import React, { useEffect, useState } from 'react';
import { AppView, UserProfile, DevotionalContent } from './types';
import { getDailyVerseInsights } from './services/geminiService';
import { db, doc, getDoc } from './services/firebase';
import { APP_CONFIG } from './constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState<DevotionalContent | null>(null);
  const [showDevotional, setShowDevotional] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manifestationProgress, setManifestationProgress] = useState<number[]>([]);
  
  const dailyVerse = {
    ref: "Joshua 1:8",
    text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night..."
  };

  useEffect(() => {
    setLoading(true);
    getDailyVerseInsights(dailyVerse.text)
      .then(res => setInsight(res))
      .catch(err => console.error("Shekinah Insight Error:", err))
      .finally(() => setLoading(false));

    if (profile.uid) {
      const userRef = doc(db, "users", profile.uid);
      getDoc(userRef).then(snap => {
        if (snap.exists()) {
          setManifestationProgress(snap.data().manifestationProgress || []);
        }
      });
    }
  }, [profile.uid]);

  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 pb-16 animate-enter">
      {/* 1. WELCOME HEADER */}
      <header className="px-2 flex justify-between items-end">
        <div className="relative">
          <h2 className="text-3xl md:text-5xl serif italic text-white/90 leading-tight tracking-tight">Peace be with you, {profile.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">LATTICE SYNCHRONIZATION ACTIVE</span>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{APP_CONFIG.codename}</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveView(AppView.ESTORE)}
          className="hidden md:flex items-center gap-3 glass px-5 py-2.5 border-indigo-500/20 hover:border-indigo-500/40 transition-all group"
        >
          <span className="text-xs font-black text-indigo-400 tracking-widest">{profile.points} RESONANCE</span>
          <span className="group-hover:rotate-12 transition-transform">✨</span>
        </button>
      </header>

      {/* 2. DAILY VERSE MEDITATION - INDIGO THEME */}
      <section className={`relative glass overflow-hidden border-t-2 border-indigo-500/30 shadow-2xl bg-gradient-to-br from-indigo-950/20 to-black/60 rounded-[40px] transition-all duration-700 ${showDevotional ? 'pb-16' : ''}`}>
        <div className="p-10 md:p-14 text-center space-y-8 relative z-10">
          <p className="text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.6em]">The Living Word</p>
          <h2 className="text-3xl md:text-6xl serif italic font-bold text-white text-glow-indigo leading-[1.15] max-w-5xl mx-auto">
            "{dailyVerse.text}"
          </h2>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-white/20"></div>
              <p className="text-sm md:text-xl font-black text-indigo-400 tracking-[0.4em] uppercase">{dailyVerse.ref}</p>
              <div className="h-px w-8 bg-white/20"></div>
            </div>

            {!showDevotional ? (
              <button 
                onClick={() => setShowDevotional(true)}
                className="mt-4 px-10 py-4 glass border-indigo-500/30 bg-indigo-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] active:scale-95 flex items-center gap-3 group"
              >
                <span>✨</span> Deepen Meditation <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ) : insight ? (
              <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700 pt-10 border-t border-white/5 text-left">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Revelation Context</h4>
                   <p className="text-lg md:text-xl text-white/80 font-serif italic leading-relaxed">{insight.opening}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {insight.pillars.map((pillar, idx) => (
                    <div key={idx} className="glass p-6 border-white/5 bg-white/5 space-y-3 group hover:border-indigo-500/30 transition-all">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-black">{idx + 1}</div>
                      <h5 className="text-xs font-black text-white uppercase tracking-widest">{pillar.title}</h5>
                      <p className="text-xs text-white/50 leading-relaxed font-serif italic">{pillar.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">The Prophetic Promise</h4>
                    <p className="text-base text-white/90 font-serif italic border-l-2 border-indigo-500/30 pl-4 py-2">{insight.promise}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Daily Application</h4>
                    <ul className="space-y-3">
                      {insight.application.map((item, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-xs text-white/60 font-serif italic">
                          <span className="text-indigo-500 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-3xl opacity-5 select-none group-hover:rotate-12 transition-transform">🕊️</div>
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Seal of Prayer</h4>
                  <p className="text-lg md:text-xl text-white/90 font-serif italic leading-relaxed max-w-2xl mx-auto">"{insight.prayer}"</p>
                </div>
                <div className="flex justify-center pt-4">
                  <button onClick={() => setShowDevotional(false)} className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-indigo-500 transition-colors">Close Meditation</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 3. PROPHETIC FLOW HERO - AMBER THEME */}
      <section 
        onClick={() => setActiveView(AppView.GLORY_SCROLL)}
        className="relative overflow-hidden glass p-10 md:p-14 border-t-2 border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-black/60 rounded-[40px] shadow-2xl group cursor-pointer hover:bg-amber-500/5 transition-all"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-500/10 flex items-center justify-center text-5xl md:text-6xl border border-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform duration-700">
             📜
          </div>
          <div className="text-center md:text-left space-y-3">
             <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
               <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
               <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Phase 3: Prophetic Flow</span>
             </div>
             <h3 className="text-3xl md:text-5xl serif italic font-bold text-white text-glow-amber tracking-tight">The Glory Scrolls</h3>
             <p className="text-sm md:text-lg text-white/50 max-w-xl italic font-serif leading-relaxed">
               Prophetic resonance tailored for your career, spiritual walk, and marketplace impact.
             </p>
             <div className="pt-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] group-hover:pl-2 transition-all">Receive Your Scroll →</span>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CORE TOOLS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
        {[
          { id: AppView.CONFESSIONS, label: 'Word of Faith', icon: '⚔️' },
          { id: AppView.SITUATION_SEARCH, label: 'Divine Insights', icon: '🎬' },
          { id: AppView.BIBLE_STRUCTURE, label: 'Scripture Map', icon: '🏗️' },
          { id: AppView.MEDIA_VAULT, label: 'Media Vault', icon: '🎨' },
        ].map((tool) => (
          <button 
            key={tool.id}
            onClick={() => setActiveView(tool.id)}
            className="glass p-6 flex flex-col items-center justify-center gap-3 text-center hover:bg-white/5 border-white/5 hover:border-indigo-500/20 transition-all group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{tool.icon}</div>
            <h4 className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-tight">{tool.label}</h4>
          </button>
        ))}
      </div>

      {/* 5. THE MANIFESTATION RESONANCE MATRIX */}
      <section 
        onClick={() => setActiveView(AppView.MANIFEST)}
        className="glass p-8 md:p-10 border-green-500/20 bg-green-950/10 shadow-2xl rounded-[40px] relative overflow-hidden group cursor-pointer hover:border-green-500/40 transition-all"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Active Cycle Progress</span>
            </div>
            <h3 className="text-3xl serif italic font-bold text-white tracking-tight">21 Day Manifestation</h3>
            <p className="text-sm text-white/40 font-serif italic max-w-sm">Consistency builds the altar of breakthrough.</p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => (
              <div 
                key={day} 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                  manifestationProgress.includes(day)
                    ? 'bg-green-500 border-green-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'bg-black/40 border-white/5 text-white/20'
                }`}
              >
                {manifestationProgress.includes(day) ? '✓' : day}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRIMARY ACCESS PORTALS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <section 
          onClick={() => setActiveView(AppView.SHEKINAH_PORTAL)}
          className="md:col-span-12 glass p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 group cursor-pointer border-indigo-500/20 hover:border-indigo-500/50 transition-all bg-indigo-950/10"
        >
          <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-4xl shadow-[0_0_60px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">✨</div>
          <div className="text-center md:text-left space-y-3">
            <h3 className="text-3xl serif font-bold text-white tracking-tight">Shekinah Portal</h3>
            <p className="text-lg text-white/50 max-w-2xl italic font-serif leading-relaxed">Enter the realm of voice intercession. Speak your heart, and the Sanctuary Guide will answer.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;