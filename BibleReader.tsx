
import React, { useState, useEffect } from 'react';
import { fetchBibleParagraphs } from './geminiService';
import { BibleParagraph } from './types';

const BibleReader: React.FC = () => {
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(1);
  const [version, setVersion] = useState('KJV');
  const [paragraphs, setParagraphs] = useState<BibleParagraph[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadChapter = async (b: string, c: number, v: string) => {
    setLoading(true);
    setCurrentPage(0);
    try {
      const data = await fetchBibleParagraphs(b, c, v);
      setParagraphs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(book, chapter, version);
  }, [book, chapter, version]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const parts = searchQuery.split(' ');
    if (parts.length >= 2) {
      const b = parts.slice(0, -1).join(' ');
      const c = parseInt(parts[parts.length - 1]);
      if (!isNaN(c)) {
        setBook(b);
        setChapter(c);
      }
    }
    setSearchQuery('');
  };

  const currentPara = paragraphs[currentPage];

  return (
    <div className="space-y-6 pb-20">
      <div className="glass p-4 space-y-4 border-white/10">
        <form onSubmit={handleSearch} className="relative">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Book & Chapter (e.g. 'Psalm 23')..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white focus:border-indigo-500/50 transition-all"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">🔍</button>
        </form>

        <div className="flex justify-between items-center">
          <select 
            value={version} 
            onChange={(e) => setVersion(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-bold outline-none uppercase tracking-widest text-white"
          >
            <option value="KJV">KJV</option>
            <option value="NIV">NIV</option>
            <option value="ESV">ESV</option>
          </select>
          <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">{book} {chapter}</div>
        </div>
      </div>

      <div className="glass p-8 relative min-h-[450px] flex flex-col justify-center bg-black/10">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Opening the Scrolls...</p>
          </div>
        ) : currentPara ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl serif font-bold mb-6 text-center text-white/40">
              Page {currentPage + 1} of {paragraphs.length}
            </h2>
            <div className="space-y-6">
              <div className="text-xl leading-relaxed font-light text-white/90 serif italic text-center">
                {currentPara.verses.map((v) => (
                  <span key={v.ref} className="mr-1">
                    <sup className="text-[10px] font-black text-indigo-400 mr-1 opacity-60">{v.ref.split(':').pop()}</sup>
                    {v.text}
                  </span>
                ))}
              </div>
              
              <div className="h-px w-12 bg-white/20 mx-auto"></div>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Interpretation</p>
                <p className="text-sm italic text-white/70 leading-relaxed">
                  {currentPara.interpretation}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-white/40 italic">Chapter text unavailable.</p>
        )}
      </div>

      <div className="glass p-4 bg-indigo-900/20 border border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎬</span>
          <div className="text-[10px] font-bold uppercase tracking-widest">Watch Meditation</div>
        </div>
        <a 
          href="https://www.youtube.com/watch?v=vjlL2x0Cay0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-red-500 transition-colors"
        >
          YouTube Link
        </a>
      </div>

      <div className="flex gap-4">
        <button 
          disabled={currentPage === 0 || loading}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex-1 glass py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all disabled:opacity-20"
        >
          ← Previous
        </button>
        <button 
          disabled={currentPage >= paragraphs.length - 1 || loading}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="flex-1 glass py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all disabled:opacity-20"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default BibleReader;
