import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* BRANDING */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <ShipWheelIcon className="size-9 text-primary animate-spin-slow" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Interactime
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-1">
        {[
          { to: "/", icon: HomeIcon, label: "Home" },
          { to: "/friends", icon: UsersIcon, label: "Friends" },
          { to: "/notifications", icon: BellIcon, label: "Notifications" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case font-medium ${
              currentPath === item.to ? "btn-active bg-base-300" : "text-base-content/70"
            }`}
          >
            <item.icon className={`size-5 ${currentPath === item.to ? "text-primary" : ""}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto bg-base-200/50">
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img 
                src={authUser?.profilePic || "https://avatar.iran.liara.run/public"} 
                alt="User Avatar" 
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName || "Guest User"}</p>
            <p className="text-xs text-success flex items-center gap-1">
              Active Now
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;