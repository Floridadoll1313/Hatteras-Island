import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Zap, 
  Shield, 
  Database, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Sparkles,
  Anchor,
  Compass,
  Layers,
  Waves,
  Loader2,
  Users,
  Heart
} from 'lucide-react';
import { GameState } from '../types';
import { AI_TRAITS } from '../gameConstants';
import Markdown from 'react-markdown';

interface RightPanelProps {
  gameState: GameState;
  playingAudio: string | null;
  handleListen: (text: string) => void;
  setShowDiagnostics: (show: boolean) => void;
  loreLoading: boolean;
  loreData: string | null;
  handleGenerateLore: () => void;
  setShowFounders: (show: boolean) => void;
  setShowMemorial: (show: boolean) => void;
}

const RightPanel = ({
  gameState,
  playingAudio,
  handleListen,
  setShowDiagnostics,
  loreLoading,
  loreData,
  handleGenerateLore,
  setShowFounders,
  setShowMemorial
}: RightPanelProps) => {
  return (
    <aside className="hidden lg:flex w-80 border-l border-[#00E0FF]/10 bg-black/40 flex-col overflow-y-auto scrollbar-hide">
      <div className="p-6 space-y-8">
        {/* Island Soul Visual */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#00E0FF]">
              <Anchor size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Island Soul</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-[#00E0FF] rounded-full animate-ping" />
              <span className="text-[10px] font-mono text-[#00E0FF]">ANCHORED</span>
            </div>
          </div>
          
          <div className="aspect-square rounded-3xl border border-[#00E0FF]/20 bg-black/60 flex items-center justify-center relative overflow-hidden group">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-10"
            >
              <div className="absolute inset-0 border-[4px] border-dashed border-[#00E0FF] rounded-full m-4" />
              <div className="absolute inset-0 border-[2px] border-dotted border-[#00E0FF] rounded-full m-12" />
            </motion.div>
            
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute w-32 h-32 border border-[#00E0FF]/30 rounded-full"
            />
            
            <Compass size={64} className="text-[#00E0FF] relative z-10 drop-shadow-[0_0_20px_rgba(0,224,255,0.6)] group-hover:scale-110 transition-transform duration-500" />
            
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "-100%", opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity, 
                    delay: Math.random() * 2 
                  }}
                  className="absolute w-[1px] h-8 bg-[#00E0FF]/40"
                  style={{ left: `${20 * i + 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Evolution Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest">Island Legacy Stage</span>
            <span className="text-xs font-bold font-mono text-[#00E0FF] uppercase tracking-wider">{gameState.aiStatus.stage}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest">Legacy Multiplier</span>
            <span className="text-xs font-mono text-[#00E0FF]">{gameState.aiStatus.evolution.toFixed(1)}x</span>
          </div>
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#00E0FF] to-[#0080FF]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (gameState.aiStatus.evolution - 1) * 10)}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase">
              <span>Tourist</span>
              <span>OBX Legend</span>
            </div>
          </div>
        </div>

        {/* Island Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Maritime Knowledge', value: `${(gameState.aiStatus.evolution * 142).toFixed(0)}`, unit: 'PTS' },
            { label: 'Coastal Harmony', value: '99.9', unit: '%' },
            { label: 'Island Intuition', value: 'High', unit: '' },
            { label: 'Tide Level', value: '0.04', unit: 'ft' }
          ].map((metric, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[9px] font-mono uppercase text-white/40 leading-none">{metric.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-[#00E0FF]">{metric.value}</span>
                <span className="text-[8px] font-mono text-white/20">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Island Traits Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00E0FF]/60">
            <Layers size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Island Traits</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide pr-1">
            {gameState.aiStatus.traits.length === 0 ? (
              <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                No traits unlocked. Explore to gain new capabilities.
              </div>
            ) : (
              gameState.aiStatus.traits.map((traitId) => {
                const trait = AI_TRAITS.find(t => t.id === traitId);
                if (!trait) return null;
                return (
                  <motion.div
                    key={trait.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-3 rounded-xl border border-[#00E0FF]/20 bg-[#00E0FF]/5 space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-tight text-[#00E0FF]">{trait.name}</span>
                      <span className="text-[8px] font-mono text-[#00E0FF]/40 uppercase">Unlocked</span>
                    </div>
                    <p className="text-[9px] text-white/60 leading-tight">{trait.description}</p>
                    {trait.bonus && (
                      <div className="text-[8px] font-mono text-[#00E0FF] uppercase tracking-tighter pt-1 border-t border-[#00E0FF]/10">
                        Bonus: {trait.bonus}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* World Events Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00E0FF]/60">
            <Waves size={14} className="animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Active Island Events</span>
          </div>
          <div className="space-y-2">
            {gameState.activeEvents.length === 0 ? (
              <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                Island calm. No events detected.
              </div>
            ) : (
              gameState.activeEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`p-3 rounded-xl border ${
                    event.type === 'corruption' ? 'bg-red-500/5 border-red-500/20' :
                    event.type === 'surge' ? 'bg-[#00E0FF]/5 border-[#00E0FF]/20' :
                    event.type === 'blessing' ? 'bg-[#00E0FF]/5 border-[#00E0FF]/20' :
                    'bg-white/5 border-white/10'
                  } space-y-1 relative overflow-hidden group`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${
                      event.type === 'corruption' ? 'text-red-400' :
                      event.type === 'surge' ? 'text-[#00E0FF]' :
                      event.type === 'blessing' ? 'text-[#00E0FF]' :
                      'text-white'
                    }`}>{event.name}</span>
                    <span className="text-[8px] font-mono text-white/30 uppercase">Dur: {event.duration}</span>
                  </div>
                  <p className="text-[9px] text-white/60 leading-tight">{event.description}</p>
                  <div className="text-[8px] font-mono text-[#00E0FF]/60 uppercase tracking-tighter pt-1 border-t border-white/5">
                    Effect: {event.effect}
                  </div>
                  
                  {event.type === 'corruption' && (
                    <motion.div 
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute inset-0 bg-red-500/10 pointer-events-none"
                    />
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Lore Decryption Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#00FF00]/60">
              <Activity size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Lore Decryption</span>
            </div>
            <button 
              onClick={handleGenerateLore}
              disabled={loreLoading || !gameState.currentRealm}
              className="text-[9px] font-mono uppercase px-2 py-1 rounded bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/20 disabled:opacity-50 transition-all"
            >
              {loreLoading ? 'Decrypting...' : 'Decrypt Deep Data'}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {loreData ? (
              <motion.div
                key="lore-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl bg-[#00FF00]/5 border border-[#00FF00]/10 overflow-hidden"
              >
                <div className="markdown-body text-[10px] font-mono text-white/80 leading-relaxed max-h-48 overflow-y-auto scrollbar-hide">
                  <Markdown>{loreData}</Markdown>
                </div>
              </motion.div>
            ) : loreLoading ? (
              <motion.div
                key="lore-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 border border-dashed border-[#00FF00]/20 rounded-xl flex flex-col items-center justify-center gap-3"
              >
                <Loader2 size={24} className="text-[#00FF00] animate-spin" />
                <span className="text-[9px] font-mono text-[#00E0FF]/60 uppercase animate-pulse">Accessing Island Archives...</span>
              </motion.div>
            ) : (
              <div className="text-[9px] font-mono text-white/20 italic text-center p-4 border border-dashed border-white/10 rounded-xl">
                Deep lore fragments available for decryption.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Memory Logs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00FF00]/60">
            <Database size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Memory Banks</span>
          </div>
          <div className="space-y-2">
            {gameState.aiStatus.memory.length === 0 ? (
              <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                No significant data recorded.
              </div>
            ) : (
              gameState.aiStatus.memory.map((mem, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-2 rounded-lg bg-white/5 border-l-2 border-[#00FF00]/40 flex items-center justify-between group hover:bg-[#00FF00]/5 transition-colors"
                >
                  <span className="text-[10px] font-mono text-white/70 truncate pr-2">{mem}</span>
                  <div className="w-1 h-1 bg-[#00FF00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Subsystems Status */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-white/30">Subsystem Integrity</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-[#00FF00] animate-pulse">3,412 SURFERS ONLINE</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Island Link', status: 'Optimal', color: '#00E0FF' },
              { label: 'Data Stream', status: 'Stable', color: '#00FF00' },
              { label: 'Logic Gate', status: 'Active', color: '#00FF00' },
              { label: 'Memory Bank', status: 'Syncing', color: '#00E0FF' }
            ].map((sys, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">{sys.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase" style={{ color: sys.color }}>{sys.status}</span>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: sys.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={() => setShowFounders(true)}
              className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/20 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[#00E0FF]" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Island Founders</span>
              </div>
              <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
            </button>

            <button
              onClick={() => setShowMemorial(true)}
              className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/20 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-[#00E0FF]" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Bull Hooper Memorial</span>
              </div>
              <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
            </button>
          </div>
        </div>

        {/* Diagnostics Button */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={() => setShowDiagnostics(true)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/5 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00E0FF]/10 text-[#00E0FF]">
                <Database size={16} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">Core Diagnostics</div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">View System Logs</div>
              </div>
            </div>
            <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* AI Voice Output */}
        <div className="flex-1 flex flex-col justify-end pb-4">
          <div className="p-4 rounded-3xl bg-[#00E0FF]/5 border border-[#00E0FF]/10 space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00E0FF]">
                <Volume2 size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Neural Voice</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-0.5 bg-[#00E0FF]/40 rounded-full"
                  />
                ))}
              </div>
            </div>
            
            <p className="text-[11px] text-white/60 leading-relaxed italic pr-8">
              "{gameState.history[0] || 'Awaiting neural synchronization...'}"
            </p>

            <button
              onClick={() => handleListen(gameState.history[0] || '')}
              className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                playingAudio === (gameState.history[0] || '')
                  ? 'bg-[#00E0FF] text-black'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-[#00E0FF]'
              }`}
            >
              {playingAudio === (gameState.history[0] || '') ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
