import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Plus, Calendar, Building, Upload } from 'lucide-react';
import { UserRole } from '../types';
import { MotionButton } from './MotionComponents';

interface Circular {
  id: number;
  date: string;
  title: string;
  issuedBy: string;
  url: string; 
}

const MOCK_CIRCULARS: Circular[] = [
  { id: 1, date: "20 Jan 2026", title: "Revised Interest Rates for FY 25-26", issuedBy: "Finance Dept", url: "#" },
  { id: 2, date: "15 Dec 2025", title: "Digitization of HBA Process - Guidelines", issuedBy: "HR Dept", url: "#" },
  { id: 3, date: "10 Nov 2025", title: "Property Valuation Norms Update", issuedBy: "Legal Dept", url: "#" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

export const CircularsModal: React.FC<Props> = ({ isOpen, onClose, userRole }) => {
  const [circulars, setCirculars] = useState<Circular[]>(MOCK_CIRCULARS);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newCircular: Circular = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      issuedBy: userRole === 'HR' ? 'HR Dept' : 'Admin', 
      url: '#'
    };

    setCirculars([newCircular, ...circulars]);
    setNewTitle('');
    setNewDate('');
    setIsUploading(false);
  };

  const canUpload = userRole === 'Admin' || userRole === 'HR';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80]"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 text-iocl-blue rounded-lg">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-800">Official HBA Circulars</h2>
                     <p className="text-sm text-slate-500">Policy updates and notifications</p>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                
                {/* Upload Section */}
                {canUpload && (
                  <div className="mb-8">
                    {!isUploading ? (
                       <MotionButton 
                         onClick={() => setIsUploading(true)}
                         className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:border-iocl-saffron hover:text-iocl-saffron hover:bg-orange-50 transition-all"
                       >
                         <Plus className="w-5 h-5" />
                         Upload New Circular
                       </MotionButton>
                    ) : (
                       <motion.form 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         onSubmit={handlePublish}
                         className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                       >
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Publish New Circular
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             <div>
                               <label className="text-xs font-semibold text-slate-500 mb-1 block">Title</label>
                               <input 
                                 type="text" 
                                 required
                                 value={newTitle}
                                 onChange={e => setNewTitle(e.target.value)}
                                 className="w-full p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-iocl-blue/20 outline-none"
                                 placeholder="e.g. Revised Interest Rates..."
                               />
                             </div>
                             <div>
                               <label className="text-xs font-semibold text-slate-500 mb-1 block">Date</label>
                               <input 
                                 type="date" 
                                 required
                                 value={newDate}
                                 onChange={e => setNewDate(e.target.value)}
                                 className="w-full p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-iocl-blue/20 outline-none"
                               />
                             </div>
                          </div>
                          <div className="flex justify-end gap-3">
                             <button type="button" onClick={() => setIsUploading(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                             <button type="submit" className="px-6 py-2 bg-iocl-saffron text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md">Publish</button>
                          </div>
                       </motion.form>
                    )}
                  </div>
                )}

                {/* List */}
                <div className="space-y-3">
                  {circulars.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-100 hover:shadow-md transition-all group"
                    >
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-700 group-hover:text-iocl-blue transition-colors">{item.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                             <span className="flex items-center gap-1.5 font-medium bg-slate-50 px-2 py-0.5 rounded">
                               <Calendar className="w-3 h-3" /> {item.date}
                             </span>
                             <span className="flex items-center gap-1.5 font-medium bg-slate-50 px-2 py-0.5 rounded">
                               <Building className="w-3 h-3" /> {item.issuedBy}
                             </span>
                          </div>
                       </div>
                       
                       <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold group-hover:bg-iocl-blue group-hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                       </button>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
