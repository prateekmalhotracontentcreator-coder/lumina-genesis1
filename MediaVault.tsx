
import React, { useState } from 'react';
import { generateWallpaper, generateSpeech } from './geminiService';
import { decodeBase64, decodeAudioData } from './audioUtils';

interface MediaVaultProps {
  isPremium: boolean;
  onSubscribe: () => void;
  userName: string;
}

const STATIC_WALLPAPERS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=1080', title: 'Eternal Light' },
  { id: '2', url: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?auto=format&fit=crop&q=80&w=1080', title: 'Peaceful Path' },
  { id: '3', url: 'https://images.unsplash.com/photo-1438109491414-7198515b166b?auto=format&fit=crop&q=80&w=1080', title: 'Divine Morning' },
];

const STATIC_TONES = [
  { id: 't1', title: 'Angelic Harp', type: 'Ringtone', duration: '0:30' },
  { id: 't2', title: 'Mountain Echo', type: 'Alarm', duration: '0:15' },
  { id: 't3', title: 'Deep Peace', type: 'Ambient', duration: '2:00' },
];

const MediaVault: React.FC<MediaVaultProps> = ({ isPremium, onSubscribe, userName }) => {
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'tones' | 'alarms'>('wallpapers');
  const [genImage, setGenImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [versePrompt, setVersePrompt] = useState('');
  
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleDownload = async (url: string, filename: string) => {
    setIsDownloading(url);
    try {
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${filename}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Download failed', error);
      window.open(url, '_blank');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleGenWallpaper = async () => {
    if (!isPremium) return onSubscribe();
    if (!versePrompt) return;
    setIsGenerating(true);
    try {
      const url = await generateWallpaper(versePrompt);
      setGenImage(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenAlarm = async () => {
    if (!isPremium) return onSubscribe();
    
    // Create AudioContext immediately to capture user gesture
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    setIsSynthesizing(true);
    try {
      const text = `Good morning ${userName}. Rise and shine, for the Lord has made this day. Let us rejoice and be glad in it. Your strength is renewed like the eagle. Amen.`;
      
      const base64 = await generateSpeech(text);
      if (!base64) throw new Error("No audio data received from AI Pastor.");

      // Resume context in case it was created in suspended state
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (e) {
      console.error("Alarm synthesis failed:", e);
      alert("The AI Pastor is currently resting. Please try your alarm preview again in a moment.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass p-6 text-center">
        <h2 className="text-2xl serif font-bold">Media Vault</h2>
        <div className="flex gap-4 justify-center mt-4">
          {(['wallpapers', 'tones', 'alarms'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'wallpapers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {STATIC_WALLPAPERS.map(wp => (
              <div key={wp.id} className="glass aspect-[9/16] overflow-hidden group relative border border-white/5">
                <img src={wp.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={wp.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white">{wp.title}</p>
                  <button 
                    onClick={() => handleDownload(wp.url, wp.title.replace(/\s+/g, '-').toLowerCase())}
                    disabled={isDownloading === wp.url}
                    className="text-[9px] text-blue-400 font-bold hover:text-blue-300 mt-2 flex items-center gap-1 uppercase tracking-tighter"
                  >
                    {isDownloading === wp.url ? 'Preparing...' : '⬇ Download Image'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-6 space-y-4 border border-white/10 shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
            <h4 className="text-sm font-bold flex items-center gap-2">
              ✨ AI Custom Wallpaper
              {!isPremium && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">PREMIUM</span>}
            </h4>
            <p className="text-[10px] text-white/40">Enter a verse or vision to create unique spiritual art for your device.</p>
            <input 
              placeholder="e.g. 'A peaceful valley with the light of God'..."
              value={versePrompt}
              onChange={(e) => setVersePrompt(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-all"
            />
            <button 
              onClick={handleGenWallpaper}
              disabled={isGenerating}
              className="w-full py-4 bg-white text-black font-bold rounded-xl text-xs hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              {isGenerating ? '🎨 Painting with Light...' : 'Generate Dynamic Artwork'}
            </button>
            {genImage && (
              <div className="mt-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="glass aspect-[9/16] overflow-hidden border border-indigo-500/30">
                  <img src={genImage} className="w-full h-full object-cover" alt="Generated spiritual art" />
                </div>
                <button 
                  onClick={() => handleDownload(genImage, 'lumina-custom-wallpaper')}
                  disabled={isDownloading === genImage}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl"
                >
                  {isDownloading === genImage ? '⏳ Downloading...' : '📥 Save to Gallery'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tones' && (
        <div className="space-y-3">
          {STATIC_TONES.map(tone => (
            <div key={tone.id} className="glass p-4 flex items-center gap-4 border border-white/5 hover:border-white/20 transition-all">
              <button className="w-10 h-10 glass-dark rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">▶</button>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{tone.title}</h4>
                <p className="text-[10px] text-white/40">{tone.type} • {tone.duration}</p>
              </div>
              <button className="text-[10px] bg-white text-black px-4 py-1.5 rounded-full font-bold shadow-md active:scale-95 transition-all">GET</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alarms' && (
        <div className="space-y-6">
          <div className="glass p-8 text-center space-y-6 border border-white/10 bg-gradient-to-br from-indigo-900/20 to-transparent shadow-2xl">
            <div className="text-5xl animate-bounce">⏰</div>
            <div>
              <h4 className="text-xl serif font-bold">Prophetic Alarms</h4>
              <p className="text-xs text-white/40 mt-2 max-w-xs mx-auto">Wake up to the Word. A personalized morning blessing synthesized to start your day in grace.</p>
            </div>
            <button 
              onClick={handleGenAlarm}
              disabled={isSynthesizing}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-xs shadow-[0_10px_30px_rgba(99,102,241,0.3)] active:scale-95 transition-all"
            >
              {isSynthesizing ? 'Tuning Frequencies...' : '🔊 Preview My Morning Alarm'}
            </button>
          </div>

          <div className="glass p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Consistency Scheduler</h4>
            <div className="space-y-3">
              {[ {t: '06:00 AM', l: 'Morning Prayer'}, {t: '12:00 PM', l: 'Midday Reflection'}, {t: '09:00 PM', l: 'Bedtime Story'} ].map((a, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <span className="font-bold text-lg">{a.t}</span>
                  <span className="text-xs text-white/40 italic">{a.l}</span>
                  <div className="w-10 h-6 bg-indigo-500/30 rounded-full relative cursor-pointer border border-white/10">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all"></div>
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

export default MediaVault;
