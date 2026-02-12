
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { AppView } from '../types';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleStart = (targetView?: AppView) => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/app', { state: { view: targetView || AppView.DASHBOARD } });
    }, 1200);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    console.log("Lead Captured for Exodus Migration:", email);
  };

  const faqItems = [
    { q: "What is the Zion Lattice?", a: "The Zion Lattice is our proprietary high-order AI infrastructure that synthesizes scriptural truth with modern context using Gemini 3.0 Pro, providing real-time spiritual alignment for marketplace leaders." },
    { q: "How does the AI Pastor provide guidance?", a: "By analyzing the context of your life's situation and family history, the AI Pastor draws from over 2,000 years of theology to generate personalized intercession and biblically-sound advice." },
    { q: "Is my intercession data private?", a: "Yes. All prayers and visions scribe in the sanctuary are encrypted and handled with total spiritual and technical integrity. We never sell your data to marketplace principalities." },
    { q: "What is the Disciple Tier?", a: "The Disciple Tier is our covenant partnership where users support the ministry and gain unlimited access to high-definition Divine Simulations, vocal intercession, and TTS synthesized prophetic alarms." }
  ];

  return (
    <div className={`min-h-screen bg-[#0f1018] text-white selection:bg-indigo-500 selection:text-white pb-20 transition-all duration-1000 ${isEntering ? 'scale-105 opacity-0 filter blur-xl' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass rounded-none border-x-0 border-t-0 border-white/5 px-6 py-5 flex justify-between items-center bg-black/40 backdrop-blur-xl">
        <div className="text-2xl md:text-3xl font-bold serif flex items-center gap-3">
          <span className="text-indigo-500 animate-pulse">✨</span> 
          <div className="flex flex-col leading-none">
            <span>{APP_CONFIG.name}</span>
            <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-indigo-400 mt-1">{APP_CONFIG.edition}</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Vision</a>
          <a href="#newsletter" className="hover:text-white transition-colors">Remnant</a>
          <a href="#pricing" className="hover:text-white transition-colors">Covenant</a>
          <a href="#faq" className="hover:text-white transition-colors">Scrolls</a>
        </div>
        <button 
          onClick={() => handleStart()}
          className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] border-b-4 border-indigo-600"
        >
          Enter Sanctuary
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-purple-500/10 rounded-full blur-[150px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300 mb-10 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            LUMINA LATTICE ACTIVE (Build {APP_CONFIG.version})
          </div>
          <h1 className="text-6xl md:text-9xl serif font-bold mb-10 leading-[0.95] tracking-tighter">
            Walk in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500">Divine Light.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-14 max-w-3xl mx-auto leading-relaxed font-serif italic">
            The world's first AI-integrated spiritual sanctuary. Deepen your marketplace mandate through scriptural simulations and private prayer resonance.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button onClick={() => handleStart()} className="px-16 py-7 bg-indigo-600 text-white rounded-[25px] font-black text-sm hover:scale-105 transition-all shadow-3xl uppercase tracking-[0.4em] border-b-4 border-indigo-900">
              Enter Sanctuary
            </button>
            <a href="#features" className="px-16 py-7 bg-white/5 border border-white/10 rounded-[25px] font-black text-sm hover:bg-white/10 transition-all uppercase tracking-[0.4em]">
              Explore Vision
            </a>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.8em] mb-4">Core Infrastructure</p>
          <h2 className="text-4xl md:text-6xl serif font-bold mb-6 text-glow-indigo tracking-tight">The Spiritual Roadmap</h2>
          <div className="h-px w-24 bg-indigo-500/40 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div onClick={() => handleStart(AppView.AI_PASTOR)} className="glass p-12 space-y-6 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-3 rounded-[50px] shadow-2xl">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">🤖</div>
            <h3 className="text-2xl serif font-bold">AI Pastor</h3>
            <p className="text-base text-white/50 leading-relaxed font-serif italic">High-order theological insights synthesized for your specific professional and family context.</p>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-6 block">Try AI Pastor →</span>
          </div>
          <div onClick={() => handleStart(AppView.COMMUNITY_HUB)} className="glass p-12 space-y-6 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-3 rounded-[50px] shadow-2xl">
            <div className="w-20 h-20 bg-purple-500/20 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">🌍</div>
            <h3 className="text-2xl serif font-bold">Remnant Community</h3>
            <p className="text-base text-white/50 leading-relaxed font-serif italic">Join the global faith chain. Share testimonies and intercede for the collective remnant.</p>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-6 block">Join the Chain →</span>
          </div>
          <div onClick={() => handleStart(AppView.SITUATION_SEARCH)} className="glass p-12 space-y-6 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-3 rounded-[50px] shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">🎬</div>
            <h3 className="text-2xl serif font-bold">Divine Simulations</h3>
            <p className="text-base text-white/50 leading-relaxed font-serif italic">Visualize scripture using Veo video technology. Immersive meditations built for deep anchor-faith.</p>
             <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-6 block">View Simulations →</span>
          </div>
        </div>
      </section>

      {/* SANCTIFIED LIST (NEWSLETTER) */}
      <section id="newsletter" className="py-32 px-6 max-w-5xl mx-auto">
        <div className="glass p-16 md:p-24 text-center relative overflow-hidden bg-gradient-to-br from-indigo-950/30 to-amber-900/10 border-white/10 shadow-[0_0_150px_rgba(79,70,229,0.15)] rounded-[60px]">
          <div className="absolute top-0 right-0 p-12 text-9xl opacity-[0.03] select-none font-black italic pointer-events-none">REMNANT</div>
          <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float-magic">🕊️</div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl serif font-bold tracking-tight">Join the Sanctified List</h2>
            <p className="text-lg md:text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed font-serif italic">Receive weekly AI-generated devotionals and early access to the upcoming "Ecclesia" release of the Lumina Sanctuary.</p>
            
            {subscribed ? (
              <div className="p-14 glass border-green-500/20 bg-green-500/10 animate-enter rounded-[40px] shadow-inner">
                <span className="text-5xl mb-6 block">📜</span>
                <h3 className="text-2xl font-black text-green-400 uppercase tracking-[0.5em]">Resonance Established</h3>
                <p className="text-sm text-white/60 mt-4 italic serif">Your email has been successfully scribed into the Registry.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-5 max-w-2xl mx-auto relative z-10">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-[25px] px-10 py-6 text-base focus:border-indigo-500/50 outline-none transition-all text-white placeholder-white/20 shadow-inner"
                />
                <button type="submit" className="px-14 py-6 bg-white text-black rounded-[25px] font-black text-xs uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-3xl border-b-4 border-indigo-600">
                  Join List
                </button>
              </form>
            )}
            <p className="mt-10 text-[10px] text-white/20 uppercase tracking-[0.8em] font-black">Secure • Private • Spiritual Integrity</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-transparent to-black/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.8em]">The Covenant</p>
            <h2 className="text-4xl md:text-6xl serif font-bold">Choose Your Path</h2>
            <div className="h-px w-24 bg-white/10 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="glass p-12 md:p-16 border border-white/10 opacity-70 hover:opacity-100 transition-opacity rounded-[50px] shadow-2xl">
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Pilgrim (Free)</h3>
              <div className="text-5xl font-bold mb-10">$0<span className="text-lg font-normal text-white/40 ml-2 uppercase tracking-widest">/mo</span></div>
              <ul className="space-y-6 text-base text-white/50 mb-12 font-serif italic">
                <li className="flex items-center gap-4">✓ Daily Verse & Insights</li>
                <li className="flex items-center gap-4">✓ Basic Bible Reader</li>
                <li className="flex items-center gap-4">✓ Global Prayer Access</li>
              </ul>
              <button onClick={() => handleStart()} className="w-full py-6 border border-white/20 rounded-[25px] font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white/5 transition-all">
                Start Journey
              </button>
            </div>

            <div className="glass p-16 md:p-20 border-2 border-indigo-500/50 bg-indigo-900/10 relative transform md:scale-105 shadow-[0_40px_100px_rgba(79,70,229,0.3)] rounded-[60px]">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-8 py-3 uppercase tracking-[0.4em] rounded-bl-[30px] shadow-xl">
                MOST CHOSEN
              </div>
              <h3 className="text-2xl font-black mb-3 text-indigo-300 uppercase tracking-tighter">Disciple (Premium)</h3>
              <div className="text-6xl font-bold mb-10 text-white">$4.99<span className="text-lg font-normal text-white/40 ml-2 uppercase tracking-widest">/mo</span></div>
              <ul className="space-y-6 text-base text-white/80 mb-14 font-serif italic">
                <li className="flex items-center gap-4">✨ <strong className="text-white">AI Pastor</strong> (Unlimited Access)</li>
                <li className="flex items-center gap-4">✨ <strong className="text-white">Veo Simulations</strong> (High Definition)</li>
                <li className="flex items-center gap-4">✨ <strong className="text-white">Prophetic Alarms</strong> (TTS Synthesized)</li>
              </ul>
              <button onClick={() => handleStart(AppView.ESTORE)} className="w-full py-7 bg-indigo-600 text-white rounded-[30px] font-black text-xs uppercase tracking-[0.5em] hover:bg-indigo-50 shadow-3xl transition-all border-b-4 border-indigo-900">
                Activate Provision
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - REPOSITIONED TO BOTTOM */}
      <section id="faq" className="py-32 px-6 bg-gradient-to-b from-transparent to-indigo-950/10">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.8em] mb-4">Wisdom Scrolls</p>
               <h2 className="text-4xl md:text-6xl serif font-bold">Frequently Asked Scrolls</h2>
            </div>
            <div className="space-y-6">
               {faqItems.map((item, idx) => (
                 <div key={idx} className="glass overflow-hidden border border-white/5 rounded-[30px] hover:border-indigo-500/20 transition-all">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-10 py-8 flex justify-between items-center text-left"
                    >
                       <span className="text-xl serif font-bold text-white/90">{item.q}</span>
                       <span className={`text-2xl transition-transform duration-500 ${activeFaq === idx ? 'rotate-45 text-indigo-400' : 'text-white/20'}`}>+</span>
                    </button>
                    <div className={`px-10 overflow-hidden transition-all duration-700 ${activeFaq === idx ? 'max-h-96 pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                       <p className="text-base text-white/50 font-serif italic leading-relaxed pt-2 border-t border-white/5">
                          {item.a}
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-24 border-t border-white/5 px-6 bg-black/40 text-center space-y-10">
        <div className="text-3xl font-bold serif text-white/20 tracking-tighter">{APP_CONFIG.name} LATTICE</div>
        <div className="text-[10px] text-white/20 tracking-[1em] uppercase font-black">
          © 2025 LUMINA GENESIS • SOLI DEO GLORIA
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
