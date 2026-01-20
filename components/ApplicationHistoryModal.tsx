
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, User, GitFork, Users, Scale, Hammer, FileText, CalendarClock, Briefcase, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MotionCard } from './MotionComponents';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  app: {
    refNo: string;
    applicant: {
      name: string;
      designation: string;
      dept: string;
    };
    amount: number;
  };
}

export const ApplicationHistoryModal: React.FC<Props> = ({ isOpen, onClose, app }) => {
  
  // Mock Approval History Data for a "Ready for Sanction" application
  const timelineSteps = [
    {
      id: 1,
      title: "Application Submitted",
      role: "Applicant",
      officer: app.applicant.name,
      date: "20 Dec 2025",
      status: "completed",
      icon: User
    },
    {
      id: 2,
      title: "Document Verification",
      role: "ES Officer",
      officer: "R.K. Gupta",
      date: "21 Dec 2025",
      status: "completed",
      icon: Briefcase
    },
    {
      id: 3,
      title: "Departmental Clearances",
      type: "parallel",
      status: "completed",
      subSteps: [
        { dept: "Law Dept", officer: "Ms. Priya Singh", date: "24 Dec 2025", icon: Scale },
        { dept: "HR Dept", officer: "Alok Verma", date: "22 Dec 2025", icon: Users },
        { dept: "Engineering", officer: "S.K. Deshmukh", date: "22 Dec 2025", icon: Hammer },
      ]
    },
    {
      id: 4,
      title: "Finance Concurrence",
      role: "Finance Manager",
      officer: "V.K. Malhotra",
      date: "28 Dec 2025",
      status: "completed",
      icon: Wallet
    },
    {
      id: 5,
      title: "Final Sanction",
      role: "Competent Authority",
      officer: "Pending Action",
      date: "Awaiting",
      status: "current",
      icon: ShieldCheck
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <div>
                   <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-iocl-blue" />
                     Approval History
                   </h2>
                   <p className="text-sm text-slate-500 font-mono mt-0.5">{app.refNo}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Timeline Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
                 <div className="relative pl-4">
                    {/* Vertical Spine */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200 z-0" />

                    <div className="space-y-8 relative z-10">
                       {timelineSteps.map((step, idx) => {
                          const isCompleted = step.status === 'completed';
                          const isCurrent = step.status === 'current';
                          const Icon = step.icon || User;

                          if (step.type === 'parallel' && step.subSteps) {
                             return (
                                <div key={idx} className="relative pl-12">
                                   {/* Node on Spine */}
                                   <div className="absolute left-[3px] top-0 w-12 h-0.5 bg-slate-200" />
                                   
                                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-2">
                                      <div className="flex items-center gap-2 mb-3">
                                         <div className="p-1 bg-blue-50 text-blue-600 rounded">
                                            <GitFork className="w-4 h-4" />
                                         </div>
                                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parallel Clearances</span>
                                         <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                                            <Check className="w-3 h-3" /> All Cleared
                                         </span>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                         {step.subSteps.map((sub, sIdx) => {
                                            const SubIcon = sub.icon;
                                            return (
                                               <div key={sIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                  <div className="flex items-center justify-between mb-2">
                                                     <div className="text-xs font-bold text-slate-700">{sub.dept}</div>
                                                     <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                  </div>
                                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                                                     <User className="w-3 h-3" /> {sub.officer}
                                                  </div>
                                                  <div className="text-[10px] text-slate-400 text-right">{sub.date}</div>
                                               </div>
                                            )
                                         })}
                                      </div>
                                   </div>
                                </div>
                             )
                          }

                          return (
                             <div key={idx} className="flex gap-4">
                                {/* Icon Bubble */}
                                <div className={`w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10
                                   ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-iocl-saffron text-white' : 'bg-slate-200 text-slate-400'}
                                `}>
                                   {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 pt-1">
                                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-2">
                                         <div>
                                            <h3 className={`font-bold text-sm ${isCompleted ? 'text-slate-800' : 'text-iocl-blue'}`}>
                                               {step.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium">{step.role}</p>
                                         </div>
                                         <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                            {step.date}
                                         </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {(step.officer || "U").charAt(0)}
                                         </div>
                                         {step.officer}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 text-center">
                 <p className="text-xs text-slate-400">
                    Application ID: <span className="font-mono font-bold text-slate-600">{app.refNo}</span> • Verified for Sanction
                 </p>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
