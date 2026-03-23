import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface EmailIntakeProps {
  source: string;
  variant?: 'default' | 'minimal' | 'memorial';
}

const EmailIntake = ({ source, variant = 'default' }: EmailIntakeProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      await addDoc(collection(db, 'leads'), {
        email: email.trim(),
        source: source,
        timestamp: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
      
      // Reset to idle after 5 seconds to allow another submission
      setTimeout(() => {
        if (status === 'success') setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting email:', error);
      setStatus('error');
      try {
        handleFirestoreError(error, OperationType.CREATE, 'leads');
      } catch (e: any) {
        setErrorMessage('Database error. Please try again later.');
      }
    }
  };

  const isMemorial = variant === 'memorial';

  return (
    <div className={`w-full max-w-md ${isMemorial ? 'mx-auto' : ''}`}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-[#00FF00]/10 border border-[#00FF00]/20 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#00FF00]/20 flex items-center justify-center text-[#00FF00]">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Connection Established</h4>
              <p className="text-[10px] font-mono text-[#00FF00]/60 uppercase tracking-widest">You're on the list. Expect updates soon.</p>
            </div>
            <button 
              onClick={() => setStatus('idle')}
              className="text-[9px] font-mono text-white/40 hover:text-white uppercase underline underline-offset-4 tracking-widest transition-colors"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form onSubmit={handleSubmit} className="relative group">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isMemorial ? 'text-[#00E0FF]/40' : 'text-white/20'}`} size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Join the Neural Network..."
                    className={`w-full bg-white/[0.02] border ${
                      status === 'error' 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : isMemorial ? 'border-[#00E0FF]/20 focus:border-[#00E0FF]/60' : 'border-white/10 focus:border-white/30'
                    } rounded-2xl py-4 pl-12 pr-4 text-sm font-mono focus:outline-none focus:bg-white/[0.04] transition-all`}
                    disabled={status === 'submitting'}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting' || !email.trim()}
                  className={`p-4 rounded-2xl transition-all flex items-center justify-center ${
                    isMemorial 
                      ? 'bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20' 
                      : 'bg-white text-black hover:bg-[#00E0FF] hover:text-black'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full mt-2 left-0 text-[10px] text-red-400 font-mono uppercase tracking-widest"
                  >
                    {errorMessage || 'Something went wrong. Try again.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
            <p className={`mt-4 text-[9px] font-mono uppercase tracking-[0.2em] ${isMemorial ? 'text-white/20' : 'text-white/10'}`}>
              Receive updates on the island's evolution.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailIntake;
