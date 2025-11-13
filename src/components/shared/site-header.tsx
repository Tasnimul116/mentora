import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { logout } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function SiteHeader() {
   const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };
  const { user } = useSelector((state: any) => state.auth);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-300 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full max-md:py-2 items-center gap-1 px-4 lg:gap-2 ">
        <div className='md:hidden'>

        <SidebarTrigger  />
        </div>
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1> */}
        {/* <div className="ml-auto flex items-center gap-2 p-1">
          <div
          onClick={handleLogout}
          className="flex cursor-pointer items-center p-2 hover:bg-theme/20 rounded-md"
        >
          <div className="flex flex-row items-center justify-center gap-1 ">
            <LogOut className="h-4 w-4" />
            <span className="font-semibold">Log out</span>
          </div>
        </div>
        </div> */}
      </div>
    </header>
  )
}
