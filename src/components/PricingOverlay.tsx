import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Loader2, ArrowRight, Lock, CreditCard } from 'lucide-react';
import { GameState, SubscriptionTier } from '../types';
import { TIERS } from '../gameConstants';

interface PricingOverlayProps {
  show: boolean;
  gameState: GameState;
  setShowPricing: (show: boolean) => void;
  handleUpgrade: (tier: SubscriptionTier) => void;
  checkoutLoading: string | null;
}

const PricingOverlay = ({
  show,
  gameState,
  setShowPricing,
  handleUpgrade,
  checkoutLoading
}: PricingOverlayProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPricing(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#00E0FF]">Enhance Your Legacy</h2>
                <p className="text-white/50 text-sm mt-1">Select a tier to unlock advanced island capabilities.</p>
              </div>
              <button 
                onClick={() => setShowPricing(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TIERS.map((tier) => (
                  <div 
                    key={tier.id}
                    className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                      gameState.subscription.tier === tier.id 
                      ? 'bg-[#00E0FF]/5 border-[#00E0FF]/40 ring-1 ring-[#00E0FF]/20' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {gameState.subscription.tier === tier.id && (
                      <div className="absolute top-4 right-4 text-[#00E0FF]">
                        <Check size={20} />
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold" style={{ color: tier.color }}>{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-white/40 text-sm">/mo</span>
                      </div>
                      <p className="text-xs text-white/50 mt-4 leading-relaxed">{tier.description}</p>
                    </div>

                    <div className="flex-1 space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                          <div className="mt-1 shrink-0">
                            <Check size={12} className="text-[#00FF00]" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleUpgrade(tier.id as SubscriptionTier)}
                      disabled={!!checkoutLoading || gameState.subscription.tier === tier.id}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        gameState.subscription.tier === tier.id
                        ? 'bg-[#00FF00]/20 text-[#00FF00] cursor-default'
                        : 'bg-white text-black hover:bg-[#00FF00] hover:text-black'
                      }`}
                    >
                      {checkoutLoading === tier.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : gameState.subscription.tier === tier.id ? (
                        'Current Tier'
                      ) : (
                        <>
                          Initialize
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-[#00FF00]/5 border border-[#00FF00]/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#00FF00]/10">
                    <Lock size={24} className="text-[#00FF00]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Fair Market Value Guarantee</h4>
                    <p className="text-xs text-white/50">Our pricing is dynamically adjusted to ensure sustainable AI processing and continuous realm expansion.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FF00]">
                  <CreditCard size={16} />
                  SECURE_STRIPE_ENCRYPTION_ACTIVE
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PricingOverlay;
