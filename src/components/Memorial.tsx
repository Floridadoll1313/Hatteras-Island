import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Sparkles, Anchor, Waves } from 'lucide-react';

interface MemorialProps {
  onClose: () => void;
}

const Memorial: React.FC<MemorialProps> = ({ onClose }) => {
  const pictures = [
    { id: 1, url: 'https://picsum.photos/seed/bull1/800/600', caption: 'The Legend of Salvo' },
    { id: 2, url: 'https://picsum.photos/seed/bull2/800/600', caption: 'Bull Hooper: Guardian of the Coast' },
    { id: 3, url: 'https://picsum.photos/seed/bull3/800/600', caption: 'A Legacy in the Sand' },
    { id: 4, url: 'https://picsum.photos/seed/bull4/800/600', caption: 'Hatteras Island Icon' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-[#1a1a1a] border border-orange-900/30 rounded-3xl shadow-2xl flex flex-col">
        {/* Survivor-themed Header */}
        <div className="p-8 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Anchor className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-500 tracking-tighter uppercase italic">The Bull Hooper Memorial</h2>
              <p className="text-orange-200/60 text-sm font-mono uppercase tracking-widest">Legacy of the Outer Banks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pictures.map((pic, index) => (
              <motion.div
                key={pic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-video overflow-hidden rounded-2xl border border-orange-900/30 bg-black"
              >
                <img
                  src={pic.url}
                  alt={pic.caption}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-orange-100 font-medium text-lg italic">{pic.caption}</p>
                </div>
                {/* Tribal Accents */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600/20 backdrop-blur-md flex items-center justify-center border border-orange-500/30">
                    <Waves className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-orange-900/10 border border-orange-900/20 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-orange-500 w-6 h-6 fill-orange-500" />
              <h3 className="text-xl font-bold text-orange-100 uppercase italic tracking-wider">A Tribute to a Legend</h3>
            </div>
            <p className="text-orange-100/70 leading-relaxed italic text-lg">
              "Bull Hooper wasn't just a man; he was the soul of Salvo. Like the shifting dunes of Hatteras, his legacy remains a constant guide for all who navigate these waters. In the game of life and the game of the island, he stood tall, a true survivor of the Atlantic's might."
            </p>
            <div className="mt-6 flex items-center gap-4 text-orange-400/60 font-mono text-sm uppercase tracking-widest">
              <span>Est. Salvo, NC</span>
              <span className="w-1 h-1 rounded-full bg-orange-900/40" />
              <span>Hatteras Island Legacy</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-2 text-orange-500/40 text-xs font-mono uppercase tracking-[0.3em]">
            <Sparkles className="w-3 h-3" />
            <span>The Tribe Has Spoken • His Memory Remains</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Memorial;
