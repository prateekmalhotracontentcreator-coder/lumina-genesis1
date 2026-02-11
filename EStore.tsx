
import React, { useState } from 'react';
import { GiftItem, AffiliateProduct, UserProfile } from './types';

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
      {/* Balance Summary - Indigo Theme */}
      <div className="glass p-10 bg-gradient-to-br from-indigo-600/10 to-black/60 border-indigo-500/30 text-center relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 select-none">✨</div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-3">Resonance Points</p>
        <h2 className="text-6xl font-black serif text-white text-glow-indigo">{profile.points}</h2>
        
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <span className="block text-xl font-bold text-indigo-400">12</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.3em]">Day Streak</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-indigo-400">Rank</span>
            <span className="text-[8px] text-white/40 uppercase tracking-[0.3em]">Disciple</span>
          </div>
        </div>
      </div>

      {/* STRIPE CTA - Indigo Theme */}
      {!profile.isPremium && (
        <section className="glass p-10 bg-black/60 border-indigo-500/20 text-center space-y-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex justify-center">
            <div className="px-5 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full tracking-[0.3em] shadow-[0_0_20px_rgba(99,102,241,0.4)]">Premium Disciple</div>
          </div>
          <h4 className="text-2xl serif font-bold text-white">Unlock The Promised Land</h4>
          <p className="text-xs text-white/50 px-6 leading-relaxed">Unlimited AI Chaplain access and high-definition simulations.</p>
          
          <button 
            onClick={handleStripeCheckout}
            disabled={isCheckingOut}
            className="w-full py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            {isCheckingOut ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> ESTABLISHING LINK...</>
            ) : (
              'Initialize Subscription $4.99/mo'
            )}
          </button>
        </section>
      )}

      {/* Tabs - Indigo Theme */}
      <div className="flex gap-2 p-2 glass mx-2 rounded-2xl border-indigo-500/10">
        <button 
          onClick={() => setActiveTab('REWARDS')} 
          className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'REWARDS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Redeem Rewards
        </button>
        <button 
          onClick={() => setActiveTab('SHOP')} 
          className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'SHOP' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
        >
          Faith Marketplace
        </button>
      </div>

      {activeTab === 'REWARDS' ? (
        <div className="px-2 space-y-4">
          {GIFTS.map(gift => (
            <div key={gift.id} className="glass p-6 border-indigo-500/10 flex items-center gap-6 hover:bg-indigo-500/5 transition-all rounded-3xl group">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform border border-indigo-500/20">{gift.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-white">{gift.title}</h4>
                <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-1">{gift.pointsCost} Points Required</p>
              </div>
              <button 
                disabled={profile.points < gift.pointsCost} 
                className="px-6 py-3 rounded-xl font-black text-[9px] bg-white text-black disabled:opacity-20 transition-all uppercase tracking-widest hover:bg-indigo-50 active:scale-95 shadow-lg"
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
              <div key={product.id} className="glass overflow-hidden flex flex-col border border-indigo-500/10 group rounded-3xl shadow-xl">
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                </div>
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight h-10 overflow-hidden line-clamp-2">{product.title}</h4>
                    <p className="text-sm font-bold text-indigo-400 mt-2">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => window.open(product.affiliateUrl, '_blank')} 
                    className="w-full py-3 bg-white text-black font-black text-[9px] rounded-xl border border-indigo-500/10 uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EStore;
