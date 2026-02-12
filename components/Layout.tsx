import React from 'react';
import { AppView, UserProfile } from '../types';
import { APP_CONFIG } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  user?: UserProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, user }) => {
  const isManifestTab = activeView === AppView.MANIFEST;
  
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Home', icon: '🏠' },
    { id: AppView.BIBLE, label: 'Bible', icon: '📖' },
    { id: AppView.SHEKINAH_PORTAL, label: 'Portal', icon: '✨' },
    { id: AppView.MANIFEST, label: '21 Day Manifestation', icon: '🗓️' },
    { id: AppView.COMMUNITY_HUB, label: 'Remnant', icon: '🌍' },
    { id: AppView.PRAYERS, label: 'Journal', icon: '🙏' },
  ];

  if (activeView === AppView.LANDING) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen relative text-white isolate overflow-x-hidden bg-[#0f1018]">
      {/* THEMATIC GRID SYSTEM */}
      <div className={`fixed inset-0 pointer-events-none -z-10 transition-colors duration-1000 ${
        isManifestTab 
          ? 'bg-[linear-gradient(rgba(34,197,94,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.06)_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]'
      } bg-[size:45px_45px]`} />
      
      {/* Ambient Lighting */}
      <div className={`fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none -z-10 hidden md:block transition-colors duration-1000 ${isManifestTab ? 'bg-green-500/5' : 'bg-indigo-500/5'}`} />
      <div className="fixed bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10 hidden md:block" />

      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-6 px-6 md:px-10 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-1 relative group cursor-pointer" onClick={() => setActiveView(AppView.DASHBOARD)}>
            <span className="text-base md:text-lg text-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] z-20 transition-transform group-hover:scale-110">✦</span>
            <span className="text-2xl md:text-3xl text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.4)] z-10 transition-transform group-hover:-translate-y-1">✨</span>
          </div>

          <div className="flex flex-col">
            <h1 className={`text-2xl md:text-3xl font-bold serif tracking-tight transition-all duration-700 ${isManifestTab ? 'text-glow-green text-white' : 'text-glow-indigo text-white'}`}>
              Lumina
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          {/* ARCHITECT STATUS ORB - Primary Dev Portal */}
          <button 
            onClick={() => setActiveView(AppView.SYSTEM_COMMAND)}
            className="flex items-center gap-3 glass px-3 py-1.5 border-green-500/20 hover:border-green-500/50 transition-all group"
          >
            <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Lattice Health</span>
               <span className="text-[9px] font-mono text-white/40">GENESIS-01</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse group-hover:scale-125 transition-transform" />
          </button>

          <button 
            onClick={() => setActiveView(AppView.SETTINGS)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full glass border flex items-center justify-center overflow-hidden transition-all shadow-xl group ${isManifestTab ? 'border-green-500/20 hover:border-green-500/50' : 'border-indigo-500/20 hover:border-indigo-500/50'}`}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 pb-40 pt-2 z-10 relative overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Stability Metadata Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-1 px-4 flex justify-between items-center z-[60] bg-black/40 backdrop-blur-md border-t border-white/5 pointer-events-none">
        <div className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">
          Build: {APP_CONFIG.buildTag} // DR: {APP_CONFIG.fallbackRef}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[7px] font-black uppercase tracking-[0.4em] text-green-500/40">Sanctuary Health: {APP_CONFIG.sanctuaryHealth}%</div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl glass border p-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/70 backdrop-blur-3xl ring-1 rounded-3xl transition-all duration-1000 ${
        isManifestTab ? 'border-green-500/20 ring-green-500/10' : 'border-indigo-500/20 ring-indigo-500/10'
      }`}>
        <div className="flex justify-around items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const isPortal = item.id === AppView.SHEKINAH_PORTAL;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center p-1.5 flex-1 rounded-2xl transition-all duration-300 relative group ${
                  isActive 
                    ? isManifestTab ? 'bg-green-500/10 scale-105 text-white' : 'bg-indigo-500/10 scale-105 text-white'
                    : 'opacity-30 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                <span className={`text-xl md:text-2xl mb-0.5 group-hover:scale-110 transition-transform ${isPortal ? 'text-2xl md:text-3xl' : ''} ${
                  isActive 
                    ? item.id === AppView.MANIFEST ? 'text-glow-green text-green-400' : 'text-glow-indigo text-indigo-400' 
                    : ''
                }`}>
                  {item.icon}
                </span>
                <span className={`text-[6px] md:text-[8px] font-black uppercase tracking-tighter text-center whitespace-nowrap leading-none ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;