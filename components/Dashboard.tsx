
import React, { useEffect, useState } from 'react';
import { AppView, UserProfile } from '../types';
import { getDailyVerseInsights } from '../services/geminiService';
import { APP_CONFIG } from '../constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState('Opening the heavenly archives...');
  const dailyVerse = {
    ref: "Joshua 1:8",
    text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night..."
  };

  useEffect(() => {
    getDailyVerseInsights(dailyVerse.text)
      .then(setInsight)
      .catch(() => setInsight("Meditate on the Word of God today for good success and divine prosperity."));
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
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">BIBLE FIRST PROTOCOL</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <div className="flex gap-4 mt-2 justify-end">
             <button 
              onClick={() => setActiveView(AppView.ESTORE)}
              className="glass px-4 py-2 text-[10px] font-bold border-amber-500/20 shadow-lg tracking-widest text-glow-amber group"
            >
              💰 <span className="group-hover:text-amber-400 transition-colors">{profile.points} POINTS</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. DAILY VERSE HERO (THE FOUNDATION) */}
      <section className="relative overflow-hidden glass p-10 md:p-16 shadow-2xl border-t border-amber-500/30 bg-gradient-to-br from-amber-900/10 to-indigo-900/10 group">
        <div className="relative z-10 text-center space-y-8">
          <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.5em]">The Living Word of the Day</p>
          <h2 className="text-3xl md:text-6xl serif italic font-bold text-white text-glow-amber leading-tight max-w-4xl mx-auto group-hover:scale-[1.01] transition-transform duration-700">
            "{dailyVerse.text}"
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="text-sm md:text-lg font-black text-amber-400 tracking-[0.3em] uppercase">{dailyVerse.ref}</p>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
          <p className="text-sm md:text-base text-white/60 font-serif italic max-w-2xl mx-auto leading-relaxed">
            {insight}
          </p>
        </div>
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </section>

      {/* 3. CORE SPIRITUAL TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* WORD OF FAITH (CONFESSIONS) */}
        <button 
          onClick={() => setActiveView(AppView.CONFESSIONS)}
          className="glass p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30 transition-all group shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">⚔️</div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Word of Faith</h4>
            <p className="text-[10px] text-white/40 mt-1">Scriptural Confessions.</p>
          </div>
        </button>

        {/* DIVINE INSIGHTS (SITUATION SEARCH) */}
        <button 
          onClick={() => setActiveView(AppView.SITUATION_SEARCH)}
          className="glass p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30 transition-all group shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🎬</div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Divine Insights</h4>
            <p className="text-[10px] text-white/40 mt-1">Scripture Simulations.</p>
          </div>
        </button>

        {/* SCRIPTURE MAP (BIBLE STRUCTURE) */}
        <button 
          onClick={() => setActiveView(AppView.BIBLE_STRUCTURE)}
          className="glass p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/30 transition-all group shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🏗️</div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Scripture Map</h4>
            <p className="text-[10px] text-white/40 mt-1">Biblical Structure.</p>
          </div>
        </button>

        {/* MEDIA VAULT */}
        <button 
          onClick={() => setActiveView(AppView.MEDIA_VAULT)}
          className="glass p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-purple-500/5 border-purple-500/10 hover:border-purple-500/30 transition-all group shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🎨</div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Media Vault</h4>
            <p className="text-[10px] text-white/40 mt-1">Visual Sanctuary.</p>
          </div>
        </button>
      </div>

      {/* 4. SECONDARY SECTION (SHEKINAH PORTAL & MANIFESTATION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SHEKINAH PORTAL (Presence Entry) */}
        <section 
          onClick={() => setActiveView(AppView.SHEKINAH_PORTAL)}
          className="lg:col-span-8 relative overflow-hidden glass p-8 md:p-12 shadow-2xl border-t border-indigo-500/30 bg-black/40 group cursor-pointer hover:bg-indigo-500/5 transition-all"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">✨</div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl serif font-bold text-white mb-2">Shekinah Portal</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-md">Experience voice-integrated spiritual resonance. Speak, and the Sanctuary answers with biblical wisdom and presence.</p>
            </div>
          </div>
        </section>

        {/* MANIFESTATION QUICK-LINK */}
        <section 
          onClick={() => setActiveView(AppView.MANIFEST)}
          className="lg:col-span-4 relative overflow-hidden glass p-8 shadow-2xl border-t border-green-500/30 bg-green-500/5 group cursor-pointer hover:bg-green-500/10 transition-all flex flex-col items-center justify-center"
        >
          <div className="text-3xl mb-3">🗓️</div>
          <h4 className="text-sm font-black text-white uppercase tracking-widest">21 Day Cycles</h4>
          <p className="text-[10px] text-white/40 mt-1">Consistent Manifestation.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
