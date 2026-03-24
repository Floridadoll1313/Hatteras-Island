import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Briefcase, Sparkles, CheckCircle2, XCircle, Send, Lightbulb } from 'lucide-react';
import { BusinessAIChallenge } from '../types';

interface BusinessChallengeOverlayProps {
  challenge: BusinessAIChallenge;
  onSolve: (solution: string) => Promise<void>;
  onClose: () => void;
  isProcessing: boolean;
  feedback?: string;
}

const BusinessChallengeOverlay: React.FC<BusinessChallengeOverlayProps> = ({
  challenge,
  onSolve,
  onClose,
  isProcessing,
  feedback
}) => {
  const [solution, setSolution] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  AI Business Test
                </h2>
                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                  {challenge.category.replace('_', ' ')} • {challenge.difficulty}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">
            {challenge.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">The Problem</h4>
            <p className="text-lg text-gray-200 leading-relaxed italic">
              "{challenge.problem}"
            </p>
          </div>

          <div className="flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
            <p className="text-sm text-yellow-200/70 italic">
              <span className="font-bold text-yellow-500 uppercase text-[10px] tracking-widest block mb-1">Hint</span>
              {challenge.solutionHint}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-4">
              Your AI Strategy
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Describe how you would apply AI to solve this issue..."
              className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            />
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                feedback.includes('Success') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0 mt-1" />
              <p className="text-sm italic">{feedback}</p>
            </motion.div>
          )}

          <button
            onClick={() => onSolve(solution)}
            disabled={isProcessing || !solution.trim()}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase italic tracking-tighter rounded-[2rem] transition-all flex items-center justify-center gap-3 group"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Submit Strategy
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusinessChallengeOverlay;
