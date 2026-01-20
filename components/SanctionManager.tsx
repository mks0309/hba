
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Search, SlidersHorizontal, ArrowUpRight, IndianRupee, Info, Crown } from 'lucide-react';
import { MotionCard, MotionButton } from './MotionComponents';
import { SanctionLetterModal } from './SanctionLetterModal';
import { ApplicationHistoryModal } from './ApplicationHistoryModal';

interface Application {
  id: string;
  refNo: string;
  applicant: {
    name: string;
    designation: string;
    empId: string;
    dept: string;
  };
  amount: number;
  type: string;
  status: string;
  location: string;
}

// Updated Mock Data: Status is now APPROVED_BY_ED (Step 7 Complete), ready for Sanction Order (Step 8)
const MOCK_DATA: Application[] = [
  {
     id: '101',
     refNo: 'IOCL/HBA/2026/042',
     applicant: { name: 'Amit Verma', designation: 'Chief Manager', empId: '00556677', dept: 'LPG' },
     amount: 4500000,
     type: 'Resale',
     status: 'APPROVED_BY_ED', 
     location: 'Mumbai'
  },
  {
     id: '102',
     refNo: 'IOCL/HBA/2026/048',
     applicant: { name: 'Sneha Roy', designation: 'Senior Engineer', empId: '00112233', dept: 'Aviation' },
     amount: 3200000,
     type: 'Construction',
     status: 'APPROVED_BY_ED',
     location: 'Noida'
  },
  {
     id: '103',
     refNo: 'IOCL/HBA/2026/055',
     applicant: { name: 'Rahul Khanna', designation: 'DGM (HR)', empId: '00998877', dept: 'HR' },
     amount: 6000000,
     type: 'Resale',
     status: 'APPROVED_BY_ED',
     location: 'Gurgaon'
  }
];

export const SanctionManager: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [historyApp, setHistoryApp] = useState<Application | null>(null);

  const handleGrantSanction = (e: React.MouseEvent, app: Application) => {
    e.stopPropagation(); // Prevent opening the history modal
    setSelectedApp(app);
  };

  const handleRowClick = (app: Application) => {
    setHistoryApp(app);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <FileCheck className="w-8 h-8 text-iocl-saffron" />
             Sanction Orders
           </h1>
           <p className="text-slate-500 mt-1">Issue Final Sanction Letters for applications <strong className="text-slate-700">Approved by ED (Region)</strong>.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Ref No..." 
                className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-iocl-saffron/20 outline-none w-64"
              />
           </div>
           <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
              <SlidersHorizontal className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {MOCK_DATA.map((app) => (
           <MotionCard 
             key={app.id} 
             onClick={() => handleRowClick(app)}
             className="p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-md hover:border-iocl-blue/30 transition-all cursor-pointer group relative"
           >
              {/* Hover Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-iocl-blue scale-y-0 group-hover:scale-y-100 transition-transform origin-center rounded-l-xl" />
              
              {/* Icon & Ref */}
              <div className="flex items-center gap-4 min-w-[200px]">
                 <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    {app.applicant.name.charAt(0)}
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Reference No</div>
                    <div className="font-mono font-semibold text-slate-700 group-hover:text-iocl-blue transition-colors">{app.refNo}</div>
                 </div>
              </div>

              {/* Applicant */}
              <div className="flex-1 min-w-[200px]">
                 <h3 className="font-bold text-slate-800 text-lg">{app.applicant.name}</h3>
                 <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                    <span>{app.applicant.designation}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{app.applicant.dept}</span>
                 </div>
              </div>

              {/* Status Badge - ED Approved */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-lg text-purple-700 text-xs font-bold uppercase tracking-wide mr-4">
                 <Crown className="w-3.5 h-3.5" /> Approved by ED
              </div>

              {/* Details */}
              <div className="flex items-center gap-8 mr-4">
                 <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Loan Amount</div>
                    <div className="font-bold text-slate-800 flex items-center gap-1 text-lg">
                       <IndianRupee className="w-4 h-4" />
                       {app.amount.toLocaleString('en-IN')}
                    </div>
                 </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="hidden group-hover:flex text-xs text-slate-400 font-medium items-center gap-1">
                   <Info className="w-3 h-3" /> View History
                </div>
                <MotionButton 
                  onClick={(e) => handleGrantSanction(e as any, app)}
                  className="bg-iocl-blue text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-blue-900 flex items-center gap-2 whitespace-nowrap z-10"
                >
                   Issue Order <ArrowUpRight className="w-4 h-4" />
                </MotionButton>
              </div>

           </MotionCard>
        ))}
      </div>

      {/* Grant Sanction Modal */}
      {selectedApp && (
         <SanctionLetterModal 
            isOpen={!!selectedApp} 
            onClose={() => setSelectedApp(null)}
            data={{
               refNo: selectedApp.refNo,
               applicantName: selectedApp.applicant.name,
               designation: selectedApp.applicant.designation,
               empId: selectedApp.applicant.empId,
               amount: selectedApp.amount,
               location: selectedApp.location,
               purpose: selectedApp.type === 'Resale' ? 'Purchase of Resale Flat' : 'Construction of House'
            }}
         />
      )}

      {/* Approval History Modal */}
      {historyApp && (
         <ApplicationHistoryModal 
            isOpen={!!historyApp}
            onClose={() => setHistoryApp(null)}
            app={historyApp}
         />
      )}
    </div>
  );
};
