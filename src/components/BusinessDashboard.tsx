import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
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
  Rocket, 
  Mail,
  Lock,
  Wrench
} from 'lucide-react';
import { GameState } from '../types';

interface BusinessDashboardProps {
  gameState: GameState;
  onClose: () => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  gameState,
  onClose
}) => {
  const survivor = gameState.survivor;
  const [unlocking, setUnlocking] = React.useState<string | null>(null);
  const [unlockMessage, setUnlockMessage] = React.useState<string | null>(null);

  const handleUnlockTool = async (toolId: string) => {
    setUnlocking(toolId);
    setUnlockMessage(null);
    try {
      const response = await fetch(`/api/village/${gameState.villageId}/toolbox/${toolId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': gameState.role === 'TRIBE_LEADER' ? 'Bearer mock-tribe-leader-token' : 'Bearer mock-villager-token'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setUnlockMessage(`SUCCESS: ${data.message}`);
      } else {
        setUnlockMessage(`ERROR: ${data.message}`);
      }
    } catch (error) {
      console.error("Unlock Error:", error);
      setUnlockMessage("ERROR: Failed to connect to the Council.");
    } finally {
      setUnlocking(null);
    }
  };

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
              <Briefcase className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Island Business</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Hatteras Island • Outer Banks Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-[10px] font-mono uppercase">
                  <ArrowUpRight className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest block mb-1">Total Revenue</span>
                <span className="text-3xl font-bold text-white tracking-tighter italic">${gameState.sandDollars * 10}</span>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-[10px] font-mono uppercase">
                  <ArrowUpRight className="w-3 h-3" />
                  +5%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest block mb-1">Active Users</span>
                <span className="text-3xl font-bold text-white tracking-tighter italic">{survivor?.contestants.length || 0}</span>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-red-500 text-[10px] font-mono uppercase">
                  <ArrowDownRight className="w-3 h-3" />
                  -2%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest block mb-1">Engagement Rate</span>
                <span className="text-3xl font-bold text-white tracking-tighter italic">84%</span>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-[10px] font-mono uppercase">
                  <ArrowUpRight className="w-3 h-3" />
                  +24%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest block mb-1">AI Evolution</span>
                <span className="text-3xl font-bold text-white tracking-tighter italic">{Math.floor(gameState.evolution * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Charts & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gameState.inventory.includes('Secret AI Key') ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/30 rounded-[2.5rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Sparkles className="w-24 h-24 text-orange-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                      <Brain className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Secret AI Insights</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-black/40 border border-orange-500/20 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Market Prediction</h4>
                      <p className="text-sm text-white font-medium italic">"The digital tides are shifting towards automated customer empathy. Invest in Social Resonance."</p>
                    </div>
                    <div className="p-6 bg-black/40 border border-orange-500/20 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Operational Efficiency</h4>
                      <p className="text-sm text-white font-medium italic">"Neural Nexus throughput can be increased by 15% if you optimize the Driftwood Shrine data stream."</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-orange-500 font-mono uppercase tracking-widest mt-4">
                      <Zap className="w-3 h-3 animate-pulse" />
                      <span>Real-time Business Elevation Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-6 group">
                <div className="w-20 h-20 rounded-full bg-orange-900/10 flex items-center justify-center text-orange-900/40 group-hover:scale-110 transition-transform">
                  <Lock className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white/40 uppercase italic tracking-tighter mb-2">Secret Insights Locked</h3>
                  <p className="text-[10px] text-orange-400/30 font-mono uppercase tracking-widest max-w-[200px]">Purchase the Secret AI Key in the Sales Center to unlock advanced business intelligence.</p>
                </div>
              </div>
            )}

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Revenue Overview</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end gap-4">
                {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full bg-orange-600/40 border border-orange-500/30 rounded-t-lg"
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 0.4}%` }}
                      className="w-full bg-blue-600/40 border border-blue-500/30 rounded-t-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <span key={d} className="text-[8px] text-orange-400/40 font-mono uppercase tracking-widest">{d}</span>
                ))}
              </div>
            </div>            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter mb-10">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { name: 'Neural Boost Pack', amount: '+150 SD', time: '2 mins ago', status: 'completed' },
                  { name: 'Island Subscription', amount: '+$29.00', time: '15 mins ago', status: 'completed' },
                  { name: 'Skill Unlock: Surfing', amount: '-50 SD', time: '1 hour ago', status: 'completed' },
                  { name: 'Lighthouse Upgrade', amount: '-100 SD', time: '3 hours ago', status: 'completed' },
                  { name: 'New User Onboarding', amount: '+10 SD', time: '5 hours ago', status: 'completed' }
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-white uppercase italic">{t.name}</h4>
                        <span className="text-[8px] text-orange-400/40 font-mono uppercase tracking-widest">{t.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold font-mono ${t.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {t.amount}
                      </span>
                      <span className="text-[8px] text-orange-400/40 font-mono uppercase tracking-widest block mt-0.5">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Survival Toolbox - Tribe Leader Only Area */}
          <div className="mt-12 p-10 bg-gradient-to-br from-orange-900/20 to-black/40 border border-orange-500/20 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Wrench className="w-48 h-48 text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-700 flex items-center justify-center shadow-lg shadow-orange-700/20">
                    <Wrench className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Survival Toolbox</h3>
                    <p className="text-orange-400 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Tribe Leader Automation Suite</p>
                  </div>
                </div>
                {gameState.role === 'TRIBE_LEADER' ? (
                  <div className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-full flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">Authorized Tribe Leader</span>
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-full flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest">Access Restricted</span>
                  </div>
                )}
              </div>

              {unlockMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-8 p-4 rounded-xl font-mono text-[10px] uppercase tracking-widest border ${
                    unlockMessage.startsWith('SUCCESS') ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'
                  }`}
                >
                  {unlockMessage}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'auto_outreach', name: 'Neural Outreach Bot', desc: 'Automates social signaling and trust building.', cost: '500 SD' },
                  { id: 'market_oracle', name: 'Market Prediction Oracle', desc: 'Real-time analysis of digital tides.', cost: '1200 SD' },
                  { id: 'resource_gatherer', name: 'Autonomous Scavenger', desc: 'Collects driftwood and resources while you sleep.', cost: '800 SD' },
                  { id: 'tribe_monitor', name: 'Tribe Sentiment Analyzer', desc: 'Predicts voting patterns and hidden alliances.', cost: '1500 SD' }
                ].map((tool) => (
                  <div key={tool.id} className="p-6 bg-black/40 border border-orange-500/10 rounded-3xl group hover:border-orange-500/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase italic">{tool.name}</h4>
                        <p className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest mt-1">{tool.desc}</p>
                      </div>
                      <span className="text-orange-500 font-mono text-xs font-bold">{tool.cost}</span>
                    </div>
                    <button
                      onClick={() => handleUnlockTool(tool.id)}
                      disabled={unlocking !== null || gameState.role !== 'TRIBE_LEADER'}
                      className={`w-full py-3 rounded-xl font-bold uppercase italic tracking-widest text-[10px] transition-all ${
                        gameState.role === 'TRIBE_LEADER' 
                          ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 active:scale-95' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {unlocking === tool.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Unlock Survival Tool'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monitoring Section */}
          {gameState.inventory.includes('Neural Nexus Monitor') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-10 bg-white/5 border border-blue-500/30 rounded-[2.5rem] overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Activity className="w-48 h-48 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <Activity className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Neural Workflow Monitoring</h3>
                      <p className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Real-time AI Performance Metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">System Online</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Social Resonance', status: 'Optimal', load: '12%', latency: '45ms', icon: Zap },
                    { label: 'Neural Outreach', status: 'Active', load: '28%', latency: '120ms', icon: Mail },
                    { label: 'Market Prediction', status: 'Processing', load: '85%', latency: '850ms', icon: TrendingUp }
                  ].map((monitor, i) => (
                    <div key={i} className="p-6 bg-black/40 border border-blue-500/10 rounded-3xl group hover:border-blue-500/40 transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <monitor.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-full ${
                          monitor.status === 'Optimal' ? 'bg-green-500/10 text-green-400' : 
                          monitor.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {monitor.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase italic mb-4">{monitor.label}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-gray-500">
                          <span>Load Factor</span>
                          <span>{monitor.load}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: monitor.load }} />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-gray-500">
                          <span>Latency</span>
                          <span>{monitor.latency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 bg-black/40 border-t border-orange-900/20 flex justify-center">
        <div className="flex items-center gap-3 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
          <Rocket className="w-3 h-3" />
          <span>Maximize Growth • Optimize Island Operations</span>
          <Rocket className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;
