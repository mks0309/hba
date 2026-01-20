
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Mail, Phone, Calendar, Hash, Droplet, MapPin, Award, Building2, CreditCard } from 'lucide-react';
import { UserRole } from '../types';
import { ROLE_PROFILES } from '../data/RoleProfiles';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const SectionHeader: React.FC<{ icon: any, title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    <div className="p-1.5 rounded-lg bg-orange-50 text-iocl-saffron">
      <Icon className="w-4 h-4" />
    </div>
    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
  </div>
);

const InfoRow: React.FC<{ label: string, value: string, icon?: any }> = ({ label, value, icon: Icon }) => (
  <div className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
    <div className="flex items-center gap-2 text-slate-500">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
  </div>
);

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userRole }) => {
  
  // Determine the correct profile key based on the UserRole type
  const getProfileKey = (role?: UserRole) => {
    switch (role) {
      case 'Applicant': return 'applicant';
      case 'ES': return 'es';
      case 'Law': return 'law';
      case 'Engineering': return 'engineering';
      case 'HR': return 'relations'; // HR maps to Employee Relations profile
      case 'Finance': return 'finance';
      case 'Admin': return 'ed'; // Admin maps to ED profile
      default: return 'applicant';
    }
  };

  const profileKey = getProfileKey(userRole);
  // @ts-ignore - Indexing with string on ROLE_PROFILES
  const profile = ROLE_PROFILES[profileKey] || ROLE_PROFILES['applicant'];
  
  // Create initials
  const initials = profile.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-iocl-blue to-blue-900 flex justify-between items-center relative overflow-hidden">
               {/* Decorative Circle */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
               
               <div className="relative z-10 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center text-white font-bold text-lg shadow-inner backdrop-blur-md">
                    {initials}
                 </div>
                 <div>
                   <h2 className="text-white font-bold text-lg leading-tight">Employee Profile</h2>
                   <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Officer Grade • Active</p>
                 </div>
               </div>
               
               <button 
                 onClick={onClose}
                 className="relative z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-slate-50/50">
              
              {/* Section 1: Personal Info */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <SectionHeader icon={User} title="Personal Information" />
                 <div className="space-y-1">
                    <InfoRow label="Full Name" value={profile.name} />
                    <InfoRow label="Employee ID" value={profile.id} icon={Hash} />
                    <InfoRow label="Date of Birth" value={profile.dob} icon={Calendar} />
                    <InfoRow label="Blood Group" value={profile.bloodGroup} icon={Droplet} />
                 </div>
              </div>

              {/* Section 2: Professional Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <SectionHeader icon={Briefcase} title="Professional Details" />
                 <div className="space-y-1">
                    <InfoRow label="Designation" value={profile.designation} />
                    <InfoRow label="Department" value={profile.department} icon={Building2} />
                    <InfoRow label="Base Location" value={profile.location} icon={MapPin} />
                    <InfoRow label="Date of Joining" value={profile.joiningDate} icon={Calendar} />
                    <InfoRow label="Grade / Level" value={profile.grade} icon={Award} />
                 </div>
              </div>

              {/* Section 3: Financial/Contact */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <SectionHeader icon={CreditCard} title="Financial & Contact" />
                 <div className="space-y-1">
                    <InfoRow label="Official Email" value={profile.email} icon={Mail} />
                    <InfoRow label="Mobile" value={profile.mobile} icon={Phone} />
                    <InfoRow label="PF Number" value={profile.id} icon={Hash} />
                 </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white text-center">
              <p className="text-[10px] text-slate-400">
                Data synced with Active Directory • Last updated: Today 09:00 AM
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
