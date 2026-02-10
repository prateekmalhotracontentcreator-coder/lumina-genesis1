
import React, { useState } from 'react';
import { CircleMember } from '../types';

const MOCK_CIRCLE: CircleMember[] = [
  { id: 'f1', name: 'Sarah Wilson', progress: 75, lastActive: '2m ago', prayers: ['Healing for her cat', 'New job interview'] },
  { id: 'f2', name: 'Mark Thompson', progress: 42, lastActive: '1h ago', prayers: ['Financial peace'] },
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
    setTimeout(() => setSyncing(false), 2000);
    
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
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="glass p-6 text-center border-b border-white/10 sticky top-0 backdrop-blur-2xl z-20">
        <h2 className="text-2xl serif font-bold text-white">Community Bridge</h2>
        <div className="flex gap-2 justify-center mt-6 overflow-x-auto no-scrollbar">
          {(['CIRCLE', 'CHAINS', 'SOCIAL'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[9px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full transition-all border ${
                activeTab === tab 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-transparent text-white/40 border-white/5 hover:border-white/20'
              }`}
            >
              {tab === 'CIRCLE' ? 'Faith Circle' : tab === 'CHAINS' ? 'Prayer Chains' : 'Social Bridge'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'CIRCLE' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {MOCK_CIRCLE.map(member => (
            <div key={member.id} className="glass p-5 border border-white/5 space-y-4 hover:bg-white/5 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg">
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{member.name}</h4>
                    <p className="text-[10px] text-white/40">{member.lastActive === 'Now' ? 'Connected' : member.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{member.progress}% Faith Score</span>
                  <div className="w-24 h-1 bg-white/5 rounded-full mt-1">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${member.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-white/5">
                {member.prayers.map((p, idx) => (
                  <div key={idx} className="bg-white/5 p-3 rounded-xl flex justify-between items-center group">
                    <span className="text-xs italic text-white/70">"{p}"</span>
                    <button 
                      onClick={() => togglePrayed(`${member.id}-${idx}`)}
                      className={`text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                        prayedIds.has(`${member.id}-${idx}`) 
                          ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg' 
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {prayedIds.has(`${member.id}-${idx}`) ? '✓ Prayed' : '🙏 Pray'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SOCIAL' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
          {/* Social Sync Hero */}
          <div className="glass p-8 text-center space-y-6 bg-gradient-to-br from-[#1877F2]/20 to-[#1DA1F2]/20 border border-blue-500/20 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
             <div className="text-4xl">🖇️</div>
             <div>
                <h3 className="text-xl serif font-bold">Lumina Social Bridge</h3>
                <p className="text-xs text-white/40 mt-2">Simultaneously broadcast your faith milestones to Facebook & X with AI-authored testimonies.</p>
             </div>
             
             <button 
                onClick={handleSocialSync}
                disabled={syncing}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-xl ${
                  syncing ? 'bg-blue-600/50 animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
             >
                {syncing ? 'Establishing Spiritual Bridge...' : 'Sync Active Testimony Now'}
             </button>
          </div>

          {/* Simulated Notifications Feed */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] px-2 flex justify-between items-center">
              <span>Bridge Activity</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </h4>
            
            <div className="space-y-3">
               {MOCK_SOCIAL_NOTIFS.map((notif, idx) => (
                 <div key={idx} className="glass p-4 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {notif.icon}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs text-white font-medium">
                         <span className="text-indigo-400">{notif.user}</span> {notif.action}
                       </p>
                       <p className="text-[10px] text-white/40 mt-0.5">{notif.time}</p>
                    </div>
                    <button className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Respond
                    </button>
                 </div>
               ))}
            </div>
          </div>

          {/* AI Response Bridge */}
          <div className="glass p-6 border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest">AI Social Proxy</h4>
                   <p className="text-[10px] text-white/40">Pastor AI is managing 3 engagement seeds.</p>
                </div>
             </div>
             <button className="text-[10px] font-black text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-full uppercase">
                Review Bridge
             </button>
          </div>
        </div>
      )}

      {activeTab === 'CHAINS' && (
        <div className="space-y-4 p-2 animate-in fade-in slide-in-from-left-2">
          <div className="glass p-8 text-center space-y-4 bg-indigo-600/10 border-indigo-500/20">
            <div className="text-4xl">🔗</div>
            <h3 className="text-xl serif font-bold">Global Prayer Chain</h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">Join thousands in a continuous cycle of prayer for world peace and individual healing.</p>
            <div className="flex justify-center gap-2">
              <span className="bg-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 tracking-widest uppercase animate-pulse">
                14,204 PRRAYING NOW
              </span>
            </div>
            <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm shadow-xl mt-4 hover:scale-105 transition-all">
              Connect to the Chain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
