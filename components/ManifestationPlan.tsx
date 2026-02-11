import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, updateDoc } from '../services/firebase';
import { UserProfile } from '../types';

interface ManifestationPlanProps {
  user: UserProfile | null;
}

const ManifestationPlan: React.FC<ManifestationPlanProps> = ({ user }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  const prompts: Record<number, { title: string, content: string, verse: string }> = {
    1: { title: "The Power of Belief", content: "Write down three things you are asking God for today, believing He has already provided them.", verse: "Mark 11:24" },
    2: { title: "Walking in Faith", content: "How would you act differently today if your biggest prayer was already answered?", verse: "Hebrews 11:1" },
    3: { title: "Abundance Mentality", content: "List five ways God has shown His abundance in your life this week.", verse: "Philippians 4:19" },
    4: { title: "Speaking the Word", content: "Identify a negative thought pattern and replace it with a scripture-based declaration.", verse: "Proverbs 18:21" },
    5: { title: "The Promised Land", content: "Write a detailed description of your vision as if it were a physical reality you are standing in.", verse: "Hebrews 11:8" },
  };

  // FETCH CLOUD PROGRESS: Synchronizing with the Sanctuary Database
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
          
          // Focus on the first uncompleted cycle
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
      alert("Please initialize your Sanctuary Link (Login) to sync your progress to the cloud.");
      return;
    }
    
    const newCompleted = completedDays.includes(day)
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day];
    
    // Optimistic Update
    setCompletedDays(newCompleted);
    
    // SYNC TO CLOUD
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { manifestationProgress: newCompleted });
    } catch (err) {
      console.error("Cloud Sync Failed:", err);
      setCompletedDays(completedDays); // Rollback
    }
  };

  const dayData = prompts[currentDay] || prompts[1];

  return (
    <div className="space-y-8 pb-32 animate-enter relative">
      {/* Tab Header with Cloud Resonance Status */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-4">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}></span>
          <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em]">
            {loading ? 'Retrieving Scrolls...' : 'Cloud Resonance Synchronized'}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl serif font-bold text-white tracking-tight text-glow-green uppercase">21 Day Manifestation</h2>
        <p className="text-sm text-white/40 mt-3 font-serif italic max-w-md mx-auto leading-relaxed tracking-wide">Refining the divine blueprint through discipline, faith, and persistence.</p>
      </div>

      {/* Grid Matrix with Green Ticks */}
      <div className="glass p-6 border-green-500/20 bg-black/40 shadow-2xl relative overflow-hidden group rounded-3xl">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none opacity-50" />
        
        <div className="grid grid-cols-7 gap-3 relative z-10">
          {days.map(day => {
            const isSelected = currentDay === day;
            const isCompleted = completedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-xs font-black transition-all duration-500 relative group/btn border ${
                  isSelected 
                    ? 'bg-green-500 text-black border-green-400 scale-110 shadow-[0_0_25px_rgba(34,197,94,0.5)] z-20' 
                    : isCompleted
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'glass border-white/5 text-white/20 hover:border-green-500/30 hover:text-green-500/50'
                }`}
              >
                <span className="text-[7px] opacity-40 mb-0.5">DAY</span>
                <span className="text-base">{day}</span>
                
                {/* THE GREEN TICK OF RESONANCE */}
                {isCompleted && (
                  <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-[#0f1018] flex items-center justify-center shadow-lg transition-transform duration-500 z-30 ${isSelected ? 'bg-white scale-110' : 'bg-green-500 animate-in zoom-in'}`}>
                    <span className={`text-[9px] font-black ${isSelected ? 'text-green-600' : 'text-black'}`}>✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scribe's Card */}
      <div className="glass p-10 md:p-12 shadow-2xl space-y-8 mt-4 relative overflow-hidden border-t-2 border-green-500/30 bg-gradient-to-br from-green-950/20 to-black/70 rounded-3xl">
        <div className="absolute top-0 right-0 p-8 text-9xl text-green-500/5 serif italic pointer-events-none font-black select-none">
          {currentDay}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em]">Current Protocol</span>
            <div className="h-px flex-1 bg-green-500/10"></div>
          </div>
          
          <h3 className="text-3xl md:text-4xl serif italic font-bold text-white mb-6 leading-tight">
            Day {currentDay}: <span className="text-green-100">{dayData.title}</span>
          </h3>
          
          <div className="bg-green-500/5 border-l-4 border-green-500/40 p-6 rounded-r-2xl mb-8 backdrop-blur-sm shadow-xl">
            <p className="text-xl serif italic text-green-400 leading-relaxed font-light">
              "{dayData.verse}"
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Spiritual Prompt</p>
            <p className="text-lg text-white/70 leading-relaxed font-serif">
              {dayData.content}
            </p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <textarea 
            placeholder="Journal your manifestation journey here..."
            className="w-full h-44 bg-black/40 border border-green-500/10 rounded-3xl p-6 text-sm outline-none focus:border-green-500/40 text-white transition-all shadow-inner font-serif placeholder:opacity-20"
          />

          <button 
            onClick={() => toggleComplete(currentDay)}
            className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${
              completedDays.includes(currentDay)
                ? 'bg-green-500/20 border border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                : 'bg-white text-black hover:bg-white/90 shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
            }`}
          >
            {completedDays.includes(currentDay) ? (
              <>
                <span className="text-xl animate-bounce">✓</span>
                RESONANCE ESTABLISHED
              </>
            ) : (
              'INITIALIZE DAY REFLECTION'
            )}
          </button>
        </div>

        <div className="flex justify-between items-center px-2 pt-6 border-t border-white/5 opacity-40">
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Exodus Protocol 0.3.5</span>
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">{completedDays.length} / 21 CYCLES COMPLETED</span>
        </div>
      </div>
    </div>
  );
};

export default ManifestationPlan;