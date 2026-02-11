import React, { useEffect, useState } from 'react';
import { AppView, UserProfile } from '../types';
import { getDailyVerseInsights } from '../services/geminiService';
import { APP_CONFIG } from '../constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState('Synthesizing daily illumination...');
  const dailyVerse = {
    ref: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want."
  };

  useEffect(() => {
    getDailyVerseInsights(dailyVerse.text)
      .then(setInsight)
      .catch(() => setInsight("Grace be with you in this sacred moment."));
  }, []);

  return (
    <div className="space-y-10 pb-16 animate-enter">
      {/* 1. WELCOME HEADER */}
      <header className="px-2 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="relative">
          <h2 className="text-3xl md:text-5xl serif italic text-white/90 leading-tight">Peace be with you, {profile.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-[10px] md:text-[12px] font-black text-amber-500 uppercase tracking-[0.4em]">{APP_CONFIG.edition}</p>
            <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black text-green-400 uppercase tracking-tighter">SACRED LINK: 100% RESONANCE</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Persistence</p>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="glass px-4 py-2 text-xs font-bold border-amber-500/20 shadow-lg tracking-widest text-glow-amber">🔥 12 CYCLES</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN GRID SYSTEM - DAILY ILLUMINATION IS HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* HERO: DAILY ILLUMINATION (ELEVATED) */}
        <section className="lg:col-span-12 relative overflow-hidden glass p-8 md:p-14 shadow-2xl border-t border-white/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 group">
          <div className="relative z-10 text-center">
            <p className="text-[9px] uppercase tracking-[0.5em] font-black text-amber-400/60 mb-8">Daily Illumination</p>
            <h2 className="text-4xl md:text-6xl serif italic mb-10 leading-tight group-hover:text-white transition-colors">"{dailyVerse.text}"</h2>
            <div className="flex flex-col items-center gap-6">
               <p className="text-base md:text-xl font-bold text-amber-400 tracking-[0.2em] uppercase">{dailyVerse.ref}</p>
               <div className="h-px w-24 bg-white/20"></div>
               <p className="text-base md:text-lg italic text-white/70 max-w-2xl leading-relaxed font-serif">
                {insight}
               </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        </section>

        {/* REWARDS: FAITH MARKETPLACE */}
        <section 
          onClick={() => setActiveView(AppView.ESTORE)}
          className="lg:col-span-12 glass p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-yellow-500/20 transition-all group shadow-2xl gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="text-5xl group-hover:scale-110 transition-transform">💰</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500 mb-1">Resonance Points</p>
              <p className="text-4xl font-black text-white">{profile.points}</p>
            </div>
          </div>
          <div className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] text-center rounded-full shadow-lg">Enter Faith Marketplace</div>
        </section>

        {/* MASONRY GRID: FEATURE MODULES */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <button 
            onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
            className="glass p-10 flex flex-col gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-blue-500 group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:scale-125 transition-transform">🌍</div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-4xl shadow-inner">🤝</div>
            <div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Community Hub</h4>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">Join the global remnant synchronized in intercession.</p>
            </div>
          </button>

          <div className="grid grid-cols-1 gap-6">
            <button 
              onClick={() => setActiveView(AppView.MANIFEST)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-indigo-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-3xl shadow-inner">🗓️</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">21-Day Manifestation</h4>
                <p className="text-[10px] text-white/40">Faith Realization Journey</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveView(AppView.BIBLE_STRUCTURE)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-amber-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl shadow-inner">🏛️</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Scripture Map</h4>
                <p className="text-[10px] text-white/40">The Architect of Truth</p>
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
                  <p className="text-[8px] text-white/40">Sacred Wallpapers & Alarms</p>
                </div>
              </div>
              <span className="text-white/20 group-hover:text-white transition-colors">➔</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;