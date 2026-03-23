import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X } from 'lucide-react';
import { GameState } from '../types';
import { SKILLS } from '../gameConstants';

interface SkillsOverlayProps {
  gameState: GameState;
  setShowSkills: (show: boolean) => void;
  purchaseSkill: (id: string, cost: number) => void;
}

const SkillsOverlay = ({
  gameState,
  setShowSkills,
  purchaseSkill
}: SkillsOverlayProps) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSkills(false)}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#00E0FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.1)]"
        >
          <div className="p-8 border-b border-[#00E0FF]/10 flex items-center justify-between bg-[#00E0FF]/5">
            <div className="flex items-center gap-3">
              <Compass size={24} className="text-[#00E0FF]" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#00E0FF]">Island Skill Tree</h2>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Available Sand Dollars: {gameState.sandDollars.toFixed(0)} SD</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSkills(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS.map((skill) => {
              const isUnlocked = gameState.skills.includes(skill.id);
              const canAfford = gameState.sandDollars >= skill.cost;
              const Icon = skill.icon;

              return (
                <button
                  key={skill.id}
                  disabled={isUnlocked || !canAfford}
                  onClick={() => purchaseSkill(skill.id, skill.cost)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                    isUnlocked 
                    ? 'bg-[#00E0FF]/10 border-[#00E0FF]/40' 
                    : canAfford 
                      ? 'bg-white/5 border-white/10 hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/5' 
                      : 'bg-white/5 border-white/5 opacity-40 grayscale'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-[#00E0FF]/20' : 'bg-white/5'}`}>
                      <Icon size={20} className={isUnlocked ? 'text-[#00E0FF]' : 'text-white/40'} />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[8px] font-mono uppercase text-[#00E0FF] bg-[#00E0FF]/10 px-2 py-1 rounded">Unlocked</span>
                    ) : (
                      <span className="text-[10px] font-mono text-white/60">{skill.cost} SD</span>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-[#00E0FF]' : 'text-white'}`}>{skill.name}</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed">{skill.description}</p>
                  
                  {isUnlocked && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/5 to-transparent pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="p-6 bg-black/40 border-t border-white/5 text-center">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Sand dollars are earned by successfully navigating the island's mysteries.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SkillsOverlay;
