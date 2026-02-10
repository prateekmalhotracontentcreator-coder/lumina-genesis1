import React, { useState, useEffect } from 'react';
import { generateAIPrayer } from './geminiService';
import { PrayerCard } from './types';
import PrayerHistory from './PrayerHistory';

const PrayerWall: React.FC = () => {
  const [cards, setCards] = useState<PrayerCard[]>(() => {
    const saved = localStorage.getItem('lumina_prayers');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Family Health', content: 'Praying for healing for my mother.', timestamp: Date.now(), isAnswered: false, daysPrayed: 12, isPrivate: false },
      { id: '2', title: 'Marketplace Success', content: 'I declare that my business venture is established by God and no weapon formed against it shall prosper.', timestamp: Date.now() - 86400000, isAnswered: true, daysPrayed: 4, isPrivate: false }
    ];
  });
  
  const [newRequest, setNewRequest] = useState('');
  const [aiPrayer, setAiPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_prayers', JSON.stringify(cards));
  }, [cards]);

  const handleGenerateAI = async () => {
    if (!newRequest) return;
    setIsGenerating(true);
    try {
      const prayer = await generateAIPrayer(newRequest);
      setAiPrayer(prayer);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addCard = () => {
    if (!newRequest) return;
    const newCard: PrayerCard = {
      id: Math.random().toString(),
      title: newRequest.slice(0, 30),
      content: aiPrayer || newRequest,
      timestamp: Date.now(),
      isAnswered: false,
      daysPrayed: 1,
      isPrivate: false
    };
    setCards([newCard, ...cards]);
    setNewRequest('');
    setAiPrayer('');
  };

  return (
    <div className="space-y-8 relative">
      <button 
        onClick={() => setShowHistory(true)}
        className="fixed bottom-28 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 shadow-[0_10px_30px_rgba(180,83,9,0.5)] border-2 border-amber-300 flex items-center justify-center text-2xl z-40 hover:scale-110 active:scale-95 transition-all group"
        title="Open Sacred Archive"
      >
        <span className="group-hover:rotate-12 transition-transform">📖</span>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-[#1a1c2c] text-[10px] font-bold flex items-center justify-center">
          {cards.length}
        </div>
      </button>

      {showHistory && (
        <PrayerHistory 
          history={cards} 
          onClose={() => setShowHistory(false)} 
        />
      )}

      <div className="glass p-6 shadow-lg border-t border-white/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl serif font-bold">Prayer Generator</h3>
          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full uppercase">Creative Power</span>
        </div>
        
        <textarea
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="Enter your petition or marketplace vision..."
          className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-white/20 shadow-inner"
        />
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 shadow-xl transition-all"
          >
            {isGenerating ? 'Synthesizing...' : '✨ AI Compose'}
          </button>
          <button 
            onClick={addCard}
            className="flex-1 glass border-white/10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Archive Seed
          </button>
        </div>
        
        {aiPrayer && (
          <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-indigo-500/30 italic text-sm text-white/90 animate-in zoom-in-95 duration-500 relative">
            <div className="absolute -top-2 left-4 px-2 bg-[#1a1c2c] text-[8px] font-bold text-indigo-400">DIVINE DRAFT</div>
            {aiPrayer}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl serif font-bold px-2 flex items-center gap-2">
          <span>Active Declarations</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </h3>
        {cards.slice(0, 3).map(card => (
          <div key={card.id} className={`glass p-6 border-l-4 transition-all hover:bg-white/5 ${card.isAnswered ? 'border-green-500/40' : 'border-indigo-500/40'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-white/90">{card.title}</h4>
              <span className="text-[10px] text-white/40">{new Date(card.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-white/60 line-clamp-2 mb-4 italic leading-relaxed">"{card.content}"</p>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
              <div className="flex gap-4">
                <span className="text-amber-500/60">🔥 Strength: {card.daysPrayed}d</span>
                {card.isAnswered && <span className="text-green-400">✓ Realized</span>}
              </div>
              <button className="text-indigo-400 hover:text-indigo-300">Review →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerWall;