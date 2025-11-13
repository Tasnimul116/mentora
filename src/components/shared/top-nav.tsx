import {
  GraduationCap,
  Layers,
  Heart,
  ShoppingCart,
  User,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// A helper component for the logo to stack the icons
function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <GraduationCap
        className="h-10 w-10 text-supperagent"
      />

      <span className="text-3xl font-bold text-supperagent">Mentora</span>
    </Link>
  );
}

function NavLink({ to, children, active = false }) {
  const activeClass = active
    ? 'text-supperagent border-b-2 border-supperagent font-medium'
    : 'text-gray-600 hover:text-supperagent';

  return (
    <li>
      <Link to={to} className={`pb-1 ${activeClass}`}>
        {children}
      </Link>
    </li>
  );
}

export function TopNav() {
  return (
    <div className="flex h-20 items-center justify-between bg-white shadow-sm z-[9999] p-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-10">
          <Logo />
          <nav>
            <ul className="flex items-center space-x-6">
              <NavLink to="/" active>
                Home
              </NavLink>
              <NavLink to="#">Course</NavLink>
              <NavLink to="#">Pages</NavLink>
              <NavLink to="#">Contact</NavLink>
            </ul>
          </nav>
        </div>

        {/* Right Side: Search, Icons, Buttons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            {/* You could add a search icon here */}
          </div>

          {/* Icon Buttons */}
          <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Heart className="h-5 w-5" />
            {/* Example of a badge:
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">3</span> 
            */}
          </button>

          <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-supperagent text-xs text-white">
              1
            </span>
          </button>

          {/* Auth Buttons */}
          <Link
            to="/login"
            className="flex items-center space-x-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            <span>Log in</span>
          </Link>

          <Link
            to="/signup"
            className="flex items-center space-x-2 rounded-md bg-supperagent px-4 py-2 text-sm font-medium text-white hover:bg-supperagent/90"
          >
            <span>Sign up</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
