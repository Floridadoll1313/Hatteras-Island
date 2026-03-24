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
  Mail,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';
import { User } from 'firebase/auth';
import { GameState, AIStage } from '../types';
import { AI_STAGES } from '../gameConstants';

interface HeaderProps {
  gameState: GameState;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onShowMemorial: () => void;
  onShowSkills: () => void;
  onShowUpgrade: () => void;
}

const Header: React.FC<HeaderProps> = ({
  gameState,
  user,
  onLogin,
  onLogout,
  onShowMemorial,
  onShowSkills,
  onShowUpgrade
}) => {
  const aiStageInfo = AI_STAGES[gameState.aiStage];

  return (
    <header className="h-24 border-b border-orange-900/20 bg-black/40 backdrop-blur-md flex items-center justify-between px-10 z-50">
      {/* Game Title & AI Stage */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tighter uppercase italic leading-none">Hatteras Island</h1>
          <span className="text-[10px] text-orange-400 font-mono uppercase tracking-[0.4em] mt-1">OBX Odyssey • AI Evolution</span>
        </div>
        
        <div className="h-10 w-px bg-orange-900/30" />
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">AI Stage</span>
              <span className="text-[10px] font-bold text-white uppercase italic">{aiStageInfo.name}</span>
            </div>
            <div className="w-32 h-1 bg-orange-900/30 rounded-full mt-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${gameState.evolution * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Navigation */}
      <div className="flex items-center gap-8">
        {/* Vitality */}
        <div className="flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10">
          <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest">Vitality</span>
            <span className="text-xs font-bold text-white font-mono">{gameState.vitality}%</span>
          </div>
        </div>

        {/* Sand Dollars */}
        <div className="flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-orange-900/20 border border-orange-500/30">
          <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
          <div className="flex flex-col">
            <span className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest">Sand Dollars</span>
            <span className="text-xs font-bold text-white font-mono">{gameState.sandDollars}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onShowMemorial}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-orange-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all group"
            title="Memorial"
          >
            <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onShowSkills}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-orange-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all group"
            title="Skills"
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onShowUpgrade}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold uppercase italic text-[10px] tracking-widest shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Upgrade
          </button>
        </div>

        {/* Auth */}
        <div className="h-10 w-px bg-orange-900/30" />
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white font-bold uppercase italic">{user.displayName}</span>
              <button 
                onClick={onLogout}
                className="text-[8px] text-orange-400/60 font-mono uppercase tracking-widest hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-2 h-2" />
                Logout
              </button>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 p-0.5">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-orange-400 hover:bg-white/10 transition-all group"
          >
            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase italic tracking-widest">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
