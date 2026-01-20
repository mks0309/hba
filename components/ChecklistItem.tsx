import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Upload, FileText, X, AlertTriangle, FileCheck2, AlertCircle, Ban, Eye, MessageSquare, Check, XCircle, RotateCcw } from 'lucide-react';
import { ChecklistItemData } from '../types';

interface Props {
  item: ChecklistItemData;
  index: number;
  section: string;
  variants?: Variants;
  // New Props for Workflow
  mode?: 'applicant' | 'review';
  isRejected?: boolean;
  remark?: string;
  onRemarkChange?: (text: string) => void;
  onStatusToggle?: (isRejected: boolean) => void; // For reviewer to toggle reject status
}

export const ChecklistItem: React.FC<Props> = ({ 
  item, 
  index, 
  section, 
  variants, 
  mode = 'applicant',
  isRejected = false,
  remark = '',
  onRemarkChange,
  onStatusToggle
}) => {
  const [status, setStatus] = useState<'pending' | 'uploading' | 'received'>('pending');
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNA, setIsNA] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(!!remark);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If item is rejected in applicant mode, auto-set status to pending so they can re-upload
  useEffect(() => {
    if (mode === 'applicant' && isRejected) {
      setStatus('pending');
      setFileName(null);
    } else if (mode === 'review') {
        // In review mode, assume files are "received" for visualization purposes unless strictly pending
        setStatus('received');
        setFileName(`${item.label.substring(0, 15)}...pdf`);
    }
  }, [mode, isRejected, item.label]);

  const handleUploadClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError("File too large (>50MB).");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setError(null), 4000);
        return;
      }
      if (file.type !== "application/pdf") {
        setError("PDF only.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setError(null), 2000);
        return;
      }
      
      setError(null);
      setStatus('uploading');
      setFileName(file.name);
      setTimeout(() => { setStatus('received'); }, 1500);
    }
  };

  const isOriginal = item.fixedType === 'Original';
  const buttonLayoutId = `btn-${section}-${item.id}`;

  // Dynamic Styles based on Status/Mode
  let bgColor = '#ffffff';
  let borderColor = '#e2e8f0';

  if (isRejected) {
    bgColor = '#fef2f2'; // Red-50
    borderColor = '#fca5a5'; // Red-300
  } else if (mode === 'applicant' && status === 'received') {
    bgColor = 'rgba(240, 253, 244, 0.6)';
    borderColor = '#bbf7d0';
  } else if (isNA) {
    bgColor = '#f8fafc';
  }

  return (
    <motion.div 
      layout
      variants={variants}
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      className={`relative border rounded-xl p-5 transition-colors duration-300 ${isNA ? 'grayscale-[0.5]' : ''}`}
    >
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf" />

      <div className="flex flex-col gap-4">
        {/* Top Row: Info & Main Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Label Section */}
          <div className="flex items-start gap-4 flex-1">
            <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center border transition-colors
              ${isRejected ? 'bg-red-100 text-red-600 border-red-200' : 
                (status === 'received' ? 'bg-green-500 text-white border-green-600' : 'bg-slate-100 text-slate-500 border-slate-300')
              }`}>
              {isRejected ? <X className="w-5 h-5" /> : status === 'received' ? <Check className="w-5 h-5" /> : item.id}
            </div>
            
            <div className="flex flex-col">
              <h4 className={`text-base leading-snug font-medium ${isRejected ? 'text-red-700' : 'text-slate-800'}`}>
                {item.label}
                {item.required && !isNA && mode === 'applicant' && status !== 'received' && <span className="text-red-500 ml-1">*</span>}
              </h4>
              
              {/* File Name or NA status */}
              <AnimatePresence>
                {!isNA && status === 'received' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {fileName || "Document_Scan.pdf"}
                  </motion.div>
                )}
                {isRejected && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-2 bg-red-100/50 rounded-lg border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="uppercase text-[10px] text-red-500 font-bold block mb-0.5">Reviewer Remark:</span>
                        {remark || "Please re-upload this document."}
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
             
             {/* Original/Xerox Badge */}
             {!isNA && (
                <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-bold uppercase ${isOriginal ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {isOriginal ? 'Original' : 'Xerox'}
                </div>
             )}

             {/* Workflow Logic */}
             {mode === 'applicant' ? (
               // APPLICANT ACTIONS
               <div className="flex items-center gap-3">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={isNA} onChange={(e) => setIsNA(e.target.checked)} className="accent-[#F37021]" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">N/A</span>
                 </label>

                 {status === 'pending' || isRejected ? (
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleUploadClick}
                     className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold uppercase shadow-sm ${isRejected ? 'bg-red-600 text-white border-red-700 hover:bg-red-700' : 'bg-white text-iocl-saffron border-iocl-saffron hover:bg-orange-50'}`}
                   >
                     {isRejected ? <RotateCcw className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                     {isRejected ? "Re-Upload" : "Upload"}
                   </motion.button>
                 ) : (
                   <button onClick={() => setStatus('pending')} className="p-2 text-slate-400 hover:text-red-500">
                     <X className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ) : (
               // REVIEWER ACTIONS
               <div className="flex items-center gap-2">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                   title="View Document"
                 >
                   <Eye className="w-4 h-4" />
                 </motion.button>

                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     const newStatus = !isRejected;
                     onStatusToggle && onStatusToggle(newStatus);
                     if (newStatus) setIsRemarkOpen(true);
                   }}
                   className={`p-2 rounded-lg border transition-colors ${isRejected ? 'bg-red-600 text-white border-red-700' : 'bg-white text-slate-400 border-slate-200 hover:border-red-300 hover:text-red-500'}`}
                   title={isRejected ? "Clear Rejection" : "Reject Document"}
                 >
                   {isRejected ? <X className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                 </motion.button>
               </div>
             )}
          </div>
        </div>

        {/* Remark Input (Reviewer Only) */}
        <AnimatePresence>
          {mode === 'review' && isRejected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-red-100 mt-2">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-red-400 mt-2" />
                  <textarea
                    value={remark}
                    onChange={(e) => onRemarkChange && onRemarkChange(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full text-sm p-2 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-slate-700 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
