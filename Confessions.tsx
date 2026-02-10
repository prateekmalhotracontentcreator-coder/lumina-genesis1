import React, { useState, useRef } from 'react';
import { generateConfession, generateSpeech } from './geminiService';
import { decodeBase64, decodeAudioData } from './audioUtils';

const CATEGORIES = [
  { id: 'healing', label: 'Physical Healing', icon: '🍷' },
  { id: 'finance', label: 'Prosperity & Debt', icon: '🪙' },
  { id: 'authority', label: 'Spiritual Authority', icon: '⚔️' },
  { id: 'peace', label: 'Mental Peace', icon: '🕊️' },
];

const Confessions: React.FC<{ userName: string }> = ({ userName }) => {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [confession, setConfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setConfession('');
    try {
      const text = await generateConfession(activeCat.label, userName);
      setConfession(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const speakConfession = async () => {
    if (!confession || isPlaying) return;
    setIsPlaying(true);
    try {
      const base64 = await generateSpeech(confession);
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, audioCtxRef.current, 24000, 1);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log("Releasing spiritual power through spoken word...");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="glass p-8 text-center bg-gradient-to-br from-amber-500/20 to-indigo-900/40">
        <h2 className="text-3xl serif font-bold mb-2">Voice of Faith</h2>
        <p className="text-sm text-white/60">"God's Creative Power will work for you if you release it through your words."</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCat(cat)}
            className={`glass p-4 text-center border transition-all ${activeCat.id === cat.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 opacity-60'}`}
          >
            <span className="text-2xl block mb-2">{cat.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-all disabled:opacity-50"
      >
        {loading ? 'Consulting the Word...' : 'Generate Scriptural Seed'}
      </button>

      {confession && (
        <div className="glass p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={speakConfession}
              className={`p-2 rounded-full glass border border-white/10 ${isPlaying ? 'animate-pulse text-indigo-400' : ''}`}
            >
              🔊
            </button>
          </div>
          <p className="text-xl serif italic text-white/90 leading-relaxed text-center">
            "{confession}"
          </p>
          
          <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Now, speak this over your life:</p>
            <button 
              onClick={handleMicToggle}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-2xl ${isRecording ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-amber-500 text-black hover:scale-105 shadow-amber-500/30'}`}
            >
              {isRecording ? '⏹' : '🎤'}
            </button>
            <span className="text-[9px] font-bold text-amber-500 animate-pulse">{isRecording ? 'RELEASING FAITH POWER' : 'TAP TO DECLARE'}</span>
          </div>
        </div>
      )}

      <div className="glass p-6 text-center italic text-[10px] text-white/30 space-y-2">
        <p>"Faith is the substance of things hoped for, the evidence of things not seen." — Hebrews 11:1</p>
        <p>Inspired by the teachings of Charles Capps.</p>
      </div>
    </div>
  );
};

export default Confessions;