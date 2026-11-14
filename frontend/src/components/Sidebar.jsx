
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  Settings,
  Boxes,
  X
} from "lucide-react";

function Sidebar({ role = "admin", isOpen = false, onClose }) {
  const adminLinks = [
    { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Add Product", path: "/add-product", icon: PlusCircle },
    { name: "Users", path: "/users", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  const userLinks = [
    { name: "Dashboard", path: "/user-dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 text-white
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Boxes className="text-blue-400" size={27} />
            <span className="text-xl font-bold">StockFlow</span>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider text-slate-500 px-6 mt-7 mb-3">
          Main Menu
        </p>

        <nav className="px-3 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span className="text-sm font-medium">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto p-5 border-t border-slate-800">
          <p className="text-xs text-slate-500">StockFlow Inventory</p>
          <p className="text-xs text-slate-400 mt-1">Management System</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
