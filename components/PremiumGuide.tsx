
import React, { useState } from 'react';
import { generatePersonalizedPrayer, generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../services/audioUtils';

interface PremiumGuideProps {
  isPremium: boolean;
  onSubscribe: () => void;
}

const PremiumGuide: React.FC<PremiumGuideProps> = ({ isPremium, onSubscribe }) => {
  const [formData, setFormData] = useState({
    name: '',
    family: '',
    intendedFor: '',
    purpose: ''
  });
  const [prayer, setPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const handleGenerate = async () => {
    if (!formData.name || !formData.purpose) return;
    setIsGenerating(true);
    try {
      const result = await generatePersonalizedPrayer({
        userName: formData.name,
        familyDetails: formData.family,
        intendedFor: formData.intendedFor,
        purpose: formData.purpose
      });
      setPrayer(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleListen = async () => {
    if (!prayer) return;
    setIsPlaying(true);
    try {
      const base64 = await generateSpeech(prayer);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };

      source.start();
      
      // Simulate progress for UI
      const duration = buffer.duration;
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= duration) {
          clearInterval(interval);
        } else {
          setAudioProgress((elapsed / duration) * 100);
        }
      }, 100);

    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-dark min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-4xl shadow-2xl animate-pulse">
          ✨
        </div>
        <h2 className="text-3xl serif font-bold">Premium Spiritual Guide</h2>
        <p className="text-white/60 text-sm max-w-xs">
          Unlock personalized AI-generated prayers, audio meditations, and deep theological insights tailored to your life story.
        </p>
        <ul className="text-left text-xs space-y-3 text-white/80 py-4">
          <li className="flex items-center gap-2">✅ Deeply personalized audio prayers</li>
          <li className="flex items-center gap-2">✅ Priority access to the AI Chaplain</li>
          <li className="flex items-center gap-2">✅ Multi-voice guided meditations</li>
          <li className="flex items-center gap-2">✅ Detailed scripture deep-dives</li>
        </ul>
        <button 
          onClick={onSubscribe}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-2xl shadow-xl hover:scale-105 transition-all"
        >
          Subscribe for $4.99/mo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="glass p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✨</span>
          <h3 className="text-xl serif font-bold">Personalized Guide</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <input 
            placeholder="Your Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-white/30"
          />
          <input 
            placeholder="Family Details (e.g. spouse, children)"
            value={formData.family}
            onChange={e => setFormData({...formData, family: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-white/30"
          />
          <input 
            placeholder="Intended for (e.g. Myself, Brother Mark)"
            value={formData.intendedFor}
            onChange={e => setFormData({...formData, intendedFor: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-white/30"
          />
          <textarea 
            placeholder="Purpose of prayer (Healing, Guidance, Anxiety...)"
            value={formData.purpose}
            onChange={e => setFormData({...formData, purpose: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm h-24 outline-none focus:border-white/30"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {isGenerating ? 'Drafting Divine Words...' : 'Generate Personalized Prayer'}
        </button>
      </div>

      {prayer && (
        <div className="glass p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center">
            <h4 className="serif italic text-lg opacity-60">A Prayer for {formData.intendedFor || 'You'}</h4>
            <button 
              onClick={handleListen}
              disabled={isPlaying}
              className={`p-3 rounded-full transition-all ${
                isPlaying ? 'bg-indigo-500/50 scale-110 animate-pulse' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isPlaying ? '🔊' : '🎧 Listen'}
            </button>
          </div>
          
          {isPlaying && (
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-100" 
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          )}

          <div className="text-sm leading-relaxed space-y-4 text-white/90 whitespace-pre-wrap">
            {prayer}
          </div>
          
          <div className="pt-6 border-t border-white/10 flex gap-4">
            <button className="flex-1 glass py-3 text-xs font-bold hover:bg-white/10">Save to Journal</button>
            <button className="flex-1 glass py-3 text-xs font-bold hover:bg-white/10">Share</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumGuide;
