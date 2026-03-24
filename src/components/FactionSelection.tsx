import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Sword, Zap, CheckCircle2, Lock, ArrowRight, Brain, Users, Waves, Anchor, Flame } from 'lucide-react';
import { FACTIONS } from '../gameConstants';

interface FactionSelectionProps {
  currentFaction: string | null;
  onSelect: (factionId: string) => void;
  onClose: () => void;
}

const FactionSelection: React.FC<FactionSelectionProps> = ({
  currentFaction,
  onSelect,
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
              <Users className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Island Factions</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Hatteras Island • Outer Banks Allegiance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Factions Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FACTIONS.map((faction) => {
              const isSelected = currentFaction === faction.id;

              return (
                <motion.div
                  key={faction.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full group ${
                    isSelected 
                      ? 'bg-orange-600/10 border-orange-500/50 shadow-[0_0_50px_rgba(234,88,12,0.15)]' 
                      : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-orange-900/20 text-orange-500'
                    }`}>
                      {faction.id === 'surfers' ? <Waves className="w-8 h-8" /> :
                       faction.id === 'keepers' ? <Anchor className="w-8 h-8" /> :
                       <Flame className="w-8 h-8" />}
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/30">
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        <span className="text-[10px] text-orange-400 font-mono uppercase tracking-widest font-bold">Active Allegiance</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold text-white uppercase italic mb-4 tracking-tighter">{faction.name}</h3>
                  <p className="text-sm text-orange-100/60 font-mono leading-relaxed mb-10 flex-1">{faction.description}</p>

                  <div className="space-y-4 mb-12">
                    <h4 className="text-[10px] text-orange-400 font-mono uppercase tracking-widest mb-4">Faction Bonuses</h4>
                    {faction.bonuses.map((bonus, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-orange-100/80 font-mono uppercase">
                        <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                        {bonus}
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isSelected}
                    onClick={() => onSelect(faction.id)}
                    className={`w-full py-5 rounded-2xl font-bold uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                      isSelected 
                        ? 'bg-orange-600/10 text-orange-400/40 cursor-default border border-orange-500/20' 
                        : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1'
                    }`}
                  >
                    {isSelected ? 'Allegiance Sworn' : (
                      <>
                        <Brain className="w-5 h-5" />
                        Join Faction
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
            <span>Choose Your Path • The Island Remembers Your Loyalty</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FactionSelection;
