
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, User, BellRing, GitMerge, GitFork, ChevronDown } from 'lucide-react';
import { MotionCard } from './MotionComponents';
import { WORKFLOW_STEPS, getCurrentStepIndex } from '../utils/WorkflowUtils';
import { AppStatus } from '../types';

// Mock Status for visualization - Updated to PENDING_FINANCE to allow Nudge
const CURRENT_STATUS: AppStatus = 'PENDING_FINANCE'; 

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const WorkflowTimeline: React.FC = () => {
  const [nudgeSent, setNudgeSent] = useState(false);
  const currentStepIdx = getCurrentStepIndex(CURRENT_STATUS);

  const handleNudge = () => {
    setNudgeSent(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 pb-12">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h2 className="text-xl font-bold text-iocl-blue flex items-center gap-2">
             Application Lifecycle
           </h2>
           <p className="text-sm text-slate-500 mt-1">Ref ID: <span className="font-mono font-bold text-slate-700">IOCL/HBA/042</span></p>
        </div>
        <div className="text-right">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Stage</div>
           <div className="text-lg font-bold text-orange-500 flex items-center gap-1 justify-end animate-pulse">
             <Clock className="w-4 h-4" /> Budget Concurrence
           </div>
        </div>
      </div>

      <div className="relative">
        {/* Main Vertical Spine */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block z-0">
           <motion.div 
             initial={{ height: "0%" }}
             animate={{ height: `${(currentStepIdx / 8) * 100}%` }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="w-full bg-green-500"
           />
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8 relative z-10"
        >
          {WORKFLOW_STEPS.map((step, index) => {
            // Determine status of each step relative to current progress
            // Step ID is 1-based, currentStepIdx is roughly mapped
            const isCompleted = index < currentStepIdx;
            const isCurrent = index === currentStepIdx; // Or close to it
            
            // Special handling for Parallel Step (ID 3)
            if (step.type === 'parallel' && step.subSteps) {
              return (
                <motion.div key={step.id} variants={itemVariants} className="relative py-2">
                  <div className="absolute left-[19px] -top-8 h-12 w-0.5 bg-green-500 hidden md:block"></div>
                  
                  <div className="ml-0 md:ml-12">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                          <GitFork className="w-4 h-4 rotate-90" />
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Parallel Departmental Clearance</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 hidden md:block transform -translate-y-1/2"></div>
                        
                        {step.subSteps.map((sub, sIdx) => {
                          const Icon = sub.icon;
                          
                          return (
                            <MotionCard key={sIdx} className="p-4 border-l-4 border-l-green-500 relative bg-white">
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                     <div className="p-1.5 rounded-lg bg-green-100 text-green-700">
                                       <Icon className="w-4 h-4" />
                                     </div>
                                     <span className="font-bold text-sm text-slate-600">{sub.dept}</span>
                                  </div>
                                  <Check className="w-4 h-4 text-green-600" />
                               </div>
                               <div className="text-xs text-slate-400 font-medium text-right mt-2 uppercase tracking-wide">
                                 Cleared
                               </div>
                            </MotionCard>
                          );
                        })}
                     </div>

                     <div className="flex items-center gap-2 mt-4 justify-end md:justify-start">
                        <div className="hidden md:block w-8 h-px bg-slate-300"></div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <GitMerge className="w-3 h-3" />
                          Consolidated
                        </div>
                     </div>
                  </div>
                  <div className="absolute left-[19px] -bottom-8 h-10 w-0.5 bg-slate-200 hidden md:block"></div>
                </motion.div>
              );
            }

            // Normal Steps
            const Icon = step.icon;

            return (
              <motion.div 
                key={step.id}
                variants={itemVariants}
                className="relative flex flex-col md:flex-row gap-6 md:items-center group"
              >
                {/* Node Circle */}
                <div className="flex items-center md:justify-start md:w-10 flex-shrink-0 z-10 bg-white md:bg-transparent py-2 md:py-0">
                   {isCompleted ? (
                     <div className="w-10 h-10 rounded-full bg-green-500 border-4 border-green-50 flex items-center justify-center shadow-sm relative z-10">
                       <Check className="w-5 h-5 text-white stroke-[3px]" />
                     </div>
                   ) : isCurrent ? (
                     <div className="w-10 h-10 rounded-full bg-orange-500 border-4 border-orange-100 flex items-center justify-center shadow-sm relative z-10">
                       <Clock className="w-5 h-5 text-white animate-pulse" />
                     </div>
                   ) : (
                     <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center relative z-10">
                       <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                     </div>
                   )}
                </div>

                {/* Content */}
                <div className={`flex-grow md:pl-0 border-l-2 border-slate-100 md:border-l-0 pl-4 pb-6 md:pb-0 transition-all duration-300
                    ${isCurrent ? 'scale-105 origin-left' : ''}
                `}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border shadow-sm transition-colors
                     ${isCurrent ? 'bg-white border-orange-200 ring-4 ring-orange-500/10' : 'bg-white border-slate-200 opacity-80'}
                  `}>
                     <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isCurrent ? 'bg-orange-100 text-orange-600' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                           <Icon className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className={`font-bold text-sm ${isCurrent ? 'text-slate-800' : 'text-slate-600'}`}>
                             {step.role}
                           </h3>
                           <p className="text-xs text-slate-500 font-medium">{step.label}</p>
                        </div>
                     </div>
                     
                     <div className="mt-2 sm:mt-0 flex flex-col sm:items-end gap-2">
                       {isCompleted && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>}
                       
                       {isCurrent && (
                         <>
                           <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded animate-pulse text-center sm:text-right">In Progress</span>
                           <button 
                             onClick={handleNudge}
                             disabled={nudgeSent}
                             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                               ${nudgeSent 
                                 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                 : 'bg-iocl-blue/10 text-iocl-blue hover:bg-iocl-blue hover:text-white border border-iocl-blue/20'
                               }
                             `}
                           >
                             <BellRing className={`w-3 h-3 ${!nudgeSent ? 'animate-bounce' : ''}`} />
                             {nudgeSent ? 'Reminder Sent' : 'Nudge Officer'}
                           </button>
                         </>
                       )}

                       {!isCompleted && !isCurrent && <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Upcoming</span>}
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
