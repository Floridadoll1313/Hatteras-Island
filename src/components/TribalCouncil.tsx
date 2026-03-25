import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Users, 
  Skull, 
  Shield, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  X,
  Sparkles,
  TrendingUp,
  Heart
} from 'lucide-react';
import { Contestant, Alliance } from '../types';

interface TribalCouncilProps {
  contestants: Contestant[];
  alliances: Alliance[];
  onVote: (votedId: string) => Promise<void>;
  onTrustSignal: (signals: Record<string, 1 | 0 | -1>) => void;
  onClose: () => void;
}

const TribalCouncil: React.FC<TribalCouncilProps> = ({ contestants, alliances, onVote, onTrustSignal, onClose }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteStage, setVoteStage] = useState<'accusation' | 'voting' | 'reveal'>('accusation');
  const [trustTokens, setTrustTokens] = useState<Record<string, 1 | 0 | -1>>({});

  const activeContestants = contestants.filter(c => c.status === 'active');
  const player = contestants.find(c => c.isPlayer);

  const handleTrustToken = (contestantId: string, value: 1 | 0 | -1) => {
    setTrustTokens(prev => ({ ...prev, [contestantId]: value }));
  };

  const handleProceedToVote = () => {
    onTrustSignal(trustTokens);
    setVoteStage('voting');
  };

  const handleVote = async () => {
    if (!selectedId) return;
    setIsVoting(true);
    setVoteStage('reveal');
    await onVote(selectedId);
    setIsVoting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-[#0a0a0a] border border-orange-500/20 rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-500/10">
        {/* Tribal Header */}
        <div className="relative h-64 bg-gradient-to-b from-orange-950/50 to-transparent p-12 flex flex-col justify-end">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.2),transparent_70%)]" />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-orange-500/20 blur-[120px] rounded-full" 
            />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="text-xs font-mono tracking-[0.4em] uppercase font-bold">
                {voteStage === 'accusation' ? 'Accusation Phase' : 'Tribal Council'}
              </span>
            </div>
            <h2 className="text-7xl font-black tracking-tighter uppercase italic leading-none">
              {voteStage === 'accusation' ? (
                <>Trust <span className="text-orange-500">Signaling</span></>
              ) : (
                <>The Fire Represents <br /><span className="text-orange-500">Your Life</span></>
              )}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors border border-white/10"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Contestants Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Remaining Survivors</h3>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                {activeContestants.length} Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeContestants.map((contestant) => (
                <motion.div
                  key={contestant.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => {
                    if (voteStage === 'voting' && !contestant.isPlayer) setSelectedId(contestant.id);
                  }}
                  className={`relative p-6 rounded-[2rem] border transition-all duration-300 text-left group overflow-hidden ${
                    selectedId === contestant.id && voteStage === 'voting'
                      ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } ${contestant.isPlayer ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Trust Tokens (Accusation Phase) */}
                  {voteStage === 'accusation' && !contestant.isPlayer && (
                    <div className="absolute top-4 right-4 flex gap-1 bg-[#0a0a0a] p-1 rounded-full border border-white/10 shadow-xl z-20">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTrustToken(contestant.id, 1); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${trustTokens[contestant.id] === 1 ? 'bg-green-500 text-black' : 'bg-white/5 text-green-500 hover:bg-green-500/20'}`}
                      >+1</button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTrustToken(contestant.id, 0); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${trustTokens[contestant.id] === 0 ? 'bg-gray-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-gray-500/20'}`}
                      >0</button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTrustToken(contestant.id, -1); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${trustTokens[contestant.id] === -1 ? 'bg-red-500 text-black' : 'bg-white/5 text-red-500 hover:bg-red-500/20'}`}
                      >-1</button>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold">{contestant.name}</h4>
                        {contestant.isPlayer && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-mono uppercase rounded-full border border-blue-500/30">You</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{contestant.archetype}</p>
                    </div>
                    <div className="p-2 bg-black/40 rounded-xl border border-white/10">
                      <TrendingUp className={`w-4 h-4 ${contestant.threatLevel > 70 ? 'text-red-500' : 'text-emerald-500'}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <StatMini label="STR" value={contestant.strategicAbility} color="text-purple-400" />
                    <StatMini label="PHY" value={contestant.physicalAbility} color="text-blue-400" />
                    <StatMini label="LOY" value={contestant.loyalty} color="text-emerald-400" />
                  </div>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedId === contestant.id && voteStage === 'voting' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute top-4 right-4"
                      >
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Skull className="w-3 h-3 text-black" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Background Pattern */}
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Flame className="w-24 h-24 rotate-12" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Voting Panel */}
          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="w-32 h-32" />
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold uppercase tracking-tight">
                  {voteStage === 'accusation' ? 'Opinion Vetting' : 'The Decision'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {voteStage === 'accusation' 
                    ? 'Use Dis&approval Voting (+1, 0, -1) to broadcast trust signals and form consensus before the final vote.'
                    : '"In this game, fire represents your life. When your fire\'s gone, so are you."'}
                </p>
              </div>

              <div className="space-y-6 relative z-10">
                {voteStage === 'accusation' ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleProceedToVote}
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 bg-blue-500 text-black hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                    >
                      <span>Proceed to Elimination Vote</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        <span>Selected Target</span>
                        <Skull className="w-3 h-3" />
                      </div>
                      <div className="text-2xl font-black text-orange-500 uppercase italic">
                        {selectedId ? activeContestants.find(c => c.id === selectedId)?.name : 'None Selected'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleVote}
                        disabled={!selectedId || isVoting || voteStage === 'reveal'}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                          !selectedId || isVoting || voteStage === 'reveal'
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-orange-500 text-black hover:bg-orange-400 shadow-lg shadow-orange-500/20'
                        }`}
                      >
                        {isVoting ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>
                            <span>Cast Your Vote</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-[10px] font-mono text-center text-gray-600 uppercase tracking-widest">
                        This action cannot be undone
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Alliances Info */}
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Active Alliances</span>
                </div>
                <div className="space-y-2">
                  {alliances.map((alliance) => (
                    <div key={alliance.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-xs font-bold text-gray-300">{alliance.name}</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-mono text-blue-400">{alliance.members.length}</span>
                      </div>
                    </div>
                  ))}
                  {alliances.length === 0 && (
                    <p className="text-[10px] font-mono text-gray-600 italic">No formal alliances detected...</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] flex gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl h-fit">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-tight">AI Strategic Analysis</h4>
                <p className="text-[10px] text-blue-400/70 leading-relaxed">
                  The social dynamics are shifting. Your vote will ripple through the AI's memory bank, affecting future loyalty and threat assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatMini: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="p-2 bg-black/40 rounded-xl border border-white/5 text-center">
    <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-xs font-bold ${color}`}>{value}</div>
  </div>
);

export default TribalCouncil;
