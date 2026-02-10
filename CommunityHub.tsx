
import React, { useState } from 'react';
import { CircleMember } from './types';

const MOCK_CIRCLE: CircleMember[] = [
  { id: 'f1', name: 'Sarah Wilson', progress: 75, lastActive: '2m ago', prayers: ['Healing for her cat', 'New job interview'] },
  { id: 'f2', name: 'Mark Thompson', progress: 42, lastActive: '1h ago', prayers: ['Financial peace', 'Guidance for son'] },
  { id: 'f3', name: 'Anna Grace', progress: 90, lastActive: 'Now', prayers: ['Family reconciliation'] },
];

const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CIRCLE' | 'CHAINS'>('CIRCLE');
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

  const togglePrayed = (id: string) => {
    const newSet = new Set(prayedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setPrayedIds(newSet);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass p-6 text-center border-b border-white/10 sticky top-0 backdrop-blur-xl z-10">
        <h2 className="text-2xl serif font-bold text-white">Community Hub</h2>
        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Intercession & Connection</p>
        
        <div className="flex gap-4 justify-center mt-6">
          <button 
            onClick={() => setActiveTab('CIRCLE')}
            className={`text-xs font-bold px-6 py-2 rounded-full transition-all border ${
              activeTab === 'CIRCLE' 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
            }`}
          >
            My Circle
          </button>
          <button 
            onClick={() => setActiveTab('CHAINS')}
            className={`text-xs font-bold px-6 py-2 rounded-full transition-all border ${
              activeTab === 'CHAINS' 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
            }`}
          >
            Prayer Chains
          </button>
        </div>
      </div>

      {activeTab === 'CIRCLE' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider">Active Members</h3>
            <button className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-full hover:bg-indigo-500/30 transition-all">+ Invite</button>
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
                      <p className="text-[10px] text-white/40">{member.lastActive === 'Now' ? 'Online' : member.lastActive}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{member.progress}% Faith Score</span>
                  <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${member.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Prayer Requests</p>
                {member.prayers.map((p, idx) => (
                  <div key={idx} className="bg-white/5 p-3 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all">
                    <span className="text-xs italic text-white/80">"{p}"</span>
                    <button 
                      onClick={() => togglePrayed(`${member.id}-${idx}`)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                        prayedIds.has(`${member.id}-${idx}`) 
                          ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                          : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                      }`}
                    >
                      {prayedIds.has(`${member.id}-${idx}`) ? '🙏 Prayed' : 'Pray'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="glass p-6 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 text-center space-y-3 mx-2">
            <span className="text-2xl">🎁</span>
            <p className="text-xs text-yellow-400/90 font-medium">Encourage your circle! Gift a 7-Day Reading Plan using your points.</p>
            <button className="text-[10px] font-bold bg-yellow-500 text-black px-6 py-2 rounded-full uppercase tracking-widest hover:scale-105 transition-all shadow-lg">Open Gift Shop</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-2 animate-in fade-in slide-in-from-right-2">
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
              <span className="text-[10px] font-bold text-white tracking-widest">14,204 PRAYING NOW</span>
            </div>
            
            <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 hover:scale-105 transition-all">
              Join the Chain
            </button>
          </div>
          
          <div className="glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Share Request To</h4>
            <div className="grid grid-cols-3 gap-3">
              <button className="glass p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                <span className="text-[9px] font-bold text-white/60 group-hover:text-white">WhatsApp</span>
              </button>
              <button className="glass p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
                <span className="text-[9px] font-bold text-white/60 group-hover:text-white">Contacts</span>
              </button>
              <button className="glass p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">✉️</span>
                <span className="text-[9px] font-bold text-white/60 group-hover:text-white">Email</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 text-center">
             <p className="text-[10px] text-white/30 italic">"For where two or three gather in my name, there am I with them." — Matthew 18:20</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
