import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FileCheck, LogOut } from 'lucide-react';

interface SessionCardProps {
  onLogout: () => void;
  variant?: 'light' | 'dark';
  className?: string;
  variants?: Variants; // For framer-motion stagger effects
}

export const SessionCard: React.FC<SessionCardProps> = ({ onLogout, variant = 'light', className = '', variants }) => {
  const isDark = variant === 'dark';

  const containerClasses = isDark 
    ? "bg-slate-800 border-slate-700 shadow-lg" 
    : "bg-white border-slate-200 shadow-sm";
    
  const textTitle = isDark ? "text-white" : "text-iocl-blue";
  const textSub = isDark ? "text-slate-400" : "text-slate-400";
  const iconBg = isDark ? "bg-slate-700 border-slate-600" : "bg-orange-50 border-orange-100";
  const iconColor = isDark ? "text-orange-400" : "text-iocl-saffron";
  
  const btnClasses = isDark
    ? "border-slate-600 text-slate-300 hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-400"
    : "border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600";

  return (
    <motion.div 
      variants={variants}
      className={`rounded-xl border p-5 flex flex-col justify-between ${containerClasses} ${className}`}
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconBg} ${iconColor}`}>
             <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${textTitle} flex items-center gap-2`}>
              Session Active
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </h3>
            <p className={`text-[10px] uppercase tracking-wider font-semibold ${textSub}`}>Audit Log Enabled</p>
          </div>
        </div>
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors text-sm font-bold ${btnClasses}`}
      >
        <LogOut className="w-4 h-4" />
        Secure Logout
      </motion.button>
    </motion.div>
  );
};
