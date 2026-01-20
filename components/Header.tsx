
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { CircularsModal } from './CircularsModal';
import { UserRole } from '../types';

interface HeaderProps {
  userRole?: UserRole;
  userName: string;
  userDesignation: string;
}

export const Header: React.FC<HeaderProps> = ({ userRole, userName, userDesignation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCircularsOpen, setIsCircularsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate Initials dynamically
  const initials = useMemo(() => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [userName]);

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b-[4px] border-[#F37021] transition-all duration-300 
          ${isScrolled ? 'py-2' : 'py-3'}
        `}
      >
        {/* Fluid Container: w-full with padding, NO max-width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
             <motion.img 
               src="https://iocl.com/images/static/indianoil_logo.jpg" 
               alt="Indian Oil Logo" 
               className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-9' : 'h-10 md:h-12'}`}
             />
             <div>
               <h1 className={`font-bold text-[#003767] leading-tight transition-all duration-300 hidden md:block ${isScrolled ? 'text-sm' : 'text-base'}`}>
                 Indian Oil Corporation Limited
               </h1>
               <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden md:block">
                 (A Govt. of India Undertaking)
               </p>
             </div>
          </div>

          {/* Right: Context & Profile */}
          <div className="flex items-center gap-6">
            
            {/* HBA Circulars Button */}
            <button 
               onClick={() => setIsCircularsOpen(true)}
               className="flex items-center gap-2 text-slate-600 hover:text-[#F37021] transition-colors group"
            >
               <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span className="text-sm font-medium hidden sm:block">HBA Circulars</span>
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

            {/* Portal Title - Context Text */}
            <div className="hidden xl:block text-right">
              <h2 className={`font-semibold text-slate-800 leading-tight transition-all duration-300 text-sm`}>
                House Building Allowance
              </h2>
              <p className={`font-bold tracking-widest text-[#F37021] uppercase text-[10px] mt-0.5`}>
                {userRole === 'Applicant' ? 'Employee Self-Service Portal' : `${userRole} Approval Module`}
              </p>
            </div>

            {/* Profile Pill */}
            <div className="pl-0 lg:pl-4">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(241, 245, 249, 0.8)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 bg-slate-100/50 hover:bg-slate-100 border border-slate-200/60 rounded-full pl-1.5 pr-4 py-1.5 transition-all shadow-sm group"
              >
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-iocl-saffron to-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-md group-hover:shadow-lg transition-shadow">
                   {initials}
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-slate-700 leading-tight">{userName}</p>
                      <p className="text-[9px] text-slate-400 font-medium leading-tight">{userDesignation}</p>
                   </div>
                   <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                 </div>
              </motion.button>
            </div>
          </div>

        </div>
      </motion.header>

      {/* Modals */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userRole={userRole} />
      <CircularsModal isOpen={isCircularsOpen} onClose={() => setIsCircularsOpen(false)} userRole={userRole} />
    </>
  );
};
