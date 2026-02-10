
import React, { useState } from 'react';

const ManifestationPlan: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([1]);

  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  const prompts: Record<number, { title: string, content: string, verse: string }> = {
    1: { title: "The Power of Belief", content: "Write down three things you are asking God for today, believing He has already provided them.", verse: "Mark 11:24" },
    2: { title: "Walking in Faith", content: "How would you act differently today if your biggest prayer was already answered?", verse: "Hebrews 11:1" },
    3: { title: "Abundance Mentality", content: "List five ways God has shown His abundance in your life this week.", verse: "Philippians 4:19" },
  };

  const toggleComplete = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  const dayData = prompts[currentDay] || prompts[1];

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl serif font-bold text-white">21-Day Manifestation</h2>
        <p className="text-xs text-white/40 mt-1">Transforming your life through faith.</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
              currentDay === day 
                ? 'bg-white text-black scale-110' 
                : completedDays.includes(day)
                  ? 'bg-blue-500/30 text-white border border-blue-500/50'
                  : 'glass border-white/5 text-white/40'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="glass p-8 shadow-xl space-y-6 mt-8 relative overflow-hidden">
        <div>
          <h3 className="text-xl serif italic mb-2 text-white">Day {currentDay}: {dayData.title}</h3>
          <p className="text-sm text-white/70 italic border-l-2 border-white/10 pl-4 mb-6">"{dayData.verse}"</p>
          <div className="space-y-4">
            <p className="text-sm font-medium text-white/90">Today's Prompt:</p>
            <p className="text-sm text-white/60 leading-relaxed">{dayData.content}</p>
          </div>
        </div>
        <textarea 
          placeholder="Journal your manifestation here..."
          className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm outline-none text-white focus:border-white/30"
        />
        <button 
          onClick={() => toggleComplete(currentDay)}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
            completedDays.includes(currentDay)
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {completedDays.includes(currentDay) ? '✓ Day Completed' : 'Complete Day Reflection'}
        </button>
      </div>
    </div>
  );
};

export default ManifestationPlan;
