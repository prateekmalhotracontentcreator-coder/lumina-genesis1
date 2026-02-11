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
      alert("Blessings! Your Disciple Tier subscription is now active.");
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-32 animate-enter">
      {/* Balance Summary - Green Exodus Style */}
      <div className="glass p-10 bg-gradient-to-br from-green-600/10 to-black/60 border-green-500/30 text-center relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 select-none">✨</div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-green-500 mb-3">Resonance Points</p>
        <h2 className="text-6xl font-black serif text-white text-glow-green">{profile.points}</h2>
        
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <span className="block text-xl font-bold text-green-400">12</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.3em]">Day Streak</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-green-400">Rank</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.3em]">Disciple</span>
          </div>
        </div>
      </div>

      {/* STRIPE CTA - Exodus Green Style */}
      {!profile.isPremium && (
        <section className="glass p-10 bg-black/60 border-green-500/20 text-center space-y-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex justify-center">
            <div className="px-5 py-1.5 bg-green-500 text-black text-[10px] font-black uppercase rounded-full tracking-[0.3em] shadow-[0_0_20px_rgba(34,197,94,0.4)]">Premium Exodus</div>
          </div>
          <h4 className="text-2xl serif font-bold text-white">Unlock The Promised Land</h4>
          <p className="text-xs text-white/50 px-6 leading-relaxed">Unlimited AI Chaplain access, high-definition Divine Simulations, and early access to the Social Bridge.</p>
          
          <button 
            onClick={handleStripeCheckout}
            disabled={isCheckingOut}
            className="w-full py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-green-50 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            {isCheckingOut ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> ESTABLISHING LINK...</>
            ) : (
              'Initialize Subscription $4.99/mo'
            )}
          </button>
          
          <div className="flex items-center justify-center gap-3 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            <span className="text-[8px] font-black tracking-widest uppercase">Verified by</span>
            <svg width="40" height="16" viewBox="0 0 40 16" fill="white"><path d="M16 8.11c0-.85.35-1.46 1.05-1.46.51 0 .86.37.86.86v3.7h1.94V7.5c0-1.43-1-2.28-2.31-2.28a2.53 2.53 0 0 0-1.54.54V5.4H14.1v5.8h1.9zm-4.7-1.12c0-.57.34-.84.9-.84.4 0 .7.18.8.44l.08.1v.3zm0 2.2V9.3h1.92v-.14c0-1.34-.85-2.61-2.68-2.61-1.68 0-2.88 1.15-2.88 2.85s1.2 2.85 2.88 2.85c.98 0 1.9-.38 2.41-.9l-1.04-1.1a1.2 1.2 0 0 1-.95.44c-.7 0-1.1-.4-1.1-1.12zM5.5 11.2h1.9V3H5.5zm-5.2 0H2.2v-5.8h1.8V4.3c-.6 0-1 .4-1.2.6v-.9H.3zM9.4 5.4h1.9v-.8c0-.7.3-1.1 1.1-1.1h.4V2h-.7c-1.3 0-2 .6-2 2v1.4z"/></svg>
          </div>
        </section>
      )}

      {/* Tabs - Green Exodus Style */}
      <div className="flex gap-2 p-2 glass mx-2 rounded-2xl border-green-500/10">
        <button 
          onClick={() => setActiveTab('REWARDS')} 
          className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'REWARDS' ? 'bg-green-500 text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Redeem Rewards
        </button>
        <button 
          onClick={() => setActiveTab('SHOP')} 
          className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'SHOP' ? 'bg-green-500 text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Faith Marketplace
        </button>
      </div>

      {activeTab === 'REWARDS' ? (
        <div className="px-2 space-y-4">
          {GIFTS.map(gift => (
            <div key={gift.id} className="glass p-6 border-green-500/10 flex items-center gap-6 hover:bg-green-500/5 transition-all rounded-3xl group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform border border-green-500/20">{gift.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-white">{gift.title}</h4>
                <p className="text-[10px] text-green-500/60 font-black uppercase tracking-widest mt-1">{gift.pointsCost} Points Required</p>
              </div>
              <button 
                disabled={profile.points < gift.pointsCost} 
                className="px-6 py-3 rounded-xl font-black text-[9px] bg-white text-black disabled:opacity-20 transition-all uppercase tracking-widest hover:bg-green-50 active:scale-95 shadow-lg"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {AFFILIATE_PRODUCTS.map(product => (
              <div key={product.id} className="glass overflow-hidden flex flex-col border border-green-500/10 group rounded-3xl shadow-xl">
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-bold text-green-400 border border-green-500/20">{product.category}</div>
                </div>
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight h-10 overflow-hidden line-clamp-2">{product.title}</h4>
                    <p className="text-sm font-bold text-green-400 mt-2">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => window.open(product.affiliateUrl, '_blank')} 
                    className="w-full py-3 bg-white text-black font-black text-[9px] rounded-xl border border-green-500/10 uppercase tracking-[0.2em] hover:bg-green-50 transition-all active:scale-95 shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Policy Footer */}
      <div className="text-center opacity-20 py-10 px-6">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] leading-relaxed">Divine Marketplace Policy: Lumina is not responsible for physical fulfillment. All shop items are handled by sacred external providers.</p>
      </div>
    </div>
  );
};

export default EStore;