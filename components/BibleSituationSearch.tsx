
import React, { useState } from 'react';
import { getSituationMotivation, generateInstanceVideo } from '../services/geminiService';
import { SituationResult } from '../types';

const MARKETPLACE_CATEGORIES = [
  { label: 'Entrepreneurship', icon: '💼', q: 'Success in a new business venture' },
  { label: 'Marketplace Integrity', icon: '⚖️', q: 'Maintaining biblical ethics at work' },
  { label: 'Career Transition', icon: '🚀', q: 'Seeking a new career path' },
  { label: 'Financial Freedom', icon: '🔓', q: 'Breaking the cycle of debt' },
];

const BibleSituationSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [result, setResult] = useState<SituationResult | null>(null);

  const handleSearch = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const query = customQ || keyword;
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await getSituationMotivation(query);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!result || videoLoading) return;
    
    // Fixed: hasSelectedApiKey must be awaited according to guidelines
    if (!await (window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setVideoLoading(true);
    try {
      const videoUri = await generateInstanceVideo(result.miracleStory);
      setResult({ ...result, videoUri });
    } catch (e) {
      console.error(e);
      alert("Video generation requires a paid API key.");
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="glass p-6 space-y-4">
        <h2 className="text-2xl serif font-bold">Divine Guidance</h2>
        <p className="text-xs text-white/40 italic">"I will guide you along the best pathway for your life..." — Psalm 32:8</p>
        
        <form onSubmit={(e) => handleSearch(e)} className="flex gap-2">
          <input 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. 'Facing Debt', 'Marketplace Success'..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none text-white"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'Consulting...' : 'Search'}
          </button>
        </form>
      </div>

      {!result && !loading && (
        <div className="px-2 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Marketplace Ministry (Industry Trends)</h3>
          <div className="grid grid-cols-2 gap-4">
            {MARKETPLACE_CATEGORIES.map(k => (
              <button 
                key={k.label} 
                onClick={() => { handleSearch(undefined, k.q); }}
                className="glass p-6 text-center hover:bg-white/5 text-xs font-bold border border-white/5 transition-all hover:scale-105 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{k.icon}</span>
                <span className="text-white">{k.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass p-8 space-y-4 border-l-4 border-indigo-500 bg-indigo-500/5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Theological Insight</h3>
            <p className="text-sm leading-relaxed text-white/90 italic">{result.analysis}</p>
          </div>

          <div className="glass p-1 overflow-hidden">
            {result.videoUri ? (
              <video src={result.videoUri} controls autoPlay loop className="w-full aspect-video rounded-2xl object-cover" />
            ) : (
              <div className="aspect-video bg-black/40 rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
                <span className="text-4xl">📽️</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white">Simulate this Instance</h4>
                  <p className="text-[10px] text-white/40 max-w-[200px]">Generate a cinematic Veo video of this scriptural principle.</p>
                </div>
                <button 
                  onClick={handleGenerateVideo}
                  disabled={videoLoading}
                  className="bg-indigo-500 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-lg"
                >
                  {videoLoading ? 'Generating Vision...' : 'Synthesize Video'}
                </button>
              </div>
            )}
          </div>

          <div className="glass p-8 space-y-4 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 text-white">A Story of God's Power</h3>
            <div className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{result.miracleStory}</div>
          </div>

          <div className="glass p-10 space-y-6 bg-white/5 border border-white/10">
            <h3 className="text-center text-xs font-bold uppercase tracking-[0.4em] opacity-40 text-white">Divine Narrative</h3>
            <p className="text-lg serif italic text-white/90 leading-[1.8] first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-2">
              {result.narrative}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleSituationSearch;
