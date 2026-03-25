import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Brain, Download, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import { GameState } from '../types';
import { GoogleGenAI } from '@google/genai';

interface MannyRogersProps {
  gameState: GameState;
  onClose: () => void;
}

const MannyRogers: React.FC<MannyRogersProps> = ({ gameState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'training'>('chat');
  const [chatLog, setChatLog] = useState<{ sender: string, message: string }[]>([
    { sender: 'Manny', message: "Welcome to Buxton. I'm Manny Rogers, Lead AI Strategist. How can I help your business scale today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input;
    setChatLog(prev => [...prev, { sender: 'You', message: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Build conversation history
      const history = chatLog.map(log => `${log.sender}: ${log.message}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are Manny Rogers, Lead AI Strategist based near the Cape Hatteras Light. You bridge the gap between survival strategy and SMB automation. 
        You are talking to a user who is playing a game where they survive on an island and learn about AI.
        Keep your responses concise, professional, and thematic to Hatteras Island and AI business strategy.
        
        Conversation history:
        ${history}
        You: ${userMessage}
        Manny:`,
      });

      setChatLog(prev => [...prev, { sender: 'Manny', message: response.text || "I'm analyzing that data. Let's discuss it further soon." }]);
    } catch (error) {
      console.error("Manny chat failed:", error);
      setChatLog(prev => [...prev, { sender: 'Manny', message: "Sorry, my connection to the mainland is a bit spotty right now. Can you repeat that?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-blue-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative flex flex-col md:flex-row gap-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Manny Profile */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="aspect-square rounded-2xl overflow-hidden border border-blue-500/30 relative bg-blue-900/20">
            {/* Placeholder for Manny's consistent character image */}
            <div className="absolute inset-0 flex items-center justify-center text-blue-500/50">
              <Brain className="w-24 h-24" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Manny Rogers</h2>
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">Lead AI Strategist</p>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Based near the Cape Hatteras Light, Manny bridges the gap between survival strategy and SMB automation.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${activeTab === 'chat' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span className="font-bold uppercase tracking-widest text-xs">Strategy Chat</span>
              <MessageSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('training')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${activeTab === 'training' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span className="font-bold uppercase tracking-widest text-xs">Training Module</span>
              <Brain className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:w-2/3 flex flex-col min-h-[400px]">
          {activeTab === 'chat' ? (
            <div className="flex flex-col h-full border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {chatLog.map((log, i) => (
                  <div key={i} className={`flex flex-col ${log.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{log.sender}</span>
                    <div className={`p-4 rounded-2xl max-w-[80%] ${log.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                      {log.message}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Manny</span>
                    <div className="p-4 rounded-2xl bg-white/10 text-gray-200 rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span className="text-sm italic text-gray-400">Analyzing data...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Manny about AI strategy..."
                  disabled={isTyping}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-6">
              <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-xl font-bold text-white mb-2">Generative Agent Architecture</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  Behind the scenes, my decisions are driven by a combination of Behavior Trees and Blackboards. The Blackboard stores the current state of the world (like your inventory or the current weather), while the Behavior Tree evaluates that state to determine my next action.
                </p>
                <div className="p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-blue-300">
                  <div>[Blackboard]</div>
                  <div className="pl-4 text-gray-400">Player_Tier: Enterprise</div>
                  <div className="pl-4 text-gray-400">Current_Topic: Automation</div>
                  <div className="mt-2">[Behavior Tree]</div>
                  <div className="pl-4 text-green-400">└─ Sequence: Explain Architecture</div>
                  <div className="pl-8 text-gray-400">├─ Check Tier (Success)</div>
                  <div className="pl-8 text-gray-400">└─ Provide Guide (Executing)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-blue-500/50 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-white mb-1">AI for Business Guide</h4>
                  <p className="text-xs text-gray-400">Download the PDF on automating customer service.</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MannyRogers;
