import React from 'react';
import { motion } from 'motion/react';
import { 
  Anchor, 
  Brain, 
  Users, 
  Compass, 
  Loader2, 
  Save, 
  RotateCcw, 
  Waves 
} from 'lucide-react';
import { GameState } from '../types';
import { User } from 'firebase/auth';

interface HeaderProps {
  gameState: GameState;
  user: User | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  setShowAILab: (show: boolean) => void;
  setShowFounders: (show: boolean) => void;
  setShowSkills: (show: boolean) => void;
  handleManualSave: () => void;
  handleReset: () => void;
  signIn: () => void;
  signOut: () => void;
  setShowPricing: (show: boolean) => void;
}

const Header = ({
  gameState,
  user,
  saveStatus,
  setShowAILab,
  setShowFounders,
  setShowSkills,
  handleManualSave,
  handleReset,
  signIn,
  signOut,
  setShowPricing
}: HeaderProps) => {
  return (
    <header className="relative z-10 border-b border-[#00E0FF]/20 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#00E0FF]/10 rounded-lg border border-[#00E0FF]/30">
          <Anchor className="text-[#00E0FF]" size={20} />
        </div>
        <div>
          <h1 className="text-xs font-mono uppercase tracking-widest text-[#00E0FF]/70">Hatteras Island</h1>
          <h2 className="text-xl font-bold tracking-tight">OBX ODYSSEY <span className="text-[#00E0FF] font-mono text-sm ml-2">v{gameState.aiStatus.evolution.toFixed(1)}</span></h2>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Health Bar */}
        <div className="hidden lg:flex items-center gap-3 px-4 border-r border-[#00E0FF]/20">
          <div className="text-right">
            <div className="text-[8px] font-mono text-white/30 uppercase">Island Harmony</div>
            <div className="text-xs font-bold text-[#00E0FF]">{gameState.playerStats.health}%</div>
          </div>
          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              animate={{ width: `${gameState.playerStats.health}%` }}
              className="h-full bg-[#00E0FF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-r border-[#00E0FF]/20 pr-4 mr-2">
          <button 
            onClick={() => setShowAILab(true)}
            className="p-2 rounded-lg bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all text-[#00E0FF]"
            title="AI Lab"
          >
            <Brain size={16} />
          </button>
          <button 
            onClick={() => setShowFounders(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF] flex items-center gap-2"
            title="The Founders"
          >
            <Users size={16} />
            <span className="text-[10px] font-mono hidden md:inline">Founders</span>
          </button>
          <button 
            onClick={() => setShowSkills(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF] flex items-center gap-2"
            title="Island Skill Tree"
          >
            <Compass size={16} />
            <span className="text-[10px] font-mono">{gameState.sandDollars.toFixed(0)} SD</span>
          </button>
          <button 
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF]"
            title="Manual Save"
          >
            {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          </button>
          <button 
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-red-500/70 hover:text-red-500"
            title="Reset Journey"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
            >
              <div className="w-5 h-5 rounded-full bg-[#00E0FF]/20 flex items-center justify-center text-[10px] font-bold text-[#00E0FF]">
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </div>
              <span className="text-[10px] font-mono uppercase hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <button 
              onClick={() => signIn()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-[#00E0FF] transition-all"
            >
              <Users size={14} />
              <span className="text-[10px] font-mono uppercase font-bold">Sign In</span>
            </button>
          )}

          <button 
            onClick={() => setShowPricing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all text-xs font-mono uppercase text-[#00E0FF]"
          >
            <Waves size={14} />
            {gameState.subscription.tier === 'none' ? 'Upgrade Legacy' : `${gameState.subscription.tier} Active`}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
