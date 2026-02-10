
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { AppView } from '../types';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  // Deep Link handler
  const handleStart = (targetView?: AppView) => {
    setIsEntering(true);
    // Delay navigation to allow animation
    setTimeout(() => {
      navigate('/app', { state: { view: targetView || AppView.DASHBOARD } });
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-[#0f1018] text-white selection:bg-indigo-500 selection:text-white pb-20 transition-all duration-1000 ${isEntering ? 'scale-105 opacity-0 filter blur-xl' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass rounded-none border-x-0 border-t-0 border-white/5 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md">
        <div className="text-2xl font-bold serif flex items-center gap-2">
          <span className="text-indigo-500">✨</span> 
          <div className="flex flex-col leading-none">
            <span>{APP_CONFIG.name}</span>
            <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-indigo-400 mt-1">Genesis Golden State</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Experience</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <button 
          onClick={() => handleStart()}
          className="px-6 py-2 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          Open Web App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-purple-500/10 rounded-full blur-[150px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300 mb-8">
            {APP_CONFIG.name} {APP_CONFIG.edition} (v{APP_CONFIG.version})
          </div>
          <h1 className="text-5xl md:text-8xl serif font-bold mb-8 leading-[1.1]">
            Walk in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500">Divine Light.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's first AI-integrated spiritual sanctuary. Deepen your faith through scriptural simulations, private prayer circles, and personalized guidance.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => handleStart()}
              className="group relative px-12 py-5 bg-indigo-600 text-white rounded-full font-bold text-sm md:text-base hover:scale-105 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] uppercase tracking-widest"
            >
              {isEntering ? 'Entering Sanctuary...' : 'Enter Sanctuary'}
            </button>
            <a href="#features" className="px-12 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-sm md:text-base hover:bg-white/10 transition-all uppercase tracking-widest">
              Learn More
            </a>
          </div>
          
          <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest">Available on Web • iOS & Android Coming Soon</p>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl serif font-bold mb-4">The Spiritual Roadmap</h2>
          <p className="text-white/40 text-sm">Harnessing Gemini AI & Veo for a new era of devotion.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            onClick={() => handleStart(AppView.AI_PASTOR)}
            className="glass p-8 space-y-4 hover:bg-white/5 transition-colors border border-white/5 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-xl font-bold">AI Pastor</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Receive personalized theological insight and prayer based on your life's context. Powered by Gemini 3 Pro, offering 24/7 spiritual guidance.
            </p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-4 block">Try AI Pastor →</span>
          </div>
          <div 
            onClick={() => handleStart(AppView.COMMUNITY_HUB)}
            className="glass p-8 space-y-4 hover:bg-white/5 transition-colors border border-white/5 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
            <h3 className="text-xl font-bold">Global Prayer Chain</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Join thousands in synchronized prayer. Share requests securely with your private circle or the world.
            </p>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-4 block">Join the Chain →</span>
          </div>
          <div 
            onClick={() => handleStart(AppView.SITUATION_SEARCH)}
            className="glass p-8 space-y-4 hover:bg-white/5 transition-colors border border-white/5 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="text-xl font-bold">Divine Simulations</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Visualize scripture like never before. Generate high-definition Veo video meditations and immersive narratives.
            </p>
             <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-4 block">Create Simulation →</span>
          </div>
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
                <li className="flex items-center gap-2">✓ Standard Prayer Generator</li>
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
              <h3 className="text-xl font-bold mb-2 text-indigo-300">Disciple (Premium)</h3>
              <div className="text-3xl font-bold mb-6">$4.99<span className="text-sm font-normal text-white/40">/mo</span></div>
              <ul className="space-y-4 text-sm text-white/80 mb-8">
                <li className="flex items-center gap-2">✨ <strong>AI Pastor</strong> (Unlimited Chat)</li>
                <li className="flex items-center gap-2">✨ <strong>Veo Video Simulations</strong></li>
                <li className="flex items-center gap-2">✨ <strong>Audio Prayers</strong> (TTS)</li>
                <li className="flex items-center gap-2">✨ <strong>Custom Wallpapers</strong></li>
                <li className="flex items-center gap-2">✨ <strong>Private Prayer Circles</strong></li>
              </ul>
              <button onClick={() => handleStart(AppView.PREMIUM_GUIDE)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-lg transition-all">
                Start 7-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl serif font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="glass p-6 border border-white/5 hover:border-white/20 transition-all">
            <h4 className="font-bold text-sm mb-2 text-white/90">Is the AI content biblically accurate?</h4>
            <p className="text-sm text-white/50 leading-relaxed">Our models are prompted with specific theological constraints to ensure content aligns with standard Christian doctrine, though we always encourage cross-referencing with the Bible itself.</p>
          </div>
          <div className="glass p-6 border border-white/5 hover:border-white/20 transition-all">
            <h4 className="font-bold text-sm mb-2 text-white/90">How does the Prayer Chain work?</h4>
            <p className="text-sm text-white/50 leading-relaxed">You can post anonymous requests. When someone clicks "Pray", you receive a notification that you are being lifted up, without revealing their identity unless they are in your private circle.</p>
          </div>
           <div className="glass p-6 border border-white/5 hover:border-white/20 transition-all">
            <h4 className="font-bold text-sm mb-2 text-white/90">Can I cancel my subscription?</h4>
            <p className="text-sm text-white/50 leading-relaxed">Yes, you can cancel anytime from the Settings menu. You will retain access until the end of your billing period.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 px-6 bg-black/40 text-center">
        <div className="text-2xl font-bold serif mb-4 text-white/20">{APP_CONFIG.name}</div>
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-white/40 mb-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
        <div className="text-[10px] text-white/20">
          © 2025 {APP_CONFIG.name} {APP_CONFIG.edition}. All rights reserved. • Build: {APP_CONFIG.buildTag}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
