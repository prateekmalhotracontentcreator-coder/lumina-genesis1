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
    // This simulates the actual Stripe checkout redirect
    setTimeout(() => {
      onSubscribe();
      setIsCheckingOut(false);
      alert("Blessings! Your Disciple Tier subscription is now active.");
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Points Summary */}
      <div className="glass p-8 bg-gradient-to-br from-yellow-500/20 to-amber-900/20 border-yellow-500/30 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">💰</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500 mb-2">Devotion Balance</p>
        <h2 className="text-5xl font-bold serif text-white">{profile.points}</h2>
        <div className="mt-6 flex justify-center gap-4">
          <div className="text-center">
            <span className="block text-lg font-bold">12</span>
            <span className="text-[8px] text-white/40 uppercase tracking-widest">Day Streak</span>
          </div>
        </div>
      </div>

      {/* STRIPE CTA */}
      {!profile.isPremium && (
        <section className="glass p-8 bg-indigo-900/20 border-indigo-500/30 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="px-3 py-1 bg-indigo-500 text-[10px] font-black uppercase rounded-full tracking-[0.2em]">Disciple Tier</div>
          </div>
          <h4 className="text-xl serif font-bold text-white">Unlock Full Sanctuary Access</h4>
          <p className="text-xs text-white/50 px-4">Unlimited AI Pastor, Divine Simulations, and Personalized Morning Alarms.</p>
          
          <button 
            onClick={handleStripeCheckout}
            disabled={isCheckingOut}
            className="w-full py-5 bg-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-[0_15px_30px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isCheckingOut ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Preparing Stripe...</>
            ) : (
              'Subscribe for $4.99/mo'
            )}
          </button>
          <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
            <span className="text-[8px] font-bold">POWERED BY</span>
            <svg width="40" height="16" viewBox="0 0 40 16" fill="white"><path d="M16 8.11c0-.85.35-1.46 1.05-1.46.51 0 .86.37.86.86v3.7h1.94V7.5c0-1.43-1-2.28-2.31-2.28a2.53 2.53 0 0 0-1.54.54V5.4H14.1v5.8h1.9zm-4.7-1.12c0-.57.34-.84.9-.84.4 0 .7.18.8.44l.08.1v.3zm0 2.2V9.3h1.92v-.14c0-1.34-.85-2.61-2.68-2.61-1.68 0-2.88 1.15-2.88 2.85s1.2 2.85 2.88 2.85c.98 0 1.9-.38 2.41-.9l-1.04-1.1a1.2 1.2 0 0 1-.95.44c-.7 0-1.1-.4-1.1-1.12zM5.5 11.2h1.9V3H5.5zm-5.2 0H2.2v-5.8h1.8V4.3c-.6 0-1 .4-1.2.6v-.9H.3zM9.4 5.4h1.9v-.8c0-.7.3-1.1 1.1-1.1h.4V2h-.7c-1.3 0-2 .6-2 2v1.4z"/></svg>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass mx-2">
        <button onClick={() => setActiveTab('REWARDS')} className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'REWARDS' ? 'bg-white text-black shadow-md' : 'text-white/40'}`}>Redeem Points</button>
        <button onClick={() => setActiveTab('SHOP')} className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'SHOP' ? 'bg-white text-black shadow-md' : 'text-white/40'}`}>Faith Shop</button>
      </div>

      {activeTab === 'REWARDS' ? (
        <div className="px-2 space-y-4">
          {GIFTS.map(gift => (
            <div key={gift.id} className="glass p-5 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
              <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center text-3xl">{gift.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">{gift.title}</h4>
                <p className="text-[10px] text-white/40">{gift.pointsCost} Devotion Points</p>
              </div>
              <button disabled={profile.points < gift.pointsCost} className="px-4 py-2 rounded-xl font-bold text-xs bg-white text-black disabled:opacity-20 transition-all">Redeem</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {AFFILIATE_PRODUCTS.map(product => (
              <div key={product.id} className="glass overflow-hidden flex flex-col border border-white/5 group">
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="font-bold text-[10px] text-white leading-tight h-8 overflow-hidden">{product.title}</h4>
                  <button onClick={() => window.open(product.affiliateUrl, '_blank')} className="w-full py-2 bg-white/10 text-white font-bold text-[9px] rounded-lg border border-white/10 uppercase tracking-widest hover:bg-white hover:text-black transition-all">Buy Now</button>
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