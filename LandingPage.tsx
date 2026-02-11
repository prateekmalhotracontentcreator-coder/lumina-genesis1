
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from './constants';
import { AppView } from './types';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  return (
    <div className={`min-h-screen bg-[#0f1018] text-white selection:bg-indigo-500 selection:text-white pb-20 transition-all duration-1000 ${isEntering ? 'scale-105 opacity-0 filter blur-xl' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass rounded-none border-x-0 border-t-0 border-white/5 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md">
        <div className="text-2xl font-bold serif flex items-center gap-2">
          <span className="text-indigo-500">✨</span> 
          <div className="flex flex-col leading-none">
            <span>{APP_CONFIG.name}</span>
            <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-indigo-400 mt-1">{APP_CONFIG.edition}</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Experience</a>
          <a href="#newsletter" className="hover:text-white transition-colors">Remnant</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={() => handleStart()}
          className="px-6 py-2 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          Open App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-purple-500/10 rounded-full blur-[150px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            {APP_CONFIG.name} {APP_CONFIG.edition} (Build {APP_CONFIG.version})
          </div>
          <h1 className="text-5xl md:text-8xl serif font-bold mb-8 leading-[1.1]">
            Walk in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500">Divine Light.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's first AI-integrated spiritual sanctuary. Deepen your faith through scriptural simulations, private prayer circles, and personalized guidance.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button onClick={() => handleStart()} className="px-12 py-5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:scale-105 transition-all shadow-2xl uppercase tracking-widest">
              Enter Sanctuary
            </button>
            <a href="#features" className="px-12 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-sm hover:bg-white/10 transition-all uppercase tracking-widest">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl serif font-bold mb-4 text-glow-indigo">The Spiritual Roadmap</h2>
          <p className="text-white/40 text-sm">Harnessing Gemini AI & Veo for a new era of devotion.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            // Fixed: AI_PASTOR replaced with SHEKINAH_PORTAL as AI_PASTOR is not defined in AppView enum
            onClick={() => handleStart(AppView.SHEKINAH_PORTAL)} 
            className="glass p-8 space-y-4 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-xl font-bold">AI Pastor</h3>
            <p className="text-sm text-white/50 leading-relaxed">Personalized theological insight and prayer based on your life's context. Powered by Gemini 3 Pro.</p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-4 block">Try AI Pastor →</span>
          </div>
          <div onClick={() => handleStart(AppView.COMMUNITY_HUB)} className="glass p-8 space-y-4 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-2">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
            <h3 className="text-xl font-bold">Prayer Chain</h3>
            <p className="text-sm text-white/50 leading-relaxed">Join thousands in synchronized prayer. Share requests securely with your private circle.</p>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-4 block">Join the Chain →</span>
          </div>
          <div onClick={() => handleStart(AppView.SITUATION_SEARCH)} className="glass p-8 space-y-4 hover:bg-white/5 transition-all border border-white/5 group cursor-pointer hover:-translate-y-2">
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="text-xl font-bold">Simulations</h3>
            <p className="text-sm text-white/50 leading-relaxed">Visualize scripture like never before. Generate high-definition Veo video meditations.</p>
             <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-4 block">Create Simulation →</span>
          </div>
        </div>
      </section>

      {/* LEAD GENERATION MODULE */}
      <section id="newsletter" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="glass p-12 text-center relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-amber-900/10 border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.1)]">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-5">🕊️</div>
          <h2 className="text-3xl serif font-bold mb-4">Join the Sanctified List</h2>
          <p className="text-white/50 text-sm mb-10 max-w-md mx-auto leading-relaxed">Get early access to our upcoming "Ecclesia" release and weekly AI devotionals delivered to your spirit.</p>
          
          {subscribed ? (
            <div className="p-10 glass border-green-500/20 bg-green-500/10 animate-enter">
              <span className="text-3xl mb-4 block">📜</span>
              <h3 className="text-xl font-bold text-green-400 uppercase tracking-widest">Blessings Received</h3>
              <p className="text-xs text-white/60 mt-2 italic">You are now part of the Lumina remnant. Check your inbox soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative z-10">
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all text-white placeholder-white/20"
              />
              <button type="submit" className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                Join Now
              </button>
            </form>
          )}
          <p className="mt-6 text-[9px] text-white/20 uppercase tracking-widest">Privacy Protected • Divine Use Only</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl serif font-bold mb-4">Choose Your Path</h2>
            <p className="text-white/40 text-sm">Support the ministry and unlock deeper features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Free Plan */}
            <div className="glass p-8 md:p-12 border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold mb-2">Pilgrim (Free)</h3>
              <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-white/40">/mo</span></div>
              <ul className="space-y-4 text-sm text-white/60 mb-8">
                <li className="flex items-center gap-2">✓ Daily Verse & Insights</li>
                <li className="flex items-center gap-2">✓ Basic Bible Reader</li>
                <li className="flex items-center gap-2">✓ Community Prayer Access</li>
              </ul>
              <button onClick={() => handleStart()} className="w-full py-3 border border-white/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                Start Journey
              </button>
            </div>

            {/* Premium Plan */}
            <div className="glass p-8 md:p-12 border-2 border-indigo-500/50 bg-indigo-900/10 relative transform md:scale-105 shadow-2xl">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-xl">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-300 uppercase tracking-tighter">Disciple (Premium)</h3>
              <div className="text-3xl font-bold mb-6">$4.99<span className="text-sm font-normal text-white/40">/mo</span></div>
              <ul className="space-y-4 text-sm text-white/80 mb-8">
                <li className="flex items-center gap-2">✨ <strong>AI Pastor</strong> (Unlimited)</li>
                <li className="flex items-center gap-2">✨ <strong>Veo Simulations</strong> (HD)</li>
                <li className="flex items-center gap-2">✨ <strong>Prophetic Alarms</strong> (TTS)</li>
              </ul>
              <button onClick={() => handleStart(AppView.PREMIUM_GUIDE)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-lg transition-all">
                Start Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - RESTORED */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl serif font-bold mb-4">Wisdom & Answers</h2>
          <p className="text-white/40 text-sm italic">Seek, and you shall find. Understanding the {APP_CONFIG.edition} migration.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-8 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1">
            <h4 className="font-bold text-sm mb-3 text-white/90">Is the AI content biblically accurate?</h4>
            <p className="text-sm text-white/50 leading-relaxed italic">Our models are prompted with rigorous theological constraints. For every insight, we provide the "Berean Tool" in Settings to cross-reference claims against literal scripture.</p>
          </div>
          <div className="glass p-8 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1">
            <h4 className="font-bold text-sm mb-3 text-white/90">How does the Prayer Chain work?</h4>
            <p className="text-sm text-white/50 leading-relaxed italic">You can post anonymous or public petitions. When a member of the remnant clicks "Pray", you receive a spiritual notification. Data is encrypted and sacred.</p>
          </div>
          <div className="glass p-8 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1">
            <h4 className="font-bold text-sm mb-3 text-white/90">What is the "Exodus" migration?</h4>
            <p className="text-sm text-white/50 leading-relaxed italic">Phase-2 (Exodus) represents our move from internal build (Genesis) to global accessibility. It involves the integration of high-definition Veo simulations and real-time social intercession.</p>
          </div>
          <div className="glass p-8 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1">
            <h4 className="font-bold text-sm mb-3 text-white/90">Can I use my own API Key?</h4>
            <p className="text-sm text-white/50 leading-relaxed italic">Yes. For high-definition Veo video generation, the app allows you to connect your personal Google Cloud API key to unlock unlimited simulations.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 px-6 bg-black/40 text-center">
        <div className="text-2xl font-bold serif mb-4 text-white/20">{APP_CONFIG.name}</div>
        <div className="text-[10px] text-white/20 tracking-widest uppercase">
          © 2025 LUMINA GENESIS • BUILT FOR THE GLORY OF GOD
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
