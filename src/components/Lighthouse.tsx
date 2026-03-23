import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Zap, Shield, Database, ArrowUp, X } from 'lucide-react';
import { GameState, LighthouseUpgrade } from '../types';

interface LighthouseProps {
  gameState: GameState;
  onClose: () => void;
  onUpgrade: (upgrade: LighthouseUpgrade) => void;
}

const LIGHTHOUSE_UPGRADES: LighthouseUpgrade[] = [
  { id: 'neural_antenna', name: 'Neural Antenna', description: 'Increases AI evolution speed by 10%.', level: 1, cost: 200, bonus: 'Evolution Speed +10%' },
  { id: 'gear_rack', name: 'Gear Rack', description: 'Increases inventory capacity.', level: 1, cost: 150, bonus: 'Inventory +5' },
  { id: 'solar_array', name: 'Solar Array', description: 'Reduces energy costs for AI actions.', level: 1, cost: 300, bonus: 'Efficiency +15%' },
  { id: 'tide_monitor', name: 'Tide Monitor', description: 'Provides advanced warning of tide changes.', level: 1, cost: 100, bonus: 'Tide Foresight' }
];

export default function Lighthouse({ gameState, onClose, onUpgrade }: LighthouseProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full bg-[#050505] border border-white/10 rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-bottom border-white/10 flex items-center justify-between bg-gradient-to-r from-[#00E0FF]/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00E0FF]/10">
              <Anchor size={24} className="text-[#00E0FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase">The Lighthouse</h2>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Base Level {gameState.lighthouse.level}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={24} className="text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#00E0FF]">Base Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Sand Dollars</div>
                  <div className="text-xl font-bold text-[#FFD700]">{gameState.sandDollars}</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Upgrades</div>
                  <div className="text-xl font-bold text-white">{gameState.lighthouse.upgrades.length}</div>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative">
              <img 
                src="https://picsum.photos/seed/lighthouse/800/450" 
                alt="Lighthouse"
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-xs font-mono text-[#00E0FF] uppercase tracking-[0.3em] mb-1">Location</div>
                <div className="text-xl font-bold uppercase tracking-tighter">Hatteras Point</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#00E0FF]">Available Upgrades</h3>
            {LIGHTHOUSE_UPGRADES.map((upgrade) => {
              const isOwned = gameState.lighthouse.upgrades.includes(upgrade.id);
              const canAfford = gameState.sandDollars >= upgrade.cost;

              return (
                <div 
                  key={upgrade.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOwned 
                      ? 'bg-[#00FF00]/5 border-[#00FF00]/20' 
                      : 'bg-white/5 border-white/10 hover:border-[#00E0FF]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold flex items-center gap-2">
                        {upgrade.name}
                        {isOwned && <span className="text-[8px] font-mono bg-[#00FF00]/20 text-[#00FF00] px-1.5 py-0.5 rounded uppercase">Active</span>}
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{upgrade.description}</p>
                      <div className="text-[10px] font-mono text-[#00E0FF] uppercase tracking-wider">{upgrade.bonus}</div>
                    </div>
                    {!isOwned && (
                      <button
                        onClick={() => onUpgrade(upgrade)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase transition-all ${
                          canAfford 
                            ? 'bg-[#00E0FF]/10 text-[#00E0FF] hover:bg-[#00E0FF]/20 border border-[#00E0FF]/30' 
                            : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {upgrade.cost} SD
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
