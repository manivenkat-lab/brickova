
import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentStatusProps {
  status: 'SUCCESS' | 'FAILURE';
  planName?: string;
  onClose: () => void;
  onDashboard: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, planName, onClose, onDashboard }) => {
  const isSuccess = status === 'SUCCESS';

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-navy/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-premium overflow-hidden border border-beige-200"
      >
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-8 text-center">
          <div className="flex justify-center">
            {isSuccess ? (
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 border-4 border-success/30 rounded-full"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-alert/10 rounded-full flex items-center justify-center text-alert">
                <XCircle className="w-12 h-12" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-[900] text-navy uppercase tracking-tighter">
              {isSuccess ? 'Transaction Confirmed' : 'Payment Aborted'}
            </h2>
            <p className="text-navy-muted font-bold uppercase tracking-widest text-[10px] md:text-[11px] max-w-xs mx-auto">
              {isSuccess 
                ? `Your ${planName || 'Professional'} activation protocol has been successfully verified.` 
                : 'The transaction could not be completed at this time. No funds were debited from your account.'}
            </p>
          </div>

          {isSuccess && (
            <div className="bg-beige-50 border border-beige-200 p-6 rounded-2xl flex items-center justify-between shadow-soft">
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center shadow-navy">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest">Active Plan</p>
                  <p className="text-xs font-bold text-navy uppercase tracking-tighter">{planName || 'Brickova Elite'}</p>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-white border border-beige-200 rounded-full text-[8px] font-bold uppercase tracking-widest text-navy shadow-xs">
                Active
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <button 
                onClick={onDashboard}
                className="w-full py-5 bg-navy text-white rounded-2xl font-bold uppercase tracking-wider text-[10px] hover:bg-navy-ultra shadow-navy transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Access Dashboard <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="w-full py-5 bg-navy text-white rounded-2xl font-bold uppercase tracking-wider text-[10px] hover:bg-navy-ultra shadow-navy transition-all"
              >
                Try Again
              </button>
            )}
            {!isSuccess && (
              <button 
                onClick={onClose}
                className="w-full py-4 text-navy-muted font-bold uppercase tracking-widest text-[10px] hover:text-navy transition-colors"
              >
                Return to Pricing
              </button>
            )}
          </div>

          <div className="pt-4">
            <p className="text-[9px] font-medium text-navy-muted/50 uppercase tracking-widest leading-relaxed">
              Institutional Grade Security • 256-bit Encryption • Global Compliance
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentStatus;
