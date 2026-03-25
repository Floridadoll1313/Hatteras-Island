import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Target, 
  History, 
  Package, 
  Zap, 
  Map as MapIcon, 
  Flame, 
  Waves, 
  Anchor, 
  Compass, 
  TrendingUp, 
  ShoppingBag, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  Heart,
  Brain,
  Wind
} from 'lucide-react';
import { GameState, SurvivorState, Contestant } from '../types';

interface SidebarProps {
  gameState: GameState;
  activeTab: 'logs' | 'inventory' | 'tasks' | 'hub';
  setActiveTab: (tab: 'logs' | 'inventory' | 'tasks' | 'hub') => void;
  onShowTribal: () => void;
  onShowSurfing: () => void;
  onShowLighthouse: () => void;
  onShowFactions: () => void;
  onShowBusiness: () => void;
  onShowSales: () => void;
  onShowAILab: () => void;
  onShowCampLife: () => void;
  onShowMembersArea: () => void;
  onShowMannyRogers: () => void;
  onShowSalvoMemorial: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  gameState, 
  activeTab, 
  setActiveTab,
  onShowTribal,
  onShowSurfing,
  onShowLighthouse,
  onShowFactions,
  onShowBusiness,
  onShowSales,
  onShowAILab,
  onShowCampLife,
  onShowMembersArea,
  onShowMannyRogers,
  onShowSalvoMemorial
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const survivor = gameState.survivor;
  const activeContestants = survivor?.contestants.filter(c => c.status === 'active') || [];

  const tabs = [
    { id: 'logs', icon: History, label: 'Logs' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'tasks', icon: Target, label: 'Objectives' },
    { id: 'hub', icon: MapIcon, label: 'Island Hub' }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 80 }}
      className="h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col relative z-40 transition-all duration-300"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-12 bg-orange-500 rounded-full flex items-center justify-center border border-white/20 hover:bg-orange-400 transition-colors z-50"
      >
        {isOpen ? <X className="w-4 h-4 text-black" /> : <Menu className="w-4 h-4 text-black" />}
      </button>

      {/* Survivor Stats */}
      <div className={`p-6 border-b border-white/10 ${!isOpen && 'items-center'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          {isOpen && (
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">Survivor Status</h2>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Hatteras Island</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              {isOpen && <span className="text-xs text-gray-400">Day</span>}
            </div>
            <span className="text-sm font-bold text-orange-500">{survivor?.day || 1}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              {isOpen && <span className="text-xs text-gray-400">AI Learning</span>}
            </div>
            <span className="text-sm font-bold text-blue-500">{survivor?.aiLearningProgress || 0}%</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              {isOpen && <span className="text-xs text-gray-400">Tribe Level</span>}
            </div>
            <span className="text-sm font-bold text-emerald-500">{survivor?.tribeLevel || 1}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              {isOpen && <span className="text-xs text-gray-400">Tribe</span>}
            </div>
            <span className="text-sm font-bold text-blue-400">{survivor?.tribe || 'None'}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500">
              {isOpen && <span>AI Learning Progress</span>}
              <span>{survivor?.aiLearningProgress || 0}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${survivor?.aiLearningProgress || 0}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>
          </div>

          {isOpen && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Active</div>
                <div className="text-lg font-bold text-emerald-400">{activeContestants.length}</div>
              </div>
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Eliminated</div>
                <div className="text-lg font-bold text-red-400">{survivor?.eliminatedCount || 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-all relative ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {isOpen && <span className="text-[10px] font-mono uppercase tracking-widest">{tab.label}</span>}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {gameState.history?.map((log, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-1 h-1 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {log}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-2 gap-3"
              >
                {gameState.inventory.map((item, i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center gap-2 group hover:border-orange-500/30 transition-all">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-center text-gray-400">{item}</span>
                  </div>
                ))}
                {gameState.inventory.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-600 italic text-sm">
                    Inventory is empty...
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                {gameState.tasks?.map((task, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-300">{task.title}</span>
                      <span className="text-[10px] font-mono text-orange-500">{task.reward} SD</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-1/2" />
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-orange-500">Reach AI Awareness</span>
                    <span className="text-[10px] font-mono text-orange-500">100 SD</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${gameState.evolution * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'hub' && (
              <motion.div 
                key="hub"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                <HubButton icon={Flame} label="Tribal Council" onClick={onShowTribal} color="text-orange-500" />
                <HubButton icon={Brain} label="AI Lab" onClick={onShowAILab} color="text-blue-500" />
                <HubButton icon={Wind} label="Camp Life" onClick={onShowCampLife} color="text-emerald-500" />
                <HubButton icon={Waves} label="Surfing Game" onClick={onShowSurfing} color="text-blue-400" />
                <HubButton icon={Anchor} label="Lighthouse" onClick={onShowLighthouse} color="text-yellow-400" />
                <HubButton icon={Compass} label="Faction Selection" onClick={onShowFactions} color="text-emerald-400" />
                <HubButton icon={LayoutDashboard} label="Business Dashboard" onClick={onShowBusiness} color="text-purple-400" />
                <HubButton icon={ShoppingBag} label="Sales Center" onClick={onShowSales} color="text-pink-400" />
                <HubButton icon={Sparkles} label="Members Area" onClick={onShowMembersArea} color="text-yellow-400" />
                <HubButton icon={Brain} label="Manny Rogers (AI Strategist)" onClick={onShowMannyRogers} color="text-blue-400" />
                <HubButton icon={Heart} label="Salvo Memorial" onClick={onShowSalvoMemorial} color="text-red-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      {isOpen && (
        <div className="p-6 bg-black/40 border-t border-white/10">
          <div className="flex items-center gap-3 text-gray-500">
            <Heart className="w-4 h-4 text-red-500/50" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Hatteras Strong</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

interface HubButtonProps {
  icon: any;
  label: string;
  onClick: () => void;
  color: string;
}

const HubButton: React.FC<HubButtonProps> = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 hover:border-white/20 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-black/40 border border-white/10 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-all group-hover:translate-x-1" />
  </button>
);

export default Sidebar;
