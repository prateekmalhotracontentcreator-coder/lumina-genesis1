import React, { useState, useRef, useEffect } from 'react';
import { getAIChaplainAdviceExtended, generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../services/audioUtils';

const BIBLE_BOOKS_REGEX = /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s?Samuel|2\s?Samuel|1\s?Kings|2\s?Kings|1\s?Chronicles|2\s?Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song\sof\sSolomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s?Corinthians|2\s?Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s?Thessalonians|2\s?Thessalonians|1\s?Timothy|2\s?Timothy|Titus|Philemon|Hebrews|James|1\s?Peter|2\s?Peter|1\s?John|2\s?John|3\s?John|Jude|Revelation)\s+\d+(?::\d+(?:-\d+)?)?\b/gi;

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(BIBLE_BOOKS_REGEX);
  const matches = text.match(BIBLE_BOOKS_REGEX);

  if (!matches) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold shadow-sm shadow-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-default group">
              <span className="text-[10px] opacity-70 group-hover:scale-110 transition-transform">📖</span>
              {matches[i]}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

interface Message {
  role: 'user' | 'ai';
  text: string;
  image?: string;
  sources?: { title: string; uri: string }[];
}

const AIChaplain: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Peace be with you. I am your Lumina Spiritual Guide. How can I help you walk closer with the Lord today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const speakMessage = async (text: string, index: number) => {
    if (isSpeaking !== null) return;
    setIsSpeaking(index);
    try {
      const base64 = await generateSpeech(text);
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, audioCtxRef.current, 24000, 1);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsSpeaking(null);
      source.start();
    } catch (e) {
      console.error(e);
      setIsSpeaking(null);
    }
  };

  const handleSend = async () => {
    if ((!input && !selectedImage) || loading) return;
    
    const userMsg = input || (selectedImage ? "Please interpret this spiritually." : "");
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: currentImage || undefined }]);
    setLoading(true);

    try {
      const response = await getAIChaplainAdviceExtended(userMsg, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'ai', text: response.text, sources: response.sources }]);
    } catch (e: any) {
      if (e.message === "QUOTA_EXHAUSTED") {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "The Sanctuary is currently in a moment of Sacred Rest due to high resonance (Quota Limit). Please meditate in the Bible scrolls for a few moments, or check your billing status. The light will return shortly." 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the heavenly host right now. Let's pray together instead." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[75vh] flex flex-col glass p-4 shadow-2xl overflow-hidden bg-black/20 relative">
      <div className="flex-1 overflow-y-auto space-y-6 p-2 no-scrollbar">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed relative group ${
              m.role === 'user' 
                ? 'bg-blue-600/40 border border-blue-400/20 text-white shadow-lg' 
                : 'bg-white/10 border border-white/10 text-white/90 shadow-[0_5px_15px_rgba(0,0,0,0.2)]'
            }`}>
              {m.image && (
                <img 
                  src={m.image} 
                  alt="Spiritual Insight" 
                  className="w-full h-auto rounded-lg mb-3 border border-white/10 shadow-inner" 
                />
              )}
              
              <div className="relative">
                {m.role === 'ai' ? (
                  <FormattedText text={m.text} />
                ) : (
                  m.text
                )}

                {m.role === 'ai' && (
                  <button 
                    onClick={() => speakMessage(m.text, idx)}
                    className={`ml-2 inline-flex items-center justify-center transition-all ${isSpeaking === idx ? 'animate-pulse text-indigo-400' : 'opacity-40 hover:opacity-100'}`}
                    title="Listen to the Pastor"
                  >
                    {isSpeaking === idx ? '🔊' : '🔉'}
                  </button>
                )}
              </div>

              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Sources & Grounding</p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s, si) => (
                      <a 
                        key={si} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-md transition-colors text-indigo-300 line-clamp-1"
                      >
                        🔗 {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-xl animate-pulse flex items-center gap-3">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
               <span className="text-xs text-white/40 italic">Pastor is reflecting on current events and scripture...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 relative z-10">
        {selectedImage && (
          <div className="relative w-20 h-20 ml-2 animate-in fade-in zoom-in-95 duration-300">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-xl border border-white/20 shadow-lg" 
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20 shadow-xl"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-xl hover:bg-indigo-500/40 transition-all active:scale-95"
            title="Upload Vision"
          >
            📷
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything spiritual..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none text-white transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:bg-white/90 disabled:opacity-20 transition-all shadow-xl active:scale-95"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChaplain;