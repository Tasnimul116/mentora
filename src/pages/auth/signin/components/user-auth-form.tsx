import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  authWithFbORGoogle,
  loginUser,
  resetError
} from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'; // <-- Import useState
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import {
  useSignInWithFacebook,
  useSignInWithGoogle
} from 'react-firebase-hooks/auth';
import { firebaseAuth } from '@/firebaseConfig';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; // <-- Import icons

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

// Updated type to match the data object being created
type socialUserSchema = {
  name: string | null;
  email: string | null;
  googleUid: string;
  image: string | undefined;
  phone: string | undefined;
  password?: string; // <-- Added password as optional
};

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [signInWithGoogle, googleUser, gLoading, gError] =
    useSignInWithGoogle(firebaseAuth);
  const [signInWithFacebook, facebookUser, fLoading, fError] =
    useSignInWithFacebook(firebaseAuth);
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.auth);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false); // <-- Added state

  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    const result: any = await dispatch(loginUser(data));
    console.log(result)
   
  
  };

  useEffect(() => {
  if (user?.role) {
    if (user.role === 'student') router.push('/student');
    else if (['admin', 'instructor', 'company'].includes(user.role)) router.push('/dashboard');
  }
}, [user]);

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleFacebookLogin = async () => {
    await signInWithFacebook();
  };

  const loginWithFbOrGoogle = async (data: socialUserSchema) => {
    const result: any = await dispatch(authWithFbORGoogle(data));
    if (result?.payload?.success) {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (googleUser) {
      const { email, displayName, uid, photoURL, phoneNumber } =
        googleUser?.user;
      const data: socialUserSchema = { // <-- Use updated type
        name: displayName,
        email,
        password: '123456', // This is still hardcoded, but now matches the type
        googleUid: uid,
        image: photoURL ? photoURL : undefined,
        phone: phoneNumber ? phoneNumber : undefined
      };
      loginWithFbOrGoogle(data);
    }
  }, [googleUser]);

  useEffect(() => {
    if (facebookUser) {
      const { email, displayName, uid, photoURL, phoneNumber } =
        facebookUser?.user;
      const data: socialUserSchema = { // <-- Use updated type
        name: displayName,
        email,
        password: '123456', // This is still hardcoded, but now matches the type
        googleUid: uid,
        image: photoURL ? photoURL : undefined,
        phone: phoneNumber ? phoneNumber : undefined
      };
      loginWithFbOrGoogle(data);
    }
  }, [facebookUser]);

  useEffect(() => {
    // Reset the error when the component mounts
    dispatch(resetError());
  }, [dispatch]);

  return (
    <>
      {/* Correct shadcn/ui Form implementation:
        1. Pass the form object to the <Form> component.
        2. Use a native <form> tag inside with the `onSubmit` handler.
      */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control} // <-- Corrected: was control={form}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    disabled={loading}
                    {...field}
                    className="h-12 w-full"
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control} // <-- Corrected: was control={form}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'} // <-- Use state
                      placeholder="••••••••"
                      disabled={loading}
                      {...field}
                      className="h-12 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // <-- Toggle state
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? ( // <-- Use state
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-supperagent text-base font-semibold text-white hover:bg-supperagent/90"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </Form>
      {error && (
        <Badge
          variant="outline"
          className="mt-4 w-full justify-center border-red-500 py-2 text-red-500"
        >
          {error}
        </Badge>
      )}
      <p className="mt-4 text-right text-sm hover:underline">
        {/* Changed to Link for better SPA navigation */}
        <Link to="/forgot-password" className="text-supperagent">
          Forgot Password?
        </Link>
      </p>
    </>
  );
}