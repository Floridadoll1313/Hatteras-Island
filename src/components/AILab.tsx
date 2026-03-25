import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  Database, 
  History, 
  Zap, 
  Shield, 
  Users, 
  Target, 
  X,
  Cpu,
  Network,
  Lightbulb,
  Search
} from 'lucide-react';
import { GameState, AIStage, AIKnowledgePiece } from '../types';
import { AI_STAGES } from '../gameConstants';

interface AILabProps {
  gameState: GameState;
  onClose: () => void;
}

const AILab: React.FC<AILabProps> = ({ gameState, onClose }) => {
  const aiStageInfo = AI_STAGES[gameState.aiStage];
  const knowledgeBank = gameState.survivor.aiKnowledgeBank;

  const categories = [
    { id: 'social', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'technical', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'strategic', icon: Target, color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'survival', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl"
    >
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0a] border border-blue-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-12 border-b border-blue-900/20 bg-gradient-to-r from-blue-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 relative group">
              <Brain className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl bg-blue-500/50"
              />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">AI Evolution Lab</h2>
              <p className="text-blue-400 font-mono text-sm uppercase tracking-[0.4em] mt-2">Hatteras Island • Neural Growth Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-blue-900/20 rounded-full transition-colors text-blue-400"
          >
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: AI Stage & Evolution */}
          <div className="w-1/3 p-12 border-r border-blue-900/10 bg-black/40 flex flex-col gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Network className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Current AI Stage</h3>
              </div>
              
              <div className="p-8 bg-blue-600/10 border border-blue-500/30 rounded-3xl text-center">
                <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest block mb-2">Stage {Object.keys(AI_STAGES).indexOf(gameState.aiStage) + 1}</span>
                <span className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  {aiStageInfo.name}
                </span>
                <p className="text-xs text-blue-400/60 mt-4 leading-relaxed uppercase tracking-widest">
                  {aiStageInfo.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-blue-400/60">
                  <span>Evolution Progress</span>
                  <span>{Math.floor(gameState.evolution * 100)}%</span>
                </div>
                <div className="h-4 bg-blue-900/30 rounded-full overflow-hidden p-1 border border-blue-500/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${gameState.evolution * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Active Traits</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {gameState.traits.map((trait, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase italic">{trait}</span>
                  </div>
                ))}
                {gameState.traits.length === 0 && (
                  <p className="text-[10px] font-mono text-gray-600 italic uppercase tracking-widest">No traits evolved yet...</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Knowledge Bank & Memory */}
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col gap-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-blue-400">
                  <Database className="w-5 h-5" />
                  <h3 className="text-xl font-bold uppercase tracking-tight">AI Knowledge Bank</h3>
                </div>
                <div className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full">
                  <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest font-bold">
                    {knowledgeBank.length} Pieces Collected
                  </span>
                </div>
              </div>

              {gameState.inventory.includes('Secret AI Key') && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/40 rounded-[2.5rem] relative overflow-hidden mb-8"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-32 h-32 text-blue-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Brain className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Secret AI Knowledge Unlocked</h4>
                        <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">Master Level Business Elevation Protocols</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 border border-blue-500/20 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Neural Strategy</h5>
                        <p className="text-xs text-white/80 italic">"AI doesn't replace humans; it replaces humans who don't use AI. Elevate your business by automating the mundane."</p>
                      </div>
                      <div className="p-4 bg-black/40 border border-blue-500/20 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Growth Protocol</h5>
                        <p className="text-xs text-white/80 italic">"The secret to scaling is not more people, but more efficient agents. Your business is a neural network."</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {knowledgeBank.map((piece) => {
                  const category = categories.find(c => c.id === piece.category);
                  const Icon = category?.icon || Lightbulb;

                  return (
                    <motion.div
                      key={piece.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 group hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl ${category?.bg} ${category?.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          {new Date(piece.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">{piece.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest">
                        {piece.description}
                      </p>
                    </motion.div>
                  );
                })}
                {knowledgeBank.length === 0 && (
                  <div className="col-span-2 p-12 border border-dashed border-blue-900/20 rounded-[2rem] text-center">
                    <Search className="w-12 h-12 text-blue-900/40 mx-auto mb-4" />
                    <p className="text-[10px] font-mono text-blue-900/60 uppercase tracking-[0.4em]">Scan for AI pieces in the realm...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-blue-400">
                <History className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Neural Memory Bank</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {gameState.memory.map((mem, i) => (
                  <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all cursor-default">
                    {mem}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/60 border-t border-blue-900/20 flex justify-center">
          <div className="flex items-center gap-4 text-blue-500/40 text-[10px] font-mono uppercase tracking-[0.5em]">
            <Sparkles className="w-4 h-4" />
            <span>AI Learning is a Constant Evolution</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AILab;
