import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Check, Zap, Rocket, BarChart3, Briefcase, Mail, ArrowRight } from 'lucide-react';
import { TIERS } from '../gameConstants';

interface PricingOverlayProps {
  onUpgrade: (plan: string) => void;
  onClose: () => void;
}

const PricingOverlay: React.FC<PricingOverlayProps> = ({
  onUpgrade,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-6xl max-h-[80vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Crown className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Island Sovereign</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Outer Banks • Neural Nexus Tiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                whileHover={{ scale: 1.02 }}
                className="relative p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 transition-all flex flex-col h-full group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    {tier.id === 'initiate' ? <Mail className="w-5 h-5" /> :
                     tier.id === 'automator' ? <BarChart3 className="w-5 h-5" /> :
                     tier.id === 'architect' ? <Briefcase className="w-5 h-5" /> :
                     <Rocket className="w-5 h-5" />}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white tracking-tighter italic">${tier.price}</span>
                    <span className="text-[10px] text-orange-400/60 font-mono uppercase block">/mo</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white uppercase italic mb-3">{tier.name}</h3>
                <p className="text-xs text-orange-100/60 font-mono leading-relaxed mb-8 flex-1">{tier.description}</p>

                <div className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] text-orange-100/80 font-mono uppercase">
                      <Check className="w-3 h-3 text-orange-500 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onUpgrade(tier.id)}
                  className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold uppercase italic tracking-widest shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-4 h-4" />
                  Select Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-3 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
            <ArrowRight className="w-3 h-3" />
            <span>Secure Checkout • Instant Neural Activation</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingOverlay;
