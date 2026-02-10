
import React from 'react';

const EVENTS = [
  { date: '2025-04-20', title: 'Easter Sunday', category: 'Holy Day' },
  { date: '2025-05-29', title: 'Ascension Day', category: 'Feast' },
  { date: '2025-06-08', title: 'Pentecost', category: 'Solemnity' },
  { date: '2025-08-15', title: 'Assumption Day', category: 'Feast' },
];

const ChristianCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h2 className="text-2xl serif font-bold mb-2">Liturgical Year</h2>
        <p className="text-xs text-white/40">Tracking sacred rhythms.</p>
      </div>
      <div className="space-y-3">
        {EVENTS.map((ev, i) => (
          <div key={i} className="glass p-4 flex items-center gap-4">
            <div className="w-12 h-12 glass-dark rounded-xl flex flex-col items-center justify-center border border-white/10">
              <span className="text-[10px] font-bold uppercase opacity-40">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
              <span className="text-lg font-bold">{new Date(ev.date).getDate()}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{ev.title}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{ev.category}</p>
            </div>
            <button className="text-xs p-2 glass rounded-lg">🔔</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChristianCalendar;
