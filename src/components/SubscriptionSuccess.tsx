import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Rocket, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';

interface SubscriptionSuccessProps {
  plan: string;
  onClose: () => void;
}

export default function SubscriptionSuccess({ plan, onClose }: SubscriptionSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-black border border-[#00E0FF]/30 rounded-[40px] p-10 text-center space-y-8 relative overflow-hidden shadow-[0_0_100px_rgba(0,224,255,0.2)]"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-[#00E0FF]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00FF00]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-[#00E0FF] to-[#00FF00] rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(0,224,255,0.5)]"
          >
            <CheckCircle2 size={48} className="text-black" />
          </motion.div>

          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-[#00E0FF] font-mono text-xs uppercase tracking-[0.3em]"
            >
              <Sparkles size={14} />
              Neural Link Established
              <Sparkles size={14} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold tracking-tighter uppercase text-white"
            >
              Welcome to the {plan}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 text-sm"
            >
              Your subscription is now active. The island's neural infrastructure has been upgraded to match your new status.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div className="text-left">
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Active Plan</div>
              <div className="text-lg font-bold text-[#00E0FF] uppercase tracking-tighter">{plan}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#00E0FF]/10 text-[#00E0FF]">
              <Rocket size={24} />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            className="w-full py-5 rounded-3xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-[#00E0FF] transition-all flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            Begin Operations
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
