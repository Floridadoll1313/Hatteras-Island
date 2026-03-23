import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, 
  Waves, 
  Anchor, 
  ChevronRight, 
  Sparkles, 
  Activity, 
  Volume2, 
  VolumeX, 
  Users, 
  ArrowRight, 
  Compass 
} from 'lucide-react';
import { GameState, BranchingPath, RealmOption } from '../types';

interface RealmViewProps {
  gameState: GameState;
  branchingPaths: BranchingPath[] | null;
  transitioning: boolean;
  handleSelectPath: (path: BranchingPath) => void;
  setShowMemorial: (show: boolean) => void;
  handleListen: (text: string) => void;
  playingAudio: string | null;
  handleAction: (option: RealmOption) => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const RealmView = ({
  gameState,
  branchingPaths,
  transitioning,
  handleSelectPath,
  setShowMemorial,
  handleListen,
  playingAudio,
  handleAction,
  setGameState
}: RealmViewProps) => {
  if (!gameState.currentRealm) return null;

  return (
    <section className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.currentRealm.id}
          initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl w-full space-y-8"
        >
          {/* Branching Paths Overlay */}
          <AnimatePresence>
            {branchingPaths && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md p-8 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="max-w-2xl w-full space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-[#00E0FF] tracking-tighter uppercase">Island Divergence Detected</h3>
                    <p className="text-white/60 text-sm font-mono italic">Choose your narrative consequence...</p>
                  </div>

                  <div className="grid gap-4">
                    {branchingPaths.map((path, i) => (
                      <motion.button
                        key={path.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleSelectPath(path)}
                        disabled={transitioning}
                        className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/50 hover:bg-[#00E0FF]/5 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            {transitioning && (
                              <Loader2 size={16} className="text-[#00E0FF] animate-spin" />
                            )}
                            <h4 className="text-lg font-bold text-white group-hover:text-[#00E0FF] transition-colors uppercase tracking-tight">{path.title}</h4>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            path.riskLevel === 'critical' ? 'border-red-500 text-red-500 bg-red-500/10' :
                            path.riskLevel === 'high' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                            'border-[#00E0FF]/40 text-[#00E0FF]/60 bg-[#00E0FF]/5'
                          } uppercase tracking-widest`}>
                            Risk: {path.riskLevel}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">{path.consequence}</p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00E0FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          <Waves size={12} />
                          <span>Potential Reward: {path.potentialReward}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Realm Image */}
          {gameState.currentRealm.imageUrl && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 relative group">
              <img 
                src={gameState.currentRealm.imageUrl} 
                alt={gameState.currentRealm.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00E0FF] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Island Connection Established</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#00E0FF]/60">
              <Waves size={14} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{gameState.currentRealm.environment}</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
              {gameState.currentRealm.name}
            </h3>
            {gameState.currentRealm.name.toLowerCase().includes('salvo') && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowMemorial(true)}
                className="mt-4 flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#00E0FF]/20">
                  <Anchor size={18} className="text-[#00E0FF]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white uppercase tracking-widest">Visit Bull Hooper Memorial</div>
                  <div className="text-[10px] font-mono text-[#00E0FF]/60 uppercase">A Salvo Landmark</div>
                </div>
                <ChevronRight size={16} className="text-[#00E0FF]/40 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>

          <div className="relative group/desc">
            <div className="absolute -left-8 top-0 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-500">
              <Sparkles size={20} className="text-[#00E0FF] animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light italic pr-12 group-hover/desc:text-white transition-colors duration-500">
              "{gameState.currentRealm.description}"
            </p>
            <div className="absolute -right-4 bottom-0 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-500 delay-100">
              <Activity size={16} className="text-[#00E0FF]/40" />
            </div>
            <button
              onClick={() => handleListen(gameState.currentRealm!.description)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${
                playingAudio === gameState.currentRealm.description
                  ? 'bg-[#00E0FF] text-black animate-pulse'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-[#00E0FF]'
              }`}
              title="Listen to Island Soul"
            >
              {playingAudio === gameState.currentRealm.description ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <div className="pt-8 space-y-4">
            {gameState.currentRealm.npc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-[#00E0FF]/5 border border-[#00E0FF]/20 space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#00E0FF]/20 text-[#00E0FF]">
                    <Users size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter">{gameState.currentRealm.npc.name}</h4>
                      <span className="text-[10px] font-mono text-[#00E0FF] uppercase tracking-widest px-2 py-0.5 rounded border border-[#00E0FF]/30 bg-[#00E0FF]/5">
                        {gameState.currentRealm.npc.role}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed italic">
                      "{gameState.currentRealm.npc.description}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Dialogue Stream</span>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm text-white/80 italic leading-relaxed relative group/dialogue">
                    "{gameState.currentRealm.npc.dialogue[0]}"
                    <button
                      onClick={() => handleListen(gameState.currentRealm!.npc!.dialogue[0])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 text-white/40 hover:bg-[#00E0FF]/10 hover:text-[#00E0FF] transition-all opacity-0 group-hover/dialogue:opacity-100"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>

                {gameState.currentRealm.npc.trades && gameState.currentRealm.npc.trades.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Available Exchanges</span>
                    <div className="grid grid-cols-1 gap-2">
                      {gameState.currentRealm.npc.trades.map((trade, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const hasItem = gameState.inventory.some(item => item.id === trade.input || item.name === trade.input);
                            if (hasItem) {
                              setGameState(prev => ({
                                ...prev,
                                inventory: [...(prev.inventory || []).filter(item => item.id !== trade.input && item.name !== trade.input), trade.output],
                                history: [`Trade: Exchanged ${trade.input} for ${trade.output.name} with ${gameState.currentRealm!.npc!.name}.`, ...prev.history]
                              }));
                            }
                          }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/40 hover:bg-[#00E0FF]/5 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[10px] font-mono text-white/40 uppercase">Give: <span className="text-white">{trade.input}</span></div>
                            <ArrowRight size={12} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
                            <div className="text-[10px] font-mono text-white/40 uppercase">Receive: <span className="text-[#00E0FF]">{trade.output.name}</span></div>
                          </div>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest block">Available Pathways</span>
            <div className="grid grid-cols-1 gap-3">
              {gameState.currentRealm.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(option)}
                  disabled={transitioning}
                  className="group relative flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/40 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-black/40 group-hover:bg-[#00E0FF]/20 transition-colors">
                      {transitioning ? (
                        <Loader2 size={18} className="text-[#00E0FF] animate-spin" />
                      ) : (
                        <>
                          {option.targetType === 'explore' && <Compass size={18} className="text-[#00E0FF]" />}
                          {option.targetType === 'interact' && <Waves size={18} className="text-[#00E0FF]" />}
                          {option.targetType === 'analyze' && <Anchor size={18} className="text-[#00E0FF]" />}
                        </>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold group-hover:text-[#00E0FF] transition-colors">{option.label}</div>
                      <div className="text-[10px] font-mono uppercase text-white/40">{option.targetType} pathway</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-[#00E0FF] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default RealmView;
