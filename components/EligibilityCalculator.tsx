
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';
import { MotionInput } from './MotionComponents';

export const EligibilityCalculator: React.FC = () => {
  // Mock Salary Data (In real app, fetch from user profile)
  const BASIC_PAY = 85000;
  const DA = 42500; // 50% of Basic
  const MULTIPLIER = 100;
  const UPPER_LIMIT = 6500000;
  
  // Eligibility is the lower of (Basic + DA) * 100 OR Fixed Upper Limit
  const FORMULA_VALUE = (BASIC_PAY + DA) * MULTIPLIER;
  const MAX_ELIGIBILITY = Math.min(FORMULA_VALUE, UPPER_LIMIT);

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [status, setStatus] = useState<'safe' | 'warning' | 'error' | 'neutral'>('neutral');

  useEffect(() => {
    const amount = parseFloat(loanAmount);
    if (!amount || isNaN(amount)) {
      setStatus('neutral');
      return;
    }
    if (amount > MAX_ELIGIBILITY) {
      setStatus('error');
    } else if (amount > MAX_ELIGIBILITY * 0.9) {
      setStatus('warning');
    } else {
      setStatus('safe');
    }
  }, [loanAmount, MAX_ELIGIBILITY]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string to clear input
    if (val === '') {
      setLoanAmount('');
      return;
    }
    // Only allow non-negative numbers
    if (parseFloat(val) >= 0) {
      setLoanAmount(val);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-iocl-blue rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">In-Principle Eligibility Check</h3>
          <p className="text-xs text-slate-400">Based on Basic Pay + DA formula</p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
           <div className="text-[10px] uppercase font-bold text-slate-400">Max Limit</div>
           <div className="text-lg font-bold text-slate-700">{formatCurrency(MAX_ELIGIBILITY)}</div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Loan Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <IndianRupee className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="number"
              min="0"
              value={loanAmount}
              onChange={handleAmountChange}
              placeholder={`Max: ${MAX_ELIGIBILITY}`}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all font-bold text-lg
                ${status === 'error' ? 'border-red-300 focus:ring-red-200 text-red-600' : 
                  status === 'warning' ? 'border-orange-300 focus:ring-orange-200 text-orange-600' :
                  'border-slate-300 focus:ring-blue-200 text-slate-700'}
              `}
              onKeyDown={(e) => {
                // Prevent typing minus sign or 'e' for exponent
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <div className="h-full flex items-center">
           <AnimatePresence mode="wait">
             {status === 'error' && (
               <motion.div 
                 key="error"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 w-full"
               >
                 <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold text-sm">Exceeds Eligibility Limit!</p>
                   <p className="text-xs opacity-90">Please reduce amount by {formatCurrency(parseFloat(loanAmount || '0') - MAX_ELIGIBILITY)}</p>
                 </div>
               </motion.div>
             )}

             {status === 'safe' && (
                <motion.div 
                  key="safe"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 w-full"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm">You are eligible</p>
                    <p className="text-xs opacity-90">Amount is within the permissible limit.</p>
                  </div>
                </motion.div>
             )}
              
             {(status === 'neutral' || status === 'warning') && (
                <motion.div 
                   key="info"
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="text-xs text-slate-400 leading-relaxed"
                >
                   *Eligibility is calculated as the lower of 100 months salary (Basic + DA) and the upper limit of {formatCurrency(UPPER_LIMIT)}. This is an indicative figure subject to final approval by Finance.
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
