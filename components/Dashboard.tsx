import React, { useEffect, useState } from 'react';
import { AppView, UserProfile, DevotionalContent } from '../types';
import { getDailyVerseInsights } from '../services/geminiService';
import { APP_CONFIG } from '../constants';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, profile }) => {
  const [insight, setInsight] = useState<DevotionalContent | null>(null);
  const [showDevotional, setShowDevotional] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalPulse, setGlobalPulse] = useState(14216);
  
  const dailyVerse = {
    ref: "Joshua 1:8",
    text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night..."
  };

  useEffect(() => {
    setLoading(true);
    getDailyVerseInsights(dailyVerse.text)
      .then(res => {
        if (res && typeof res === 'object') {
          setInsight(res as unknown as DevotionalContent);
        }
      })
      .catch(err => console.error("Shekinah Insight Error:", err))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      setGlobalPulse(prev => prev + (Math.random() > 0.6 ? 1 : -1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 pb-16 animate-enter">
      
      {/* 1. WELCOME HEADER & RESONANCE (PROMOTED TO TOP) */}
      <header className="px-2 flex flex-col md:flex-row md:justify-between md:items-end gap-6 pt-4">
        <div className="relative">
          <h2 className="text-4xl md:text-6xl serif italic text-white/90 leading-tight tracking-tight">Peace, {profile.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-2 mt-3">
            <p className="text-[10px] md:text-[12px] font-black text-green-500 uppercase tracking-[0.4em]">{APP_CONFIG.edition}</p>
            <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">LATTICE ACTIVE</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-[35px] w-full md:w-auto shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Active Resonance</span>
            <span className="text-2xl font-bold font-sans tracking-tighter text-glow-indigo">{profile.points}</span>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex gap-1.5 h-10 items-end">
             {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
               <div 
                 key={i} 
                 className="w-2 bg-indigo-500/40 rounded-full animate-bounce" 
                 style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '1.2s' }} 
               />
             ))}
          </div>
        </div>
      </header>

      {/* 2. DAILY VERSE MEDITATION */}
      <section className={`relative glass overflow-hidden border-t-2 border-indigo-500/30 shadow-3xl bg-gradient-to-br from-indigo-950/20 to-black/80 rounded-[50px] transition-all duration-700 ${showDevotional ? 'pb-16' : ''}`}>
        <div className="p-12 md:p-20 text-center space-y-10 relative z-10">
          <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.7em]">The Living Word</p>
          <h2 className="text-4xl md:text-8xl serif italic font-bold text-white text-glow-indigo leading-tight max-w-5xl mx-auto drop-shadow-2xl">
            "{dailyVerse.text}"
          </h2>
          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center justify-center gap-8">
              <div className="h-px w-16 bg-white/20"></div>
              <p className="text-sm md:text-3xl font-black text-indigo-400 tracking-[0.5em] uppercase">{dailyVerse.ref}</p>
              <div className="h-px w-16 bg-white/20"></div>
            </div>

            {!showDevotional ? (
              <button 
                onClick={() => setShowDevotional(true)}
                disabled={loading}
                className="mt-4 px-16 py-7 bg-white text-black text-[12px] font-black uppercase rounded-full tracking-[0.5em] hover:bg-indigo-50 transition-all shadow-3xl active:scale-95 flex items-center gap-5 group border-b-4 border-indigo-600"
              >
                <span>{loading ? '⌛' : '✨'}</span> {loading ? 'FETCHING REVELATION...' : 'DEEPEN REVELATION'}
              </button>
            ) : insight ? (
              <div className="w-full max-w-5xl mx-auto space-y-16 animate-in fade-in zoom-in-95 duration-1000 pt-16 border-t border-white/5 text-left">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Contextual Revelation</h4>
                   <p className="text-2xl md:text-3xl text-white/90 font-serif italic leading-relaxed">{insight.opening}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {insight.pillars && insight.pillars.map((pillar, idx) => (
                    <div key={idx} className="glass p-10 border-white/10 bg-white/5 space-y-5 group hover:border-indigo-500/30 transition-all rounded-[35px]">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-lg font-black border border-indigo-500/20">{idx + 1}</div>
                      <h5 className="text-sm font-black text-white uppercase tracking-widest">{pillar.title}</h5>
                      <p className="text-base text-white/50 leading-relaxed font-serif italic">{pillar.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Prophetic Promise</h4>
                    <p className="text-xl text-white/95 font-serif italic border-l-4 border-indigo-500/30 pl-8 py-5 bg-white/5 rounded-r-3xl shadow-2xl leading-relaxed">{insight.promise}</p>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Dominion Steps</h4>
                    <ul className="space-y-5">
                      {insight.application && insight.application.map((item, idx) => (
                        <li key={idx} className="flex gap-5 items-start text-base text-white/70 font-serif italic bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
                          <span className="text-indigo-500 text-xl font-bold mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-950/20 p-16 rounded-[60px] border border-indigo-500/20 text-center space-y-8 relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 p-10 text-9xl opacity-5 select-none group-hover:rotate-12 group-hover:scale-150 transition-all duration-1000">🕊️</div>
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em]">The Seal of Prayer</h4>
                  <p className="text-2xl md:text-5xl text-white/95 font-serif italic leading-tight max-w-4xl mx-auto drop-shadow-lg">"{insight.prayer}"</p>
                </div>

                <div className="flex justify-center pt-10">
                  <button onClick={() => setShowDevotional(false)} className="text-[11px] font-black uppercase tracking-[0.8em] text-white/30 hover:text-indigo-500 transition-all">CLOSE ALTAR</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 3. PRIMARY ARCHITECTURAL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1">
        <section 
          onClick={() => setActiveView(AppView.SCRIBES_PROTOCOL)}
          className="lg:col-span-2 glass p-10 border-amber-500/20 bg-amber-950/5 shadow-3xl rounded-[45px] relative overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-all"
        >
          <div className="absolute top-0 right-0 p-8 text-9xl text-amber-500/5 font-black serif italic pointer-events-none group-hover:scale-110 transition-transform duration-1000">SCRIBES</div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Protocol Active</span>
                </div>
                <h3 className="text-3xl serif font-bold text-white tracking-tight leading-none">Scribe's Protocol</h3>
                <p className="text-sm text-white/40 max-w-sm italic">Access sacred documentation and Zion Lattice architectural blueprints.</p>
             </div>
             <div className="text-center md:text-right bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Archive Health</p>
                <p className="text-4xl font-mono text-amber-500 tabular-nums font-bold tracking-tighter drop-shadow-lg">100%</p>
             </div>
          </div>
        </section>

        <section 
          onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
          className="glass p-10 border-indigo-500/20 bg-indigo-950/10 shadow-2xl rounded-[45px] flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-indigo-500/5 transition-all border-b-4 border-b-indigo-500/40"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">🌍</div>
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-tight mb-2">Remnant Community</h4>
          <p className="text-xs text-white/30 italic">Global Intercession Bridge</p>
          <div className="mt-4 flex -space-x-2">
             {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full border border-black bg-indigo-900 flex items-center justify-center text-[8px] font-black">👤</div>)}
             <div className="w-6 h-6 rounded-full border border-black bg-indigo-600 flex items-center justify-center text-[8px] font-black">+</div>
          </div>
        </section>
      </div>

      {/* 4. CORE SPIRITUAL TOOLS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { id: AppView.CONFESSIONS, label: 'Voice of Faith', icon: '⚔️' },
          { id: AppView.SITUATION_SEARCH, label: 'Divine Insights', icon: '🎬' },
          { id: AppView.KINGDOM_VISION, label: 'Kingdom Mandate', icon: '🏗️' },
          { id: AppView.SYSTEM_COMMAND, label: 'Architect Console', icon: '⚙️' },
        ].map((tool) => (
          <button 
            key={tool.id}
            onClick={() => setActiveView(tool.id)}
            className={`glass p-10 flex flex-col items-center justify-center gap-5 text-center hover:bg-white/5 border-white/5 hover:border-white/20 transition-all group shadow-xl rounded-[40px]`}
          >
            <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all`}>
              {tool.icon}
            </div>
            <h4 className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-tight">{tool.label}</h4>
          </button>
        ))}
      </div>

      {/* 5. SECONDARY PORTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section 
          onClick={() => setActiveView(AppView.GLORY_SCROLL)}
          className="glass p-12 md:p-16 border-amber-500/20 bg-amber-950/10 shadow-2xl rounded-[50px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-all border-b-8 border-b-amber-500/40"
        >
          <div className="w-24 h-24 rounded-[35px] bg-white/5 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl">📜</div>
          <h3 className="text-3xl serif font-bold text-white tracking-tight">The Glory Scrolls</h3>
          <p className="text-sm text-white/40 mt-4 font-serif italic leading-relaxed max-w-xs">AI Prophetic mandates generated for your specific marketplace assignment.</p>
        </section>

        <section 
          onClick={() => setActiveView(AppView.SHEKINAH_PORTAL)}
          className="glass p-12 md:p-16 border-indigo-500/20 bg-indigo-950/10 shadow-2xl rounded-[50px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-all border-b-8 border-b-indigo-500/40"
        >
          <div className="w-24 h-24 rounded-[35px] bg-white/5 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-2xl">✨</div>
          <h3 className="text-3xl serif font-bold text-white tracking-tight">Shekinah Portal</h3>
          <p className="text-sm text-white/40 mt-4 font-serif italic leading-relaxed max-w-xs">Speak your vision directly to the Sanctuary Guide in real-time resonance.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;