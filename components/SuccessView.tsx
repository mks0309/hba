import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { MotionButton } from './MotionComponents';
import { jsPDF } from 'jspdf';

interface SuccessViewProps {
  refId: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ refId }) => {

  const handleDownload = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // -- Header Section --
    // Logo placeholder (optional, skipping image for simplicity, using text)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 55, 103); // IOCL Blue
    doc.text("INDIAN OIL CORPORATION LIMITED", 105, 22, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("House Building Allowance (HBA) Portal", 105, 30, { align: "center" });
    
    // Horizontal Line
    doc.setDrawColor(243, 112, 33); // IOCL Saffron
    doc.setLineWidth(0.5);
    doc.line(20, 36, 190, 36);

    // -- Title --
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("ACKNOWLEDGEMENT RECEIPT", 105, 50, { align: "center" });

    // -- Details Box --
    doc.setFillColor(248, 250, 252); // Light Gray Background
    doc.setDrawColor(226, 232, 240); // Slate 200 Border
    doc.rect(20, 60, 170, 45, 'FD');

    // Box Content
    doc.setFontSize(11);
    
    // Row 1: Ref ID
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text("Application Reference ID :", 30, 75);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(refId, 90, 75);

    // Row 2: Date
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Date of Submission       :", 30, 85);
    doc.setTextColor(15, 23, 42);
    doc.text(date, 90, 85);

    // Row 3: Status
    doc.setTextColor(100, 116, 139);
    doc.text("Status                   :", 30, 95);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // Green 600
    doc.text("Submitted to HR", 90, 95);

    // -- Body Text --
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // Slate 700
    
    const textStartY = 125;
    doc.text("Dear Employee,", 20, textStartY);
    doc.text("Your application has been successfully submitted and has been forwarded to the", 20, textStartY + 10);
    doc.text("HR Department for further verification and processing.", 20, textStartY + 17);
    
    doc.text("Please retain this Acknowledgement Receipt and Reference ID for all future", 20, textStartY + 30);
    doc.text("correspondence regarding your HBA application.", 20, textStartY + 37);

    // -- Footer --
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("This is a computer-generated document and does not require a signature.", 105, 270, { align: "center" });
    doc.text("Indian Oil Corporation Limited | HBA Portal", 105, 275, { align: "center" });

    // Save File
    const safeRefId = refId.replace(/[\/\\]/g, '-'); 
    doc.save(`IOCL_HBA_Acknowledgement_${safeRefId}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[500px]"
    >
      {/* Animated Checkmark */}
      <div className="w-24 h-24 mb-6 relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="w-full h-full bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-extrabold text-iocl-blue tracking-tight mb-2"
      >
        Application Submitted Successfully!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-500 text-sm mb-8"
      >
        Your application has been forwarded to the HR Dept for verification.
      </motion.p>

      {/* Reference ID Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-inner"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Application Reference No.
        </p>
        <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
          {refId}
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <MotionButton
          onClick={handleDownload}
          className="bg-iocl-saffron hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          Download Acknowledgement (PDF)
        </MotionButton>
      </motion.div>
    </motion.div>
  );
};