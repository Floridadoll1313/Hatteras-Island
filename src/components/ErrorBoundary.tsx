import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorDetails = null;
      try {
        if (this.state.error?.message) {
          errorDetails = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8 font-sans selection:bg-orange-500/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-white/5 border border-orange-500/20 rounded-[3rem] p-12 text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/10 blur-[100px] pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-10 group">
              <ShieldAlert className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>

            <h1 className="text-5xl font-bold text-white tracking-tighter uppercase italic mb-6">Neural Link Severed</h1>
            
            <div className="space-y-6 mb-12">
              <p className="text-orange-100/60 text-lg font-mono leading-relaxed">
                A critical anomaly has been detected in the Hatteras Island neural network. 
                The system has entered safe mode to prevent data corruption.
              </p>

              {errorDetails ? (
                <div className="p-6 bg-red-900/10 border border-red-900/20 rounded-2xl text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-sm font-bold text-red-400 uppercase italic tracking-widest">Protocol Error</h3>
                  </div>
                  <pre className="text-[10px] text-red-400/60 font-mono overflow-x-auto p-4 bg-black/40 rounded-xl whitespace-pre-wrap">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-6 bg-orange-900/10 border border-orange-900/20 rounded-2xl text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-bold text-orange-400 uppercase italic tracking-widest">Error Signature</h3>
                  </div>
                  <p className="text-xs text-orange-400/60 font-mono leading-relaxed">
                    {this.state.error?.message || 'Unknown system failure'}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-orange-600 text-white font-bold uppercase italic tracking-widest rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1 transition-all group"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Reboot System
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-white font-bold uppercase italic tracking-widest rounded-2xl hover:bg-white/10 transition-all"
              >
                <Home className="w-5 h-5" />
                Return Home
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-[10px] text-orange-400/30 font-mono uppercase tracking-[0.4em]">
                Hatteras Island • Outer Banks • OBX Odyssey
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
