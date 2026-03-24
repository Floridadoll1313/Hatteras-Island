import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, CheckCircle2, Lock, ArrowRight, Brain } from 'lucide-react';
import { SKILLS } from '../gameConstants';

interface SkillsOverlayProps {
  ownedSkills: string[];
  sandDollars: number;
  onPurchase: (skillId: string) => void;
  onClose: () => void;
}

const SkillsOverlay: React.FC<SkillsOverlayProps> = ({
  ownedSkills,
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
      <div className="relative w-full max-w-5xl max-h-[80vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Legacy Skills</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Hatteras Island • Neural Evolution</p>
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

        {/* Skills Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill) => {
              const isOwned = ownedSkills.includes(skill.id);
              const canAfford = sandDollars >= skill.cost;

              return (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full ${
                    isOwned 
                      ? 'bg-orange-600/10 border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.1)]' 
                      : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isOwned ? 'bg-orange-600 text-white' : 'bg-orange-900/20 text-orange-500'
                    }`}>
                      <skill.icon className="w-6 h-6" />
                    </div>
                    {isOwned ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/30">
                        <CheckCircle2 className="w-3 h-3 text-orange-400" />
                        <span className="text-[8px] text-orange-400 font-mono uppercase tracking-widest font-bold">Unlocked</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                        canAfford ? 'bg-orange-900/20 border-orange-500/30 text-orange-400' : 'bg-red-900/20 border-red-500/30 text-red-400 opacity-50'
                      }`}>
                        <Zap className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold font-mono">{skill.cost} SD</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase italic mb-3">{skill.name}</h3>
                  <p className="text-xs text-orange-100/60 font-mono leading-relaxed mb-8 flex-1">{skill.description}</p>

                  <button
                    disabled={isOwned || !canAfford}
                    onClick={() => onPurchase(skill.id)}
                    className={`w-full py-4 rounded-xl font-bold uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                      isOwned 
                        ? 'bg-orange-600/10 text-orange-400/40 cursor-default border border-orange-500/20' 
                        : canAfford
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1'
                          : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {isOwned ? 'Legacy Active' : canAfford ? (
                      <>
                        <Brain className="w-4 h-4" />
                        Unlock Skill
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
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
            <span>Master the Island • Evolve Your Neural Network</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsOverlay;
