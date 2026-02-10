
import React, { useState } from 'react';
import { generateAIPrayer } from './geminiService';

interface OccasionalPrayersProps {
  isPremium: boolean;
  onSubscribe: () => void;
  userName: string;
}

const STATIC_PRAYERS = [
  { 
    id: 'meal', 
    title: 'Grace Before Meals', 
    icon: '🍞',
    content: 'Bless us, O Lord, and these thy gifts, which we are about to receive from thy bounty, through Christ our Lord. Amen.'
  },
  { 
    id: 'morning', 
    title: 'Morning Offering', 
    icon: '☀️',
    content: 'O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys, and sufferings of this day for all the intentions of your Sacred Heart. Amen.'
  },
  { 
    id: 'family', 
    title: 'Family Unity', 
    icon: '👨‍👩‍👧',
    content: 'Lord, we thank you for the gift of family. Help us to love one another as you have loved us, with patience, kindness, and forgiveness. Amen.'
  },
  { 
    id: 'travel', 
    title: 'Traveler\'s Prayer', 
    icon: '🚗',
    content: 'O God, our heavenly Father, whose glory fills the whole creation, and whose presence we find wherever we go: Preserve those who travel; surround them with your loving care. Amen.'
  }
];

const OccasionalPrayers: React.FC<OccasionalPrayersProps> = ({ isPremium, onSubscribe, userName }) => {
  const [selected, setSelected] = useState(STATIC_PRAYERS[0]);
  const [personalizedPrayer, setPersonalizedPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [familyNames, setFamilyNames] = useState('');

  const handlePersonalize = async () => {
    if (!isPremium) {
      onSubscribe();
      return;
    }
    
    setIsGenerating(true);
    try {
      const prompt = `Adapt the traditional "${selected.title}" for a modern family sitting at the table. 
      Family Member Names: ${familyNames || 'the whole family'}. 
      Occasion context: ${selected.id}. 
      User Name: ${userName}. 
      Make it warm and personalized.`;
      
      const result = await generateAIPrayer(prompt);
      setPersonalizedPrayer(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass p-6 text-center">
        <h2 className="text-2xl serif font-bold">Occasional Prayers</h2>
        <p className="text-xs text-white/40 mt-1">Sacred words for everyday moments.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATIC_PRAYERS.map((p) => (
          <button 
            key={p.id}
            onClick={() => { setSelected(p); setPersonalizedPrayer(''); }}
            className={`glass p-4 text-center border transition-all ${
              selected.id === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 opacity-60'
            }`}
          >
            <span className="text-2xl block mb-2">{p.icon}</span>
            <span className="text-xs font-bold">{p.title}</span>
          </button>
        ))}
      </div>

      <div className="glass p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-3xl opacity-10">{selected.icon}</div>
        
        <h3 className="text-xl serif italic font-bold">{selected.title}</h3>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-white/80">
          {selected.content}
        </div>

        <div className="h-px w-full bg-white/10"></div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Personalize this Moment</h4>
            {!isPremium && <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">PREMIUM</span>}
          </div>
          
          <input 
            placeholder="Add names (e.g. John, Mary)..."
            value={familyNames}
            onChange={(e) => setFamilyNames(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30"
          />

          <button 
            onClick={handlePersonalize}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isPremium 
                ? 'bg-white text-black hover:bg-white/90' 
                : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black'
            }`}
          >
            {isGenerating ? 'Weaving Names into Prayer...' : 'Generate Personalized Blessing'}
          </button>
        </div>

        {personalizedPrayer && (
          <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap italic">
              {personalizedPrayer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OccasionalPrayers;
