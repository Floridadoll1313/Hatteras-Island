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
  Mail 
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
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
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
                      <span className={`text-[10px] font-bold font-mono ${t.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount}
                      </span>
                      <span className="text-[8px] text-orange-400/40 font-mono uppercase tracking-widest block mt-0.5">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;
