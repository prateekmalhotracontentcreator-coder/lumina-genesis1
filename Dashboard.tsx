import React, { useEffect, useState } from 'react';
import { AppView, UserProfile } from './types';
import { getDailyVerseInsights } from './geminiService';
import { APP_CONFIG } from './constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState('Generating daily insight...');
  const dailyVerse = {
    ref: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want."
  };

  useEffect(() => {
    getDailyVerseInsights(dailyVerse.text)
      .then(setInsight)
      .catch(() => setInsight("Grace be with you today."));
  }, []);

  return (
    <div className="space-y-10 pb-16 animate-enter">
      {/* 1. WELCOME HEADER */}
      <header className="px-2 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="relative">
          <h2 className="text-3xl md:text-4xl serif italic text-white/90 leading-tight">Welcome home, {profile.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-[10px] md:text-[12px] font-black text-amber-500 uppercase tracking-[0.4em]">{APP_CONFIG.edition}</p>
            {/* DIVINE SYNC SEAL */}
            <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black text-green-400 uppercase tracking-tighter">{APP_CONFIG.sanctuaryHealth}% DIVINE SYNC</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Active Spiritual Streaks</p>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="glass px-4 py-2 text-xs font-bold border-amber-500/20 shadow-lg">🔥 12 Days</div>
            <div className="glass px-4 py-2 text-xs font-bold border-indigo-500/20 shadow-lg">📖 48 Chapters</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LARGE FEATURE: VERSE HERO */}
        <section className="lg:col-span-8 relative overflow-hidden glass p-8 md:p-12 shadow-2xl border-t border-white/30 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 group">
          <div className="relative z-10 text-center lg:text-left">
            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-amber-400/60 mb-8">Verse of the Day</p>
            <h2 className="text-3xl md:text-5xl serif italic mb-6 leading-tight group-hover:text-white transition-colors">"{dailyVerse.text}"</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
               <p className="text-sm md:text-base font-bold text-amber-400">{dailyVerse.ref}</p>
               <div className="hidden lg:block h-px w-12 bg-white/20"></div>
               <p className="text-sm md:text-base italic text-white/70 max-w-lg leading-relaxed font-serif">
                {insight}
               </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
        </section>

        {/* SIDEBAR WIDGET: REWARDS */}
        <section 
          onClick={() => setActiveView(AppView.ESTORE)}
          className="lg:col-span-4 glass p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex flex-col justify-center items-center h-full cursor-pointer hover:bg-yellow-500/20 transition-all group shadow-2xl"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-1">Devotion Points</p>
          <p className="text-4xl font-black text-white">{profile.points}</p>
          <div className="mt-6 w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest text-center rounded-full">Enter Store</div>
        </section>

        {/* 3. RESPONSIVE MASONRY GRID */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* COMMUNITY (Island) */}
          <button 
            onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
            className="glass p-8 flex flex-col gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-blue-500 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:rotate-12 transition-transform">🌍</div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-4xl shadow-inner">🤝</div>
            <div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Remnant Community</h4>
              <p className="text-xs text-white/50 mt-1">14,204 believers are interceding right now.</p>
            </div>
            <div className="flex -space-x-3 mt-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1c2c] bg-indigo-500 flex items-center justify-center text-[10px] font-bold shadow-md">U{i}</div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#1a1c2c] bg-gray-800 flex items-center justify-center text-[8px] font-bold">+9</div>
            </div>
          </button>

          {/* SPIRITUAL PATHS GRID */}
          <div className="grid grid-cols-1 gap-6">
            <button 
              onClick={() => setActiveView(AppView.MANIFEST)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-indigo-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-3xl shadow-inner">🗓️</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">21-Day Manifestation</h4>
                <p className="text-[10px] text-white/40">Faith-based word transformation.</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveView(AppView.MEDITATION)}
              className="glass p-6 flex items-center gap-6 text-left hover:bg-white/10 transition-all border-l-4 border-purple-500 group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-3xl shadow-inner">🧘</div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Sleep Meditations</h4>
                <p className="text-[10px] text-white/40">Find rest in the secret place.</p>
              </div>
            </button>
          </div>

          {/* THE ORACLE ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
             <button 
              onClick={() => setActiveView(AppView.CONFESSIONS)}
              className="glass p-6 bg-gradient-to-br from-amber-600/20 to-amber-900/20 border-amber-500/30 flex flex-col items-center justify-center gap-3 text-center active:scale-[0.98] transition-all group shadow-xl"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">🎤</span>
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-tight">Voice of<br/>Faith</p>
            </button>

            <button 
              onClick={() => setActiveView(AppView.SITUATION_SEARCH)}
              className="glass p-6 bg-gradient-to-br from-blue-600/20 to-indigo-900/20 border-blue-500/30 flex flex-col items-center justify-center gap-3 text-center active:scale-[0.98] transition-all group shadow-xl"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">🌈</span>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-tight">Divine<br/>Motivation</p>
            </button>

            <button 
              onClick={() => setActiveView(AppView.MEDIA_VAULT)}
              className="col-span-2 glass p-6 flex items-center justify-between hover:bg-white/5 transition-all group"
            >
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

        </div>
      </div>

      {/* 4. SACRED ACADEMY */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 flex items-center gap-3">
          <span>Sacred Academy</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button onClick={() => setActiveView(AppView.TRIVIA)} className="glass p-6 flex flex-col items-center gap-3 hover:bg-indigo-500/10 transition-all group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">🏆</span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Trivia</span>
          </button>
          <button onClick={() => setActiveView(AppView.CALENDAR)} className="glass p-6 flex flex-col items-center gap-3 hover:bg-indigo-500/10 transition-all group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">📅</span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Calendar</span>
          </button>
          <button onClick={() => setActiveView(AppView.BIBLE_STRUCTURE)} className="glass p-6 flex flex-col items-center gap-3 hover:bg-indigo-500/10 transition-all group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">🏗️</span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Structure</span>
          </button>
          <button onClick={() => setActiveView(AppView.OCCASIONAL_PRAYERS)} className="hidden md:flex glass p-6 flex flex-col items-center gap-3 hover:bg-indigo-500/10 transition-all group col-span-2 md:col-span-1">
            <span className="text-3xl group-hover:rotate-12 transition-transform">🙏</span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Prayers</span>
          </button>
          <button onClick={() => setActiveView(AppView.SETTINGS)} className="hidden lg:flex glass p-6 flex flex-col items-center gap-3 hover:bg-indigo-500/10 transition-all group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">📜</span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Berean</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;