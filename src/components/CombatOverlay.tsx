import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  History as HistoryIcon, 
  Heart, 
  Sword, 
  Shield, 
  Zap 
} from 'lucide-react';
import { GameState } from '../types';

interface CombatOverlayProps {
  gameState: GameState;
  combatLogFilter: 'all' | 'player' | 'enemy' | 'system';
  setCombatLogFilter: (filter: 'all' | 'player' | 'enemy' | 'system') => void;
  handleCombatAction: (action: 'attack' | 'defend' | 'special') => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const CombatOverlay = ({
  gameState,
  combatLogFilter,
  setCombatLogFilter,
  handleCombatAction,
  scrollRef
}: CombatOverlayProps) => {
  if (!gameState.combat) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="relative w-full max-w-4xl bg-[#0A0A0A] border border-red-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(255,0,0,0.15)] flex flex-col md:flex-row h-[80vh]"
        >
          {/* Enemy Side */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-b from-red-500/5 to-transparent">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
              <Skull size={120} className="text-red-500 relative z-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-3xl font-bold tracking-tighter text-red-500 uppercase">{gameState.combat.enemy.name}</h3>
              <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">{gameState.combat.enemy.description}</p>
            </div>
            
            <div className="mt-12 w-full max-w-xs space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-red-400 uppercase">
                <span>Integrity</span>
                <span>{gameState.combat.enemy.health} / {gameState.combat.enemy.maxHealth}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(gameState.combat.enemy.health / gameState.combat.enemy.maxHealth) * 100}%` }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          </div>

          {/* Combat Controls & Logs */}
          <div className="flex-1 flex flex-col bg-black/40">
            {/* Log Header & Filter */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <HistoryIcon size={14} className="text-white/40" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Combat Log</span>
              </div>
              <div className="flex gap-1">
                {(['all', 'player', 'enemy', 'system'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setCombatLogFilter(f)}
                    className={`px-2 py-1 rounded text-[8px] font-mono uppercase transition-all ${combatLogFilter === f ? 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30' : 'text-white/20 hover:text-white/40'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-hide">
              {(gameState.combat.logs || [])
                .filter(log => combatLogFilter === 'all' || log.type === combatLogFilter)
                .map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={log.type === 'player' ? 'text-[#00FF00]' : log.type === 'enemy' ? 'text-red-400' : 'text-blue-400'}
                >
                  <span className="opacity-30 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  {log.message}
                </motion.div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Player HUD & Controls */}
            <div className="p-8 border-t border-white/5 bg-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-[#00FF00]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Island Harmony</span>
                  </div>
                  <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      animate={{ width: `${(gameState.combat.playerHealth / gameState.combat.playerMaxHealth) * 100}%` }}
                      className="h-full bg-[#00FF00]"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00FF00]">{gameState.combat.playerHealth}</div>
                  <div className="text-[10px] font-mono text-white/30 uppercase">Sync Level</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  disabled={gameState.combat.turn !== 'player'}
                  onClick={() => handleCombatAction('attack')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 transition-all group disabled:opacity-50"
                >
                  <Sword size={20} className="text-[#00FF00] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono uppercase text-[#00FF00]">Strike</span>
                </button>
                <button
                  disabled={gameState.combat.turn !== 'player'}
                  onClick={() => handleCombatAction('defend')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all group disabled:opacity-50"
                >
                  <Shield size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono uppercase text-blue-400">Shield</span>
                </button>
                <button
                  disabled={gameState.combat.turn !== 'player'}
                  onClick={() => handleCombatAction('special')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all group disabled:opacity-50"
                >
                  <Zap size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono uppercase text-purple-400">Surge</span>
                </button>
              </div>
              
              {gameState.combat.turn === 'enemy' && (
                <div className="text-center">
                  <span className="text-[10px] font-mono text-red-500 uppercase animate-pulse">Enemy analyzing island patterns...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CombatOverlay;
