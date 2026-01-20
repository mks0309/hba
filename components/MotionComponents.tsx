import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

// Premium Spring Physics
const springConfig = { type: "spring" as const, stiffness: 400, damping: 25 };

// Standard Card with Hover Lift & Stagger Support
export const MotionCard: React.FC<HTMLMotionProps<"div">> = ({ children, className, variants, ...props }) => (
  <motion.div
    layout
    variants={variants}
    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    transition={springConfig}
    className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Clickable Button with Scale Tap effect ("Tactile" Feel)
export const MotionButton: React.FC<HTMLMotionProps<"button">> = ({ children, className, ...props }) => (
  <motion.button
    layout
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.96 }}
    transition={springConfig}
    className={`${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

// Form Input with Focus Expand
export const MotionInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <motion.div className="relative w-full" whileTap={{ scale: 0.995 }}>
    <input
      className={`w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-iocl-blue/20 focus:border-iocl-blue outline-none border border-slate-300 rounded-lg px-4 py-2 ${className}`}
      {...props}
    />
  </motion.div>
);