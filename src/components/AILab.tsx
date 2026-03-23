import React from 'react';
import { 
  X, 
  MessageSquare, 
  ImageIcon, 
  Video, 
  Mic, 
  MapPin, 
  Brain, 
  Sparkles, 
  Search, 
  Upload, 
  Play, 
  Pause, 
  VolumeX, 
  RefreshCw, 
  Trash2,
  Loader2,
  ChevronRight,
  Send,
  Volume2,
  Lock as LockIcon,
  Eye,
  Globe,
  Activity,
  History as HistoryIcon,
  Edit3,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { AIResponse } from '../types';

interface AILabProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: any;
  setGameState: any;
  aiLabTab: 'chat' | 'generate' | 'analyze' | 'maps' | 'craft';
  setAiLabTab: (tab: 'chat' | 'generate' | 'analyze' | 'maps' | 'craft') => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatLoading: boolean;
  handleChatSubmit: (e: React.FormEvent) => void;
  imagePrompt: string;
  setImagePrompt: (val: string) => void;
  videoPrompt: string;
  setVideoPrompt: (val: string) => void;
  genLoading: boolean;
  handleImageGen: (aspectRatio?: any) => void;
  handleVideoGen: () => void;
  analysisInput: string;
  setAnalysisInput: (val: string) => void;
  analysisFile: string | null;
  analysisLoading: boolean;
  handleAnalysis: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mapsInput: string;
  setMapsInput: (val: string) => void;
  mapsLoading: boolean;
  handleMapsGrounding: () => void;
  handleSearchGrounding: () => void;
  searchLoading: boolean;
  imageEditPrompt: string;
  setImageEditPrompt: (val: string) => void;
  handleEditImage: () => void;
  handleLiveAudio: () => void;
  liveSession: any;
  liveTranscript: string[];
  thinkingMode: boolean;
  setThinkingMode: (val: boolean) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  handleTTS: (text: string) => void;
  playingAudio: string | null;
  onOpenApiKeySelector: () => void;
  setAnalysisFile: (file: string | null) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  hasPaidKey: boolean;
}

const AILab: React.FC<AILabProps> = ({
  isOpen,
  onClose,
  gameState,
  setGameState,
  aiLabTab,
  setAiLabTab,
  chatInput,
  setChatInput,
  chatLoading,
  handleChatSubmit,
  imagePrompt,
  setImagePrompt,
  videoPrompt,
  setVideoPrompt,
  genLoading,
  handleImageGen,
  handleVideoGen,
  analysisInput,
  setAnalysisInput,
  analysisFile,
  analysisLoading,
  handleAnalysis,
  handleFileUpload,
  mapsInput,
  setMapsInput,
  mapsLoading,
  handleMapsGrounding,
  handleSearchGrounding,
  searchLoading,
  imageEditPrompt,
  setImageEditPrompt,
  handleEditImage,
  handleLiveAudio,
  liveSession,
  liveTranscript,
  thinkingMode,
  setThinkingMode,
  isRecording,
  startRecording,
  stopRecording,
  handleTTS,
  playingAudio,
  onOpenApiKeySelector,
  setAnalysisFile,
  audioRef,
  hasPaidKey
}) => {
  const [selectedAspectRatio, setSelectedAspectRatio] = React.useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '1:4' | '1:8' | '4:1' | '8:1'>('1:1');
  const [activeSubTab, setActiveSubTab] = React.useState<'gen' | 'edit' | 'live'>('gen');

  const aspectRatios = [
    { label: '1:1', value: '1:1' },
    { label: '3:4', value: '3:4' },
    { label: '4:3', value: '4:3' },
    { label: '9:16', value: '9:16' },
    { label: '16:9', value: '16:9' },
    { label: '1:4', value: '1:4' },
    { label: '1:8', value: '1:8' },
    { label: '4:1', value: '4:1' },
    { label: '8:1', value: '8:1' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#0A0A0A] border border-[#00E0FF]/20 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,224,255,0.1)] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00E0FF]/10 border border-[#00E0FF]/30">
              <Brain size={24} className="text-[#00E0FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">Island AI Lab</h2>
              <p className="text-[10px] font-mono text-[#00E0FF]/60 uppercase tracking-[0.3em]">Advanced Neural Processing Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApiKeySelector}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-mono uppercase ${
                hasPaidKey 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-[#00E0FF] hover:border-[#00E0FF]/30'
              }`}
            >
              <LockIcon size={12} />
              {hasPaidKey ? 'API Key Active' : 'Select API Key'}
            </button>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              {(['chat', 'generate', 'analyze', 'maps', 'craft'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAiLabTab(tab)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase transition-all flex items-center gap-2 ${
                    aiLabTab === tab 
                    ? 'bg-[#00E0FF]/20 text-[#00E0FF] border border-[#00E0FF]/30' 
                    : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tab === 'chat' && <MessageSquare size={14} />}
                  {tab === 'generate' && <Sparkles size={14} />}
                  {tab === 'analyze' && <Eye size={14} />}
                  {tab === 'maps' && <MapPin size={14} />}
                  {tab === 'craft' && <Zap size={14} />}
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl hover:bg-white/5 transition-colors text-white/40 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-black/20">
            {/* Messages / Output */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {gameState.aiResponses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Brain size={64} className="animate-pulse" />
                  <p className="font-mono text-sm uppercase tracking-widest">Awaiting Neural Input...</p>
                </div>
              ) : (
                gameState.aiResponses.map((res: AIResponse) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${res.metadata?.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl border ${
                      res.metadata?.sender === 'user' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-[#00E0FF]/5 border-[#00E0FF]/20 text-[#00E0FF]'
                    }`}>
                      {res.type === 'text' && (
                        <div className="markdown-body text-sm leading-relaxed">
                          <Markdown>{res.content}</Markdown>
                        </div>
                      )}
                      {res.type === 'image' && (
                        <div className="space-y-3">
                          <img src={res.content} alt="Generated" className="rounded-xl w-full border border-white/10" referrerPolicy="no-referrer" />
                          <p className="text-[10px] font-mono opacity-60 uppercase">Prompt: {res.metadata?.prompt}</p>
                        </div>
                      )}
                      {res.type === 'video' && (
                        <div className="space-y-3">
                          <video src={res.content} controls className="rounded-xl w-full border border-white/10" />
                          <p className="text-[10px] font-mono opacity-60 uppercase">Prompt: {res.metadata?.prompt}</p>
                        </div>
                      )}
                      {res.type === 'maps' && (
                        <div className="space-y-4">
                          <div className="markdown-body text-sm leading-relaxed">
                            <Markdown>{res.content}</Markdown>
                          </div>
                          {res.metadata?.links && res.metadata.links.length > 0 && (
                            <div className="pt-3 border-t border-[#00E0FF]/20 space-y-2">
                              <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">Grounding Sources:</p>
                              {res.metadata.links.map((link: any, i: number) => (
                                <a 
                                  key={i} 
                                  href={link.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[10px] hover:underline text-[#00E0FF]"
                                >
                                  <Globe size={10} />
                                  {link.title || link.uri}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <span className="text-[8px] font-mono opacity-40 uppercase">
                          {new Date(res.timestamp).toLocaleTimeString()}
                        </span>
                        {res.type === 'text' && res.metadata?.sender === 'ai' && (
                          <button 
                            onClick={() => handleTTS(res.content)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Volume2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-black/40">
              {aiLabTab === 'chat' && (
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setThinkingMode(!thinkingMode)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase transition-all flex items-center gap-2 ${
                        thinkingMode 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-white/5 text-white/40 border border-white/10'
                      }`}
                    >
                      <Brain size={12} />
                      Thinking Mode: {thinkingMode ? 'ON' : 'OFF'}
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <button
                      type="button"
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onMouseLeave={stopRecording}
                      className={`p-2 rounded-full transition-all ${
                        isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                      title="Hold to Record"
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={thinkingMode ? "Ask a complex question..." : "Type your message..."}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-[#00E0FF] text-black rounded-xl font-bold hover:bg-[#00E0FF]/80 disabled:opacity-50 transition-all"
                    >
                      {chatLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              )}

              {aiLabTab === 'generate' && (
                <div className="space-y-6">
                  {/* Sub-tabs for Generation/Edit/Live */}
                  <div className="flex gap-4 mb-2 border-b border-white/10 pb-2">
                    <button
                      onClick={() => setActiveSubTab('gen')}
                      className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${activeSubTab === 'gen' ? 'text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
                    >
                      Synthesis
                    </button>
                    <button
                      onClick={() => setActiveSubTab('edit')}
                      className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${activeSubTab === 'edit' ? 'text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
                    >
                      Modification
                    </button>
                    <button
                      onClick={() => setActiveSubTab('live')}
                      className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${activeSubTab === 'live' ? 'text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
                    >
                      Neural Link
                    </button>
                  </div>

                  {activeSubTab === 'gen' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#00E0FF]">
                          <ImageIcon size={16} />
                          <span className="text-xs font-mono uppercase tracking-widest">Image Synthesis</span>
                        </div>
                        <div className="relative space-y-3">
                          <textarea
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder="Describe the image you want to generate..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm h-32 resize-none focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                          />
                          <div className="flex flex-wrap gap-2">
                            {aspectRatios.map((ratio) => (
                              <button
                                key={ratio.value}
                                onClick={() => setSelectedAspectRatio(ratio.value as any)}
                                className={`px-2 py-1 rounded-lg text-[8px] font-mono uppercase transition-all ${
                                  selectedAspectRatio === ratio.value 
                                    ? 'bg-[#00E0FF]/20 text-[#00E0FF] border border-[#00E0FF]/30' 
                                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {ratio.label}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => handleImageGen(selectedAspectRatio)}
                            disabled={genLoading || !imagePrompt.trim()}
                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                              hasPaidKey 
                              ? 'bg-[#00E0FF] text-black hover:bg-[#00E0FF]/80' 
                              : 'bg-white/10 text-white/40 hover:bg-white/20'
                            } disabled:opacity-50`}
                          >
                            {genLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {hasPaidKey ? 'Generate' : 'Key Required'}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#00E0FF]">
                          <Video size={16} />
                          <span className="text-xs font-mono uppercase tracking-widest">Video Motion</span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 p-4 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                              <Upload size={18} className="text-white/40" />
                              <span className="text-xs text-white/40 font-mono uppercase">
                                {analysisFile ? 'Image Loaded' : 'Upload Base Image'}
                              </span>
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                            {analysisFile && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                                <img src={analysisFile} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={videoPrompt}
                              onChange={(e) => setVideoPrompt(e.target.value)}
                              placeholder="Describe the motion..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                            />
                            <button
                              onClick={handleVideoGen}
                              disabled={genLoading || !videoPrompt.trim() || !analysisFile}
                              className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl font-bold transition-all ${
                                hasPaidKey 
                                ? 'bg-[#00E0FF] text-black hover:bg-[#00E0FF]/80' 
                                : 'bg-white/10 text-white/40 hover:bg-white/20'
                              } disabled:opacity-50`}
                            >
                              {genLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'edit' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-[#00E0FF]">
                        <Edit3 size={16} />
                        <span className="text-xs font-mono uppercase tracking-widest">Image Modification</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 p-8 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                              <Upload size={24} className="text-white/40" />
                              <span className="text-sm text-white/40 font-mono uppercase">
                                {analysisFile ? 'Image Loaded' : 'Upload Image to Edit'}
                              </span>
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                          </div>
                          {analysisFile && (
                            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                              <img src={analysisFile} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <textarea
                            value={imageEditPrompt}
                            onChange={(e) => setImageEditPrompt(e.target.value)}
                            placeholder="Describe the modifications (e.g., 'add a sunset', 'change the color to blue')..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm h-48 resize-none focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                          />
                          <button
                            onClick={handleEditImage}
                            disabled={genLoading || !imageEditPrompt.trim() || !analysisFile}
                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                              hasPaidKey 
                              ? 'bg-[#00E0FF] text-black hover:bg-[#00E0FF]/80' 
                              : 'bg-white/10 text-white/40 hover:bg-white/20'
                            } disabled:opacity-50`}
                          >
                            {genLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                            {hasPaidKey ? 'Apply Modifications' : 'Key Required'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'live' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#00E0FF]">
                          <Mic size={16} />
                          <span className="text-xs font-mono uppercase tracking-widest">Neural Link (Live Audio)</span>
                        </div>
                        {liveSession && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-green-400 font-mono uppercase">Connected</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
                        {liveTranscript.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-4 mt-20">
                            <Mic size={48} className="opacity-10" />
                            <p className="text-xs font-mono uppercase tracking-widest">Establish link to begin neural transmission</p>
                          </div>
                        ) : (
                          liveTranscript.map((line, i) => (
                            <div key={i} className={`text-xs font-mono leading-relaxed ${line.startsWith('AI:') ? 'text-[#00E0FF]' : 'text-white/60'}`}>
                              {line}
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={handleLiveAudio}
                        disabled={!hasPaidKey}
                        className={`w-full py-5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                          !hasPaidKey
                            ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                            : liveSession
                              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                              : 'bg-[#00E0FF] text-black hover:bg-[#00E0FF]/80 shadow-[0_0_30px_rgba(0,224,255,0.2)]'
                        }`}
                      >
                        {liveSession ? (
                          <>
                            <X size={18} />
                            TERMINATE LINK
                          </>
                        ) : (
                          <>
                            <Mic size={18} />
                            {hasPaidKey ? 'ESTABLISH NEURAL LINK' : 'PAID KEY REQUIRED'}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {aiLabTab === 'analyze' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-3 p-8 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group">
                      <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-[#00E0FF]/10 transition-colors">
                        <Upload size={32} className="text-white/40 group-hover:text-[#00E0FF]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white uppercase tracking-widest">Drop Media Here</p>
                        <p className="text-[10px] font-mono text-white/30 uppercase mt-1">Images or Videos for Analysis</p>
                      </div>
                      <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {analysisFile && (
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 relative group">
                        <img src={analysisFile} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setAnalysisFile(null)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={analysisInput}
                      onChange={(e) => setAnalysisInput(e.target.value)}
                      placeholder="What should I look for in this media?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                    />
                    <button
                      onClick={handleAnalysis}
                      disabled={analysisLoading || !analysisInput.trim() || !analysisFile}
                      className="absolute right-2 top-2 bottom-2 px-6 bg-[#00E0FF] text-black rounded-xl font-bold hover:bg-[#00E0FF]/80 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {analysisLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                      Analyze
                    </button>
                  </div>
                </div>
              )}

              {aiLabTab === 'maps' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-blue-500/10">
                      <MapPin size={32} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geospatial Grounding</h3>
                      <p className="text-xs text-white/50 leading-relaxed">Leverage Google Maps and Search data to find real-world locations, landmarks, and island points of interest with live grounding.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={mapsInput}
                        onChange={(e) => setMapsInput(e.target.value)}
                        placeholder="Search for island landmarks or locations..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-[#00E0FF]/50 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleMapsGrounding}
                        disabled={mapsLoading || !mapsInput.trim()}
                        className="py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {mapsLoading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                        Locate (Maps)
                      </button>
                      <button
                        onClick={handleSearchGrounding}
                        disabled={searchLoading || !mapsInput.trim()}
                        className="py-4 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {searchLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        Search (Web)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {aiLabTab === 'craft' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-amber-500/10">
                      <Zap size={32} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-widest">Neural Assembly</h3>
                      <p className="text-xs text-white/50 leading-relaxed">Combine raw materials and data shards to forge powerful artifacts and tools for your journey.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'ghost_anchor',
                        name: 'Ghost Anchor',
                        description: 'Spectral defense artifact.',
                        ingredients: [{ id: 'rusty_anchor', name: 'Rusty Anchor', count: 1 }, { id: 'neural_shard', name: 'Neural Shard', count: 1 }],
                        result: 'Ghost Anchor'
                      },
                      {
                        id: 'neural_compass',
                        name: 'Neural Compass',
                        description: 'Always points to the nearest data surge.',
                        ingredients: [{ id: 'broken_compass', name: 'Broken Compass', count: 1 }, { id: 'data_fragment', name: 'Data Fragment', count: 2 }],
                        result: 'Neural Compass'
                      }
                    ].map((recipe) => {
                      const hasIngredients = recipe.ingredients.every(ing => 
                        gameState.inventory.some((item: any) => item.id === ing.id)
                      );

                      return (
                        <div key={recipe.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white uppercase">{recipe.name}</h4>
                              <p className="text-[10px] text-white/40">{recipe.description}</p>
                            </div>
                            <span className="text-[8px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase">Recipe</span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[8px] font-mono uppercase text-white/20 tracking-widest">Required Components</p>
                            <div className="flex flex-wrap gap-2">
                              {recipe.ingredients.map((ing, idx) => {
                                const hasIng = gameState.inventory.some((item: any) => item.id === ing.id);
                                return (
                                  <div key={idx} className={`px-2 py-1 rounded-lg text-[8px] font-mono flex items-center gap-1 ${hasIng ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {ing.name} x{ing.count}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            disabled={!hasIngredients}
                            onClick={() => {
                              // Crafting logic would go here
                              const inventory = gameState.inventory || [];
                              const newInventory = inventory.filter((item: any) => 
                                !recipe.ingredients.some(ing => ing.id === item.id)
                              );
                              const craftedItem = {
                                id: recipe.id,
                                name: recipe.name,
                                description: recipe.description,
                                type: 'artifact',
                                rarity: 'rare'
                              };
                              setGameState((prev: any) => ({
                                ...prev,
                                inventory: [...newInventory, craftedItem],
                                history: [`CRAFTED: Successfully forged ${recipe.name}.`, ...prev.history]
                              }));
                            }}
                            className={`w-full py-2 rounded-xl text-[10px] font-mono uppercase transition-all ${
                              hasIngredients 
                              ? 'bg-amber-500 text-black hover:bg-amber-400 font-bold' 
                              : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                            }`}
                          >
                            {hasIngredients ? 'Assemble Neural Artifact' : 'Insufficient Materials'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: History & Stats */}
          <aside className="w-80 border-l border-white/5 bg-black/40 p-6 space-y-8 overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00E0FF]/60">
                <Activity size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Neural Stats</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Processing Power', value: '98.4%', color: '#00E0FF' },
                  { label: 'Neural Sync', value: 'Active', color: '#00FF00' },
                  { label: 'Data Grounding', value: 'Live', color: '#00FF00' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-white/40 uppercase">{stat.label}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00E0FF]/60">
                  <HistoryIcon size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Session History</span>
                </div>
                <button 
                  onClick={() => setGameState((prev: any) => ({ ...prev, aiResponses: [] }))}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {gameState.aiResponses.slice(-5).reverse().map((res: AIResponse) => (
                  <div key={res.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono uppercase text-[#00E0FF]/60">{res.type}</span>
                      <span className="text-[8px] font-mono text-white/20">{new Date(res.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] text-white/60 truncate">{res.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
      <audio ref={audioRef as any} className="hidden" />
    </div>
  );
};

export default AILab;
