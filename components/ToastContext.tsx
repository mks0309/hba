
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<Toast & { onClose: () => void }> = ({ id, message, type, onClose }) => {
  const styles = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      border: 'border-l-green-500',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      border: 'border-l-red-500',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-600" />,
      border: 'border-l-blue-500',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      border: 'border-l-orange-500',
    },
  };

  const currentStyle = styles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`pointer-events-auto w-full max-w-sm bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 border-l-4 ${currentStyle.border} flex items-start gap-3`}
    >
      <div className="mt-0.5 flex-shrink-0">{currentStyle.icon}</div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-semibold text-slate-800 leading-snug">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md hover:bg-slate-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
