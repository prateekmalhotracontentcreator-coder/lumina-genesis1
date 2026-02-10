import React, { useState } from 'react';
import { CircleMember } from './types';

const MOCK_CIRCLE: CircleMember[] = [
  { id: 'f1', name: 'Sarah Wilson', progress: 75, lastActive: '2m ago', prayers: ['Healing for her cat', 'New job interview'] },
  { id: 'f2', name: 'Mark Thompson', progress: 42, lastActive: '1h ago', prayers: ['Financial peace', 'Guidance for son'] },
  { id: 'f3', name: 'Anna Grace', progress: 90, lastActive: 'Now', prayers: ['Family reconciliation'] },
];

const MOCK_SOCIAL_NOTIFS = [
  { user: 'John Doe', action: 'shared your testimony on Facebook', time: '5m ago', icon: '👤' },
  { user: 'Pastor Mike', action: 'reacted with ❤️ on X', time: '12m ago', icon: '⛪' },
  { user: 'Community Global', action: 'verified your Berean claim', time: '1h ago', icon: '🌐' }
];

const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CIRCLE' | 'CHAINS' | 'SOCIAL'>('CIRCLE');
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  const togglePrayed = (id: string) => {
    const newSet = new Set(prayedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setPrayedIds(newSet);
  };

  const handleSocialSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      // Web Share API Integration
      if (navigator.share) {
        navigator.share({
          title: 'Lumina Testimony',
          text: 'I just experienced a divine breakthrough on Lumina: Genesis. God is good!',
          url: 'https://lumina.genesis'
        }).catch(console.error);
      } else {
        window.open('https://facebook.com/sharer/sharer.php?u=https://lumina.genesis', '_blank');
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="glass p-6 text-center border-b border-white/10 sticky top-0 backdrop-blur-2xl z-20">
        <h2 className="text-2xl serif font-bold text-white">Community Bridge</h2>
        <div className="flex gap-1 justify-center mt-6 overflow-x-auto no-scrollbar bg-black/20 p-1 rounded-full border border-white/5">
          {(['CIRCLE', 'CHAINS', 'SOCIAL'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[8px] font-black tracking-widest uppercase px-4 py-2.5 rounded-full transition-all flex-1 whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'CIRCLE' ? 'Circle' : tab === 'CHAINS' ? 'Chains' : 'Bridge'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'CIRCLE' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 px-1">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Inner Circle</h3>
            <button className="text-[9px] text-indigo-300 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">+ Invite Members</button>
          </div>
          
          {MOCK_CIRCLE.map(member => (
            <div key={member.id} className="glass p-5 border border-white/5 space-y-4 hover:bg-white/5 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg border border-white/10">
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{member.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${member.lastActive === 'Now' ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`}></span>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{member.lastActive === 'Now' ? 'Online' : member.lastActive}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{member.progress}% Devotion</span>
                  <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${member.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-white/5">
                {member.prayers.map((p, idx) => (
                  <div key={idx} className="bg-white/5 p-3 rounded-xl flex justify-between items-center group">
                    <span className="text-xs italic text-white/80 line-clamp-1 flex-1 pr-2">"{p}"</span>
                    <button 
                      onClick={() => togglePrayed(`${member.id}-${idx}`)}
                      className={`text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                        prayedIds.has(`${member.id}-${idx}`) 
                          ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg' 
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {prayedIds.has(`${member.id}-${idx}`) ? '✓ Prayed' : '🙏 Pray'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="glass p-6 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center space-y-3">
            <span className="text-2xl">🎁</span>
            <p className="text-xs text-amber-200/90 font-medium">Build each other up! Gift a 7-Day Reading Plan to your circle.</p>
            <button className="text-[9px] font-bold bg-amber-500 text-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg active:scale-95 transition-all">Gift Devotional</button>
          </div>
        </div>
      )}

      {activeTab === 'CHAINS' && (
        <div className="space-y-6 px-1 animate-in fade-in slide-in-from-left-2">
          <div className="glass p-8 text-center space-y-4 bg-gradient-to-b from-blue-600/20 to-transparent border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            <div className="text-5xl mb-2">🌍</div>
            <h3 className="text-xl serif font-bold text-white">Global Prayer Chain</h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">Join thousands in a continuous cycle of prayer for world peace, healing, and revival.</p>
            
            <div className="inline-flex items-center justify-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-black text-white tracking-widest uppercase">14,204 PRAYING NOW</span>
            </div>
            
            <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl mt-4 active:scale-95 transition-all">
              Join the Chain
            </button>
          </div>
          
          <div className="glass p-6 space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40">Marketplace Intercession</h4>
            <div className="grid grid-cols-3 gap-3">
              {['Tech', 'Health', 'Finance'].map(tag => (
                <button key={tag} className="glass p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                  <span className="text-lg opacity-60">🏷️</span>
                  <span className="text-[9px] font-bold text-white/60 uppercase group-hover:text-white">{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SOCIAL' && (
        <div className="space-y-6 px-1 animate-in fade-in slide-in-from-right-2">
          <div className="glass p-8 text-center space-y-6 bg-gradient-to-br from-[#1877F2]/20 to-[#1DA1F2]/20 border border-blue-500/20 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
             <div className="text-4xl">🖇️</div>
             <div>
                <h3 className="text-xl serif font-bold">Social Bridge</h3>
                <p className="text-xs text-white/40 mt-2">Broadcast your faith milestones to social networks with AI-authored testimonies.</p>
             </div>
             
             <button 
                onClick={handleSocialSync}
                disabled={syncing}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl ${
                  syncing ? 'bg-blue-600/50 animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
             >
                {syncing ? 'Establishing Bridge...' : 'Sync Active Testimony'}
             </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] px-2 flex justify-between items-center">
              <span>Community Activity</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </h4>
            
            <div className="space-y-3">
               {MOCK_SOCIAL_NOTIFS.map((notif, idx) => (
                 <div key={idx} className="glass p-4 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {notif.icon}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs text-white/90">
                         <span className="text-indigo-400 font-bold">{notif.user}</span> {notif.action}
                       </p>
                       <p className="text-[9px] text-white/30 uppercase mt-0.5">{notif.time}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;