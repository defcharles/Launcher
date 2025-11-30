import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Wrench, User, Palette, Settings } from "lucide-react";
import GlassContainer from "../Global/GlassContainer";

export const SettingsTopBar: React.FC<{ onSelect: (key: string) => void }> = ({
  onSelect,
}) => {
  const sections = [
    { name: "Appearance", icon: <Palette size={14} /> },
    { name: "Account", icon: <User size={14} /> },
    { name: "Options", icon: <Settings size={14} /> },
    { name: "Developer", icon: <Wrench size={14} /> },
  ];

  return (
    <GlassContainer className="w-full h-14 px-4 flex items-center gap-2 rounded-xl bg-glass-noise">
      {sections.map((sec) => (
        <motion.button
          key={sec.name}
          onClick={() => onSelect(sec.name)}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="
            flex items-center gap-2 px-3 py-1.5
            rounded-md text-white/80 hover:bg-white/5
            text-sm group transition-all
          "
        >
          <div className="text-gray-300 group-hover:text-white transition-colors">
            {sec.icon}
          </div>

          <span>{sec.name}</span>

          <ChevronRight
            className="
              w-3.5 h-3.5 text-gray-400
              group-hover:text-white transition-colors
            "
          />
        </motion.button>
      ))}
    </GlassContainer>
  );
};
