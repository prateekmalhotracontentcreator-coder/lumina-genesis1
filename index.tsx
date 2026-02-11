
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

/**
 * ErrorBoundary: Protects the sacred space of the Lumina Sanctuary.
 */
class ErrorBoundary extends Component<Props, State> {
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
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1018] text-white p-8 text-center font-serif relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 bg-[linear-gradient(rgba(251,191,36,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(251,191,36,0.2)] border border-amber-500/20">
            <span className="text-4xl animate-pulse">✨</span>
          </div>
          <h1 className="text-3xl mb-4 font-bold tracking-tight text-amber-100">Sanctuary Restoration</h1>
          <p className="opacity-50 mb-10 max-w-sm mx-auto text-sm font-sans leading-relaxed tracking-wide">
            {this.state.error?.message || 'The manifest glory is being realigned. Please re-enter the light.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-5 bg-white text-black rounded-full font-sans text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-50 transition-all shadow-2xl active:scale-95 border-b-4 border-amber-600"
          >
            Reconnect to Lumina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global detection for production environment
const isProduction = window.location.hostname.endsWith('vercel.app') || window.location.hostname === 'lumina.genesis';

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
        .catch(() => { /* suppressed */ });
    } else {
      console.log('Sanctuary Link Status: Sandbox Mode. (Shekinah PWA Sync Deferred)');
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
