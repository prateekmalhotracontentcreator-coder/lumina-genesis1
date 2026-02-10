
import React, { useState } from 'react';
import { GiftItem, AffiliateProduct } from './types';

const GIFTS: GiftItem[] = [
  { id: 'g1', title: '$5 Amazon Gift Card', description: 'Exchange your devotion points for a digital gift card.', pointsCost: 500, type: 'GIFT_CARD', icon: '🎁' },
  { id: 'g2', title: 'Premium Gift Month', description: 'Gift a month of Lumina Premium to a loved one.', pointsCost: 1000, type: 'PREMIUM_SUB', icon: '✨' },
  { id: 'g3', title: '50% Coffee Coupon', description: 'Reward yourself or a friend with a local coffee discount.', pointsCost: 200, type: 'COUPON', icon: '☕' },
];

const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'p1',
    title: 'Journaling Bible (ESV)',
    price: '$34.99',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/1433544145?tag=your-affiliate-id',
    category: 'Study'
  },
  {
    id: 'p2',
    title: 'Modern Wood Wall Cross',
    price: '$22.50',
    imageUrl: 'https://images.unsplash.com/photo-1544735047-9799270635e8?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/B08P1Q1K5Q?tag=your-affiliate-id',
    category: 'Home Decor'
  },
  {
    id: 'p3',
    title: 'Leather Prayer Journal',
    price: '$18.99',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/B01N26B2K5?tag=your-affiliate-id',
    category: 'Journal'
  },
  {
    id: 'p4',
    title: 'Oil Anointing Set',
    price: '$29.00',
    imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=400',
    affiliateUrl: 'https://amazon.com/dp/B075RC9V8C?tag=your-affiliate-id',
    category: 'Spiritual'
  }
];

interface EStoreProps {
  userPoints: number;
}

const EStore: React.FC<EStoreProps> = ({ userPoints }) => {
  const [activeTab, setActiveTab] = useState<'REWARDS' | 'SHOP'>('REWARDS');

  const handleExternalPurchase = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Points Summary Card */}
      <div className="glass p-8 bg-gradient-to-br from-yellow-500/20 to-amber-900/20 border-yellow-500/30 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">💰</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500 mb-2">Devotion Points</p>
        <h2 className="text-5xl font-bold serif text-white">{userPoints}</h2>
        <div className="mt-6 flex justify-center gap-4">
          <div className="text-center">
            <span className="block text-lg font-bold">12</span>
            <span className="text-[8px] text-white/40 uppercase">Day Streak</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <span className="block text-lg font-bold">48</span>
            <span className="text-[8px] text-white/40 uppercase">Chapters Read</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass mx-2">
        <button 
          onClick={() => setActiveTab('REWARDS')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'REWARDS' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Points Rewards
        </button>
        <button 
          onClick={() => setActiveTab('SHOP')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'SHOP' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
          }`}
        >
          Spiritual Shop
        </button>
      </div>

      {activeTab === 'REWARDS' ? (
        <div className="px-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 px-2">Redeem Points</h3>
          <div className="grid grid-cols-1 gap-4">
            {GIFTS.map(gift => (
              <div key={gift.id} className="glass p-5 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
                <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center text-3xl">
                  {gift.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{gift.title}</h4>
                  <p className="text-[10px] text-white/40 mb-2">{gift.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-400">{gift.pointsCost} Points</span>
                  </div>
                </div>
                <button 
                  disabled={userPoints < gift.pointsCost}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                    userPoints >= gift.pointsCost 
                      ? 'bg-white text-black hover:bg-white/90 shadow-lg' 
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
          
          <div className="glass p-6 text-center space-y-4 bg-white/5 border-dashed border-white/20">
            <h4 className="text-sm font-bold italic">Progress Tracker Rewards</h4>
            <p className="text-[10px] text-white/40 leading-relaxed">Basis your reading progress, we unlock special bonuses. Stay consistent to earn $10-50 Gift Cards directly via email.</p>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
            </div>
            <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Next Milestone: 1000 pts (Premium Month)</p>
          </div>
        </div>
      ) : (
        <div className="px-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Curated Resources</h3>
            <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">AMAZON AFFILIATE</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {AFFILIATE_PRODUCTS.map(product => (
              <div key={product.id} className="glass overflow-hidden flex flex-col group border border-white/5">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 glass text-[8px] font-bold uppercase tracking-tighter">
                    {product.category}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-xs line-clamp-2 leading-tight">{product.title}</h4>
                    <p className="text-sm font-bold text-indigo-400 mt-1">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => handleExternalPurchase(product.affiliateUrl)}
                    className="w-full py-2 bg-white/10 hover:bg-white text-white hover:text-black font-bold text-[10px] rounded-lg border border-white/10 transition-all uppercase tracking-widest"
                  >
                    Buy on Amazon
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-6 bg-indigo-900/20 border border-indigo-500/20">
            <div className="flex items-start gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-xs font-bold uppercase mb-1">Affiliate Disclosure</h4>
                <p className="text-[9px] text-white/50 leading-relaxed">
                  Lumina is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Your purchases help support our AI ministry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EStore;
