
import React, { useState } from 'react';

const TRACKS = [
  { id: 1, title: 'Still Waters', duration: '12:05', verse: 'Psalm 23', icon: '🌊' },
  { id: 2, title: 'The Creator\'s Rest', duration: '15:20', verse: 'Genesis 2', icon: '✨' },
  { id: 3, title: 'In the Hollow of His Hand', duration: '10:00', verse: 'Isaiah 49', icon: '🤲' },
];

const SleepMeditations: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div className="glass p-8 text-center bg-gradient-to-b from-blue-900/40 to-black/40 border-t border-blue-400/20">
        <div className="w-20 h-20 glass-dark rounded-full mx-auto mb-6 flex items-center justify-center text-4xl animate-pulse">🌙</div>
        <h2 className="text-2xl serif font-bold mb-2">Rest in the Word</h2>
        <p className="text-sm text-white/60">Biblically-centered stories to reduce anxiety and invite peaceful rest.</p>
      </div>

      <div className="space-y-4">
        {TRACKS.map(track => (
          <div 
            key={track.id} 
            onClick={() => setActiveTrack(track.id)}
            className={`glass p-5 cursor-pointer transition-all border ${
              activeTrack === track.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{track.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{track.title}</h4>
                <p className="text-[10px] text-white/40 mt-1">Based on {track.verse} • {track.duration}</p>
              </div>
              <button className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTrack === track.id ? 'bg-indigo-500 text-white' : 'bg-white/10'
              }`}>
                {activeTrack === track.id ? '⏸' : '▶'}
              </button>
            </div>
            
            {activeTrack === track.id && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-1/3 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SleepMeditations;
