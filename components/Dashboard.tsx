
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { getDailyVerseInsights } from '../services/geminiService';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
  points: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, points }) => {
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

  const occasions = [
    { label: 'Meals', icon: '🍞' },
    { label: 'Morning', icon: '☀️' },
    { label: 'Family', icon: '👨‍👩‍👧' },
    { label: 'Travel', icon: '🚗' },
    { label: 'Bedtime', icon: '🛌' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Daily Verse Hero */}
      <section className="relative overflow-hidden glass p-8 shadow-2xl border-t border-white/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
        <div className="relative z-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-4">Verse of the Day</p>
          <h2 className="text-3xl serif italic mb-4">"{dailyVerse.text}"</h2>
          <p className="text-sm font-bold opacity-80 mb-6">{dailyVerse.ref}</p>
          <div className="h-px w-12 bg-white/20 mx-auto mb-6"></div>
          <p className="text-sm italic text-white/60 max-w-xs mx-auto leading-relaxed">
            {insight}
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Voice of Faith Confessions (Charles Capps focus) */}
      <section 
        onClick={() => setActiveView(AppView.CONFESSIONS)}
        className="glass p-6 bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-amber-500/30 flex justify-between items-center cursor-pointer hover:bg-amber-600/30 transition-all shadow-lg border-l-4 border-amber-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl shadow-inner">🎤</div>
          <div>
            <h4 className="text-base font-bold text-white">Voice of Faith</h4>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Confessions & Declarations</p>
          </div>
        </div>
        <span className="text-amber-400 font-bold text-xs">DECLARE →</span>
      </section>

      {/* Community Hub Access */}
      <section 
        onClick={() => setActiveView(AppView.COMMUNITY_HUB)}
        className="glass p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 flex justify-between items-center cursor-pointer hover:bg-blue-600/30 transition-all shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-inner">🤝</div>
          <div>
            <h4 className="text-base font-bold text-white">Community Hub</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">14k Praying Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#1a1c2c] flex items-center justify-center text-[10px] font-bold">SJ</div>
            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#1a1c2c] flex items-center justify-center text-[10px] font-bold">MK</div>
            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#1a1c2c] flex items-center justify-center text-[8px] font-bold text-white">+9</div>
          </div>
          <span className="text-white/40 text-xs ml-2">➔</span>
        </div>
      </section>

      {/* Berean scholars tool */}
      <section 
        onClick={() => setActiveView(AppView.SETTINGS)} // Redirect to specific scholar view later
        className="glass p-6 border-indigo-500/20 bg-indigo-500/5 flex justify-between items-center cursor-pointer hover:bg-indigo-500/10 transition-all border-l-4 border-indigo-500"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📜</span>
          <div>
            <h4 className="text-sm font-bold text-white">The Berean scholar</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Verify Claims & Modern Views</p>
          </div>
        </div>
        <span className="text-indigo-400 font-bold text-[10px]">VERIFY</span>
      </section>

      {/* Situation Motivator Search */}
      <section 
        onClick={() => setActiveView(AppView.SITUATION_SEARCH)}
        className="glass p-6 border-indigo-500/20 bg-indigo-500/5 flex justify-between items-center cursor-pointer hover:bg-indigo-500/10 transition-all border-l-4 border-indigo-500"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌈</span>
          <div>
            <h4 className="text-sm font-bold text-white">Divine Motivation</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Keyword Situation Search</p>
          </div>
        </div>
        <span className="text-indigo-400 font-bold text-[10px]">EXPLORE</span>
      </section>

      {/* Reward Points Quick Glance */}
      <section 
        onClick={() => setActiveView(AppView.ESTORE)}
        className="glass p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex justify-between items-center cursor-pointer hover:bg-yellow-500/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Devotion Points</p>
            <p className="text-lg font-bold text-white">{points}</p>
          </div>
        </div>
        <button className="text-[10px] font-bold bg-white text-black px-3 py-1 rounded-full">ESTORE</button>
      </section>

      {/* Occasions Horizontal Scroll */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-2 flex justify-between">
          <span>Prayers for Occasions</span>
          <button onClick={() => setActiveView(AppView.OCCASIONAL_PRAYERS)} className="text-blue-400 hover:text-blue-300 transition-colors">View All</button>
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {occasions.map((occ, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveView(AppView.OCCASIONAL_PRAYERS)}
              className="flex-shrink-0 w-24 h-24 glass flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all border-white/10"
            >
              <span className="text-2xl">{occ.icon}</span>
              <span className="text-[10px] font-bold text-white">{occ.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
