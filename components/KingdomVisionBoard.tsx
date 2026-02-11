
import React, { useState } from 'react';
import { getKingdomStrategy, generateBlueprintImage } from '../services/geminiService';
import { KingdomStrategy, UserProfile } from '../types';

interface KingdomVisionBoardProps {
  user: UserProfile;
}

const KingdomVisionBoard: React.FC<KingdomVisionBoardProps> = ({ user }) => {
  const [goal, setGoal] = useState('');
  const [strategy, setStrategy] = useState<KingdomStrategy | null>(null);
  const [blueprint, setBlueprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blueprintLoading, setBlueprintLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal) return;
    setLoading(true);
    setStrategy(null);
    setBlueprint(null);
    try {
      const data = await getKingdomStrategy(goal, user.name);
      setStrategy(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBlueprint = async () => {
    if (!strategy || blueprintLoading) return;
    
    // Paid API key is required for Gemini 3 Pro Image
    if (!await (window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setBlueprintLoading(true);
    try {
      const img = await generateBlueprintImage(strategy.blueprintPrompt);
      setBlueprint(img);
    } catch (e) {
      console.error(e);
    } finally {
      setBlueprintLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-24 animate-enter max-w-5xl mx-auto px-4">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.4em]">Phase 4.0: Kingdom Mandate</span>
        </div>
        <h2 className="text-4xl md:text-7xl serif italic font-bold text-white tracking-tighter">Marketplace Vision</h2>
        <p className="text-sm md:text-xl text-white/50 max-w-2xl mx-auto italic font-serif leading-relaxed">
          Establish your mandate. Scribe your professional vision and receive a scriptural blueprint for marketplace dominion.
        </p>
      </div>

      {/* INPUT SECTION */}
      <div className="glass p-10 md:p-14 border-blue-500/20 bg-blue-950/10 shadow-2xl rounded-[40px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-40" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-2">Marketplace Pursuit</label>
             <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your career goal, business venture, or technical project..."
                className="w-full h-32 bg-black/40 border border-blue-500/10 rounded-3xl p-6 text-base md:text-lg outline-none focus:border-blue-500/40 text-white transition-all shadow-inner font-serif italic placeholder:opacity-20 leading-relaxed"
             />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !goal}
            className="w-full py-6 rounded-[25px] font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95 bg-white text-black hover:bg-blue-50 disabled:opacity-30 flex items-center justify-center gap-4"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Scribe Mandate'}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      {strategy && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* MANDATE CARD */}
          <div className="glass p-10 md:p-16 border-l-8 border-blue-500 bg-gradient-to-br from-blue-950/20 to-black/80 rounded-[40px] shadow-3xl">
             <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">The Kingdom Mandate</h4>
             <p className="text-2xl md:text-4xl serif italic text-white leading-tight font-bold">{strategy.mandate}</p>
          </div>

          {/* PILLARS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategy.pillars.map((pillar, i) => (
              <div key={i} className="glass p-8 border-white/5 bg-white/5 space-y-4 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs">{i + 1}</div>
                <h5 className="text-xs font-black text-white uppercase tracking-widest">{pillar.title}</h5>
                <p className="text-xs text-white/50 leading-relaxed font-serif italic">{pillar.action}</p>
              </div>
            ))}
          </div>

          {/* BLUEPRINT SECTION */}
          <div className="glass p-1 overflow-hidden rounded-[40px] shadow-3xl bg-black/40 border border-white/5">
            {blueprint ? (
              <img src={blueprint} alt="Prophetic Blueprint" className="w-full aspect-video object-cover rounded-[38px] animate-in zoom-in-95 duration-1000" />
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center p-10 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-4xl border border-blue-500/20 animate-pulse">🏗️</div>
                <div className="space-y-2">
                  <h4 className="text-xl serif font-bold text-white">Synthesize Divine Blueprint</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest max-w-xs mx-auto">Generate a high-definition architectural visualization of this prophetic strategy.</p>
                </div>
                <button 
                  onClick={handleBlueprint}
                  disabled={blueprintLoading}
                  className="px-10 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl active:scale-95 disabled:opacity-30"
                >
                  {blueprintLoading ? 'Manifesting Image...' : 'Synthesize Blueprint'}
                </button>
              </div>
            )}
          </div>

          {/* DECLARATION SEAL */}
          <div className="glass p-12 text-center bg-blue-950/20 border-t-2 border-blue-500/40 rounded-[50px] space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 select-none transition-transform duration-1000 group-hover:rotate-12">🛡️</div>
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Prophetic Declaration</h4>
            <p className="text-xl md:text-3xl serif italic text-white/90 leading-relaxed max-w-3xl mx-auto">"{strategy.propheticDeclaration}"</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default KingdomVisionBoard;
