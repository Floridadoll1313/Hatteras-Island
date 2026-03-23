import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon, 
  Package, 
  CheckCircle2, 
  Globe, 
  Database, 
  Shield, 
  Zap, 
  TrendingUp, 
  Rocket, 
  Anchor, 
  Waves, 
  Circle,
  Mail
} from 'lucide-react';
import { GameState } from '../types';
import EmailIntake from './EmailIntake';

interface SidebarProps {
  gameState: GameState;
  activeTab: 'logs' | 'inventory' | 'tasks' | 'hub';
  setActiveTab: (tab: 'logs' | 'inventory' | 'tasks' | 'hub') => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  transitioning: boolean;
  useItem: (id: string) => void;
  dropItem: (id: string) => void;
  setShowBusinessDashboard: (show: boolean) => void;
  setShowSalesCenter: (show: boolean) => void;
  setShowLighthouse: (show: boolean) => void;
  setShowFactionSelection: (show: boolean) => void;
  setShowSurfingGame: (show: boolean) => void;
  toggleTask: (id: string) => void;
}

const Sidebar = ({
  gameState,
  activeTab,
  setActiveTab,
  scrollRef,
  transitioning,
  useItem,
  dropItem,
  setShowBusinessDashboard,
  setShowSalesCenter,
  setShowLighthouse,
  setShowFactionSelection,
  setShowSurfingGame,
  toggleTask
}: SidebarProps) => {
  return (
    <aside className="w-full md:w-80 border-r border-[#00E0FF]/10 bg-black/20 flex flex-col">
      <div className="flex border-b border-[#00E0FF]/10">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'logs' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
        >
          <HistoryIcon size={14} />
          <span className="text-[10px] font-mono uppercase tracking-wider">Ship's Log</span>
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
        >
          <Package size={14} />
          <span className="text-[10px] font-mono uppercase tracking-wider">Gear ({gameState.inventory.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'tasks' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
        >
          <CheckCircle2 size={14} />
          <span className="text-[10px] font-mono uppercase tracking-wider">Tasks ({(gameState.tasks || []).filter(t => !t.completed).length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('hub')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'hub' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
        >
          <Globe size={14} />
          <span className="text-[10px] font-mono uppercase tracking-wider">Hub</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'logs' ? (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 scrollbar-hide"
            >
              {gameState.history.map((entry, i) => (
                <div key={i} className={entry.startsWith('>') ? 'text-[#00FF00]' : 'text-white/60'}>
                  {entry}
                </div>
              ))}
              {transitioning && (
                <div className="text-[#00FF00] animate-pulse">
                  _ PROCESSING_REALM_DATA...
                </div>
              )}
            </motion.div>
          ) : activeTab === 'inventory' ? (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
            >
              {gameState.inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-8">
                  <Database size={32} className="mb-4 opacity-20" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Storage Empty</p>
                </div>
              ) : (
                gameState.inventory.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3 group hover:border-[#00FF00]/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold group-hover:text-[#00FF00] transition-colors">{item.name}</div>
                        <div className="text-[8px] font-mono uppercase text-[#00FF00]/60">{item.rarity} {item.type}</div>
                      </div>
                      <div className="p-1.5 rounded bg-black/40">
                        {item.type === 'artifact' && <Shield size={12} className="text-[#00FF00]" />}
                        {item.type === 'tool' && <Zap size={12} className="text-[#00FF00]" />}
                        {item.type === 'data_fragment' && <Database size={12} className="text-[#00FF00]" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed">{item.description}</p>
                    
                    {item.passiveBonus && (
                      <div className="p-2 rounded bg-[#00FF00]/5 border border-[#00FF00]/10 flex items-center gap-2">
                        <TrendingUp size={10} className="text-[#00FF00]" />
                        <span className="text-[9px] font-mono text-[#00FF00]/80 uppercase tracking-tighter">Passive: {item.passiveBonus}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => useItem(item.id)}
                        className="flex-1 py-1.5 rounded-lg bg-[#00FF00]/10 border border-[#00FF00]/20 text-[9px] font-mono uppercase text-[#00FF00] hover:bg-[#00FF00]/20 transition-all"
                      >
                        Integrate
                      </button>
                      <button 
                        onClick={() => dropItem(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : activeTab === 'hub' ? (
            <motion.div 
              key="hub"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Commercial Operations</span>
                <button 
                  onClick={() => setShowBusinessDashboard(true)}
                  className="w-full p-4 rounded-2xl bg-[#00FF00]/5 border border-[#00FF00]/20 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/10 transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-[#00FF00]/10 text-[#00FF00] group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Business Dashboard</div>
                    <div className="text-[10px] font-mono text-[#00FF00]/60 uppercase">Revenue: ${gameState.business.revenue.toLocaleString()}</div>
                  </div>
                </button>
                <button 
                  onClick={() => setShowSalesCenter(true)}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 group relative overflow-hidden ${
                    gameState.subscription.status === 'active'
                    ? 'bg-[#00E0FF]/10 border border-[#00E0FF]/40 hover:border-[#00E0FF]/60'
                    : 'bg-[#00E0FF]/5 border border-[#00E0FF]/20 hover:border-[#00E0FF]/50 hover:bg-[#00E0FF]/10'
                  }`}
                >
                  {gameState.subscription.status === 'active' && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E0FF]/20 to-transparent"
                    />
                  )}
                  <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                    gameState.subscription.status === 'active' ? 'bg-[#00E0FF]/20 text-[#00E0FF]' : 'bg-[#00E0FF]/10 text-[#00E0FF]'
                  }`}>
                    {gameState.subscription.status === 'active' ? <Shield size={20} /> : <Rocket size={20} />}
                  </div>
                  <div className="text-left relative z-10">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      {gameState.subscription.status === 'active' ? 'Neural Infrastructure' : 'Sales & Infrastructure'}
                    </div>
                    <div className={`text-[10px] font-mono uppercase ${
                      gameState.subscription.status === 'active' ? 'text-[#00E0FF]' : 'text-[#00E0FF]/60'
                    }`}>
                      {gameState.subscription.status === 'active' ? `Active Plan: ${gameState.subscription.tier}` : 'View Plans & Features'}
                    </div>
                  </div>
                  {gameState.subscription.status === 'active' && (
                    <div className="ml-auto">
                      <CheckCircle2 size={16} className="text-[#00FF00]" />
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Island Infrastructure</span>
                <button 
                  onClick={() => setShowLighthouse(true)}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/5 transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-[#00E0FF]/10 text-[#00E0FF] group-hover:scale-110 transition-transform">
                    <Anchor size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">The Lighthouse</div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Base Operations & Upgrades</div>
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Neural Alignment</span>
                <button 
                  onClick={() => setShowFactionSelection(true)}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4444]/30 hover:bg-[#FF4444]/5 transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-[#FF4444]/10 text-[#FF4444] group-hover:scale-110 transition-transform">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Faction Alignment</div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">
                      {gameState.faction ? `Aligned: ${gameState.faction.toUpperCase()}` : 'No Alignment Detected'}
                    </div>
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Island Recreation</span>
                <button 
                  onClick={() => setShowSurfingGame(true)}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00FF00]/30 hover:bg-[#00FF00]/5 transition-all flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-[#00FF00]/10 text-[#00FF00] group-hover:scale-110 transition-transform">
                    <Waves size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Surf the Data Stream</div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Earn Sand Dollars</div>
                  </div>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Environment Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E0FF] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#00E0FF] uppercase">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono uppercase text-white/20">Current Weather</div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{gameState.weather}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[8px] font-mono uppercase text-white/20">Tide Level</div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{gameState.tide}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
            >
              {gameState.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-8">
                  <CheckCircle2 size={32} className="mb-4 opacity-20" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">No Objectives</p>
                </div>
              ) : (
                gameState.tasks.map((task) => (
                  <button 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full p-4 rounded-xl border transition-all text-left space-y-2 group ${
                      task.completed 
                        ? 'bg-[#00FF00]/5 border-[#00FF00]/20 opacity-60' 
                        : 'bg-white/5 border-white/10 hover:border-[#00E0FF]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className={`text-xs font-bold transition-colors ${task.completed ? 'text-[#00FF00] line-through' : 'text-white group-hover:text-[#00E0FF]'}`}>
                          {task.title}
                        </div>
                        <p className={`text-[10px] leading-relaxed ${task.completed ? 'text-[#00FF00]/40' : 'text-white/40'}`}>
                          {task.description}
                        </p>
                      </div>
                      <div className={`mt-0.5 transition-colors ${task.completed ? 'text-[#00FF00]' : 'text-white/20 group-hover:text-[#00E0FF]/50'}`}>
                        {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                    </div>
                    {task.reward && !task.completed && (
                      <div className="text-[8px] font-mono text-[#FFD700]/60 uppercase tracking-widest">
                        Reward: {task.reward} Sand Dollars
                      </div>
                    )}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Intake Form */}
        <div className="p-4 pt-0">
          <div className="p-6 rounded-3xl bg-[#00E0FF]/5 border border-[#00E0FF]/10 space-y-4">
            <div className="flex items-center gap-3 text-[#00E0FF]">
              <Mail size={18} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Neural Updates</h4>
            </div>
            <EmailIntake source="sidebar_main" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
