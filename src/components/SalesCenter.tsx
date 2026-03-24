import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Zap, CheckCircle2, Lock, ArrowRight, Brain, DollarSign, Briefcase, Rocket, Mail, Shield, Sword, Heart } from 'lucide-react';
import { SALES_ITEMS } from '../gameConstants';

interface SalesCenterProps {
  sandDollars: number;
  onPurchase: (itemId: string) => void;
  onClose: () => void;
}

const SalesCenter: React.FC<SalesCenterProps> = ({
  sandDollars,
  onPurchase,
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
              <ShoppingBag className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Island Exchange</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Outer Banks • Neural Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-6 py-3 rounded-2xl bg-orange-900/20 border border-orange-500/30 flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span className="text-xl font-bold text-white">{sandDollars}</span>
              <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">Sand Dollars</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SALES_ITEMS.map((item) => {
              const canAfford = sandDollars >= item.cost;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative p-8 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 transition-all flex flex-col h-full group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      {item.id === 'health_pack' ? <Heart className="w-7 h-7" /> :
                       item.id === 'shield_gen' ? <Shield className="w-7 h-7" /> :
                       item.id === 'neural_boost' ? <Zap className="w-7 h-7" /> :
                       <Sword className="w-7 h-7" />}
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                      canAfford ? 'bg-orange-900/20 border-orange-500/30 text-orange-400' : 'bg-red-900/20 border-red-500/30 text-red-400 opacity-50'
                    }`}>
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold font-mono">{item.cost} SD</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white uppercase italic mb-3 tracking-tighter">{item.name}</h3>
                  <p className="text-xs text-orange-100/60 font-mono leading-relaxed mb-10 flex-1">{item.description}</p>

                  <button
                    disabled={!canAfford}
                    onClick={() => onPurchase(item.id)}
                    className={`w-full py-5 rounded-2xl font-bold uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                      canAfford
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1'
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Purchase Item
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Insufficient SD
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-3 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
            <ArrowRight className="w-3 h-3" />
            <span>Equip for Survival • The Island Provides for the Prepared</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesCenter;
