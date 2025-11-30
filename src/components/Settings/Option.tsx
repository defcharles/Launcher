import React from "react";
import { motion } from "framer-motion";

export const Option: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, value, onChange }) => {
  const knobTravel = 21;

  return (
    <div className="flex items-center justify-between w-full py-4 px-3 rounded-lg hover:bg-white/5 transition-all z-50">
      <span className="text-sm text-white/80">{label}</span>

      <motion.button
        type="button"
        onClick={() => onChange(!value)}
        initial={false}
        aria-pressed={value}
        role="switch"
        aria-checked={value}
        whileTap={{ scale: 0.97 }}
        className="relative w-10 h-5 rounded-full flex-shrink-0 focus:outline-none"
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            backgroundColor: value
              ? "rgba(255,255,255,0.22)"
              : "rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 rounded-full"
        />

        <motion.span
          layout
          initial={false}
          animate={{ x: value ? knobTravel : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ willChange: "transform" }}
        />
      </motion.button>
    </div>
  );
};
