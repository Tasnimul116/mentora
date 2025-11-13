import { Mail, Phone } from "lucide-react";
import { TopNav } from "../shared/top-nav";

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {

 return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      
      {/* Top contact bar */}
      <div className="bg-supperagent h-12 p-4 text-white">
        <div className="container mx-auto flex h-full items-center justify-start  gap-8">
          
          {/* Email */}
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4" />
            <a href="mailto:info@example.com" className="hover:text-gray-100">
              info@edulab.com
            </a>
          </div>

          {/* Phone Number */}
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <a href="tel:+123456789" className="hover:text-gray-100 ">
              +1 (234) 567-890
            </a>
          </div>
          
        </div>
      </div>
      
      <TopNav />
      
      <main className="flex-grow overflow-y-auto"> {/* Added classes for scrolling */}
        {children}
      </main>
      
    </div>
  );
}
