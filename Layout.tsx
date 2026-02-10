import React from 'react';
import { AppView, UserProfile } from './types';
import { APP_CONFIG } from './constants';

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
    { id: AppView.COMMUNITY_HUB, label: 'Remnant', icon: '🌍' },
    { id: AppView.PREMIUM_GUIDE, label: 'Spiritual', icon: '✨' },
    { id: AppView.PRAYERS, label: 'Journal', icon: '🙏' },
    { id: AppView.AI_PASTOR, label: 'Chat', icon: '💬' },
  ];

  if (activeView === AppView.LANDING) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen relative text-white isolate overflow-x-hidden">
      {/* EXPLICIT BACKGROUND LAYERS - Full Screen Coverage */}
      <div className="fixed inset-0 bg-[#0f1018] -z-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f1018] via-[#1a1c2c] to-[#0f1018] opacity-90 -z-10" />
      
      {/* Ambient Lighting Orbs for Desktop */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10 hidden md:block" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10 hidden md:block" />

      {/* Header Container - Responsive Width */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-6 px-6 md:px-10 z-10 relative">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold serif tracking-tight text-white/90">Lumina</h1>
          <span className="text-[8px] md:text-[10px] font-sans font-bold uppercase tracking-widest text-amber-500 opacity-80 -mt-1">{APP_CONFIG.edition}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block border-r border-white/10 pr-4 mr-1">
            <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-tighter">Devotion Points</p>
            <p className="text-sm font-bold leading-none">{user?.points || 0}</p>
          </div>
          <button 
            onClick={() => setActiveView(AppView.SETTINGS)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full glass border border-white/10 flex items-center justify-center overflow-hidden hover:border-amber-500/50 transition-all shadow-xl group"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Container - Responsive Column Logic */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 pb-32 pt-2 z-10 relative overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation - The Sacred Ribbon (Adaptive Island) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-xl glass border border-white/10 p-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/70 backdrop-blur-3xl ring-1 ring-white/5 md:rounded-3xl">
        <div className="flex justify-around items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center p-2 flex-1 rounded-2xl transition-all duration-300 relative group ${
                  isActive ? 'bg-white/10 scale-105 text-white' : 'opacity-30 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                <span className="text-xl md:text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center whitespace-nowrap leading-none">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
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