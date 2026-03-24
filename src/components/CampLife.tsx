import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Users, 
  Home, 
  Heart, 
  Zap, 
  Shield, 
  MessageSquare, 
  Sparkles, 
  X,
  TrendingUp,
  Brain,
  Coffee,
  Sun,
  Moon,
  CloudRain
} from 'lucide-react';
import { GameState, Contestant, SurvivorState } from '../types';

interface CampLifeProps {
  gameState: GameState;
  onInteract: (contestantId: string, action: string) => void;
  onManageCamp: (action: string) => void;
  onClose: () => void;
}

const CampLife: React.FC<CampLifeProps> = ({ gameState, onInteract, onManageCamp, onClose }) => {
  const survivor = gameState.survivor;
  const activeContestants = survivor.contestants.filter(c => c.status === 'active' && !c.isPlayer);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);

  const campStats = [
    { id: 'morale', label: 'Tribe Morale', value: survivor.campMorale, icon: Heart, color: 'text-pink-400' },
    { id: 'infrastructure', label: 'Camp Infrastructure', value: survivor.campInfrastructure, icon: Home, color: 'text-emerald-400' },
    { id: 'ai_learning', label: 'AI Learning', value: survivor.aiLearningProgress, icon: Brain, color: 'text-blue-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl"
    >
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-12 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20 relative group">
              <Home className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl bg-orange-500/50"
              />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">{survivor.tribe} Camp</h2>
              <p className="text-orange-400 font-mono text-sm uppercase tracking-[0.4em] mt-2">Hatteras Island • Tribe Level {survivor.tribeLevel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
          >
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Camp Management */}
          <div className="w-1/3 p-12 border-r border-orange-900/10 bg-black/40 flex flex-col gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-orange-400">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Camp Vitality</h3>
              </div>
              
              <div className="space-y-6">
                {campStats.map((stat) => (
                  <div key={stat.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">{stat.label}</span>
                      </div>
                      <span className={`text-xs font-bold font-mono ${stat.color}`}>{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        className={`h-full bg-current ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-orange-400">
                <Shield className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">AI Camp Actions</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <ActionButton 
                  icon={Coffee} 
                  label="Social Bonding" 
                  description="Use AI to mediate tribe conflicts."
                  onClick={() => onManageCamp('social')}
                />
                <ActionButton 
                  icon={Zap} 
                  label="Resource Optimization" 
                  description="AI-driven foraging and storage."
                  onClick={() => onManageCamp('resource')}
                />
                <ActionButton 
                  icon={Shield} 
                  label="Fortify Shelter" 
                  description="Structural AI analysis for safety."
                  onClick={() => onManageCamp('infrastructure')}
                />
              </div>
            </div>
          </div>

          {/* Right: Tribe Interactions */}
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-orange-400">
                <Users className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Tribe Members</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeContestants.map((contestant) => (
                  <motion.div
                    key={contestant.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedContestant(contestant)}
                    className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group flex flex-col ${
                      selectedContestant?.id === contestant.id 
                        ? 'bg-orange-600/10 border-orange-500 shadow-lg shadow-orange-500/20' 
                        : 'bg-white/5 border-white/10 hover:border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">{contestant.name}</h4>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{contestant.archetype}</p>
                      </div>
                      <div className="p-3 bg-orange-900/20 rounded-xl text-orange-500">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" />
                        {contestant.loyalty} LOY
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-blue-400" />
                        {contestant.strategicAbility} STR
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedContestant && (
                <motion.div
                  key={selectedContestant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold uppercase tracking-tight">Interact with {selectedContestant.name}</h3>
                      <p className="text-sm text-gray-400 uppercase tracking-widest">Strengthen your bond or strategize using AI.</p>
                    </div>
                    <button onClick={() => setSelectedContestant(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InteractionButton 
                      label="AI Alliance Pitch" 
                      description="Use AI to calculate shared interests."
                      onClick={() => onInteract(selectedContestant.id, 'alliance')}
                    />
                    <InteractionButton 
                      label="Social Intelligence" 
                      description="Learn about their motivations via AI."
                      onClick={() => onInteract(selectedContestant.id, 'learn')}
                    />
                    <InteractionButton 
                      label="Strategic Planning" 
                      description="Simulate voting scenarios together."
                      onClick={() => onInteract(selectedContestant.id, 'strategy')}
                    />
                    <InteractionButton 
                      label="Emotional Support" 
                      description="AI-assisted empathy and bonding."
                      onClick={() => onInteract(selectedContestant.id, 'bond')}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/60 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-4 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.5em]">
            <Sparkles className="w-4 h-4" />
            <span>Tribe Life is the Heart of the Island</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton: React.FC<{ icon: any, label: string, description: string, onClick: () => void }> = ({ icon: Icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-orange-600/10 hover:border-orange-500/30 transition-all text-left"
  >
    <div className="p-3 bg-orange-900/20 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-xs font-bold text-white uppercase italic tracking-tight">{label}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{description}</div>
    </div>
  </button>
);

const InteractionButton: React.FC<{ label: string, description: string, onClick: () => void }> = ({ label, description, onClick }) => (
  <button
    onClick={onClick}
    className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left group hover:bg-orange-600/10 hover:border-orange-500/30 transition-all"
  >
    <div className="text-sm font-bold text-white uppercase italic tracking-tight group-hover:text-orange-400 transition-colors">{label}</div>
    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{description}</div>
  </button>
);

export default CampLife;
