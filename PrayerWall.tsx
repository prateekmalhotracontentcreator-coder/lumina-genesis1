
import React, { useState } from 'react';
import { generateAIPrayer } from './geminiService';
import { PrayerCard } from './types';

const PrayerWall: React.FC = () => {
  const [cards, setCards] = useState<PrayerCard[]>([
    { id: '1', title: 'Family Health', content: 'Praying for healing for my mother.', timestamp: Date.now(), isAnswered: false, daysPrayed: 12, isPrivate: false },
    { id: '2', title: 'Guidance', content: 'Seeking wisdom for new job.', timestamp: Date.now() - 86400000, isAnswered: true, daysPrayed: 4, isPrivate: false }
  ]);
  const [newRequest, setNewRequest] = useState('');
  const [aiPrayer, setAiPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
      title: newRequest.slice(0, 20),
      content: aiPrayer || newRequest,
      timestamp: Date.now(),
      isAnswered: false,
      daysPrayed: 0,
      isPrivate: false
    };
    setCards([newCard, ...cards]);
    setNewRequest('');
    setAiPrayer('');
  };

  return (
    <div className="space-y-8">
      <div className="glass p-6 shadow-lg">
        <h3 className="text-xl serif font-bold mb-4">Prayer Generator</h3>
        <textarea
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="What's on your heart today?"
          className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:border-white/30 outline-none transition-all text-white"
        />
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 disabled:opacity-50"
          >
            {isGenerating ? 'Synthesizing...' : '✨ AI Compose'}
          </button>
          <button 
            onClick={addCard}
            className="flex-1 glass py-3 rounded-xl font-bold text-sm hover:bg-white/10"
          >
            Add to List
          </button>
        </div>
        
        {aiPrayer && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-sm text-white/80 animate-pulse">
            {aiPrayer}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl serif font-bold px-2">My Prayer Journal</h3>
        {cards.map(card => (
          <div key={card.id} className={`glass p-5 border-l-4 ${card.isAnswered ? 'border-green-500/50' : 'border-blue-500/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">{card.title}</h4>
              <span className="text-[10px] text-white/40">{new Date(card.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-white/70 line-clamp-3 mb-4">{card.content}</p>
            <div className="flex justify-between items-center text-[11px] font-medium text-white/40">
              <div className="flex gap-4">
                <span>🔥 {card.daysPrayed} days in prayer</span>
                {card.isAnswered && <span className="text-green-400">✓ Answered</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerWall;
