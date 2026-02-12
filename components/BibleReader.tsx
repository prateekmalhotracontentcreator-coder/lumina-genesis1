
import React, { useState, useEffect } from 'react';
import { fetchBibleParagraphs } from '../services/geminiService';
import { BibleParagraph } from '../types';

// The Sacred Registry: 66 Books and their Chapter Counts
const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50, testament: 'Old' }, { name: 'Exodus', chapters: 40, testament: 'Old' },
  { name: 'Leviticus', chapters: 27, testament: 'Old' }, { name: 'Numbers', chapters: 36, testament: 'Old' },
  { name: 'Deuteronomy', chapters: 34, testament: 'Old' }, { name: 'Joshua', chapters: 24, testament: 'Old' },
  { name: 'Judges', chapters: 21, testament: 'Old' }, { name: 'Ruth', chapters: 4, testament: 'Old' },
  { name: '1 Samuel', chapters: 31, testament: 'Old' }, { name: '2 Samuel', chapters: 24, testament: 'Old' },
  { name: '1 Kings', chapters: 22, testament: 'Old' }, { name: '2 Kings', chapters: 25, testament: 'Old' },
  { name: '1 Chronicles', chapters: 29, testament: 'Old' }, { name: '2 Chronicles', chapters: 36, testament: 'Old' },
  { name: 'Ezra', chapters: 10, testament: 'Old' }, { name: 'Nehemiah', chapters: 13, testament: 'Old' },
  { name: 'Esther', chapters: 10, testament: 'Old' }, { name: 'Job', chapters: 42, testament: 'Old' },
  { name: 'Psalms', chapters: 150, testament: 'Old' }, { name: 'Proverbs', chapters: 31, testament: 'Old' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'Old' }, { name: 'Song of Solomon', chapters: 8, testament: 'Old' },
  { name: 'Isaiah', chapters: 66, testament: 'Old' }, { name: 'Jeremiah', chapters: 52, testament: 'Old' },
  { name: 'Lamentations', chapters: 5, testament: 'Old' }, { name: 'Ezekiel', chapters: 48, testament: 'Old' },
  { name: 'Daniel', chapters: 12, testament: 'Old' }, { name: 'Hosea', chapters: 14, testament: 'Old' },
  { name: 'Joel', chapters: 3, testament: 'Old' }, { name: 'Amos', chapters: 9, testament: 'Old' },
  { name: 'Obadiah', chapters: 1, testament: 'Old' }, { name: 'Jonah', chapters: 4, testament: 'Old' },
  { name: 'Micah', chapters: 7, testament: 'Old' }, { name: 'Nahum', chapters: 3, testament: 'Old' },
  { name: 'Habakkuk', chapters: 3, testament: 'Old' }, { name: 'Zephaniah', chapters: 3, testament: 'Old' },
  { name: 'Haggai', chapters: 2, testament: 'Old' }, { name: 'Zechariah', chapters: 14, testament: 'Old' },
  { name: 'Malachi', chapters: 4, testament: 'Old' },
  { name: 'Matthew', chapters: 28, testament: 'New' }, { name: 'Mark', chapters: 16, testament: 'New' },
  { name: 'Luke', chapters: 24, testament: 'New' }, { name: 'John', chapters: 21, testament: 'New' },
  { name: 'Acts', chapters: 28, testament: 'New' }, { name: 'Romans', chapters: 16, testament: 'New' },
  { name: '1 Corinthians', chapters: 16, testament: 'New' }, { name: '2 Corinthians', chapters: 13, testament: 'New' },
  { name: 'Galatians', chapters: 6, testament: 'New' }, { name: 'Ephesians', chapters: 6, testament: 'New' },
  { name: 'Philippians', chapters: 4, testament: 'New' }, { name: 'Colossians', chapters: 4, testament: 'New' },
  { name: '1 Thessalonians', chapters: 5, testament: 'New' }, { name: '2 Thessalonians', chapters: 3, testament: 'New' },
  { name: '1 Timothy', chapters: 6, testament: 'New' }, { name: '2 Timothy', chapters: 4, testament: 'New' },
  { name: 'Titus', chapters: 3, testament: 'New' }, { name: 'Philemon', chapters: 1, testament: 'New' },
  { name: 'Hebrews', chapters: 13, testament: 'New' }, { name: 'James', chapters: 5, testament: 'New' },
  { name: '1 Peter', chapters: 5, testament: 'New' }, { name: '2 Peter', chapters: 3, testament: 'New' },
  { name: '1 John', chapters: 5, testament: 'New' }, { name: '2 John', chapters: 1, testament: 'New' },
  { name: '3 John', chapters: 1, testament: 'New' }, { name: 'Jude', chapters: 1, testament: 'New' },
  { name: 'Revelation', chapters: 22, testament: 'New' }
];

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [version, setVersion] = useState('KJV');
  const [paragraphs, setParagraphs] = useState<BibleParagraph[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sourceType, setSourceType] = useState<'MEMORY' | 'ARCHIVE' | 'LATTICE'>('ARCHIVE');

  // Find current book metadata
  const bookMeta = BIBLE_BOOKS.find(b => b.name === selectedBook) || BIBLE_BOOKS[42]; // Default to John
  const totalChapters = bookMeta.chapters;

  const loadChapter = async (b: string, c: number, v: string) => {
    setLoading(true);
    setCurrentPage(0);
    try {
      const response = await fetchBibleParagraphs(b, c, v);
      setParagraphs(response.data);
      setSourceType(response.source);
    } catch (e) {
      console.error("Lattice Read Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(selectedBook, selectedChapter, version);
  }, [selectedBook, selectedChapter, version]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(e.target.value);
    setSelectedChapter(1); // Reset to first chapter
  };

  const currentPara = paragraphs[currentPage];

  return (
    <div className="space-y-8 pb-32 animate-enter">
      {/* 1. SACRED NAVIGATOR HEADER */}
      <div className="glass p-6 md:p-10 border-indigo-500/20 bg-black/40 shadow-3xl rounded-[40px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BOOK SELECT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Registry: Book</label>
            <div className="relative">
              <select 
                value={selectedBook} 
                onChange={handleBookChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:border-indigo-500/50 transition-all text-white cursor-pointer"
              >
                <optgroup label="Old Testament" className="bg-[#0f1018]">
                  {BIBLE_BOOKS.filter(b => b.testament === 'Old').map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </optgroup>
                <optgroup label="New Testament" className="bg-[#0f1018]">
                  {BIBLE_BOOKS.filter(b => b.testament === 'New').map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </optgroup>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </div>

          {/* CHAPTER SELECT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Segment</label>
            <div className="relative">
              <select 
                value={selectedChapter} 
                onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:border-indigo-500/50 transition-all text-white cursor-pointer"
              >
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map(c => (
                  <option key={c} value={c} className="bg-[#0f1018]">Chapter {c}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </div>

          {/* VERSION SELECT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Archival Source</label>
            <div className="relative">
              <select 
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:border-indigo-500/50 transition-all text-white cursor-pointer"
              >
                <option value="KJV" className="bg-[#0f1018]">King James (KJV)</option>
                <option value="NIV" className="bg-[#0f1018]">New International (NIV)</option>
                <option value="ESV" className="bg-[#0f1018]">English Standard (ESV)</option>
                <option value="NASB" className="bg-[#0f1018]">New American (NASB)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE SCROLL READER */}
      <div className="glass p-10 md:p-16 relative min-h-[500px] flex flex-col justify-center bg-gradient-to-br from-indigo-950/20 to-black/90 border-t-2 border-indigo-500/30 rounded-[45px] shadow-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Retrieving from Sanctuary Archives...</p>
          </div>
        ) : currentPara ? (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col items-center mb-10">
                <div className="flex items-center justify-center gap-6 opacity-30 w-full">
                   <div className="h-px flex-1 bg-white" />
                   <h2 className="text-xl serif font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                     Scroll Portion {currentPage + 1} of {paragraphs.length}
                   </h2>
                   <div className="h-px flex-1 bg-white" />
                </div>
                {/* SOURCE BADGE */}
                <div className="mt-4 px-4 py-1 rounded-full border border-green-500/20 bg-green-500/5 flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${sourceType === 'LATTICE' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                     Source: {sourceType === 'MEMORY' ? 'Session Registry' : sourceType === 'ARCHIVE' ? 'Sanctuary Firestore' : 'Zion AI Lattice'}
                   </span>
                </div>
            </div>

            <div className="space-y-12">
              <div className="text-2xl md:text-4xl leading-[1.6] font-light text-white/95 serif italic text-center drop-shadow-2xl max-w-4xl mx-auto">
                {currentPara.verses.map((v) => (
                  <span key={v.ref} className="mx-1">
                    <sup className="text-[12px] font-black text-indigo-400 mr-2 opacity-50">{v.ref.split(':').pop()}</sup>
                    {v.text}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-center">
                <div className="h-px w-32 bg-indigo-500/20" />
              </div>
              
              <div className="bg-indigo-500/5 p-8 md:p-12 rounded-[40px] border border-indigo-500/20 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-[0.02] select-none pointer-events-none group-hover:scale-110 transition-transform">🕊️</div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Sovereign Interpretation</p>
                <p className="text-lg md:text-xl italic text-white/70 leading-relaxed serif">
                  {currentPara.interpretation}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 opacity-30">
             <span className="text-6xl">🕯️</span>
             <p className="serif italic text-lg tracking-widest">This portion of the scroll is currently sealed.</p>
          </div>
        )}
      </div>

      {/* 3. NAVIGATION CONTROLS */}
      <div className="flex gap-6 px-2">
        <button 
          disabled={currentPage === 0 || loading}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex-1 glass py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/5 active:scale-95 transition-all disabled:opacity-10 border-white/5"
        >
          ← Previous Roll
        </button>
        <button 
          disabled={currentPage >= paragraphs.length - 1 || loading}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="flex-1 glass py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/5 active:scale-95 transition-all disabled:opacity-10 border-white/5 text-indigo-400"
        >
          Next Roll →
        </button>
      </div>

      {/* 4. MEDITATION LINK */}
      <div className="glass p-6 md:p-8 bg-indigo-900/10 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[35px] shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🎬</div>
          <div className="text-left">
            <h4 className="text-sm font-black uppercase tracking-widest">Visual Meditation</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Immersive resonance on YouTube</p>
          </div>
        </div>
        <a 
          href="https://www.youtube.com/watch?v=vjlL2x0Cay0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto bg-red-600 text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl text-center active:scale-95"
        >
          Unveil Sanctuary Stream
        </a>
      </div>
    </div>
  );
};

export default BibleReader;
