
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AppStatus, ReviewData, UserRole, InboxItem } from '../types';
import { checklistData } from '../data';
import { ChecklistItem } from './ChecklistItem';
import { MotionCard } from './MotionComponents';
import { ReviewDocumentModal } from './ReviewDocumentModal';
import { SanctionManager } from './SanctionManager';
import { SkeletonLoader } from './SkeletonLoader';
import { 
  Building, Briefcase, 
  CheckCircle2, RotateCcw, AlertOctagon, Send, Inbox, 
  ArrowLeft, Filter, MoreHorizontal, CalendarClock, AlertCircle,
  TrendingDown, Clock, IndianRupee, Activity, PieChart, X
} from 'lucide-react';

interface Props {
  user: User; // Generic user
  currentUserRole: UserRole;
  reviewData: ReviewData;
  activeTab: string; // From Parent Sidebar
  onUpdateReview: (data: ReviewData) => void;
  onAction: (action: 'RETURN' | 'RECOMMEND' | 'APPROVE', note?: string) => void;
  onLogout: () => void;
}

// --- UPDATED MOCK DATA: Sanitized Departments & Removed High Priorities ---
const MOCK_INBOX: InboxItem[] = [
  {
    id: '1',
    refNo: 'IOCL/HBA/042',
    applicant: { name: 'Manish Kumar Sharma', designation: 'Manager (Ops)', dept: 'LPG Operations', empId: '00510674' },
    submittedTime: '2 hrs ago',
    status: 'PENDING_LAW',
    priority: 'Normal',
    propertyAddress: "Flat 402, Tower B, Prestige City, Sector 150, Noida, UP - 201310"
  },
  {
    id: '2',
    refNo: 'IOCL/HBA/046',
    applicant: { name: 'Karthik Nair', designation: 'Senior Engineer', dept: 'Marketing Division', empId: '00512299' },
    submittedTime: '4 hrs ago',
    status: 'PENDING_ENGG',
    priority: 'Normal',
    propertyAddress: "Plot No. 45, Green Valley Enclave, Panipat, Haryana - 132103"
  },
  {
    id: '3',
    refNo: 'IOCL/HBA/038',
    applicant: { name: 'Priya Singh', designation: 'Manager (HR)', dept: 'Human Resources', empId: '00512290' },
    submittedTime: '1 day ago',
    status: 'RETURNED', 
    priority: 'Normal',
    propertyAddress: "Villa 22, Palm Meadows, Whitefield, Bangalore, Karnataka - 560066"
  },
  {
    id: '4',
    refNo: 'IOCL/HBA/049',
    applicant: { name: 'Vikram Malhotra', designation: 'DGM (Retail Sales)', dept: 'Retail Sales', empId: '00334455' },
    submittedTime: '5 hrs ago',
    status: 'PENDING_RELATIONS',
    priority: 'Normal',
    propertyAddress: "Flat 12A, Sea View Apartments, Worli, Mumbai, Maharashtra - 400018"
  },
  {
    id: '5',
    refNo: 'IOCL/HBA/050',
    applicant: { name: 'Sneha Gupta', designation: 'Manager (Finance)', dept: 'State Office', empId: '00667788' },
    submittedTime: '2 days ago',
    status: 'PENDING_FINANCE',
    priority: 'Normal',
    propertyAddress: "H.No 55, Civil Lines, Jaipur, Rajasthan - 302006"
  },
  {
    id: '6',
    refNo: 'IOCL/HBA/029',
    applicant: { name: 'Suresh Kumar', designation: 'GM (Operations)', dept: 'Aviation', empId: '00112233' },
    submittedTime: '3 days ago',
    status: 'PENDING_ED',
    priority: 'Normal',
    propertyAddress: "Penthouse 9, Skyline Towers, Salt Lake, Kolkata, WB - 700091"
  }
];

// --- MISSING COMPONENT IMPLEMENTATION ---
const ReviewDetail: React.FC<{
  app: InboxItem;
  currentUserRole: UserRole;
  reviewData: ReviewData;
  onUpdateReview: (data: ReviewData) => void;
  onBack: () => void;
  onProcess: (action: 'RETURN' | 'RECOMMEND' | 'APPROVE', note?: string) => void;
  getStatusBadgeStyle: (status: AppStatus) => string;
}> = ({ app, currentUserRole, reviewData, onUpdateReview, onBack, onProcess, getStatusBadgeStyle }) => {
  const [activeDocument, setActiveDocument] = useState<{ name: string, key: string } | null>(null);
  const [processNote, setProcessNote] = useState('');

  const handleStatusToggle = (key: string, isRejected: boolean) => {
     const newRejectedDocs = isRejected
       ? [...new Set([...reviewData.rejectedDocs, key])]
       : reviewData.rejectedDocs.filter(d => d !== key);
     
     onUpdateReview({ ...reviewData, rejectedDocs: newRejectedDocs });
  };

  const handleRemarkChange = (key: string, text: string) => {
      const newRemarks = { ...reviewData.remarks };
      if (text) newRemarks[key] = text;
      else delete newRemarks[key];

      onUpdateReview({ ...reviewData, remarks: newRemarks });
  };

  const handleDocumentVerification = (key: string, isVerified: boolean, remarks: string) => {
    const newRejectedDocs = isVerified 
      ? reviewData.rejectedDocs.filter(d => d !== key)
      : [...new Set([...reviewData.rejectedDocs, key])];
    
    const newRemarks = { ...reviewData.remarks };
    if (remarks) newRemarks[key] = remarks;
    else delete newRemarks[key];

    onUpdateReview({ ...reviewData, rejectedDocs: newRejectedDocs, remarks: newRemarks });
  };

  const sections = [
      { id: 'partA', title: 'General Documents', items: checklistData.partA },
      { id: 'partB', title: 'Resale Specifics', items: checklistData.partB }, 
      { id: 'partC', title: 'Construction Specifics', items: checklistData.partC },
      { id: 'partD', title: 'Bank Repayment', items: checklistData.partD }
  ];

  return (
    <motion.div
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: 20 }}
       className="w-full pb-20"
    >
       <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors bg-white border border-slate-200 shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
             <h2 className="text-xl font-bold text-slate-800">Review Application</h2>
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <span className="font-mono font-semibold bg-slate-100 px-1.5 rounded text-slate-600">{app.refNo}</span>
               <span>•</span>
               <span>{app.applicant.dept}</span>
             </div>
          </div>
          <div className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${getStatusBadgeStyle(app.status)}`}>
              {app.status.replace('_', ' ')}
          </div>
       </div>

       <MotionCard className="p-6 mb-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 z-0"></div>
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 shadow-inner">
                 {app.applicant.name.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-xl text-slate-800">{app.applicant.name}</h3>
                  <div className="text-sm text-slate-500 space-y-1 mt-1">
                     <p className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> {app.applicant.designation}</p>
                     <p className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded w-fit text-slate-600">Emp ID: {app.applicant.empId}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 md:border-l border-slate-100 md:pl-8">
                <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Loan Amount</div>
                   <div className="font-bold text-lg text-slate-800">₹ 45.00 L</div>
                </div>
                <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Property Type</div>
                   <div className="font-bold text-lg text-slate-800">Resale Flat</div>
                </div>
                <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                   <div className="font-bold text-lg text-slate-800">Gurgaon</div>
                </div>
                <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Submitted On</div>
                   <div className="font-bold text-lg text-slate-800">20 Dec 2025</div>
                </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Property Address</h4>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 flex items-start gap-2">
               <div className="mt-0.5 text-iocl-saffron"><Building className="w-4 h-4" /></div>
               {app.propertyAddress || "Address details not available"}
            </div>
          </div>
       </MotionCard>

       <div className="space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
             <div className="p-1.5 bg-blue-50 text-iocl-blue rounded-lg">
               <CheckCircle2 className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Document Verification Checklist</h3>
          </div>
          
          {sections.map(section => (
             <div key={section.id} className="space-y-4">
                <div className="flex items-center gap-3">
                   <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{section.id.slice(-1)}</span>
                   <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">{section.title}</h4>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                   {section.items.map((item, idx) => {
                      const key = `${section.id}-${item.id}`;
                      const isRejected = reviewData.rejectedDocs.includes(key);
                      const remark = reviewData.remarks[key];
                      
                      return (
                         <div key={key} onClick={(e) => {
                            // Don't open preview if clicking on buttons
                            if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea')) return;
                            setActiveDocument({ name: item.label, key });
                         }} className="cursor-pointer">
                           <ChecklistItem 
                              item={item}
                              index={idx}
                              section={section.id}
                              mode="review"
                              isRejected={isRejected}
                              remark={remark}
                              onStatusToggle={(val) => handleStatusToggle(key, val)}
                              onRemarkChange={(val) => handleRemarkChange(key, val)}
                           />
                         </div>
                      );
                   })}
                </div>
             </div>
          ))}
       </div>

       <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-1/2">
                 <input 
                   type="text" 
                   value={processNote}
                   onChange={(e) => setProcessNote(e.target.value)}
                   placeholder="Add a final note or remark (optional)..."
                   className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-iocl-blue/20 outline-none transition-shadow"
                 />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                 <button 
                    onClick={() => onProcess('RETURN', processNote)}
                    disabled={reviewData.rejectedDocs.length === 0}
                    className="px-6 py-3 rounded-xl font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                 >
                    <RotateCcw className="w-4 h-4" /> Return
                 </button>
                 
                 {currentUserRole === 'ES' || currentUserRole === 'Finance' || currentUserRole === 'Law' ? (
                     <button 
                        onClick={() => onProcess('RECOMMEND', processNote)}
                        disabled={reviewData.rejectedDocs.length > 0}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-iocl-blue hover:bg-blue-900 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                     >
                        <CheckCircle2 className="w-4 h-4" /> Recommend
                     </button>
                 ) : (
                    <button 
                        onClick={() => onProcess('APPROVE', processNote)}
                        disabled={reviewData.rejectedDocs.length > 0}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                     >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                     </button>
                 )}
              </div>
           </div>
       </div>

       {activeDocument && (
          <ReviewDocumentModal
             isOpen={!!activeDocument}
             onClose={() => setActiveDocument(null)}
             documentName={activeDocument.name}
             onVerify={(verified, remark) => handleDocumentVerification(activeDocument.key, verified, remark)}
          />
       )}
    </motion.div>
  );
};

export const ReviewerDashboard: React.FC<Props> = ({ 
  currentUserRole,
  reviewData, 
  activeTab,
  onUpdateReview, 
  onAction,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [localInbox, setLocalInbox] = useState<InboxItem[]>(MOCK_INBOX);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    department: 'All'
  });
  
  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Derived Data
  const selectedApp = useMemo(() => localInbox.find(item => item.id === selectedAppId), [selectedAppId, localInbox]);
  
  const filteredInbox = useMemo(() => {
    let data = localInbox;

    // 1. Tab Logic
    if (activeTab === 'inbox') data = data.filter(i => i.status !== 'APPROVED'); // Pending
    else if (activeTab === 'sent' || activeTab === 'archive') data = data.filter(i => i.status === 'APPROVED' || i.status === 'RETURNED'); // Processed/History
    
    // 2. Filter Logic
    if (activeFilters.department !== 'All') {
      data = data.filter(i => i.applicant.dept === activeFilters.department);
    }

    return data;
  }, [activeTab, localInbox, activeFilters]);

  const pageTitle = useMemo(() => {
     switch(activeTab) {
        case 'inbox': return 'Pending Actions';
        case 'sent': return 'Sent Items / History';
        case 'archive': return 'Archive';
        default: return 'Dashboard';
     }
  }, [activeTab]);

  // Helper for Status Badge Styles
  const getStatusBadgeStyle = (status: AppStatus) => {
    switch(status) {
      case 'APPROVED':
      case 'PENDING_ED':
      case 'APPROVED_FINANCE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING_FINANCE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RETURNED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING_LAW':
      case 'PENDING_ENGG':
      case 'PENDING_RELATIONS':
      case 'PENDING_HR':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Handlers
  const handleProcessApp = (action: 'RETURN' | 'RECOMMEND' | 'APPROVE', note?: string) => {
    if (!selectedApp) return;

    // Simulate processing locally
    const newStatus = action === 'RETURN' ? 'RETURNED' : (action === 'APPROVE' ? 'APPROVED' : 'PENDING_HR');
    
    setLocalInbox(prev => prev.map(item => 
      item.id === selectedApp.id ? { ...item, status: newStatus as AppStatus } : item
    ));

    // Reset view
    setSelectedAppId(null);
    onUpdateReview({ remarks: {}, rejectedDocs: [] }); // Clear review data
  };

  // RENDER ROUTER: If Sanction Tab is active, render Sanction Manager
  if (activeTab === 'sanction-orders') {
    return (
       <div className="w-full max-w-6xl mx-auto px-6 py-8">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SanctionManager />
         </motion.div>
       </div>
    );
  }

  // DEFAULT RENDER: Inbox / Sent / Archive
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedApp ? (
            // VIEW 1: LIST
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-30">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{pageTitle}</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Role: <span className="font-bold text-iocl-saffron">{currentUserRole}</span> • Manage and review requests.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                   {/* Filter Button Component */}
                   <div className="relative">
                     <button 
                       onClick={() => setIsFilterOpen(!isFilterOpen)} 
                       className={`p-2 border rounded-lg transition-colors ${isFilterOpen || activeFilters.department !== 'All' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                     >
                       <Filter className="w-4 h-4" />
                     </button>
                     
                     <AnimatePresence>
                       {isFilterOpen && (
                         <>
                           <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                           <motion.div 
                             initial={{ opacity: 0, y: 10, scale: 0.95 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 10, scale: 0.95 }}
                             className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-5 z-50"
                           >
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-slate-800">Filter Applications</h3>
                                {(activeFilters.department !== 'All') && (
                                   <button onClick={() => setActiveFilters({ department: 'All' })} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
                                )}
                             </div>

                             <div className="space-y-4">
                               <div>
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Department</label>
                                  <select
                                    value={activeFilters.department}
                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, department: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-100"
                                  >
                                     <option value="All">All Departments</option>
                                     <option value="LPG Operations">LPG Operations</option>
                                     <option value="Human Resources">Human Resources</option>
                                     <option value="Marketing Division">Marketing Division</option>
                                     <option value="Retail Sales">Retail Sales</option>
                                     <option value="State Office">State Office</option>
                                     <option value="Aviation">Aviation</option>
                                  </select>
                               </div>
                             </div>
                           </motion.div>
                         </>
                       )}
                     </AnimatePresence>
                   </div>
                </div>
              </header>

              {/* ANALYTICS SECTION */}
              {activeTab === 'inbox' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Card 1: Processing Time */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl p-4 flex flex-col justify-between"
                  >
                     <div className="flex items-center gap-3 text-slate-500 mb-2">
                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                         <Clock className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider">Avg Time</span>
                     </div>
                     <div>
                       <div className="text-2xl font-bold text-slate-700">2.4 Days</div>
                       <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                         <TrendingDown className="w-3 h-3" />
                         <span>12% vs last week</span>
                       </div>
                     </div>
                  </motion.div>

                  {/* Card 2: Pending Value */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl p-4 flex flex-col justify-between"
                  >
                     <div className="flex items-center gap-3 text-slate-500 mb-2">
                       <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                         <IndianRupee className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider">Pending Value</span>
                     </div>
                     <div>
                       <div className="text-2xl font-bold text-slate-700">₹4.5 Cr</div>
                       <div className="text-xs text-slate-400 mt-1 font-medium">Across 12 applications</div>
                     </div>
                  </motion.div>

                  {/* Card 3: Clearance Rate */}
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl p-4 flex flex-col justify-between"
                  >
                     <div className="flex items-center gap-3 text-slate-500 mb-2">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                         <Activity className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider">Clearance Rate</span>
                     </div>
                     <div>
                       <div className="text-2xl font-bold text-emerald-600">92%</div>
                       <div className="text-xs text-slate-400 mt-1 font-medium">Top 5% in Region</div>
                     </div>
                  </motion.div>

                  {/* Card 4: Donut Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl p-4 flex items-center justify-between gap-3"
                  >
                     <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Status Mix</span>
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                             <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> Pending
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Approved
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Returned
                           </div>
                        </div>
                     </div>
                     
                     {/* CSS Conic Gradient Donut */}
                     <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-inner ring-1 ring-slate-100"
                          style={{ background: 'conic-gradient(#f97316 0% 45%, #10b981 45% 85%, #ef4444 85% 100%)' }}
                     >
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center">
                           <PieChart className="w-4 h-4 text-slate-400" />
                        </div>
                     </div>
                  </motion.div>
                </div>
              )}

              <div className="grid gap-4">
                 {isLoading ? (
                    // Skeleton Loading State
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-4 animate-pulse">
                         {/* Avatar Skeleton */}
                         <SkeletonLoader className="w-12 h-12 rounded-full flex-shrink-0" />
                         
                         {/* Text Rows Skeletons */}
                         <div className="flex-1 space-y-3">
                            <SkeletonLoader className={`h-5 rounded-md ${i % 2 === 0 ? 'w-1/3' : 'w-1/4'}`} />
                            <SkeletonLoader className={`h-4 rounded-md ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
                         </div>

                         {/* Right Side Skeleton */}
                         <div className="hidden sm:flex flex-col items-end gap-2">
                            <SkeletonLoader className="h-4 w-20 rounded-md" />
                            <SkeletonLoader className="h-8 w-24 rounded-lg" />
                         </div>
                      </div>
                    ))
                 ) : (
                   filteredInbox.map((app) => (
                     <MotionCard 
                        key={app.id} 
                        className="group p-5 hover:border-iocl-blue/30 transition-all cursor-pointer"
                        onClick={() => setSelectedAppId(app.id)}
                     >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           
                           {/* Left: Applicant Info */}
                           <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 shadow-sm bg-blue-50 text-blue-600 border-blue-100`}>
                                {app.applicant.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{app.applicant.name}</h3>
                                 </div>
                                 <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> {app.applicant.designation}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5"/> {app.applicant.dept}</span>
                                 </div>
                              </div>
                           </div>

                           {/* Right: Meta & Action */}
                           <div className="flex items-center gap-6 md:justify-end flex-grow">
                              <div className="text-right hidden sm:block">
                                 <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Ref Number</div>
                                 <div className="font-mono font-medium text-slate-700">{app.refNo}</div>
                              </div>
                              <div className="text-right hidden sm:block">
                                 <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Submitted</div>
                                 <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                    <CalendarClock className="w-3.5 h-3.5 text-slate-400" /> {app.submittedTime}
                                 </div>
                              </div>
                              
                              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${getStatusBadgeStyle(app.status)}`}>
                                 {app.status.replace('_', ' ')}
                              </div>

                              <button className="hidden group-hover:flex items-center gap-2 px-4 py-2 bg-iocl-blue text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-900 transition-all">
                                 Review
                              </button>
                           </div>

                        </div>
                     </MotionCard>
                   ))
                 )}
                 
                 {!isLoading && filteredInbox.length === 0 && (
                   <div className="text-center py-20 text-slate-400">
                     <Inbox className="w-16 h-16 mx-auto mb-4 opacity-20" />
                     <p className="text-lg font-medium">No items found matching your filters.</p>
                     {(activeFilters.department !== 'All') && (
                       <button 
                          onClick={() => setActiveFilters({ department: 'All' })}
                          className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200"
                       >
                         Clear Filters
                       </button>
                     )}
                   </div>
                 )}
              </div>
            </motion.div>
          ) : (
            // VIEW 2: DETAILED REVIEW
            <ReviewDetail 
              app={selectedApp} 
              currentUserRole={currentUserRole}
              reviewData={reviewData}
              onUpdateReview={onUpdateReview}
              onBack={() => setSelectedAppId(null)}
              onProcess={handleProcessApp}
              getStatusBadgeStyle={getStatusBadgeStyle}
            />
          )}
        </AnimatePresence>
    </div>
  );
};
