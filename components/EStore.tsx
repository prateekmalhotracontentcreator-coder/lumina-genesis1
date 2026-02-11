
import React, { useState } from 'react';
import { GiftItem, AffiliateProduct, UserProfile } from '../types';

const GIFTS: GiftItem[] = [
  { id: 'g1', title: '$5 Amazon Gift Card', description: 'Exchange your devotion points for a digital gift card.', pointsCost: 500, type: 'GIFT_CARD', icon: '🎁' },
  { id: 'g2', title: 'Premium Gift Month', description: 'Gift a month of Lumina Premium to a loved one.', pointsCost: 1000, type: 'PREMIUM_SUB', icon: '✨' },
];

const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'p1',
    title: 'Journaling Bible (ESV)',
    price: '$34.99',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/1433544145?tag=lumina-20',
    category: 'Study'
  },
  {
    id: 'p2',
    title: 'Modern Wood Wall Cross',
    price: '$22.50',
    imageUrl: 'https://images.unsplash.com/photo-1544735047-9799270635e8?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/B08P1Q1K5Q?tag=lumina-20',
    category: 'Home Decor'
  }
];

interface EStoreProps {
  profile: UserProfile;
  onSubscribe: () => void;
}

const EStore: React.FC<EStoreProps> = ({ profile, onSubscribe }) => {
  const [activeTab, setActiveTab] = useState<'REWARDS' | 'SHOP'>('REWARDS');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleStripeCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      onSubscribe();
      setIsCheckingOut(false);
      alert("Blessings! Your Shekinah Realization tier is now active.");
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-32 animate-enter">
      {/* Balance Summary - Shekinah Treasury Style */}
      <div className="glass p-12 bg-gradient-to-br from-amber-600/10 to-black/80 border-amber-500/30 text-center relative overflow-hidden rounded-[50px] shadow-3xl">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-10 text-8xl opacity-5 select-none font-black italic">GLORY</div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500 mb-4">Treasury Resonance</p>
        <h2 className="text-7xl font-black serif text-white text-glow-amber drop-shadow-2xl">{profile.points}</h2>
        
        <div className="mt-10 flex justify-center gap-12">
          <div className="text-center">
            <span className="block text-2xl font-bold text-amber-400">12</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.4em]">Faith Streak</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-amber-400">Rank</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.4em]">Steward</span>
          </div>
        </div>
      </div>

      {/* STRIPE CTA - Manifestation Premium */}
      {!profile.isPremium && (
        <section className="glass p-12 bg-black/60 border-amber-500/20 text-center space-y-8 rounded-[50px] shadow-2xl relative overflow-hidden">
          <div className="flex justify-center">
            <div className="px-6 py-2 bg-amber-500 text-black text-[10px] font-black uppercase rounded-full tracking-[0.4em] shadow-[0_0_30px_rgba(251,191,36,0.5)]">Realization Tier</div>
          </div>
          <h4 className="text-3xl md:text-4xl serif font-bold text-white">Activate Your Provision</h4>
          <p className="text-sm text-white/40 px-8 leading-relaxed italic max-w-2xl mx-auto">Access the full depth of Shekinah Portal, high-definition Divine Simulations, and prioritized prophetic scrolls.</p>
          
          <button 
            onClick={handleStripeCheckout}
            disabled={isCheckingOut}
            className="w-full max-w-md mx-auto py-7 bg-white text-black rounded-[25px] font-black text-[11px] uppercase tracking-[0.5em] shadow-3xl hover:bg-amber-50 transition-all flex items-center justify-center gap-5 active:scale-95 border-b-4 border-amber-600"
          >
            {isCheckingOut ? (
              <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> SYNCHRONIZING...</>
            ) : (
              'Initialize Covenant $4.99/mo'
            )}
          </button>
        </section>
      )}

      {/* Tabs - Treasury Style */}
      <div className="flex gap-4 p-3 glass mx-2 rounded-[30px] border-amber-500/10 bg-white/5">
        <button 
          onClick={() => setActiveTab('REWARDS')} 
          className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all ${activeTab === 'REWARDS' ? 'bg-amber-500 text-black shadow-xl scale-105' : 'text-white/30 hover:text-white/50'}`}
        >
          Provision Rewards
        </button>
        <button 
          onClick={() => setActiveTab('SHOP')} 
          className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all ${activeTab === 'SHOP' ? 'bg-amber-500 text-black shadow-xl scale-105' : 'text-white/30 hover:text-white/50'}`}
        >
          Sacred Marketplace
        </button>
      </div>

      {activeTab === 'REWARDS' ? (
        <div className="px-4 space-y-6">
          {GIFTS.map(gift => (
            <div key={gift.id} className="glass p-8 border-amber-500/10 flex items-center gap-8 hover:bg-amber-500/5 transition-all rounded-[40px] group shadow-xl">
              <div className="w-20 h-20 bg-amber-500/10 rounded-[25px] flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform border border-amber-500/20">{gift.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-white serif">{gift.title}</h4>
                <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-widest mt-2">{gift.pointsCost} Treasury Credits Required</p>
              </div>
              <button 
                disabled={profile.points < gift.pointsCost} 
                className="px-8 py-4 rounded-[20px] font-black text-[10px] bg-white text-black disabled:opacity-20 transition-all uppercase tracking-widest hover:bg-amber-50 active:scale-95 shadow-2xl"
              >
                Claim Provision
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AFFILIATE_PRODUCTS.map(product => (
              <div key={product.id} className="glass overflow-hidden flex flex-col border border-amber-500/10 group rounded-[40px] shadow-3xl bg-black/40">
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" alt={product.title} />
                  <div className="absolute top-5 left-5 px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[9px] font-bold text-amber-400 border border-amber-500/20 tracking-widest uppercase">{product.category}</div>
                </div>
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-white leading-tight serif italic">{product.title}</h4>
                    <p className="text-xl font-bold text-amber-400 mt-3">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => window.open(product.affiliateUrl, '_blank')} 
                    className="w-full py-5 bg-white text-black font-black text-[10px] rounded-[20px] border border-amber-500/10 uppercase tracking-[0.3em] hover:bg-amber-50 transition-all active:scale-95 shadow-2xl"
                  >
                    Examine Artifact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <footer className="text-center opacity-10 py-16 px-8">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">Divine Stewardship Policy: Provision fulfillment is managed by external sanctified providers.</p>
      </footer>
    </div>
  );
};

export default EStore;
