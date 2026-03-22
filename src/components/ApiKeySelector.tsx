import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Shield, ExternalLink, CheckCircle2, AlertCircle, X } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface ApiKeySelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onKeySelected?: () => void;
}

export default function ApiKeySelector({ isOpen = true, onClose, onKeySelected }: ApiKeySelectorProps) {
  const [hasKey, setHasKey] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
      setChecking(false);
    };
    checkKey();
  }, []);

  const handleOpenSelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Assume success as per guidelines to avoid race conditions
      setHasKey(true);
      if (onKeySelected) onKeySelected();
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;
  if (hasKey && !onClose) return null; // If it's the initial mandatory check, hide if key exists

  if (checking) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#00E0FF] flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-[#00E0FF]/20 border-t-[#00E0FF] rounded-full animate-spin" />
          <p className="font-mono text-sm tracking-widest uppercase">Initializing Security Protocols...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#0A0A0A] border border-[#00E0FF]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,224,255,0.1)] relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00E0FF]/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E0FF]/10 flex items-center justify-center border border-[#00E0FF]/20">
                <Shield className="w-5 h-5 text-[#00E0FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Advanced AI Access</h2>
                <p className="text-[#00E0FF]/60 text-xs font-mono uppercase tracking-wider">Security Clearance Required</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/40" />
              </button>
            )}
          </div>

          <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
            <p>
              To access high-performance features like <span className="text-[#00E0FF]">Veo Video Generation</span> and <span className="text-[#00E0FF]">Advanced Image Synthesis</span>, you must provide a valid Gemini API key from a paid Google Cloud project.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00E0FF] mt-0.5 shrink-0" />
                <p>Enables 1080p Video Generation</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00E0FF] mt-0.5 shrink-0" />
                <p>Unlocks Pro-grade Image Analysis</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00E0FF] mt-0.5 shrink-0" />
                <p>Required for Real-time Voice Interaction</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-lg p-3 text-[#00E0FF]/80">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>Billing must be enabled on your Google Cloud project.</p>
            </div>

            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#00E0FF] hover:text-white transition-colors text-xs font-mono uppercase tracking-widest group"
            >
              View Billing Documentation
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={handleOpenSelector}
              className="w-full py-4 bg-[#00E0FF] text-black font-bold rounded-xl hover:bg-white transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,224,255,0.3)] flex items-center justify-center gap-3"
            >
              <Key className="w-5 h-5" />
              SELECT API KEY
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
