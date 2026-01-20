
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Eye, FileText, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  onVerify: (isVerified: boolean, remarks: string) => void;
}

const SMART_CHIPS = [
  "Blurry Scan",
  "Signature Missing",
  "Notarization Required",
  "Outdated Document",
  "Wrong Format"
];

export const ReviewDocumentModal: React.FC<Props> = ({ isOpen, onClose, documentName, onVerify }) => {
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState<'verified' | 'flagged' | null>(null);

  const handleChipClick = (chip: string) => {
    setRemarks(prev => prev ? `${prev}, ${chip}` : chip);
    setStatus('flagged');
  };

  const handleSubmit = () => {
    if (status) {
      onVerify(status === 'verified', remarks);
      onClose();
      // Reset state
      setRemarks('');
      setStatus(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left: Document Viewer (50%) */}
            <div className="w-full md:w-1/2 bg-slate-100 border-r border-slate-200 flex flex-col">
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <span className="font-bold text-slate-700 truncate max-w-[200px]">{documentName}</span>
                </div>
                <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                  PREVIEW MODE
                </div>
              </div>
              <div className="flex-1 p-4 overflow-hidden relative">
                 {/* Mock PDF Viewer using iframe or placeholder */}
                 <div className="w-full h-full bg-white border border-slate-300 shadow-inner rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://iocl.com/assets/images/set2.jpg')] opacity-5 bg-cover bg-center" />
                    <div className="text-center p-8">
                       <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                       <p className="text-slate-400 font-medium">Document Preview Loaded</p>
                       <p className="text-xs text-slate-300 mt-2">IOCL/DOCS/VIEWER_V2.1</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                 </div>
              </div>
            </div>

            {/* Right: Verification Panel (50%) */}
            <div className="w-full md:w-1/2 bg-white flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Verification Console</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                
                {/* Status Toggles */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setStatus('verified')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      status === 'verified' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-slate-200 hover:border-green-200 hover:bg-green-50/50 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className={`w-8 h-8 ${status === 'verified' ? 'fill-green-500 text-white' : ''}`} />
                    <span className="font-bold">Mark as Verified</span>
                  </button>

                  <button
                    onClick={() => setStatus('flagged')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      status === 'flagged' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 text-slate-500'
                    }`}
                  >
                    <AlertTriangle className={`w-8 h-8 ${status === 'flagged' ? 'fill-orange-500 text-white' : ''}`} />
                    <span className="font-bold">Flag Issue</span>
                  </button>
                </div>

                {/* Smart Chips */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Quick Issues (Smart Chips)</label>
                  <div className="flex flex-wrap gap-2">
                    {SMART_CHIPS.map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Reviewer Remarks {status === 'flagged' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter detailed observation here..."
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-iocl-blue/20 focus:border-iocl-blue outline-none resize-none text-slate-700"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={handleSubmit}
                  disabled={!status || (status === 'flagged' && !remarks)}
                  className="w-full py-4 bg-iocl-blue hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  Confirm & Save <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
