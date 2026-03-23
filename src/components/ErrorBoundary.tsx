import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

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
    error: null,
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
      let errorMessage = 'An unexpected error occurred.';
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.operationType && parsed.authInfo) {
            isFirestoreError = true;
            errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}.`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isFirestoreError ? 'A database permission or connection error occurred.' : 'The application encountered an error and needs to restart.'}
              </p>
            </div>

            <div className="bg-black/50 rounded-2xl p-4 text-left overflow-auto max-h-40 border border-zinc-800">
              <code className="text-xs text-red-400 break-all whitespace-pre-wrap">
                {errorMessage}
              </code>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
