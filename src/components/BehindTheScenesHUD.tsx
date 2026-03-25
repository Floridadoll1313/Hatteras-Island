import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Brain, Database, Activity, Target } from 'lucide-react';
import { GameState } from '../types';

interface BehindTheScenesHUDProps {
  gameState: GameState;
}

const BehindTheScenesHUD: React.FC<BehindTheScenesHUDProps> = ({ gameState }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!gameState.isParadiseMember) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 w-80 shadow-2xl pointer-events-auto"
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Brain className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">AI Engine HUD</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Blackboard State</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 font-mono text-[10px] text-blue-300 space-y-1">
                  <div>Realm: {gameState.currentRealm.name}</div>
                  <div>AI Stage: {gameState.aiStage}</div>
                  <div>Evolution: {(gameState.evolution * 100).toFixed(1)}%</div>
                  <div>Active Events: {gameState.activeEvents.length}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase">BDI Logic Engine</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 font-mono text-[10px] text-purple-400 space-y-1">
                  <div><span className="text-gray-500">Beliefs:</span> Player is actively gathering.</div>
                  <div><span className="text-gray-500">Desires:</span> Maximize resource control.</div>
                  <div><span className="text-gray-500">Intentions:</span> Initiate trade or sabotage.</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Behavior Tree & EQS</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 font-mono text-[10px] text-green-400 space-y-1">
                  <div>└─ Sequence: Evaluate Environment</div>
                  <div className="pl-4 text-gray-400">├─ EQS Query: Find Resource Nodes</div>
                  <div className="pl-4 text-gray-400">├─ Check Threat Level (Low)</div>
                  <div className="pl-4 text-green-400">└─ Determine Action (Idle)</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20 transition-all pointer-events-auto flex items-center justify-center"
        title="Toggle Behind the Scenes HUD"
      >
        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default BehindTheScenesHUD;
