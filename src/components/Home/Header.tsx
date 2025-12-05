import React from "react";
import GlassContainer from "../Global/GlassContainer";
import { useAuthStore } from "@/zustand/AuthStore";

const Header: React.FC = () => {
  const AuthStore = useAuthStore();
  return (
    <div className="w-full flex justify-between items-center gap-2 mt-2">
      <div className="min-w-[120px]"></div>

      <div className="flex items-center gap-3">
        <GlassContainer className="rounded-lg bg-glass-noise shadow-lg p-3 w-48">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={AuthStore.account?.ProfilePicture || "/StellarStar.png"}
                alt="pfp"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0.5 right-0.5 block w-2 h-2 rounded-full bg-green-500 border-2 border-gray-900" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-white leading-tight">andr1ww</h3>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default Header;
