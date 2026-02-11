
import React, { useEffect, useState } from 'react';
import { AppView, UserProfile } from './types';
import { getDailyVerseInsights } from './geminiService';
import { APP_CONFIG } from './constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState('Manifesting daily illumination...');
  const dailyVerse = {
    ref: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want."
  };

  useEffect(() => {
    getDailyVerseInsights(dailyVerse.text)
      .then(setInsight)
      .catch(() => setInsight("Grace and glory be with you in this manifest season."));
  }, []);

  return (
    <div className="space-y-10 pb-16 animate-enter">
      {/* 1. WELCOME HEADER */}
      <header className="px-2 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="relative">
          <h2 className="text-3xl md:text-5xl serif italic text-white/90 leading-tight">Glory to God, {profile.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-[10px] md:text-[12px] font-black text-amber-500 uppercase tracking-[0.4em]">{APP_CONFIG.edition}</p>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">SHEKINAH RESONANCE: ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Divine Presence</p>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="glass px-4 py-2 text-xs font-bold border-amber-500/20 shadow-lg tracking-widest text-glow-amber">✨ PHASE 3</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* HERO: SHEKINAH PORTAL (PHASE 3 DESTINATION) */}
        <section 
          onClick={() => setActiveView(AppView.SHEKINAH_PORTAL)}
          className="lg:col-span-12 relative overflow-hidden glass p-8 md:p-14 shadow-2xl border-t border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-indigo-900/40 group cursor-pointer hover:scale-[1.01] transition-all"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-500/30">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em]">Phase 3: Shekinah Protocol</span>
              </div>
              <h2 className="text-4xl md:text-6xl serif font-bold text-white text-glow-amber">The Manifest Glory</h2>
              <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">Experience voice-integrated spiritual resonance. Speak, and the Sanctuary answers with biblical wisdom and manifest peace.</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform">✨</div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.5em] animate-pulse">Enter The Glory</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        </section>

        {/* DAILY ILLUMINATION */}
        <section className="lg:col-span-8 relative overflow-hidden glass p-8 md:p-12 shadow-2xl border-t border-green-500/30 bg-black/40 group">
          <div className="relative z-10 text-center lg:text-left">
            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-green-400/60 mb-8">Daily Illumination</p>
            <h2 className="text-3xl md:text-5xl serif italic mb-6 leading-tight group-hover:text-white transition-colors">"{dailyVerse.text}"</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
               <p className="text-sm md:text-base font-bold text-green-400 tracking-widest">{dailyVerse.ref}</p>
               <div className="hidden lg:block h-px w-12 bg-white/20"></div>
               <p className="text-sm md:text-base italic text-white/70 max-w-lg leading-relaxed font-serif">
                {insight}
               </p>
            </div>
          </div>
        </section>

        {/* REWARDS */}
        <section 
          onClick={() => setActiveView(AppView.ESTORE)}
          className="lg:col-span-4 glass p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex flex-col justify-center items-center h-full cursor-pointer hover:bg-yellow-500/20 transition-all group shadow-2xl"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-1">Resonance Points</p>
          <p className="text-4xl font-black text-white">{profile.points}</p>
          <div className="mt-6 w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest text-center rounded-full">Enter Marketplace</div>
        </section>

        {/* MASONRY GRID */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 gap-6">
            <button 
              onClick={() => setActiveView(AppView.MANIFEST)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-amber-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl shadow-inner">🗓️</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">21-Day Manifestation</h4>
                <p className="text-[10px] text-white/40">Established Cycles.</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveView(AppView.BIBLE)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-indigo-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-3xl shadow-inner">📖</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Sacred Scrolls</h4>
                <p className="text-[10px] text-white/40">The Living Word.</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => setActiveView(AppView.CONFESSIONS)} className="glass p-6 bg-amber-600/20 border-amber-500/30 flex flex-col items-center justify-center gap-3 text-center transition-all group shadow-xl">
              <span className="text-3xl group-hover:scale-125 transition-transform">⚔️</span>
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-tight">Word of Faith</p>
            </button>
            <button onClick={() => setActiveView(AppView.SITUATION_SEARCH)} className="glass p-6 bg-blue-600/20 border-blue-500/30 flex flex-col items-center justify-center gap-3 text-center transition-all group shadow-xl">
              <span className="text-3xl group-hover:scale-125 transition-transform">🎬</span>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-tight">Divine Insights</p>
            </button>
            <button onClick={() => setActiveView(AppView.MEDIA_VAULT)} className="col-span-2 glass p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🎨</span>
                <div className="text-left">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Media Vault</p>
                  <p className="text-[8px] text-white/40">Wallpapers & Alarms</p>
                </div>
              </div>
              <span className="text-white/20 group-hover:text-white transition-colors">➔</span>
            </button>
          </div>
          
          <button 
            onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
            className="glass p-8 flex flex-col justify-center gap-4 text-center hover:bg-white/5 transition-all group border-amber-500/10"
          >
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">The Remnant Bridge</p>
            <h4 className="text-xl serif font-bold">Community Hub</h4>
            <div className="h-px w-8 bg-amber-500/20 mx-auto"></div>
            <p className="text-[10px] italic text-white/40">Synchronized intercession.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
