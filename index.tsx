
import React, { ErrorInfo, ReactNode } from 'react';
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

/**
 * ErrorBoundary: Protects the sacred space of the Lumina Sanctuary.
 * Aligned to Shekinah Protocol (v0.5.1) - Stability Edition.
 */
// Fix: Explicitly using React.Component to ensure 'props' and 'state' are correctly inherited and recognized by the TypeScript compiler
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Shekinah Sanctuary technical fault detected:", error, errorInfo);
  }

  public render() {
    // Fix: Accessing 'this.state' which is correctly recognized due to explicit inheritance from React.Component
    if (this.state.hasError) {
      const error = this.state.error;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1018] text-white p-8 text-center font-serif relative overflow-hidden">
          {/* Exodus Green Grid background for the error state */}
          <div className="absolute inset-0 bg-green-500/5 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:45px_45px] pointer-events-none" />
          
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)] border border-green-500/20 relative z-10">
            <span className="text-4xl animate-pulse text-glow-green">✦</span>
          </div>
          
          <h1 className="text-3xl mb-4 font-bold tracking-tight text-green-100 relative z-10">Sanctuary Restoration</h1>
          <p className="opacity-50 mb-10 max-w-sm mx-auto text-sm font-sans leading-relaxed tracking-wide relative z-10">
            {error?.message || 'The Exodus resonance is being realigned. Please re-enter the light.'}
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-5 bg-white text-black rounded-full font-sans text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-50 transition-all shadow-2xl active:scale-95 border-b-4 border-green-600 relative z-10"
          >
            Reconnect to Sanctuary
          </button>
        </div>
      );
    }

    // Fix: Accessing 'this.props.children' which is correctly inherited from React.Component
    return this.props.children;
  }
}

// Global detection for production environment
const isProduction = window.location.hostname.endsWith('vercel.app') || 
                    window.location.hostname === 'lumina.genesis' || 
                    window.location.hostname === 'lumina.app';

/**
 * Resilient PWA Service Worker Registration
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hostname = window.location.hostname;
    const isSandboxed = hostname.includes('usercontent.goog') || 
                        hostname.includes('ai.studio') || 
                        hostname.includes('webcontainer.io');

    if (!isSandboxed && window.location.protocol === 'https:') {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Shekinah Protocol: Sanctuary Link Active', reg.scope))
        .catch(() => { /* suppressed in development */ });
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Sacred root element not found in DOM.');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      {isProduction && (
        <>
          <SpeedInsights route={window.location.hash || '/'} />
          <Analytics mode="production" />
        </>
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
