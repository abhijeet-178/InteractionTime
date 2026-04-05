import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import { logout } from "../lib/lib.js";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  // Safer check for chat routes
  const isChatPage =
    location.pathname === "/chat" ||
    location.pathname.startsWith("/chat/");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">

          {/* LEFT: Logo (chat pages only) */}
          {isChatPage ? (
            <Link to="/" className="flex items-center gap-2.5 pl-5">
              <ShipWheelIcon className="w-9 h-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Interaction time
              </span>
            </Link>
          ) : (
            <div />
          )}

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">

            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full bg-primary">
                <img
                  src={authUser?.profilePic}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <button
              className="btn btn-ghost btn-circle"
              onClick={() => logoutMutation()}
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
