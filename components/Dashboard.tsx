
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { User, ApplicationType, AppStatus, ReviewData } from '../types';
import { checklistData } from '../data';
import { ChecklistItem } from './ChecklistItem';
import { RejectionSummary } from './RejectionSummary';
import { SuccessView } from './SuccessView';
import { WorkflowTimeline } from './WorkflowTimeline';
import { MotionCard } from './MotionComponents';
import { EligibilityCalculator } from './EligibilityCalculator';
import { SkeletonLoader } from './SkeletonLoader';
import { UserCircle2, BadgeCheck, Check, ArrowRight, LandPlot, Building2, Loader2, Inbox, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  user: User;
  appStatus: AppStatus;
  reviewData: ReviewData;
  activeTab: string; // Controlled by parent
}

export const Dashboard: React.FC<DashboardProps> = ({ user, appStatus, reviewData, activeTab }) => {
  const [appType, setAppType] = useState<ApplicationType>('Resale');
  const [isBankTransfer, setIsBankTransfer] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isInboxLoading, setIsInboxLoading] = useState(false);

  // Simulate loading for inbox tab
  useEffect(() => {
    if (activeTab === 'inbox') {
      setIsInboxLoading(true);
      const timer = setTimeout(() => setIsInboxLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitState('loading');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success State - Trigger UI changes
    setSubmitState('success');

    // Trigger Celebration Effect (School Pride)
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // School Pride Effect - Two Cannons from sides
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Colors: IOCL Saffron (#F37021), IOCL Blue (#003767), White
      const colors = ['#F37021', '#003767', '#ffffff'];

      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors,
        angle: 60,
        spread: 55,
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors,
        angle: 120,
        spread: 55,
      });
    }, 250);

    // Delay navigation to allow user to see the success state
    setTimeout(() => {
      const randomSerial = Math.floor(Math.random() * 900) + 100;
      setSubmittedId(`IOCL/HBA/${randomSerial}`);
      setSubmitState('idle');
    }, 2500);
  };

  const isReturned = appStatus === 'RETURNED';

  // Construct flat list for Rejection Summary
  const checklistFlat = [
    ...checklistData.partA.map(i => ({ section: 'partA', item: i })),
    ...checklistData.partB.map(i => ({ section: 'partB', item: i })),
    ...checklistData.partC.map(i => ({ section: 'partC', item: i })),
    ...checklistData.partD.map(i => ({ section: 'partD', item: i })),
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 z-10 max-w-7xl mx-auto">
      <LayoutGroup>
        
        {/* Profile Details Header Card - Always Visible */}
        <motion.section 
           variants={containerVariants}
           initial="hidden"
           animate="show"
           className="w-full mb-8"
        >
          <MotionCard variants={itemVariants} className="w-full overflow-hidden">
            <div className="bg-gradient-to-r from-iocl-blue to-blue-900 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-semibold flex items-center gap-2.5 text-lg">
                <UserCircle2 className="w-6 h-6 opacity-90" />
                Employee Details
              </h3>
              <div className="flex items-center gap-2">
                 <span className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide border
                    ${isReturned ? 'bg-red-500/20 text-red-100 border-red-500/30' : 'bg-green-500/20 text-green-100 border-green-500/30'}
                 `}>
                    {isReturned ? 'Action Required' : 'Active'}
                 </span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Full Name</label>
                <div className="font-bold text-slate-800 text-lg">{user.name}</div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Employee ID</label>
                <div className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block font-semibold">{user.emp_id}</div>
              </div>
              <div>
                 <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Department</label>
                 <div className="text-slate-700 font-medium">{user.dept}</div>
              </div>
               <div>
                 <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Location</label>
                 <div className="text-slate-700 font-medium">Gurgaon BP</div>
              </div>
            </div>
          </MotionCard>
        </motion.section>

        {/* Content Switching based on Active Tab */}
        <section className="w-full flex flex-col gap-6 min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {/* INBOX VIEW: Notifications / Returns */}
            {activeTab === 'inbox' && (
               <MotionCard key="inbox-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-8 w-full">
                  <div className="flex items-center gap-3 mb-6">
                     <Inbox className="w-6 h-6 text-iocl-saffron" />
                     <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
                  </div>
                  
                  {isInboxLoading ? (
                    <div className="space-y-4">
                      {/* Skeleton for inbox messages */}
                      {[1, 2].map(i => (
                        <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-lg">
                           <SkeletonLoader className="w-12 h-12 rounded-full flex-shrink-0" />
                           <div className="flex-1 space-y-2">
                             <SkeletonLoader className="w-1/3 h-5" />
                             <SkeletonLoader className="w-3/4 h-4" />
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : isReturned ? (
                    <div className="space-y-4">
                       <RejectionSummary reviewData={reviewData} checklistFlat={checklistFlat} />
                       <p className="text-slate-600 text-sm">Please navigate to the <span className="font-bold">New Application</span> tab to re-upload documents.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <Inbox className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No new notifications.</p>
                    </div>
                  )}
               </MotionCard>
            )}

            {/* SENT ITEMS VIEW: Tracking Status */}
            {activeTab === 'sent' && (
              <MotionCard key="sent-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full p-8">
                 <div className="flex items-center gap-3 mb-6">
                     <Send className="w-6 h-6 text-iocl-saffron" />
                     <h2 className="text-xl font-bold text-slate-800">Sent Items & Tracking</h2>
                  </div>
                 <WorkflowTimeline />
              </MotionCard>
            )}

            {/* NEW APPLICATION VIEW: Create & Success */}
            {activeTab === 'new' && submittedId ? (
              <MotionCard key="success-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden w-full flex-grow">
                <SuccessView refId={submittedId} />
              </MotionCard>
            ) : activeTab === 'new' ? (
              <motion.div key="checklist-view" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="w-full flex flex-col gap-6">
                
                {/* RETURNED STATUS BANNER IN CREATE VIEW ALSO (Visual Cue) */}
                {isReturned && (
                   <RejectionSummary reviewData={reviewData} checklistFlat={checklistFlat} />
                )}

                {!isReturned && (
                  <motion.div variants={itemVariants}>
                    <EligibilityCalculator />
                  </motion.div>
                )}

                {!isReturned && (
                  <motion.div variants={itemVariants} layout className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                     <div className="flex flex-col gap-2">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Property Type</h3>
                       <div className="flex gap-2">
                         {[{ id: 'Resale', label: 'Resale', icon: Building2 }, { id: 'UnderConstruction', label: 'Construction', icon: LandPlot }].map((type) => (
                            <button key={type.id} onClick={() => setAppType(type.id as ApplicationType)} className={`relative px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 border ${appType === type.id ? 'text-white bg-iocl-blue border-iocl-blue' : 'bg-slate-50 text-slate-600'}`}>
                              <type.icon className="w-4 h-4" /> {type.label}
                            </button>
                         ))}
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bank Takeover</h3>
                       <div className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50" onClick={() => setIsBankTransfer(!isBankTransfer)}>
                          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isBankTransfer ? 'bg-iocl-saffron' : 'bg-slate-300'}`}>
                            <motion.div layout className="bg-white w-4 h-4 rounded-full shadow-md" animate={{ x: isBankTransfer ? 24 : 0 }} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Enable Balance Transfer</span>
                       </div>
                     </div>
                  </motion.div>
                )}

                <MotionCard variants={itemVariants} className="overflow-hidden w-full flex-grow relative">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
                     <h2 className="text-lg font-bold text-iocl-blue flex items-center gap-2">
                       {isReturned ? "Correction Checklist" : "Document Verification Checklist"}
                     </h2>
                     <BadgeCheck className="w-5 h-5 text-iocl-saffron" />
                  </div>

                  <div className="p-6 lg:p-8 bg-white min-h-[500px]">
                     {[
                       { id: 'partA', title: 'General Documents', items: checklistData.partA },
                       { id: 'partB', title: 'Resale Specifics', items: checklistData.partB, visible: appType === 'Resale' },
                       { id: 'partC', title: 'Construction Specifics', items: checklistData.partC, visible: appType === 'UnderConstruction' },
                       { id: 'partD', title: 'Bank Repayment', items: checklistData.partD, visible: isBankTransfer }
                     ].map(section => (
                       section.visible !== false && (
                         <motion.section key={section.id} variants={containerVariants} initial="hidden" animate="show" className="w-full mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                  {section.id.slice(-1)}
                                </div>
                                <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide">{section.title}</h3>
                                <div className="h-px bg-slate-100 flex-grow ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                              {section.items.map((item, index) => {
                                 const key = `${section.id}-${item.id}`;
                                 const isRejected = reviewData.rejectedDocs.includes(key);
                                 const remark = reviewData.remarks[key];
                                 return (
                                   <ChecklistItem 
                                      key={key} 
                                      item={item} 
                                      index={index} 
                                      section={section.id} 
                                      variants={itemVariants} 
                                      mode="applicant"
                                      isRejected={isRejected}
                                      remark={remark}
                                   />
                                 );
                              })}
                            </div>
                         </motion.section>
                       )
                     ))}
                    
                    <motion.div layout className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                      <motion.button 
                          layout
                          onClick={handleFinalSubmit}
                          disabled={submitState !== 'idle'}
                          className={`h-14 px-10 font-bold shadow-lg flex items-center justify-center rounded-xl text-white transition-all
                            ${submitState === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-iocl-blue hover:bg-blue-900'}
                          `}
                      >
                        {submitState === 'idle' && <span className="flex items-center gap-2">Final Submission <ArrowRight className="w-5 h-5"/></span>}
                        {submitState === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
                        {submitState === 'success' && (
                          <motion.span 
                            initial={{ scale: 0.5, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-6 h-6" /> Submitted Successfully
                          </motion.span>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                </MotionCard>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </LayoutGroup>
    </div>
  );
};
