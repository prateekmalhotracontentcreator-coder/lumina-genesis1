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
  const [globalPulse, setGlobalPulse] = useState(14216);
  
  const dailyVerse = {
    ref: "Joshua 1:8",
    text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night..."
  };

  useEffect(() => {
    setLoading(true);
    getDailyVerseInsights(dailyVerse.text)
      .then(res => {
        // Validation: Ensure we are receiving an object, not a string or null
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
    <div className="space-y-8 pb-16 animate-enter">
      {/* 1. WELCOME HEADER & RESONANCE METER */}
      <header className="px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="relative">
          <h2 className="text-4xl md:text-6xl serif italic text-white/90 leading-tight tracking-tight">Peace, {profile.name.split(' ')[0]}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Lattice Online</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{APP_CONFIG.edition}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl w-full md:w-auto shadow-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Active Resonance</span>
            <span className="text-xl font-bold font-sans tracking-tighter text-glow-indigo">{profile.points}</span>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex gap-1 h-8 items-end">
             {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
               <div 
                 key={i} 
                 className="w-1.5 bg-indigo-500/40 rounded-full animate-bounce" 
                 style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '1.2s' }} 
               />
             ))}
          </div>
        </div>
      </header>

      {/* 2. PRIMARY ARCHITECTURAL TABS (User's Domain) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section 
          onClick={() => setActiveView(AppView.SYSTEM_COMMAND)}
          className="lg:col-span-2 glass p-8 border-green-500/20 bg-black/40 shadow-3xl rounded-[40px] relative overflow-hidden group cursor-pointer hover:border-green-500/50 transition-all"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Global Lattice Monitor</span>
                </div>
                <h3 className="text-2xl serif font-bold text-white tracking-tight">System Command</h3>
                <p className="text-xs text-white/40 max-w-sm italic">Access telemetry, relaltional maps, and Zion infrastructure protocols.</p>
             </div>
             <div className="text-right">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Network Pulse</p>
                <p className="text-3xl font-mono text-green-500 tabular-nums font-bold tracking-tighter">{globalPulse.toLocaleString()}</p>
             </div>
          </div>
        </section>

        <section 
          onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
          className="glass p-8 border-indigo-500/20 bg-indigo-950/10 shadow-2xl rounded-[40px] flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-indigo-500/5 transition-all"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌍</div>
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-tight">Remnant Community</h4>
          <p className="text-[10px] text-white/30 mt-2">Collective Intercession Bridge</p>
        </section>
      </div>

      {/* 3. CORE SPIRITUAL TOOLS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 px-1">
        {[
          { id: AppView.CONFESSIONS, label: 'Voice of Faith', icon: '⚔️' },
          { id: AppView.SITUATION_SEARCH, label: 'Divine Insights', icon: '🎬' },
          { id: AppView.KINGDOM_VISION, label: 'Kingdom Blueprint', icon: '🏗️' },
          { id: AppView.SCRIBES_PROTOCOL, label: 'Scribes Protocol', icon: '📜' },
        ].map((tool) => (
          <button 
            key={tool.id}
            onClick={() => setActiveView(tool.id)}
            className={`glass p-8 flex flex-col items-center justify-center gap-4 text-center transition-all group shadow-xl border-white/5 hover:border-white/20 hover:bg-white/5 rounded-[35px]`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all`}>
              {tool.icon}
            </div>
            <h4 className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-tight">{tool.label}</h4>
          </button>
        ))}
      </div>

      {/* 4. DAILY VERSE MEDITATION (RELIABLE RENDERER) */}
      <section className={`relative glass overflow-hidden border-t-2 border-indigo-500/30 shadow-2xl bg-gradient-to-br from-indigo-950/20 to-black/60 rounded-[45px] transition-all duration-700 ${showDevotional ? 'pb-16' : ''}`}>
        <div className="p-12 md:p-16 text-center space-y-8 relative z-10">
          <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.7em]">The Living Word</p>
          <h2 className="text-4xl md:text-7xl serif italic font-bold text-white text-glow-indigo leading-tight max-w-5xl mx-auto drop-shadow-2xl">
            "{dailyVerse.text}"
          </h2>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-10 bg-white/20"></div>
              <p className="text-sm md:text-2xl font-black text-indigo-400 tracking-[0.5em] uppercase">{dailyVerse.ref}</p>
              <div className="h-px w-10 bg-white/20"></div>
            </div>

            {!showDevotional ? (
              <button 
                onClick={() => setShowDevotional(true)}
                disabled={loading}
                className="mt-4 px-12 py-5 glass border-indigo-500/30 bg-indigo-500/5 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-indigo-500 hover:text-white transition-all shadow-3xl active:scale-95 flex items-center gap-4 group rounded-2xl disabled:opacity-50"
              >
                <span>{loading ? '⌛' : '✨'}</span> {loading ? 'Fetching Revelation...' : 'Deepen Revelation'}
              </button>
            ) : insight ? (
              <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-1000 pt-10 border-t border-white/5 text-left">
                {/* Properly mapping properties to fix Error #31 */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Contextual Revelation</h4>
                   <p className="text-xl md:text-2xl text-white/80 font-serif italic leading-relaxed">{insight.opening}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {insight.pillars && insight.pillars.map((pillar, idx) => (
                    <div key={idx} className="glass p-8 border-white/5 bg-white/5 space-y-4 group hover:border-indigo-500/30 transition-all rounded-3xl">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm font-black border border-indigo-500/20">{idx + 1}</div>
                      <h5 className="text-xs font-black text-white uppercase tracking-widest">{pillar.title}</h5>
                      <p className="text-sm text-white/50 leading-relaxed font-serif italic">{pillar.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Prophetic Promise</h4>
                    <p className="text-lg text-white/90 font-serif italic border-l-4 border-indigo-500/30 pl-6 py-3 bg-white/5 rounded-r-2xl shadow-xl">{insight.promise}</p>
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Dominion Steps</h4>
                    <ul className="space-y-4">
                      {insight.application && insight.application.map((item, idx) => (
                        <li key={idx} className="flex gap-4 items-start text-sm text-white/60 font-serif italic bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all">
                          <span className="text-indigo-500 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 text-center space-y-6 relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 p-6 text-5xl opacity-5 select-none group-hover:rotate-12 group-hover:scale-150 transition-all duration-1000">🕊️</div>
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">The Seal of Prayer</h4>
                  <p className="text-xl md:text-3xl text-white/90 font-serif italic leading-relaxed max-w-3xl mx-auto">"{insight.prayer}"</p>
                </div>

                <div className="flex justify-center pt-6">
                  <button onClick={() => setShowDevotional(false)} className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 hover:text-indigo-500 transition-all hover:tracking-[0.8em]">Close Altar</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 5. SECONDARY PORTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section 
          onClick={() => setActiveView(AppView.GLORY_SCROLL)}
          className="glass p-10 md:p-12 border-amber-500/20 bg-amber-950/10 shadow-2xl rounded-[45px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-all border-b-4 border-b-amber-500/30"
        >
          <div className="w-20 h-20 rounded-[25px] bg-white/5 flex items-center justify-center text-5xl mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl">📜</div>
          <h3 className="text-2xl serif font-bold text-white tracking-tight">The Glory Scrolls</h3>
          <p className="text-xs text-white/40 mt-3 font-serif italic leading-relaxed max-w-xs">Prophetic mandates generated for your specific marketplace assignment.</p>
        </section>

        <section 
          onClick={() => setActiveView(AppView.SHEKINAH_PORTAL)}
          className="glass p-10 md:p-12 border-indigo-500/20 bg-indigo-950/10 shadow-2xl rounded-[45px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-all border-b-4 border-b-indigo-500/30"
        >
          <div className="w-20 h-20 rounded-[25px] bg-white/5 flex items-center justify-center text-5xl mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-xl">✨</div>
          <h3 className="text-2xl serif font-bold text-white tracking-tight">Shekinah Portal</h3>
          <p className="text-xs text-white/40 mt-3 font-serif italic leading-relaxed max-w-xs">Speak your vision directly to the Sanctuary Guide in real-time resonance.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;