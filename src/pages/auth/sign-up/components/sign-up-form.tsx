import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HTMLAttributes } from 'react';

import axiosInstance from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from '@/routes/hooks';
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const ROLES = ['student', 'company', 'instructor'] as const;

const signUpSchema = z
  .object({
    role: z.enum(ROLES, { required_error: 'Please select a role.' }),
    name: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    phone: z.string().min(7, 'Phone number is required'),
    address: z.string().optional(),
    expertise: z.string().optional(),
    dateOfBirth: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
  .refine(
    (data) =>
      data.role === 'student' || data.role === 'instructor'
        ? !!data.dateOfBirth
        : true,
    {
      message: 'Date of birth is required',
      path: ['dateOfBirth']
    }
  );

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      expertise: '',
      dateOfBirth: ''
    }
  });

  const selectedRole = useWatch({
    control: form.control,
    name: 'role'
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/signup', data);

      if (response?.data?.success) {
        toast({
          title: 'Account Created',
          description: 'Your account was successfully created.'
        });
        router.push('/login');
      } else {
        toast({
          title: 'Registration Failed',
          description: response.data.message || 'Unexpected error occurred.',
          variant: 'destructive'
        });
      }
    } catch (err: any) {
      toast({
        title: 'Server Error',
        description: err.response?.data?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  I am a... <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 w-full border-gray-400">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="company">Organization</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Common Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {selectedRole === 'company' ? 'Company Name' : 'Full Name'}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 border-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 border-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="h-12 border-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth for student & instructor */}
            {(selectedRole === 'student' || selectedRole === 'instructor') && (
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-12 border-gray-400"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Address for company */}
            {selectedRole === 'company' && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] border-gray-400 resize-none"
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Instructor fields */}
            {selectedRole === 'instructor' && (
              <>
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Expertise (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] border-gray-400 resize-none"
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className="h-12 border-gray-400"
                        disabled={loading}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      className="h-12 border-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-md bg-supperagent text-lg font-semibold text-white hover:bg-supperagent/90 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </div>
        </form>
      </Form>
    </section>
  );
}
