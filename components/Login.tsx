
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, User, Lock, Info } from 'lucide-react';
import { MotionButton } from './MotionComponents';

// Background images for the carousel
const bgImages = [
  "https://iocl.com/assets/images/set2.jpg",
  "https://iocl.com/assets/images/set2.jpg",
  "https://iocl.com/assets/images/set2.jpg",
  "https://iocl.com/assets/images/set2.jpg"
];

interface LoginProps {
  onLogin: (empId: string) => void;
  isLoading: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleEmpIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and max 8 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setEmpId(value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (empId.length !== 8) {
      setError('Employee Number must be exactly 8 digits');
      return;
    }
    // In a real app, password validation would happen here
    if (password) {
      onLogin(empId);
    }
  };

  return (
    <>
      {/* Layer 0: Background Carousel */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-slate-900">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={bgImages[currentImageIndex]}
            alt="Login Background"
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" } 
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Layer 1: Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Layer 2: Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 z-20 border-t-4 border-iocl-saffron relative"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center text-center space-y-6">
          <div className="flex flex-col items-center mb-4">
             <h1 className="text-3xl font-bold text-[#003767] tracking-tight whitespace-nowrap">Indian Oil Corporation Limited</h1>
             <h2 className="text-xl font-semibold text-[#F37021] mt-2">गृहसाथी (GrihSaathi)</h2>
          </div>
          
          <div className="w-16 h-1 bg-gradient-to-r from-iocl-saffron to-iocl-blue rounded-full"></div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">Secure Login</h2>
            <p className="text-slate-500 mt-1 text-sm">Enter your credentials to access the portal</p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative group text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Employee Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${error ? 'text-red-400' : 'text-slate-400'} group-focus-within:text-iocl-saffron transition-colors`} />
                </div>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={empId}
                  onChange={handleEmpIdChange}
                  placeholder="00510674"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-[#F37021] transition-all duration-300`}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1 font-semibold ml-1">{error}</p>}
            </div>

            <div className="relative group text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-iocl-saffron transition-colors" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-[#F37021] transition-all duration-300"
                  required
                />
              </div>
            </div>
            
            <MotionButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-iocl-saffron hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">Verifying...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Secure Login</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </MotionButton>
          </div>

          <div className="text-[10px] text-slate-400 pt-2 flex flex-col items-center justify-center gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 w-full">
             <div className="flex items-center gap-1.5 font-bold mb-1">
               <Info className="w-3 h-3" />
               <span>Available Demo Accounts:</span>
             </div>
             <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left w-full px-2">
                <div>• <span className="font-mono font-bold">00510674</span> (Manish - Applicant)</div>
                <div>• <span className="font-mono font-bold">00510299</span> (Shreeja - ES)</div>
                <div>• <span className="font-mono font-bold">00507846</span> (Abhay - Law)</div>
                <div>• <span className="font-mono font-bold">00082900</span> (Rimil - HR)</div>
                <div>• <span className="font-mono font-bold">00515260</span> (Shubham - Finance)</div>
                <div>• <span className="font-mono font-bold">12345678</span> (Rajeev - ED)</div>
             </div>
          </div>
        </form>
      </motion.div>
    </>
  );
};
