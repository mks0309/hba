
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { MotionButton } from './MotionComponents';

interface SanctionData {
  refNo: string;
  applicantName: string;
  designation: string;
  empId: string;
  amount: number;
  location: string;
  purpose: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SanctionData;
}

export const SanctionLetterModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const recoveryStart = "Feb 2026";
  const emi = Math.round((data.amount * 0.00711) + (data.amount / 240)); // Approximate calc
  const interestRate = "7.1% p.a.";

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          {/* Print Styles */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #sanction-letter-container, #sanction-letter-container * {
                visibility: visible;
              }
              #sanction-letter-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20mm;
                background: white;
                box-shadow: none;
                border: none;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center rounded-t-2xl no-print">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                   <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-800">Final Sanction Letter Preview</h2>
              </div>
              <div className="flex items-center gap-3">
                 <MotionButton onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900">
                    <Printer className="w-4 h-4" /> Print
                 </MotionButton>
                 <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <X className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Scrollable Letter Container */}
            <div className="overflow-y-auto flex-1 p-8 bg-slate-100 flex justify-center custom-scrollbar">
               <div 
                 id="sanction-letter-container" 
                 className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-[25mm] text-slate-900 font-serif relative"
               >
                  {/* Letter Header */}
                  <div className="text-center mb-8">
                     <img src="https://iocl.com/images/static/indianoil_logo.jpg" alt="IOCL Logo" className="h-16 mx-auto mb-3" />
                     <h1 className="text-xl font-bold uppercase tracking-wide text-slate-800">Indian Oil Corporation Limited</h1>
                     <p className="text-sm font-semibold text-slate-600">(Marketing Division)</p>
                     <div className="w-full h-0.5 bg-slate-800 my-4"></div>
                  </div>

                  {/* Ref & Date */}
                  <div className="flex justify-between text-sm mb-8 font-semibold">
                     <p>Ref: {data.refNo}</p>
                     <p>Date: {currentDate}</p>
                  </div>

                  {/* Recipient */}
                  <div className="mb-8 text-sm leading-relaxed">
                     <p>To,</p>
                     <p className="font-bold">{data.applicantName}</p>
                     <p>{data.designation}</p>
                     <p>Emp ID: {data.empId}</p>
                     <p>{data.location}</p>
                  </div>

                  {/* Subject */}
                  <div className="mb-8">
                     <p className="text-sm font-bold underline text-justify">
                        Sub: Sanction of House Building Allowance (HBA)
                     </p>
                  </div>

                  {/* Body */}
                  <div className="text-sm leading-7 text-justify mb-8 space-y-4">
                     <p>
                        With reference to your application dated <strong>20 Dec 2025</strong>, approval of the Competent Authority is hereby conveyed for the sanction of House Building Allowance of <strong className="whitespace-nowrap">₹ {data.amount.toLocaleString('en-IN')}</strong> (Rupees Forty Five Lakhs Only) for the purpose of <strong>{data.purpose}</strong> at <strong>{data.location}</strong>.
                     </p>
                     <p>
                        The sanction is subject to the terms and conditions prescribed in the Corporation's HBA Rules and the execution of necessary legal documents/mortgage deeds.
                     </p>
                  </div>

                  {/* Details Table */}
                  <div className="mb-10">
                     <p className="text-sm font-bold mb-2">Sanction Details:</p>
                     <table className="w-full border-collapse border border-slate-800 text-sm">
                        <tbody>
                           <tr>
                              <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Sanction Amount</td>
                              <td className="border border-slate-800 p-2">₹ {data.amount.toLocaleString('en-IN')}</td>
                           </tr>
                           <tr>
                              <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Interest Rate</td>
                              <td className="border border-slate-800 p-2">{interestRate}</td>
                           </tr>
                           <tr>
                              <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Monthly Installment (Approx.)</td>
                              <td className="border border-slate-800 p-2">₹ {emi.toLocaleString('en-IN')}</td>
                           </tr>
                           <tr>
                              <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Recovery Starts From</td>
                              <td className="border border-slate-800 p-2">{recoveryStart}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Footer/Signatory */}
                  <div className="mt-20 flex flex-col items-end text-sm">
                     <div className="text-center">
                        <p className="font-bold mb-8">(Authorized Signatory)</p>
                        <p className="font-bold">Senior Manager (ES)</p>
                        <p>For Indian Oil Corporation Ltd.</p>
                     </div>
                  </div>

                  {/* Bottom Note */}
                  <div className="mt-16 pt-4 border-t border-slate-300 text-xs text-center text-slate-500">
                     This is a computer-generated document. Reference No: {data.refNo}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
