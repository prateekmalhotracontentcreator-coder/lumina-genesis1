import React, { useState, useEffect } from 'react';
import { PrayerCard } from './types';

interface PrayerHistoryProps {
  history: PrayerCard[];
  onClose: () => void;
}

const PrayerHistory: React.FC<PrayerHistoryProps> = ({ history, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(history.length / itemsPerPage);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const flipTo = (next: number) => {
    if (next < 0 || next >= totalPages || isFlipping) return;
    setDirection(next > currentPage ? 'next' : 'prev');
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentPage(next);
    }, 300);

    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  const currentEntries = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const tornPageClass = "clip-torn-page relative flex-1 bg-[#dcc9a3] shadow-[inset_0_0_80px_rgba(75,50,0,0.3)] border-amber-900/10 transition-transform duration-700";

  return (
    <div className="fixed inset-0 z-[100] bg-[#020205]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4 overflow-hidden animate-in fade-in duration-1000">
      
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute w-1 h-1 bg-amber-200/40 rounded-full blur-[1px] animate-float-magic pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
          }}
        />
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-14 h-14 rounded-full glass border border-amber-500/20 flex items-center justify-center text-xl z-50 hover:bg-amber-500/10 hover:scale-110 transition-all text-amber-200/50 shadow-[0_0_20px_rgba(180,83,9,0.2)] active:scale-90"
      >
        ✕
      </button>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl serif font-bold text-amber-100 tracking-[0.15em] drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
          The Scribe's Revelation
        </h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <p className="text-[10px] text-amber-600/80 font-black tracking-[0.5em] uppercase">Sacred Archive VII</p>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>
      </div>

      <div className="relative w-full max-w-2xl aspect-[1.5/1] perspective-2500">
        <div className="absolute -inset-4 bg-[#1a0f08] rounded-[8px] shadow-[0_50px_150px_rgba(0,0,0,1),inset_0_0_80px_rgba(0,0,0,0.8)] border border-[#2d1b0f]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
              <div className="w-80 h-80 border-2 border-amber-500 rounded-full animate-spin-slow flex items-center justify-center">
                 <div className="w-64 h-64 border border-amber-500 rounded-full opacity-50" />
              </div>
            </div>
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-600/20 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-600/20 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-600/20 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-600/20 rounded-br-xl" />
        </div>

        <div className="absolute inset-0 flex preserve-3d">
          <div className={`${tornPageClass} rounded-l-[4px]`}>
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden p-10 font-serif text-3xl leading-relaxed text-amber-900 break-all italic">
               אבגדהוזחטיכלמנסעפצקרשת אבגדהוזחטיכלמנסעפצקרשת אבגדהוזחטיכלמנסעפצקרשת
            </div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-black/10 to-black/30 z-20" />
            
            <div className={`p-10 h-full flex flex-col justify-start relative z-10 transition-opacity duration-500 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}>
              {currentEntries[0] ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-amber-900/50 uppercase tracking-[0.2em] italic">
                      {new Date(currentEntries[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="h-px flex-1 bg-amber-900/10" />
                  </div>
                  <h4 className="serif font-bold text-amber-950 text-xl leading-tight mb-4 drop-shadow-sm">
                    <span className="text-4xl float-left mr-3 mt-1 leading-[0.8] text-amber-800 font-serif">{currentEntries[0].title[0]}</span>
                    {currentEntries[0].title.slice(1)}
                  </h4>
                  <div className="relative flex-1 overflow-hidden">
                    <p className="text-[13px] text-amber-900/80 leading-[1.7] font-serif italic line-clamp-[12]">
                      {currentEntries[0].content}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#dcc9a3] to-transparent pointer-events-none" />
                  </div>
                  {currentEntries[0].isAnswered && (
                    <div className="mt-4 pt-4 border-t border-amber-900/5 text-center">
                       <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.4em] drop-shadow-sm animate-pulse">✨ Manifested Grace ✨</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                  <div className="text-6xl mb-4">📜</div>
                  <span className="serif italic text-sm tracking-widest text-amber-900">Unwritten Vision</span>
                </div>
              )}
            </div>
          </div>

          <div className={`${tornPageClass} rounded-r-[4px]`}>
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden p-10 font-serif text-3xl leading-relaxed text-amber-900 break-all transform rotate-180 italic">
               אבגדהוזחטיכלמנסעפצקרשת אבגדהוזחטיכלמנסעפצקרשת אבגדהוזחטיכלמנסעפצקרשת
            </div>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-l from-transparent via-black/10 to-black/30 z-20" />

            <div className={`p-10 h-full flex flex-col justify-start relative z-10 transition-opacity duration-500 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}>
              {currentEntries[1] ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-amber-900/50 uppercase tracking-[0.2em] italic">
                      {new Date(currentEntries[1].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="h-px flex-1 bg-amber-900/10" />
                  </div>
                  <h4 className="serif font-bold text-amber-950 text-xl leading-tight mb-4 drop-shadow-sm">
                    <span className="text-4xl float-left mr-3 mt-1 leading-[0.8] text-amber-800 font-serif">{currentEntries[1].title[0]}</span>
                    {currentEntries[1].title.slice(1)}
                  </h4>
                  <div className="relative flex-1 overflow-hidden">
                    <p className="text-[13px] text-amber-900/80 leading-[1.7] font-serif italic line-clamp-[12]">
                      {currentEntries[1].content}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#dcc9a3] to-transparent pointer-events-none" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-900/10 text-center">
                    <span className="text-[9px] text-amber-900/40 font-bold uppercase tracking-[0.3em] italic">
                      Revelation {currentPage * itemsPerPage + 2}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                  <div className="text-6xl mb-4">✒️</div>
                  <span className="serif italic text-sm tracking-widest text-amber-900">Future Revelation</span>
                </div>
              )}
            </div>
          </div>

          {isFlipping && (
            <div 
              className={`absolute top-0 w-1/2 h-full bg-[#dcc9a3] clip-torn-page origin-left z-[100] transition-all duration-[700ms] ease-in-out ${
                direction === 'next' ? 'right-0 animate-flip-forward' : 'left-0 animate-flip-backward'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[#dcc9a3] shadow-inner" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-screen animate-shimmer-flare" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent mix-blend-multiply" />
            </div>
          )}
        </div>

        <div className="absolute -inset-x-28 top-1/2 -translate-y-1/2 flex justify-between z-[150] pointer-events-none">
          <button 
            onClick={() => flipTo(currentPage - 1)}
            disabled={currentPage === 0 || isFlipping}
            className="w-20 h-20 rounded-full glass border border-amber-500/20 flex items-center justify-center text-amber-100/40 hover:text-amber-100 hover:scale-110 disabled:opacity-0 transition-all pointer-events-auto bg-black/20 shadow-[0_0_30px_rgba(251,191,36,0.2)] active:scale-95"
          >
            <span className="text-3xl">❮</span>
          </button>
          <button 
            onClick={() => flipTo(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || isFlipping}
            className="w-20 h-20 rounded-full glass border border-amber-500/20 flex items-center justify-center text-amber-100/40 hover:text-amber-100 hover:scale-110 disabled:opacity-0 transition-all pointer-events-auto bg-black/20 shadow-[0_0_30px_rgba(251,191,36,0.2)] active:scale-95"
          >
            <span className="text-3xl">❯</span>
          </button>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-6 relative z-10">
        <div className="text-[12px] font-serif italic text-amber-100/40 tracking-[0.25em] uppercase">
          Tome Segment {currentPage + 1} of {totalPages}
        </div>
        <div className="flex gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-700 ${currentPage === i ? 'bg-amber-400 scale-150 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-white/10'}`} 
                />
            ))}
        </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-2500 { perspective: 2500px; }
        
        .clip-torn-page {
          clip-path: polygon(
            0% 2%, 3% 0%, 7% 3%, 12% 1%, 18% 4%, 23% 1%, 29% 2%, 34% 0%, 41% 3%, 47% 1%, 53% 4%, 59% 1%, 64% 2%, 71% 0%, 76% 3%, 82% 1%, 88% 4%, 94% 1%, 100% 3%,
            100% 97%, 96% 100%, 91% 96%, 86% 98%, 81% 96%, 76% 99%, 71% 96%, 66% 100%, 61% 97%, 56% 99%, 51% 96%, 46% 100%, 41% 97%, 36% 100%, 31% 96%, 26% 98%, 21% 96%, 16% 99%, 11% 96%, 6% 100%, 0% 97%
          );
        }
        
        @keyframes float-magic {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-150px) translateX(30px); opacity: 0; }
        }

        .animate-float-magic {
          animation: float-magic 6s infinite ease-out;
        }

        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 30s infinite linear;
        }

        @keyframes shimmer-flare {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
        }

        .animate-shimmer-flare {
          animation: shimmer-flare 0.8s ease-in-out forwards;
        }
        
        @keyframes flip-forward {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        
        @keyframes flip-backward {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }

        .animate-flip-forward {
          animation: flip-forward 0.7s ease-in-out forwards;
          transform-origin: left;
        }

        .animate-flip-backward {
          animation: flip-backward 0.7s ease-in-out forwards;
          transform-origin: right;
        }
      `}</style>
    </div>
  );
};

export default PrayerHistory;