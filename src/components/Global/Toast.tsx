import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import GlassContainer from "./GlassContainer";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastComponentProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const glowColors = {
    success: "rgba(34, 197, 94, 0.4)",
    error: "rgba(239, 68, 68, 0.4)",
    warning: "rgba(234, 179, 8, 0.4)",
    info: "rgba(59, 130, 246, 0.4)",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 100, scale: 0.5, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative"
    >
      <GlassContainer className="relative flex items-center gap-3 px-4 py-3 rounded-lg min-w-[300px] max-w-[400px] overflow-hidden">
        <motion.div
          className={`relative z-10 ${iconColors[toast.type]}`}
          animate={{
            filter: [
              "drop-shadow(0 0 2px currentColor)",
              "drop-shadow(0 0 4px currentColor)",
              "drop-shadow(0 0 2px currentColor)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icons[toast.type]}
        </motion.div>

        <p className="text-white text-sm flex-1 pr-2 relative z-10">
          {toast.message}
        </p>

        <button
          onClick={() => onClose(toast.id)}
          className="text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 rounded relative z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full z-10"
          style={{
            background: `linear-gradient(90deg, ${
              glowColors[toast.type]
            }, ${glowColors[toast.type].replace("0.4", "0.8")})`,
            boxShadow: `0 0 5px ${glowColors[toast.type]}`,
          }}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{
            duration: (toast.duration || 3000) / 1000,
            ease: "linear",
          }}
        />
      </GlassContainer>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
