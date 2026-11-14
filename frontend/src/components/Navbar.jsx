
import { Search, Bell, UserCircle, Menu } from "lucide-react";

function Navbar({ title = "Dashboard", onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold text-gray-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm w-40"
          />
        </div>

        <button className="relative text-gray-600">
          <Bell size={21} />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={32} className="text-blue-600" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Admin User
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
