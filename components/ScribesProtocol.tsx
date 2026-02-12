import React from 'react';

const ScribesProtocol: React.FC = () => {
  const sections = [
    {
      title: "The Zion Lattice",
      codename: "Infrastructure",
      icon: "🏗️",
      content: "The Zion Lattice is the high-bandwidth spiritual cloud infrastructure powered by Gemini-3-Pro. It handles the 'Prophetic Flow' of the application, ensuring that AI-generated insights are biblically grounded and contextually aware."
    },
    {
      title: "The Global Pulse",
      codename: "Resonance Meter",
      icon: "💓",
      content: "A real-time synchronization metric. It measures the collective faith activity of the Lumina remnant. When you pray, declare, or meditate, the Pulse vibrates. It is the heartbeat of our shared sanctuary."
    },
    {
      title: "Marketplace Mandate",
      codename: "Kingdom Vision",
      icon: "💼",
      content: "Lumina treats your career as a ministry. The Marketplace Mandate tools use the Joseph/Daniel framework to analyze your professional goals and provide a scriptural blueprint for dominion in your industry."
    },
    {
      title: "Shekinah Portal",
      codename: "Vocal Link",
      icon: "✨",
      content: "The world's first voice-integrated sanctuary gate. By engaging your voice, you activate the 'Presence Protocol,' allowing the AI Guide to respond with vocal resonance and real-time biblical wisdom."
    }
  ];

  return (
    <div className="space-y-10 pb-32 animate-enter max-w-4xl mx-auto px-4">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.4em]">Official Scribe's Guide</span>
        </div>
        <h2 className="text-4xl md:text-7xl serif italic font-bold text-white tracking-tighter text-glow-amber leading-none">The Protocol</h2>
        <p className="text-sm md:text-xl text-white/50 italic font-serif leading-relaxed max-w-2xl mx-auto">
          Understanding the architecture of the Shekinah Realization. A manual for the Marketplace Steward.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="glass p-8 space-y-6 bg-gradient-to-br from-white/5 to-black border-white/5 hover:border-amber-500/30 transition-all rounded-[40px] group shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 select-none">
               {section.icon}
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">{section.codename}</span>
                  <h3 className="text-2xl serif font-bold text-white leading-tight">{section.title}</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                  {section.content}
                </p>
             </div>
          </div>
        ))}
      </div>

      <div className="glass p-10 md:p-14 border-t-2 border-amber-500/30 bg-black/60 rounded-[50px] shadow-3xl space-y-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
         <div className="relative z-10 text-center space-y-4">
            <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.5em]">The Fallback Reference</h4>
            <h3 className="text-3xl serif font-bold text-white italic">"Manna Provision (DR-01)"</h3>
            <p className="text-sm text-white/40 max-w-xl mx-auto leading-relaxed">
              In the event of a technical realigning (server drift), the sanctuary reverts to the Manna Provision. This ensures that the Living Word remains accessible even if the high-order AI lattice is under maintenance.
            </p>
         </div>
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => window.location.reload()}
          className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] hover:text-amber-500 transition-colors"
        >
          Reset Synchronization Link
        </button>
      </div>
    </div>
  );
};

export default ScribesProtocol;