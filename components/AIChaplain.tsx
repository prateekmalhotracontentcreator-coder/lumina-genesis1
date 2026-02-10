import React, { useState, useRef, useEffect } from 'react';
// Fixed: getAIChaplainAdvice was not exported from geminiService; using getAIChaplainAdviceExtended instead.
import { getAIChaplainAdviceExtended } from '../services/geminiService';

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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold shadow-sm shadow-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-default group">
              <span className="text-[10px] opacity-70 group-hover:scale-110 transition-transform">📖</span>
              {matches[i]}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const AIChaplain: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, image?: string }[]>([
    { role: 'ai', text: 'Peace be with you. I am your Lumina Spiritual Guide. How can I help you walk closer with the Lord today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSend = async () => {
    if ((!input && !selectedImage) || loading) return;
    
    const userMsg = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMsg || (currentImage ? "Spiritual Vision Shared" : ""), 
      image: currentImage || undefined 
    }]);
    setLoading(true);

    try {
      // Fixed: Using getAIChaplainAdviceExtended and extracting text property from response object.
      const response = await getAIChaplainAdviceExtended(userMsg, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. Let's pray together instead." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[75vh] flex flex-col glass p-4 shadow-2xl overflow-hidden bg-black/20 border border-white/5">
      <div className="flex-1 overflow-y-auto space-y-6 p-2 no-scrollbar">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600/40 border border-blue-400/20 text-white shadow-lg' 
                : 'bg-white/10 border border-white/10 text-white/90'
            }`}>
              {m.image && (
                <img 
                  src={m.image} 
                  alt="Spiritual Insight" 
                  className="w-full h-auto rounded-lg mb-3 border border-white/10 shadow-md" 
                />
              )}
              {m.role === 'ai' ? (
                <FormattedText text={m.text} />
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl animate-pulse text-xs text-white/40 italic flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Pastor is reflecting on scripture...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
        {selectedImage && (
          <div className="relative w-20 h-20 ml-2 animate-in fade-in zoom-in-95 duration-300">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-xl border-2 border-indigo-500/50 shadow-2xl" 
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
          {/* CAMERA ICON BUTTON */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl hover:bg-indigo-500/30 transition-all active:scale-90 shadow-inner"
            title="Upload Spiritual Image"
          >
            📷
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or share a photo..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none text-white placeholder-white/30 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading || (!input && !selectedImage)}
            className="bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:bg-white/90 disabled:opacity-20 disabled:grayscale shadow-xl transition-all"
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChaplain;