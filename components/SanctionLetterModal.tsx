
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2, Mail, FileText, Send, Paperclip, ChevronRight, Loader2 } from 'lucide-react';
import { MotionButton } from './MotionComponents';
import { useToast } from './ToastContext';

interface SanctionData {
  refNo: string;
  applicantName: string;
  designation: string;
  empId: string;
  amount: number;
  location: string;
  purpose: string;
  propertyAddress?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SanctionData;
}

export const SanctionLetterModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'email'>('preview');
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const recoveryStart = "Feb 2026";
  const emi = Math.round((data.amount * 0.00711) + (data.amount / 240)); // Approximate calc
  const interestRate = "7.1% p.a.";
  const applicantEmail = "sharmamk6@indianoil.in"; // Mock email based on demo data

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast.success("Sanction Order sent successfully to Employee & Payroll.");
      onClose();
    }, 1500);
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
            className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center no-print">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                   <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-800">Final Sanction Letter</h2>
                    <p className="text-xs text-slate-500 font-medium">Ref: {data.refNo}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-200 bg-white flex gap-6 no-print">
               <button 
                 onClick={() => setActiveTab('preview')}
                 className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'preview' ? 'border-iocl-saffron text-iocl-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 <FileText className="w-4 h-4" /> Preview & Print
               </button>
               <button 
                 onClick={() => setActiveTab('email')}
                 className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'email' ? 'border-iocl-saffron text-iocl-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 <Mail className="w-4 h-4" /> Email Dispatch
               </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-slate-100 custom-scrollbar relative">
               
               {/* PREVIEW TAB */}
               {activeTab === 'preview' && (
                 <div className="p-8 flex justify-center">
                    <div className="flex flex-col gap-4">
                       <div className="flex justify-end gap-2 no-print w-[210mm]">
                          <MotionButton onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 shadow-lg">
                             <Printer className="w-3.5 h-3.5" /> Print Letter
                          </MotionButton>
                          <MotionButton className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50">
                             <Download className="w-3.5 h-3.5" /> Download PDF
                          </MotionButton>
                       </div>

                       <div 
                         id="sanction-letter-container" 
                         className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-[25mm] text-slate-900 font-serif relative"
                       >
                          {/* Letter Content (Same as before) */}
                          <div className="text-center mb-8">
                             <img src="https://iocl.com/images/static/indianoil_logo.jpg" alt="IOCL Logo" className="h-16 mx-auto mb-3" />
                             <h1 className="text-xl font-bold uppercase tracking-wide text-slate-800">Indian Oil Corporation Limited</h1>
                             <p className="text-sm font-semibold text-slate-600">(Marketing Division)</p>
                             <div className="w-full h-0.5 bg-slate-800 my-4"></div>
                          </div>

                          <div className="flex justify-between text-sm mb-8 font-semibold">
                             <p>Ref: {data.refNo}</p>
                             <p>Date: {currentDate}</p>
                          </div>

                          <div className="mb-8 text-sm leading-relaxed">
                             <p>To,</p>
                             <p className="font-bold">{data.applicantName}</p>
                             <p>{data.designation}</p>
                             <p>Emp ID: {data.empId}</p>
                             <p>{data.location}</p>
                          </div>

                          <div className="mb-8">
                             <p className="text-sm font-bold underline text-justify">
                                Sub: Sanction of House Building Allowance (HBA)
                             </p>
                          </div>

                          <div className="text-sm leading-7 text-justify mb-8 space-y-4">
                             <p>
                                With reference to your application dated <strong>20 Dec 2025</strong>, approval of the Competent Authority is hereby conveyed for the sanction of House Building Allowance of <strong className="whitespace-nowrap">₹ {data.amount.toLocaleString('en-IN')}</strong> (Rupees Forty Five Lakhs Only) for the purpose of <strong>{data.purpose}</strong> at <strong>{data.propertyAddress || data.location}</strong>.
                             </p>
                             <p>
                                The sanction is subject to the terms and conditions prescribed in the Corporation's HBA Rules and the execution of necessary legal documents/mortgage deeds.
                             </p>
                          </div>

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

                          <div className="mt-20 flex flex-col items-end text-sm">
                             <div className="text-center">
                                <p className="font-bold mb-8">(Authorized Signatory)</p>
                                <p className="font-bold">Senior Manager (ES)</p>
                                <p>For Indian Oil Corporation Ltd.</p>
                             </div>
                          </div>

                          <div className="mt-16 pt-4 border-t border-slate-300 text-xs text-center text-slate-500">
                             This is a computer-generated document. Reference No: {data.refNo}
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* EMAIL TAB */}
               {activeTab === 'email' && (
                 <div className="p-8 max-w-2xl mx-auto h-full flex flex-col">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col"
                    >
                       <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Send className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-700">Send Sanction Order via Email</h3>
                       </div>
                       
                       <div className="p-6 space-y-6 flex-1">
                          
                          {/* To Field */}
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To (Applicant)</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs border border-orange-200">
                                 {data.applicantName.charAt(0)}
                               </div>
                               <div className="flex-1">
                                  <div className="text-sm font-bold text-slate-700">{data.applicantName}</div>
                                  <div className="text-xs text-slate-500">{applicantEmail}</div>
                               </div>
                               <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                          </div>

                          {/* CC Field */}
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CC (Payroll Dept)</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                               <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-200">
                                 P
                               </div>
                               <div className="flex-1">
                                  <div className="text-sm font-bold text-slate-700">Finance Payroll</div>
                                  <div className="text-xs text-slate-500">finance.payroll@indianoil.in</div>
                               </div>
                               <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                          </div>

                          {/* Attachment Card */}
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attachments</label>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group">
                               <div className="p-2 bg-white rounded shadow-sm">
                                  <FileText className="w-6 h-6 text-red-500" />
                               </div>
                               <div className="flex-1">
                                  <div className="text-sm font-bold text-slate-700 group-hover:text-blue-800">HBA_Sanction_Order_{data.refNo.split('/').pop()}.pdf</div>
                                  <div className="text-xs text-slate-500">245 KB • PDF Document</div>
                               </div>
                               <Paperclip className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>

                       </div>

                       <div className="p-6 bg-slate-50 border-t border-slate-200">
                          <MotionButton 
                            onClick={handleSendEmail}
                            disabled={isSending}
                            className={`w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all
                                ${isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-iocl-blue hover:bg-blue-900 shadow-blue-900/20'}
                            `}
                          >
                             {isSending ? (
                               <>
                                 <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                               </>
                             ) : (
                               <>
                                 Sign & Send Mail <ChevronRight className="w-5 h-5" />
                               </>
                             )}
                          </MotionButton>
                       </div>
                    </motion.div>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
