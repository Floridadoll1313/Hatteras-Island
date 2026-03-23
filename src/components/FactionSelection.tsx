import React from 'react';
import { motion } from 'motion/react';
import { Shield, Compass, Zap, X, ChevronRight } from 'lucide-react';
import { FactionType } from '../types';

interface FactionSelectionProps {
  onSelect: (faction: FactionType) => void;
  onClose: () => void;
}

const FACTIONS = [
  {
    id: 'preservationist' as FactionType,
    name: 'The Preservationists',
    description: 'Focus on Lore and Defense. They believe in protecting the island\'s digital memory.',
    icon: Shield,
    color: '#00FF00',
    bonus: 'Defense +10, Lore Rewards +20%'
  },
  {
    id: 'explorer' as FactionType,
    name: 'The Explorers',
    description: 'Focus on Speed and Discovery. They believe the island\'s secrets are meant to be found.',
    icon: Compass,
    color: '#00E0FF',
    bonus: 'Movement Speed +15, Discovery Rate +10%'
  },
  {
    id: 'reclaimer' as FactionType,
    name: 'The Reclaimers',
    description: 'Focus on Combat and Power. They believe in taking back the island from the data surges.',
    icon: Zap,
    color: '#FF4444',
    bonus: 'Attack +10, Combat Rewards +25%'
  }
];

export default function FactionSelection({ onSelect, onClose }: FactionSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4"
    >
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold tracking-tighter uppercase italic">Choose Your Legacy</h2>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest max-w-xl mx-auto">
            Your alignment determines your path across the Outer Banks. Choose wisely, for the island remembers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FACTIONS.map((faction, i) => (
            <motion.button
              key={faction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(faction.id)}
              className="group relative p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all text-left flex flex-col h-full"
            >
              <div className="p-4 rounded-3xl bg-black/40 border border-white/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-500">
                <faction.icon size={32} style={{ color: faction.color }} />
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold uppercase tracking-tighter">{faction.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{faction.description}</p>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-2">Neural Bonus</div>
                  <div className="text-xs font-bold" style={{ color: faction.color }}>{faction.bonus}</div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                <span>Align with Faction</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/5 transition-colors text-white/40"
        >
          <X size={24} />
        </button>
      </div>
    </motion.div>
  );
}
