import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from './App';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { 
    hasError: false, 
    error: null 
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lumina Sanctuary Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1018] text-white p-6 text-center font-serif">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <span className="text-3xl animate-pulse">✨</span>
          </div>
          <h1 className="text-2xl mb-4 font-bold tracking-tight text-glow-amber text-amber-100">The Sanctuary is Refreshing</h1>
          <p className="opacity-60 mb-8 max-w-md mx-auto text-xs font-sans leading-relaxed tracking-wide">
            {this.state.error?.message || 'A spiritual resonance update is in progress. Please re-enter the light.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white text-black rounded-full font-sans text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-50 transition-all shadow-2xl active:scale-95"
          >
            Reconnect
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <SpeedInsights />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>
);