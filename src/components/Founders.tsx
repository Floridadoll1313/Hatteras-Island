import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Database, Shield, X, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';

interface Founder {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  image: string;
  color: string;
  socials: { platform: string; url: string; icon: React.ElementType }[];
}

const FOUNDERS: Founder[] = [
  {
    id: 'hatteras',
    name: 'Captain Hatteras',
    role: 'Founder & Chief Architect',
    description: 'The visionary who first decoded the island\'s digital soul. He believes that the Outer Banks are not just sand and sea, but a living, breathing neural network.',
    icon: Anchor,
    image: 'https://picsum.photos/seed/hatteras/800/1000',
    color: '#00E0FF',
    socials: [
      { platform: 'Twitter', url: '#', icon: Twitter },
      { platform: 'LinkedIn', url: '#', icon: Linkedin },
      { platform: 'GitHub', url: '#', icon: Github }
    ]
  },
  {
    id: 'drifter',
    name: 'Data Drifter',
    role: 'Systems Engineer',
    description: 'The technical genius behind the neural link and the lighthouse infrastructure. She ensures the data flows smoothly across the shifting tides of the network.',
    icon: Database,
    image: 'https://picsum.photos/seed/drifter/800/1000',
    color: '#00FF00',
    socials: [
      { platform: 'Twitter', url: '#', icon: Twitter },
      { platform: 'LinkedIn', url: '#', icon: Linkedin },
      { platform: 'GitHub', url: '#', icon: Github }
    ]
  },
  {
    id: 'rider',
    name: 'Storm Rider',
    role: 'Security & Defense',
    description: 'The island\'s primary protector. He monitors the surges and ensures that the corruption from the deep web never reaches the shores of Hatteras.',
    icon: Shield,
    image: 'https://picsum.photos/seed/rider/800/1000',
    color: '#FF4444',
    socials: [
      { platform: 'Twitter', url: '#', icon: Twitter },
      { platform: 'LinkedIn', url: '#', icon: Linkedin },
      { platform: 'GitHub', url: '#', icon: Github }
    ]
  }
];

interface FoundersProps {
  onBack: () => void;
}

export default function Founders({ onBack }: FoundersProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#050505] overflow-y-auto selection:bg-[#00E0FF]/30"
    >
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E0FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF00]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-24">
        {/* Header Section */}
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E0FF] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">Architectural Council</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]"
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Founders</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/40 font-light leading-relaxed max-w-xl italic"
            >
              The pioneers who first decoded the island's digital soul. Their legacy is the foundation of every neural link on the Outer Banks.
            </motion.p>
          </div>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {FOUNDERS.map((founder, i) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.15), duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div 
                className="absolute -inset-4 rounded-[48px] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${founder.color}20, transparent 70%)` }}
              />

              <div className="relative h-full flex flex-col rounded-[40px] overflow-hidden bg-[#0A0A0A] border border-white/5 group-hover:border-white/20 transition-all duration-500 group-hover:-translate-y-3">
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                  
                  {/* Technical Data Overlay */}
                  <div className="absolute bottom-6 left-8 space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#00FF00]" />
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">Link_Strength: 98.4%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#00E0FF]" />
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">Neural_Sync: ACTIVE</span>
                    </div>
                  </div>

                  {/* Floating Icon */}
                  <div className="absolute top-8 right-8 p-5 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <founder.icon size={28} style={{ color: founder.color }} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-8" style={{ backgroundColor: founder.color }} />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: founder.color }}>
                          {founder.role}
                        </span>
                      </div>
                      <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none">{founder.name}</h3>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex gap-3">
                      {founder.socials.map((social, j) => (
                        <motion.a
                          key={j}
                          href={social.url}
                          whileHover={{ y: -4, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3.5 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center group/social relative"
                          style={{ 
                            // @ts-ignore
                            '--hover-color': founder.color 
                          } as React.CSSProperties}
                        >
                          <div className="absolute inset-0 rounded-2xl bg-[var(--hover-color)] opacity-0 group-hover/social:opacity-10 blur-md transition-opacity" />
                          <social.icon 
                            size={18} 
                            className="transition-colors group-hover/social:text-[var(--hover-color)] relative z-10" 
                          />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-4 px-3 py-1.5 rounded-lg bg-black border border-white/10 backdrop-blur-xl text-[9px] font-mono uppercase tracking-[0.2em] text-white whitespace-nowrap opacity-0 group-hover/social:opacity-100 translate-y-2 group-hover/social:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                            {social.platform}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <p className="text-sm text-white/40 leading-relaxed font-light italic border-l border-white/10 pl-6">
                      "{founder.description}"
                    </p>

                    <button className="w-full py-4 rounded-2xl border border-white/5 bg-white/5 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 group/btn">
                      Access Dossier
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-8 pt-12"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <button
            onClick={onBack}
            className="group relative px-16 py-6 rounded-full overflow-hidden transition-all duration-500"
          >
            <div className="absolute inset-0 bg-white group-hover:bg-[#00E0FF] transition-colors duration-500" />
            <div className="relative flex items-center gap-4 text-black font-black uppercase tracking-tighter text-2xl">
              Return to Island
              <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform duration-500" />
            </div>
          </button>
        </motion.div>

        {/* Close Button */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onBack}
          className="fixed top-12 right-12 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl transition-all text-white/40 hover:text-white z-[160]"
        >
          <X size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
