
import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, updateDoc } from './services/firebase';
import { UserProfile } from './types';

interface ManifestationPlanProps {
  user: UserProfile | null;
}

const ManifestationPlan: React.FC<ManifestationPlanProps> = ({ user }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  const prompts: Record<number, { title: string, content: string, verse: string }> = {
    1: { title: "The Power of Belief", content: "Identify three major areas where your current belief needs to align with God's unlimited promise.", verse: "Mark 11:24" },
    2: { title: "Walking in Faith", content: "Today, act as if the answer is already visible. How does your speech and posture change?", verse: "Hebrews 11:1" },
    3: { title: "Abundance Mentality", content: "List five ways God has shown His abundance in your life this week, breaking the spirit of lack.", verse: "Philippians 4:19" },
    4: { title: "The Pillar of Truth", content: "Declare your identity in Christ out loud. Focus on who He says you are, not what the world demands.", verse: "John 8:32" },
  };

  useEffect(() => {
    if (!user?.uid) return;
    
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const progress = data.manifestationProgress || [];
          setCompletedDays(progress);
          const nextDay = days.find(d => !progress.includes(d));
          if (nextDay) setCurrentDay(nextDay);
        }
      } catch (err) {
        console.error("Scroll Retrieval Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.uid]);

  const toggleComplete = async (day: number) => {
    if (!user?.uid) {
      alert("Please login to synchronize your Manifestation scrolls.");
      return;
    }
    
    const newCompleted = completedDays.includes(day)
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day];
    
    setCompletedDays(newCompleted);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { manifestationProgress: newCompleted });
    } catch (err) {
      console.error("Cloud Sync Failed:", err);
      setCompletedDays(completedDays);
    }
  };

  const dayData = prompts[currentDay] || prompts[1];

  return (
    <div className="space-y-10 pb-32 animate-enter relative">
      {/* 1. HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}></span>
          <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.4em]">
            {loading ? 'Consulting Scrolls...' : 'Exodus Resonance Synchronized'}
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl serif italic font-bold text-white tracking-tight text-glow-green leading-none">
          21 Day Manifestation
        </h2>
        <p className="text-xs md:text-sm text-white/40 font-serif italic max-w-md mx-auto leading-relaxed tracking-wider">
          Refining the divine blueprint through consistent faith, discipline, and the creative power of your words.
        </p>
      </div>

      {/* 2. THE GREEN GRID MATRIX */}
      <div className="relative glass p-6 md:p-10 border-green-500/20 bg-black/40 shadow-2xl rounded-[40px] overflow-hidden group perspective-grid">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-60" />
        
        <div className="grid grid-cols-7 gap-3 md:gap-5 relative z-10">
          {days.map(day => {
            const isSelected = currentDay === day;
            const isCompleted = completedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-[10px] md:text-xs font-black transition-all duration-500 relative group/btn border-2 ${
                  isSelected 
                    ? 'bg-green-500 text-black border-green-400 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.6)] z-20' 
                    : isCompleted
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'glass border-white/5 text-white/20 hover:border-green-500/30 hover:text-green-500/50'
                }`}
              >
                <span className="opacity-40 text-[8px] mb-0.5">DAY</span>
                <span className="text-sm md:text-xl font-black">{day}</span>
                
                {isCompleted && (
                  <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-[#0f1018] flex items-center justify-center shadow-lg transition-transform duration-500 z-30 ${isSelected ? 'bg-white' : 'bg-green-500 animate-in zoom-in'}`}>
                    <span className={`text-[10px] font-black ${isSelected ? 'text-green-600' : 'text-black'}`}>✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. THE DAILY SCROLL */}
      <div className="glass p-10 md:p-16 shadow-2xl space-y-10 relative overflow-hidden border-t-2 border-green-500/30 bg-gradient-to-br from-green-950/20 to-black/80 rounded-[40px]">
        <div className="absolute top-0 right-0 p-8 text-[12rem] md:text-[18rem] text-green-500/5 serif italic pointer-events-none font-black select-none leading-none -translate-y-1/4">
          {currentDay}
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em]">Current Protocol: Day {currentDay}</p>
            <h3 className="text-3xl md:text-5xl serif italic font-bold text-white leading-tight">
              {dayData.title}
            </h3>
          </div>
          
          <div className="bg-green-500/5 border-l-2 border-green-500/30 p-8 rounded-r-3xl backdrop-blur-md shadow-xl">
            <p className="text-xl md:text-2xl serif italic text-green-100 leading-relaxed font-light">
              "{dayData.verse}"
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Spiritual Intent</h4>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-serif italic max-w-3xl">
              {dayData.content}
            </p>
          </div>
        </div>

        <div className="space-y-6 relative z-10 pt-6 border-t border-white/5">
          <textarea 
            placeholder="Scribe your revelation here..."
            className="w-full h-48 bg-black/40 border border-green-500/10 rounded-[30px] p-8 text-base md:text-lg outline-none focus:border-green-500/40 text-white transition-all shadow-inner font-serif italic placeholder:opacity-20 leading-relaxed"
          />

          <button 
            onClick={() => toggleComplete(currentDay)}
            className={`w-full py-6 md:py-8 rounded-[25px] font-black text-[11px] md:text-[12px] uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-5 ${
              completedDays.includes(currentDay)
                ? 'bg-green-500/20 border border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                : 'bg-white text-black hover:bg-green-50 shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
            }`}
          >
            {completedDays.includes(currentDay) ? (
              <>
                <span className="text-2xl animate-pulse">✨</span>
                Cycle Established
              </>
            ) : (
              'Initialize Resonance'
            )}
          </button>
        </div>

        <div className="flex justify-between items-center px-4 pt-8 border-t border-white/5 opacity-40">
           <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Shekinah Protocol v0.5.0-STABLE</span>
           <span className="text-[9px] font-black uppercase tracking-widest">{completedDays.length} / 21 Cycles manifested</span>
        </div>
      </div>
    </div>
  );
};

export default ManifestationPlan;
