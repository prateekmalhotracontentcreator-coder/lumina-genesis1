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
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Home', icon: '🏠' },
    { id: AppView.BIBLE, label: 'Bible', icon: '📖' },
    { id: AppView.MANIFEST, label: '21 Day Manifestation', icon: '🗓️' },
    { id: AppView.AI_PASTOR, label: 'Chat', icon: '💬' },
    { id: AppView.SHEKINAH_PORTAL, label: 'Portal', icon: '✨' },
    { id: AppView.COMMUNITY_HUB, label: 'Remnant', icon: '🌍' },
    { id: AppView.PRAYERS, label: 'Journal', icon: '🙏' },
  ];

  if (activeView === AppView.LANDING) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen relative text-white isolate overflow-x-hidden bg-[#0f1018]">
      {/* Exodus Green Grid Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:45px_45px]" />
      
      {/* Ambient Lighting */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-green-500/5 rounded-full blur-[120px] pointer-events-none -z-10 hidden md:block" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10 hidden md:block" />

      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-6 px-6 md:px-10 z-10 relative">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold serif tracking-tight text-white/90 text-glow-green">Lumina</h1>
          <span className="text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest text-green-500 opacity-80 -mt-1">{APP_CONFIG.edition}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block border-r border-white/10 pr-4 mr-1">
            <p className="text-[8px] font-black text-green-500/60 uppercase tracking-tighter">Resonance Score</p>
            <p className="text-sm font-bold leading-none">{user?.points || 0}</p>
          </div>
          <button 
            onClick={() => setActiveView(AppView.SETTINGS)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full glass border border-green-500/20 flex items-center justify-center overflow-hidden hover:border-green-500/50 transition-all shadow-xl group"
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

      {/* Bottom Navigation - Exodus Green Grid Aesthetic */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[96%] max-w-2xl glass border border-green-500/20 p-1.5 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/70 backdrop-blur-3xl ring-1 ring-green-500/10 rounded-3xl">
        <div className="flex justify-around items-center gap-0.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const isPortal = item.id === AppView.SHEKINAH_PORTAL;
            const isManifest = item.id === AppView.MANIFEST;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center p-1.5 min-w-[54px] rounded-2xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'bg-green-500/10 scale-105 text-white' 
                    : 'opacity-30 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                <span className={`text-xl md:text-2xl mb-0.5 group-hover:scale-110 transition-transform ${isActive ? 'text-glow-green text-green-400' : ''} ${isPortal ? 'text-2xl md:text-3xl' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-center whitespace-nowrap leading-none ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full shadow-lg ${isPortal ? 'bg-indigo-400 shadow-indigo-500/50' : 'bg-green-500 shadow-green-500/50'}`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;