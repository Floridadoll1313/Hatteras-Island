import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Play, Pause, Map as MapIcon, Shield } from 'lucide-react';

interface SalvoMemorialProps {
  onClose: () => void;
}

const SalvoMemorial: React.FC<SalvoMemorialProps> = ({ onClose }) => {
  const [showJournal, setShowJournal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative flex flex-col md:flex-row gap-8 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Memorial Area */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black/50 group">
            {/* Placeholder for the animated memorial video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 mb-4 relative overflow-hidden">
                {/* Simulated animation frames */}
                <motion.div 
                  animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"
                />
                <span className="text-4xl font-serif italic text-white/50">Bull</span>
              </div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Resting State Animation</p>
            </div>

            {/* Play/Pause Control */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 left-4 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif italic text-white mb-2">Johnny (Bull) Hooper Memorial</h2>
            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
              <MapIcon className="w-4 h-4" />
              Salvo, N.C.
            </p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Architectural Status: Safe Zone</span>
              </div>
              <p className="text-xs text-blue-400/70 font-mono leading-relaxed">
                Zero-collision coordinate. Non-navigable static mesh.<br/>
                EQS Query Filter: Null (Hostile AI behaviors disabled).
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Environment synced with OSM data. The surrounding dunes and salt marshes match the real-world geography of Hatteras Island.
            </p>
          </div>
        </div>

        {/* Founders Journal Area */}
        <div className="md:w-1/2 flex flex-col">
          <div className="flex-1 border border-white/10 rounded-2xl bg-white/5 p-8 relative overflow-hidden">
            {/* Journal Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h3 className="text-xl font-serif italic text-white flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  The Founders Story
                </h3>
                <button 
                  onClick={() => setShowJournal(!showJournal)}
                  className="text-[10px] font-mono uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors"
                >
                  {showJournal ? 'Close Journal' : 'Open Journal'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showJournal ? (
                  <motion.div 
                    key="open"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-center"
                  >
                    <blockquote className="text-2xl font-serif italic text-gray-300 leading-relaxed border-l-4 border-orange-500/50 pl-6">
                      "One year in a tent in the woods with three dogs, building this for our future."
                    </blockquote>
                    <p className="text-sm text-gray-500 mt-8 font-mono uppercase tracking-widest">
                      — The Foundation of Paradise
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="closed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <div className="text-center opacity-50">
                      <BookOpen className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-sm font-mono uppercase tracking-widest">Journal is closed.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalvoMemorial;
