import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Skull, 
  Activity, 
  History as HistoryIcon, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';
import { CombatState, CombatLogEntry } from '../types';

interface CombatOverlayProps {
  combat: CombatState;
  onAction: (action: 'attack' | 'defend' | 'special') => void;
  logFilter: 'all' | 'player' | 'enemy' | 'system';
  setLogFilter: (filter: 'all' | 'player' | 'enemy' | 'system') => void;
}

const CombatOverlay: React.FC<CombatOverlayProps> = ({
  combat,
  onAction,
  logFilter,
  setLogFilter
}) => {
  const filteredLogs = combat.logs.filter(log => 
    logFilter === 'all' || log.type === logFilter
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-6xl h-[80vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Combat Header */}
        <div className="p-10 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Sword className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Combat Protocol</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Hatteras Island • Engagement Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 rounded-2xl bg-orange-900/20 border border-orange-500/30">
              <span className="text-orange-400 font-mono text-xs uppercase tracking-widest">Turn: {combat.turn}</span>
            </div>
          </div>
        </div>

        {/* Combat Arena */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Player Stats */}
          <div className="w-1/4 p-10 border-r border-orange-900/10 flex flex-col justify-center">
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 p-1 mx-auto mb-6 relative">
                <div className="w-full h-full rounded-full bg-blue-900/20 flex items-center justify-center">
                  <Activity className="w-10 h-10 text-blue-400" />
                </div>
                {combat.isDefending && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mb-2">Traveler</h3>
              <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">Neural Signature Active</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-blue-400 font-mono uppercase">Vitality</span>
                  <span className="text-[10px] text-blue-100 font-mono">{combat.playerHealth}/{combat.playerMaxHealth}</span>
                </div>
                <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(combat.playerHealth / combat.playerMaxHealth) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Logs & Actions */}
          <div className="flex-1 flex flex-col bg-black/40">
            {/* Logs */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-4">
              <div className="flex items-center gap-4 mb-6 sticky top-0 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/5">
                {['all', 'player', 'enemy', 'system'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter as any)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${
                      logFilter === filter 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                        : 'text-orange-400/40 hover:text-orange-400 hover:bg-white/5'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, i) => (
                  <motion.div
                    key={log.timestamp + i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-4 p-4 rounded-2xl border ${
                      log.type === 'player' ? 'bg-blue-900/10 border-blue-900/20' :
                      log.type === 'enemy' ? 'bg-red-900/10 border-red-900/20' :
                      'bg-orange-900/10 border-orange-900/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      log.type === 'player' ? 'bg-blue-600/20 text-blue-400' :
                      log.type === 'enemy' ? 'bg-red-600/20 text-red-400' :
                      'bg-orange-600/20 text-orange-400'
                    }`}>
                      {log.type === 'player' ? <Sword className="w-4 h-4" /> :
                       log.type === 'enemy' ? <Skull className="w-4 h-4" /> :
                       <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs text-orange-100/90 font-mono leading-relaxed">{log.message}</p>
                      <span className="text-[8px] text-orange-400/40 font-mono uppercase mt-1 block">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="p-10 border-t border-orange-900/20 bg-black/60 grid grid-cols-3 gap-6">
              <button
                disabled={combat.turn !== 'player'}
                onClick={() => onAction('attack')}
                className="group p-6 bg-red-600/10 border border-red-600/30 rounded-3xl hover:bg-red-600/20 transition-all flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                  <Sword className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-white uppercase italic">Strike</span>
                <span className="text-[8px] text-red-400/60 font-mono uppercase tracking-widest">Direct Attack</span>
              </button>

              <button
                disabled={combat.turn !== 'player'}
                onClick={() => onAction('defend')}
                className="group p-6 bg-blue-600/10 border border-blue-600/30 rounded-3xl hover:bg-blue-600/20 transition-all flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-white uppercase italic">Shield</span>
                <span className="text-[8px] text-blue-400/60 font-mono uppercase tracking-widest">Reduce Damage</span>
              </button>

              <button
                disabled={combat.turn !== 'player'}
                onClick={() => onAction('special')}
                className="group p-6 bg-orange-600/10 border border-orange-600/30 rounded-3xl hover:bg-orange-600/20 transition-all flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-white uppercase italic">Surge</span>
                <span className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest">High Damage</span>
              </button>
            </div>
          </div>

          {/* Right: Enemy Stats */}
          <div className="w-1/4 p-10 border-l border-orange-900/10 flex flex-col justify-center">
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full border-4 border-red-500/30 p-1 mx-auto mb-6 relative">
                <div className="w-full h-full rounded-full bg-red-900/20 flex items-center justify-center">
                  <Skull className="w-10 h-10 text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mb-2">{combat.enemy.name}</h3>
              <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest">Hostile Entity Detected</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-red-400 font-mono uppercase">Integrity</span>
                  <span className="text-[10px] text-red-100 font-mono">{combat.enemy.health}/{combat.enemy.maxHealth}</span>
                </div>
                <div className="w-full h-2 bg-red-900/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(combat.enemy.health / combat.enemy.maxHealth) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-2xl">
                <h4 className="text-[10px] text-red-400 font-mono uppercase tracking-widest mb-3">Abilities</h4>
                <div className="space-y-2">
                  {combat.enemy.abilities.map((ability, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-orange-100/60 font-mono uppercase">
                      <ChevronRight className="w-3 h-3 text-red-500" />
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CombatOverlay;
