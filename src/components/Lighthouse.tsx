import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Zap, CheckCircle2, Lock, ArrowRight, Brain, MapPin, Waves } from 'lucide-react';
import { LighthouseState, LighthouseUpgrade } from '../types';

interface LighthouseProps {
  state: LighthouseState;
  sandDollars: number;
  onUpgrade: (upgradeId: string) => void;
  onClose: () => void;
}

const UPGRADES: LighthouseUpgrade[] = [
  { id: 'range', name: 'Signal Range', description: 'Increase the range of your island signals.', level: 1, cost: 10, bonus: '+20% Signal Range' },
  { id: 'storage', name: 'Storage Capacity', description: 'Expand your island storage capacity.', level: 1, cost: 15, bonus: '+50% Storage Capacity' },
  { id: 'defense', name: 'Defense Level', description: 'Strengthen your island defenses.', level: 1, cost: 20, bonus: '+10% Defense' },
  { id: 'efficiency', name: 'Energy Efficiency', description: 'Optimize your island energy usage.', level: 1, cost: 25, bonus: '+15% Energy Efficiency' }
];

const Lighthouse: React.FC<LighthouseProps> = ({
  state,
  sandDollars,
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
      <div className="relative w-full max-w-5xl max-h-[80vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Anchor className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Lighthouse Keeper</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Hatteras Island • Coastal Beacon</p>
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

        {/* Lighthouse Status Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-white uppercase italic tracking-widest">Beacon Status</h3>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">Signal Range</span>
                    <span className="text-[10px] text-orange-100 font-mono">{state.signalRange}x</span>
                  </div>
                  <div className="w-full h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(state.signalRange / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">Storage Capacity</span>
                    <span className="text-[10px] text-orange-100 font-mono">{state.storageCapacity}x</span>
                  </div>
                  <div className="w-full h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(state.storageCapacity / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">Defense Level</span>
                    <span className="text-[10px] text-orange-100 font-mono">{state.defenseLevel}x</span>
                  </div>
                  <div className="w-full h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(state.defenseLevel / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {UPGRADES.map((upgrade) => {
                const isOwned = state.upgrades.includes(upgrade.id);
                const canAfford = sandDollars >= upgrade.cost;

                return (
                  <motion.div
                    key={upgrade.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 text-left ${
                      isOwned 
                        ? 'bg-orange-600/10 border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isOwned ? 'bg-orange-600 text-white' : 'bg-orange-900/20 text-orange-500'
                    }`}>
                      <Waves className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white uppercase italic">{upgrade.name}</h4>
                      <p className="text-[10px] text-orange-400/60 font-mono leading-relaxed mt-1">{upgrade.description}</p>
                    </div>
                    <button
                      disabled={isOwned || !canAfford}
                      onClick={() => onUpgrade(upgrade.id)}
                      className={`px-6 py-2 rounded-lg font-bold uppercase italic tracking-widest transition-all flex items-center justify-center gap-2 ${
                        isOwned 
                          ? 'bg-orange-600/10 text-orange-400/40 cursor-default border border-orange-500/20' 
                          : canAfford
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {isOwned ? 'Active' : canAfford ? (
                        <>
                          <Zap className="w-3 h-3 fill-current" />
                          {upgrade.cost}
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          {upgrade.cost}
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-3 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
            <ArrowRight className="w-3 h-3" />
            <span>Protect the Coast • Guide the Travelers</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Lighthouse;
