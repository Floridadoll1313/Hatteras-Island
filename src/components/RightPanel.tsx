import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Database, 
  Layers, 
  Zap, 
  Shield, 
  Sword, 
  Brain, 
  Sparkles, 
  Waves, 
  Flame, 
  Anchor, 
  Compass, 
  Skull, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Lock, 
  Eye, 
  History as HistoryIcon, 
  Mic, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  DollarSign, 
  Briefcase, 
  Rocket, 
  Mail 
} from 'lucide-react';
import { GameState, AIStage, AITrait } from '../types';
import { AI_TRAITS } from '../gameConstants';

interface RightPanelProps {
  gameState: GameState;
  aiStage: AIStage;
  evolution: number;
  traits: string[];
  memory: string[];
  activeEvents: any[];
  onShowDiagnostics: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  gameState,
  aiStage,
  evolution,
  traits,
  memory,
  activeEvents,
  onShowDiagnostics
}) => {
  const survivor = gameState.survivor;

  return (
    <aside className="w-96 h-full border-l border-orange-900/20 bg-black/40 backdrop-blur-md flex flex-col z-40">
      {/* Island Soul Visualization */}
      <div className="p-8 border-b border-orange-900/20 bg-gradient-to-b from-orange-900/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-600 blur-[100px] animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-2 border-orange-500/30 p-2 mb-6 relative group">
            <div className="w-full h-full rounded-full bg-orange-900/20 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border border-orange-500/40 border-dashed"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse" />
              </div>
            </div>
            {/* Orbiting Particles */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
            </motion.div>
          </div>
          
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter mb-2">Island Soul</h3>
          <div className="flex items-center gap-2 text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Resonance: {Math.floor(evolution * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Evolution Metrics */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Survivor Strategic Depth */}
        {survivor && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] text-orange-400 font-mono uppercase tracking-[0.3em]">Survivor Metrics</h4>
              <Users className="w-3 h-3 text-orange-500" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-orange-100 font-mono uppercase">Strategic Depth</span>
                  <span className="text-[10px] text-orange-400 font-mono">{(survivor.aiLearningProgress / 10).toFixed(1)}/10</span>
                </div>
                <div className="w-full h-1 bg-orange-900/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${survivor.aiLearningProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[8px] text-orange-400/60 font-mono uppercase block mb-1">Tribe Morale</span>
                  <span className="text-xs font-bold text-white uppercase italic">High</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[8px] text-orange-400/60 font-mono uppercase block mb-1">Threat Level</span>
                  <span className="text-xs font-bold text-white uppercase italic">Moderate</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Traits */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] text-orange-400 font-mono uppercase tracking-[0.3em]">Legacy Traits</h4>
            <Sparkles className="w-3 h-3 text-orange-500" />
          </div>
          <div className="space-y-3">
            {traits.map(traitId => {
              const trait = AI_TRAITS.find(t => t.id === traitId);
              return (
                <motion.div 
                  key={traitId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-orange-600/5 border border-orange-600/20 rounded-2xl flex items-center gap-4 group hover:bg-orange-600/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-white uppercase italic">{trait?.name}</h5>
                    <p className="text-[8px] text-orange-400/60 font-mono uppercase mt-0.5">{trait?.bonus}</p>
                  </div>
                </motion.div>
              );
            })}
            {traits.length === 0 && (
              <div className="py-8 text-center border border-dashed border-orange-900/20 rounded-2xl">
                <p className="text-[10px] text-orange-400/40 font-mono uppercase tracking-widest">No Traits Unlocked</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] text-orange-400 font-mono uppercase tracking-[0.3em]">Active Events</h4>
            <Activity className="w-3 h-3 text-orange-500" />
          </div>
          <div className="space-y-3">
            {activeEvents.map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-[10px] font-bold text-blue-100 uppercase italic">{event.name}</h5>
                  <span className="text-[8px] text-blue-400 font-mono uppercase">{event.duration}T</span>
                </div>
                <p className="text-[9px] text-blue-400/60 font-mono leading-relaxed">{event.effect}</p>
              </motion.div>
            ))}
            {activeEvents.length === 0 && (
              <div className="py-8 text-center border border-dashed border-orange-900/20 rounded-2xl">
                <p className="text-[10px] text-orange-400/40 font-mono uppercase tracking-widest">Island is Calm</p>
              </div>
            )}
          </div>
        </section>

        {/* Memory Banks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] text-orange-400 font-mono uppercase tracking-[0.3em]">Memory Banks</h4>
            <Database className="w-3 h-3 text-orange-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {memory.map((loc, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-orange-100/60 font-mono uppercase"
              >
                {loc}
              </span>
            ))}
            {memory.length === 0 && (
              <p className="text-[10px] text-orange-400/40 font-mono uppercase tracking-widest w-full text-center py-4">Memory Empty</p>
            )}
          </div>
        </section>
      </div>

      {/* Diagnostics Button */}
      <div className="p-6 border-t border-orange-900/20 bg-black/40">
        <button 
          onClick={onShowDiagnostics}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-orange-400 font-mono uppercase tracking-[0.3em] hover:bg-white/10 hover:border-orange-500/30 transition-all flex items-center justify-center gap-3"
        >
          <BarChart3 className="w-3 h-3" />
          System Diagnostics
        </button>
      </div>
    </aside>
  );
};

export default RightPanel;
