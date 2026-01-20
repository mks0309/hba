
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Scale, Hammer, Users, Wallet, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole, User as UserType } from '../types';
import { MotionCard } from './MotionComponents';

interface RoleSelectionProps {
  user: UserType;
  onRoleSelect: (role: UserRole) => void;
}

const ROLES: { id: UserRole; label: string; icon: any; color: string }[] = [
  { id: 'Applicant', label: 'Applicant', icon: User, color: 'text-blue-500' },
  { id: 'ES', label: 'Employee Services', icon: Briefcase, color: 'text-orange-500' },
  { id: 'Law', label: 'Law Department', icon: Scale, color: 'text-purple-500' },
  { id: 'Engineering', label: 'Engineering', icon: Hammer, color: 'text-slate-600' },
  { id: 'HR', label: 'HR Department', icon: Users, color: 'text-pink-500' },
  { id: 'Finance', label: 'Finance', icon: Wallet, color: 'text-green-500' },
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({ user, onRoleSelect }) => {
  const [selected, setSelected] = useState<UserRole | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-iocl-blue to-slate-50 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
             {/* Dynamic Header Displaying User Name */}
             <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h1>
             <p className="text-blue-100 text-lg">Please select your access module to proceed.</p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;

            return (
              <MotionCard
                key={role.id}
                variants={itemVariants}
                onClick={() => setSelected(role.id)}
                className={`cursor-pointer transition-all duration-300 relative overflow-hidden border-2
                   ${isSelected ? 'border-iocl-saffron ring-4 ring-orange-500/10 shadow-xl scale-[1.02]' : 'border-transparent hover:border-slate-200 hover:shadow-lg'}
                `}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-orange-50' : 'bg-slate-50'}`}>
                    <Icon className={`w-8 h-8 ${role.color}`} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-iocl-blue' : 'text-slate-700'}`}>
                    {role.label}
                  </h3>
                  <p className="text-sm text-slate-400">Access {role.label} module dashboard</p>
                  
                  {isSelected && (
                    <motion.div 
                      layoutId="check"
                      className="absolute top-3 right-3 text-iocl-saffron"
                    >
                      <CheckCircle2 className="w-6 h-6 fill-orange-50" />
                    </motion.div>
                  )}
                </div>
              </MotionCard>
            );
          })}
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="mt-10 flex justify-center"
        >
          <button
            onClick={() => selected && onRoleSelect(selected)}
            disabled={!selected}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl
              ${selected 
                ? 'bg-iocl-saffron text-white hover:bg-orange-600 hover:scale-105 shadow-orange-500/30' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            Enter Portal <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
