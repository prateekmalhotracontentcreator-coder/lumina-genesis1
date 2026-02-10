import React, { useState } from 'react';
import { verifyScriptureAccuracy } from './geminiService';

const BereanTool: React.FC = () => {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isAligned: boolean, reasoning: string, references: string[] } | null>(null);

  const handleVerify = async () => {
    if (!claim) return;
    setLoading(true);
    try {
      const data = await verifyScriptureAccuracy(claim);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass p-6 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500">
        <h2 className="text-xl serif font-bold">The Berean Scholar</h2>
        <p className="text-xs text-white/40 mt-1">"...they searched the Scriptures day after day to see if it was so." — Acts 17:11</p>
      </div>

      <div className="glass p-6 space-y-4">
        <textarea 
          placeholder="Paste a theological claim or modern teaching to verify..."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-white/30 text-white"
        />
        <button 
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching the Scrolls...' : 'Verify with Scripture'}
        </button>
      </div>

      {result && (
        <div className="glass p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg ${result.isAligned ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {result.isAligned ? '✓' : '⚠'}
            </div>
            <div>
              <h4 className={`font-bold ${result.isAligned ? 'text-green-400' : 'text-red-400'}`}>
                {result.isAligned ? 'Scripturally Aligned' : 'Theological Discrepancy'}
              </h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Berean Analysis Result</p>
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-sm italic text-white/80 leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Biblical Evidence</h5>
            <div className="flex flex-wrap gap-2">
              {result.references.map((ref, idx) => (
                <span key={idx} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] px-3 py-1 rounded-md font-bold">
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BereanTool;