import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Play, Pause, Map as MapIcon, Shield, Sparkles, Scroll, History, Camera, Wand2, Image as ImageIcon, Info, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactPlayer from 'react-player';

interface SalvoMemorialProps {
  onClose: () => void;
}

interface Legend {
  id: string;
  name: string;
  title: string;
  description: string;
  richDescription: string;
  imagePrompt: string;
  generatedImage?: string;
}

const Player = ReactPlayer as any;

const SalvoMemorial: React.FC<SalvoMemorialProps> = ({ onClose }) => {
  const [showJournal, setShowJournal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLegend, setActiveLegend] = useState<Legend | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

  const legends: Legend[] = [
    {
      id: 'bull-hooper',
      name: 'Johnny "Bull" Hooper',
      title: 'The Guardian of Salvo',
      description: 'A man whose strength was matched only by his love for the island.',
      richDescription: 'Bull Hooper was a fixture of Salvo, a master of the sound and the sea. He lived a life that embodied the spirit of the Outer Banks—resilient, independent, and deeply connected to the shifting sands. Known for his incredible physical strength and his unwavering dedication to the Hatteras community, he remains a symbol of the island\'s enduring character.',
      imagePrompt: 'A legendary, strong islander man with a weathered face, standing on a Hatteras beach at sunset, wearing a classic fisherman\'s sweater, looking out at the Atlantic Ocean, cinematic lighting, realistic style, Outer Banks atmosphere.'
    },
    {
      id: 'grey-man',
      name: 'The Grey Man',
      title: 'Harbinger of the Storm',
      description: 'A spectral figure often seen walking the beaches of Hatteras before a major hurricane.',
      richDescription: 'Legend says he appears to warn residents of impending danger, a silent guardian from the mists of time. Witnesses describe a tall man in a grey cloak or 19th-century clothing, appearing on the dunes just as the sky begins to darken and the winds pick up. He never speaks, but his presence is a clear signal to seek shelter.',
      imagePrompt: 'A ghostly, ethereal figure of a man in grey 19th-century clothing, walking along a windswept Hatteras beach as a massive storm approaches, dark clouds, churning grey ocean, atmospheric and eerie.'
    },
    {
      id: 'blackbeard',
      name: 'Edward Teach',
      title: 'Blackbeard the Pirate',
      description: 'The most feared pirate of the Golden Age.',
      richDescription: 'His final stand took place in the waters off Ocracoke, but his legend—and rumors of his buried treasure—still haunt the hidden creeks and inlets of the Pamlico Sound. Blackbeard was known for his terrifying appearance, often tying smoking fuses into his beard to strike fear into his enemies. His legacy is woven into the very fabric of the OBX.',
      imagePrompt: 'A fearsome pirate with a thick black beard with smoking fuses tied into it, standing on the deck of a wooden ship in the Pamlico Sound, sunset, dramatic shadows, historical adventure style.'
    },
    {
      id: 'midgett-family',
      name: 'The Midgett Family',
      title: 'Heroes of the Surf',
      description: 'A lineage of legendary lifesavers who braved the Graveyard of the Atlantic.',
      richDescription: 'For generations, the Midgett family has been synonymous with the United States Life-Saving Service and the Coast Guard on the Outer Banks. Rasmus Midgett, perhaps the most famous, single-handedly rescued ten people from the wreck of the Priscilla in 1899. Their courage in the face of the most violent storms is the stuff of legend, embodying the selfless spirit of the islanders.',
      imagePrompt: 'A group of brave lifesavers in vintage 19th-century oilskins, pulling a wooden surfboat through massive, crashing Atlantic waves during a storm, dramatic spray, heroic lighting, historical realism.'
    }
  ];

  const generateLegendImage = async (legend: Legend) => {
    if (legend.generatedImage || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: legend.imagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          legend.generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          setActiveLegend({ ...legend });
          break;
        }
      }
    } catch (error) {
      console.error("Error generating legend image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCoolerLogo = async () => {
    if (isGeneratingLogo) return;
    setIsGeneratingLogo(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: 'An ultra-modern, futuristic evolution of the "Pick Your Tools" logo. It merges island heritage with high-tech AI. Features a glowing lighthouse silhouette whose beam is a digital data stream, integrated with a stylized wave and a gear. Neon orange and deep obsidian color palette, 3D render, hyper-realistic, epic scale.' }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedLogos(prev => [`data:image/png;base64,${part.inlineData.data}`, ...prev].slice(0, 4));
          break;
        }
      }
    } catch (error) {
      console.error("Error generating logo:", error);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#050505] border border-white/10 rounded-[2rem] p-6 md:p-10 max-w-6xl w-full my-8 shadow-2xl relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all z-50 group"
        >
          <X className="w-6 h-6 text-white/50 group-hover:text-white" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Memorial & Video */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-orange-500">
                <History className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-[0.3em]">Hatteras Legacy Project</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">
                Salvo <span className="text-orange-500">Memorial</span>
              </h1>
            </div>

            {/* Video Player Section */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black group shadow-2xl">
              <Player
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Salvo Beachfront Footage - Filmed right in front of the founder's home
                width="100%"
                height="100%"
                playing={isPlaying}
                controls={true}
                light="https://picsum.photos/seed/salvo/1280/720"
                playIcon={
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto backdrop-blur-sm group-hover:bg-orange-500/20 transition-all">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                }
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Overlay Info (Only visible when not playing) */}
              {!isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent pointer-events-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Salvo Beachfront Footage</h3>
                        <p className="text-white/50 text-xs font-mono">Filmed right in front of where we lived in Salvo</p>
                        <p className="text-white/30 text-[10px] font-mono">35.5413° N, 75.4682° W</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Live Memory</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logo Evolution Section */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-serif italic text-white">Logo Evolution</h3>
                </div>
                <button 
                  onClick={generateCoolerLogo}
                  disabled={isGeneratingLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-900/50 text-black font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
                >
                  {isGeneratingLogo ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Make it Cooler
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {/* Original Logo: Pick Your Tools */}
                <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group relative overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/pick-your-tools/400/400" 
                    alt="Pick Your Tools Logo" 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center pointer-events-none p-2 text-center">
                    <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-1">Founder's Original</span>
                    <span className="text-[8px] font-mono text-white/50 uppercase tracking-tighter">"Pick Your Tools"</span>
                  </div>
                </div>
                
                {/* Generated Logos */}
                {generatedLogos.map((logo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-square rounded-xl bg-black border border-orange-500/30 overflow-hidden relative group"
                  >
                    <img src={logo} alt={`Cooler Logo ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                ))}
                
                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 3 - generatedLogos.length) }).map((_, idx) => (
                  <div key={idx} className="aspect-square rounded-xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Legends & Journal */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Legends Gallery */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif italic text-white flex items-center gap-3">
                  <Scroll className="w-5 h-5 text-orange-500" />
                  Island Legends
                </h3>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{legends.length} Figures Found</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {legends.map((legend) => (
                  <motion.button
                    key={legend.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveLegend(legend);
                      generateLegendImage(legend);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      activeLegend?.id === legend.id 
                        ? 'bg-orange-500/10 border-orange-500/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        {legend.generatedImage ? (
                          <img src={legend.generatedImage} alt={legend.name} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-white/20" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{legend.name}</h4>
                        <p className="text-xs text-white/40 font-mono uppercase tracking-widest">{legend.title}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Legend Detail Modal-like view */}
              <AnimatePresence>
                {activeLegend && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-orange-500 font-serif italic text-lg">{activeLegend.name}</h4>
                        <button onClick={() => setActiveLegend(null)} className="text-white/20 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-white/70 leading-relaxed italic">
                          "{activeLegend.description}"
                        </p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-orange-500/50 mb-2">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">Historical Context</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed">
                            {activeLegend.richDescription}
                          </p>
                        </div>
                      </div>
                      {isGenerating && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-orange-500 uppercase tracking-widest animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          <span>Generating AI Vision...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Founders Journal */}
            <div className="p-8 bg-gradient-to-br from-orange-900/20 to-black border border-white/10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif italic text-white">Founders Journal</h3>
                  <button 
                    onClick={() => setShowJournal(!showJournal)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <BookOpen className={`w-5 h-5 ${showJournal ? 'text-orange-500' : 'text-white/50'}`} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showJournal ? (
                    <motion.div
                      key="journal-open"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-lg font-serif italic text-white/90 leading-relaxed border-l-2 border-orange-500 pl-4">
                        "One year in a tent in the woods with three dogs, building this for our future. The island provides, but only to those who respect its rhythm."
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        <span>Entry #001</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Salvo Woods</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="journal-closed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-8 text-center"
                    >
                      <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em]">Unlock the history of the realm</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalvoMemorial;
