import { NavLink } from "react-router-dom";
import { LayoutDashboard, Shield, Plus, Package, Menu } from "lucide-react";

interface Props {
  onOpenMobileMenu: () => void;
}

export default function MobileBottomNav({ onOpenMobileMenu }: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            isActive ? "text-indigo-600 font-bold" : "text-slate-500"
          }`
        }
      >
        <LayoutDashboard size={18} />
        <span>Overview</span>
      </NavLink>

      <NavLink
        to="/fraud-checker"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            isActive ? "text-indigo-600 font-bold" : "text-slate-500"
          }`
        }
      >
        <Shield size={18} />
        <span>Fraud Check</span>
      </NavLink>

      <NavLink
        to="/book-parcel"
        className="flex flex-col items-center justify-center -mt-5 w-11 h-11 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300"
      >
        <Plus size={20} />
      </NavLink>

      <NavLink
        to="/parcels"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            isActive ? "text-indigo-600 font-bold" : "text-slate-500"
          }`
        }
      >
        <Package size={18} />
        <span>Parcels</span>
      </NavLink>

      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-slate-500"
      >
        <Menu size={18} />
        <span>Menu</span>
      </button>
    </div>
  );
}
