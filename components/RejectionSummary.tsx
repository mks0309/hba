import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, FileWarning } from 'lucide-react';
import { ChecklistItemData, ReviewData } from '../types';

interface Props {
  reviewData: ReviewData;
  checklistFlat: { section: string, item: ChecklistItemData }[];
}

export const RejectionSummary: React.FC<Props> = ({ reviewData, checklistFlat }) => {
  const rejectedItems = checklistFlat.filter(entry => 
    reviewData.rejectedDocs.includes(`${entry.section}-${entry.item.id}`)
  );

  if (rejectedItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm mb-6"
    >
      <div className="bg-red-100/50 px-6 py-4 border-b border-red-200 flex items-center gap-3">
         <div className="p-2 bg-red-200 rounded-full text-red-700">
           <AlertTriangle className="w-5 h-5" />
         </div>
         <div>
           <h3 className="text-red-900 font-bold text-lg">Application Returned for Correction</h3>
           <p className="text-red-700 text-sm">Please address the following issues and re-submit your application.</p>
         </div>
      </div>

      <div className="p-4 md:p-6">
        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 px-2">Action Items ({rejectedItems.length})</h4>
        <div className="space-y-2">
          {rejectedItems.map((entry) => {
             const key = `${entry.section}-${entry.item.id}`;
             const remark = reviewData.remarks[key];
             
             return (
               <div key={key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 bg-white border border-red-100 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileWarning className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-slate-800">{entry.item.label}</span>
                  </div>
                  
                  {remark && (
                    <div className="flex items-center gap-2 md:max-w-[50%] w-full bg-red-50 px-3 py-1.5 rounded text-xs text-red-800 border border-red-100">
                      <span className="font-bold flex-shrink-0">Remark:</span>
                      <span className="truncate">{remark}</span>
                    </div>
                  )}

                  <div className="hidden md:block">
                     <ChevronRight className="w-4 h-4 text-red-300" />
                  </div>
               </div>
             )
          })}
        </div>
      </div>
    </motion.div>
  );
};
