import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Rocket, ArrowRight, Sparkles, Zap, Shield, Brain } from 'lucide-react';

interface SubscriptionSuccessProps {
  plan: string;
  onClose: () => void;
}

const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({
  plan,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl"
    >
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-orange-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(234,88,12,0.2)] flex flex-col overflow-hidden p-12 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="w-32 h-32 rounded-full bg-orange-600 flex items-center justify-center mx-auto mb-10 shadow-lg shadow-orange-600/40 relative"
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-orange-500/50"
          />
        </motion.div>

        {/* Text Content */}
        <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic mb-4">Neural Activation Successful</h2>
        <p className="text-orange-400 font-mono text-sm uppercase tracking-[0.3em] mb-12">
          Hatteras Island • {plan} Tier Active
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3">
            <Zap className="w-6 h-6 text-orange-500" />
            <span className="text-[10px] text-orange-100/60 font-mono uppercase tracking-widest">Priority Access</span>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3">
            <Shield className="w-6 h-6 text-orange-500" />
            <span className="text-[10px] text-orange-100/60 font-mono uppercase tracking-widest">Enhanced Defense</span>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3">
            <Brain className="w-6 h-6 text-orange-500" />
            <span className="text-[10px] text-orange-100/60 font-mono uppercase tracking-widest">Advanced AI</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-6 bg-orange-600 text-white font-bold uppercase italic tracking-[0.2em] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
        >
          <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Enter the Nexus
          <ArrowRight className="w-6 h-6" />
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
          <Sparkles className="w-3 h-3" />
          <span>The Island Recognizes Your Sovereignty</span>
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionSuccess;
