import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openUrl } from "@tauri-apps/plugin-opener";
import { GoHomeFill } from "react-icons/go";
import { LibraryBig } from "lucide-react";
import { MdQuestionMark } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { motion, easeOut } from "framer-motion";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseButton =
    "flex justify-center items-center w-10 h-10 rounded-md transition-all duration-300 cursor-pointer group";
  const activeButton =
    "bg-white/10 border border-white/10 shadow-lg shadow-white/5";
  const hoverButton =
    "hover:bg-white/5 border border-transparent hover:border-white/10";
  const iconClass =
    "w-4 h-4 max-w-full max-h-full text-gray-400 transition-all duration-300 group-hover:text-white";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6, ease: easeOut } }}
      className="
        fixed top-0 left-0 w-16 h-screen
        bg-gray-500/5 bg-glass-noise bg-clip-padding backdrop-filter backdrop-blur-lg
         backdrop-saturate-100 backdrop-contrast-100
        shadow-xl flex flex-col justify-between items-center px-3 py-4
      "
    >
      <div className="flex flex-col gap-3.5">
        <motion.img
          src="StellarStar.png"
          alt="Logo"
          draggable={false}
          className="scale-92"
          animate={{
            filter: [
              "drop-shadow(0 0 5px rgba(255,255,255,0.3))",
              "drop-shadow(0 0 15px rgba(255,255,255,0.8))",
              "drop-shadow(0 0 5px rgba(255,255,255,0.3))",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />

        <button
          onClick={() => navigate("/home")}
          className={`${baseButton} ${
            location.pathname === "/home" ? activeButton : hoverButton
          }`}
        >
          <GoHomeFill
            className={`${iconClass} ${
              location.pathname === "/home" ? "text-white/80" : ""
            }`}
          />
        </button>

        <button
          onClick={() => navigate("/library")}
          className={`${baseButton} ${
            location.pathname === "/library" ? activeButton : hoverButton
          }`}
        >
          <LibraryBig
            className={`${iconClass} ${
              location.pathname === "/library" ? "text-white/80" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        <button
          onClick={() => openUrl("https://discord.gg/stellarfn")}
          className={`${baseButton} ${hoverButton}`}
        >
          <MdQuestionMark className={iconClass} />
        </button>

        <button
          onClick={() => navigate("/settings")}
          className={`${baseButton} ${
            location.pathname === "/settings" ? activeButton : hoverButton
          }`}
        >
          <TbSettings
            className={`${iconClass} ${
              location.pathname === "/settings" ? "text-white/80" : ""
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
