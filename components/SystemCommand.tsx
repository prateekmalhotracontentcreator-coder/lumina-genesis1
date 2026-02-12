
import React, { useState, useEffect } from 'react';
import { seedChapterToArchive, fetchBibleParagraphs } from '../services/geminiService';
import { CURRENT_CONFIG, auth, signInWithPopup, googleProvider, signOut, db, getDoc, doc } from '../services/firebase';

const BIBLE_BOOKS_META = [
  { name: 'Genesis', chapters: 50 }, { name: 'Exodus', chapters: 40 }, { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 }, { name: 'Deuteronomy', chapters: 34 }, { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 }, { name: 'Ruth', chapters: 4 }, { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 }, { name: '1 Kings', chapters: 22 }, { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 }, { name: '2 Chronicles', chapters: 36 }, { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 }, { name: 'Esther', chapters: 10 }, { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 }, { name: 'Proverbs', chapters: 31 }, { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 }, { name: 'Isaiah', chapters: 66 }, { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 }, { name: 'Ezekiel', chapters: 48 }, { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 }, { name: 'Joel', chapters: 3 }, { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 }, { name: 'Jonah', chapters: 4 }, { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 }, { name: 'Habakkuk', chapters: 3 }, { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 }, { name: 'Zechariah', chapters: 14 }, { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 }, { name: 'Mark', chapters: 16 }, { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 }, { name: 'Acts', chapters: 28 }, { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 }, { name: '2 Corinthians', chapters: 13 }, { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 }, { name: 'Philippians', chapters: 4 }, { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 }, { name: '2 Thessalonians', chapters: 3 }, { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 }, { name: 'Titus', chapters: 3 }, { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 }, { name: 'James', chapters: 5 }, { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 }, { name: '1 John', chapters: 5 }, { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 }, { name: 'Jude', chapters: 1 }, { name: 'Revelation', chapters: 22 }
];

const SystemCommand: React.FC = () => {
  const [pulse, setPulse] = useState(14216);
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS_META[0].name);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);
  const [archiveLog, setArchiveLog] = useState<string[]>(["Awaiting Architect Command..."]);
  const [stats, setStats] = useState({ new: 0, verified: 0, failed: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);
  
  // Diagnostic State
  const [authKeyError, setAuthKeyError] = useState(false);
  const [firestoreMissingError, setFirestoreMissingError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      if (user) {
        checkFirestoreHealth();
      }
    });

    const checkFirestoreHealth = async () => {
      try {
        // Attempt to read from a doc just to verify connection to the named DB
        await getDoc(doc(db, "health_check", "ping"));
        setFirestoreMissingError(false);
        setArchiveLog(prev => [`SYNC: Connection to node '${CURRENT_CONFIG.databaseId}' established.`, ...prev]);
      } catch (err: any) {
        // If the error code is 'not-found' for the DATABASE, then it's a real missing DB
        if (err?.code === 'not-found' && err?.message?.includes('database')) {
          setFirestoreMissingError(true);
        }
      }
    };

    if (isAuthenticated) checkFirestoreHealth();

    const interval = setInterval(() => {
      setPulse(p => p + (Math.random() > 0.5 ? 1 : -1));
    }, 2500);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsVerifying(true);
    setAuthKeyError(false);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Architect Auth Failed:", err);
      const code = err?.code || "";
      const msg = err?.message || "";
      if (code === 'auth/api-key-not-valid' || msg.toLowerCase().includes('api-key-not-valid')) {
        setAuthKeyError(true);
      } else {
        setArchiveLog(prev => [`ERROR: ${code || 'Auth Exception'}`, ...prev]);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTechnicalReset = async () => {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    setArchiveLog(prev => ["PURGE: Handshake cache cleared. Re-initializing...", ...prev]);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleStartArchival = async () => {
    if (!isAuthenticated || firestoreMissingError) return;
    const bookData = BIBLE_BOOKS_META.find(b => b.name === selectedBook);
    if (!bookData || isArchiving) return;

    setIsArchiving(true);
    setArchiveProgress(0);
    setStats({ new: 0, verified: 0, failed: 0 });
    setArchiveLog([`INIT: Archival Sequence for ${selectedBook.toUpperCase()}...`]);

    const total = bookData.chapters;
    const batchSize = 3; 
    
    for (let i = 1; i <= total; i += batchSize) {
      const currentBatch = [];
      for (let j = 0; j < batchSize && (i + j) <= total; j++) {
        currentBatch.push(i + j);
      }

      await Promise.all(currentBatch.map(async (chapterNum) => {
        try {
          const existing = await fetchBibleParagraphs(selectedBook, chapterNum, "KJV");
          if (Array.isArray(existing) && existing.length > 0) {
            setStats(s => ({ ...s, verified: s.verified + 1 }));
            setArchiveLog(prev => [`SKIP: Chapter ${chapterNum} verified.`, ...prev].slice(0, 10));
          } else {
            await seedChapterToArchive(selectedBook, chapterNum, "KJV");
            setStats(s => ({ ...s, new: s.new + 1 }));
            setArchiveLog(prev => [`SUCCESS: Chapter ${chapterNum} migrated.`, ...prev].slice(0, 10));
          }
        } catch (err: any) {
          setStats(s => ({ ...s, failed: s.failed + 1 }));
          setArchiveLog(prev => [`FAIL: Chapter ${chapterNum} realigning...`, ...prev].slice(0, 10));
        }
      }));

      setArchiveProgress(Math.min(100, Math.floor(((i + currentBatch.length - 1) / total) * 100)));
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsArchiving(false);
  };

  const credentialUrl = `https://console.cloud.google.com/apis/credentials?project=${CURRENT_CONFIG.projectId}`;

  return (
    <div className="space-y-8 pb-32 animate-enter max-w-6xl mx-auto px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Architect Console</span>
          </div>
          <h2 className="text-4xl md:text-7xl serif italic font-bold text-white tracking-tighter leading-none text-glow-green">System Command</h2>
          <div className="flex flex-col gap-1">
             <p className="text-xs text-white/40 font-mono italic">Project: {CURRENT_CONFIG.projectId}</p>
             <p className="text-[10px] text-green-500/60 font-mono">Node ID: {CURRENT_CONFIG.databaseId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Resonance Score</p>
          <p className="text-5xl font-bold text-white tabular-nums tracking-tighter text-glow-indigo">{pulse.toLocaleString()}</p>
        </div>
      </header>

      {/* ERROR: AUTH API KEY INVALID */}
      {authKeyError && (
        <div className="glass p-10 bg-red-500/10 border-red-500/30 rounded-[45px] animate-in fade-in slide-in-from-top-4 duration-700 space-y-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-4xl border border-red-500/40 shadow-glow-red">🔒</div>
              <div className="space-y-1">
                 <h3 className="text-3xl font-bold text-red-400 serif">Auth Handshake Rejected</h3>
                 <p className="text-sm text-white/80 max-w-xl">
                   The Google Identity Toolkit rejected your API key. This usually means the key restriction settings are still propagating.
                 </p>
              </div>
           </div>
           <div className="bg-black/60 rounded-[35px] p-8 border border-white/5 space-y-6">
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Handshake Alignment Protocol:</h4>
              <ol className="text-xs text-white/70 space-y-4 list-decimal pl-6 leading-relaxed">
                 <li>Confirm the key in <a href={credentialUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline font-bold">GCP Console</a> has "Identity Toolkit" enabled.</li>
                 <li>If you just changed restrictions, wait <b>2-3 minutes</b> for Google's global sync.</li>
                 <li>Click <b>"Force Technical Reset"</b> below to clear cached auth states.</li>
              </ol>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button onClick={handleLogin} disabled={isVerifying} className="flex-1 py-5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-3xl">
                   {isVerifying ? 'Verifying Protocol...' : 'Try Alignment Again'}
                 </button>
                 <button onClick={handleTechnicalReset} className="flex-1 py-5 glass border-white/20 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
                   Force Technical Reset
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* LOGIN PROMPT */}
      {!isAuthenticated && !authKeyError && (
        <div className="glass p-12 bg-indigo-500/10 border-indigo-500/30 rounded-[50px] text-center space-y-8 animate-enter">
           <div className="w-24 h-24 rounded-full bg-indigo-500/20 mx-auto flex items-center justify-center text-5xl border border-indigo-500/40 shadow-glow-indigo">👤</div>
           <div className="space-y-2">
              <h3 className="text-3xl serif font-bold text-white tracking-tight">Identity Required</h3>
              <p className="text-sm text-white/50 max-w-sm mx-auto italic">Access to the Zion repository requires an authorized Architect session.</p>
           </div>
           <button onClick={handleLogin} disabled={isVerifying} className="px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-3xl active:scale-95 border-b-4 border-indigo-600">
             {isVerifying ? 'Establishing Link...' : 'Initialize Architect Session'}
           </button>
        </div>
      )}

      {/* REPOSITORY ENGINE */}
      <section className={`glass p-10 md:p-14 border-amber-500/20 bg-amber-950/5 rounded-[50px] shadow-3xl relative overflow-hidden transition-all duration-700 ${( !isAuthenticated || firestoreMissingError ) ? 'opacity-30 pointer-events-none' : ''}`}>
         <div className="absolute top-0 right-0 p-10 text-[10rem] text-amber-500/5 font-black serif italic pointer-events-none select-none uppercase">REPO</div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-2">
                  <h3 className="text-3xl serif font-bold text-white tracking-tight">Sanctuary Repository</h3>
                  <p className="text-sm text-white/40 italic font-serif leading-relaxed">Populate the Sanctuary Firestore with KJV Paragraphs.</p>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest px-2">Target Volume</label>
                    <select 
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      disabled={isArchiving}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-amber-500/50 text-white transition-all cursor-pointer shadow-inner"
                    >
                      {BIBLE_BOOKS_META.map(b => (
                        <option key={b.name} value={b.name} className="bg-[#0f1018]">{b.name} ({b.chapters} Chapters)</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleStartArchival} disabled={isArchiving} className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-3xl ${isArchiving ? 'bg-amber-500/20 text-amber-500 animate-pulse' : 'bg-white text-black hover:bg-amber-50 border-b-4 border-amber-600'}`}>
                    {isArchiving ? 'Synchronizing...' : 'Initialize Migration'}
                  </button>
               </div>
            </div>

            <div className="flex flex-col justify-between space-y-8">
               <div className="grid grid-cols-3 gap-4">
                  <div className="glass p-5 border-white/5 bg-black/40 rounded-3xl text-center">
                     <p className="text-[8px] font-black text-white/30 uppercase mb-1">New</p>
                     <p className="text-3xl font-bold text-green-500">{stats.new}</p>
                  </div>
                  <div className="glass p-5 border-white/5 bg-black/40 rounded-3xl text-center">
                     <p className="text-[8px] font-black text-white/30 uppercase mb-1">Synced</p>
                     <p className="text-3xl font-bold text-blue-500">{stats.verified}</p>
                  </div>
                  <div className="glass p-5 border-white/5 bg-black/40 rounded-3xl text-center">
                     <p className="text-[8px] font-black text-white/30 uppercase mb-1">Drift</p>
                     <p className="text-3xl font-bold text-red-500">{stats.failed}</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Progress</span>
                    <span className="text-3xl font-mono text-white font-bold">{archiveProgress}%</span>
                 </div>
                 <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transition-all duration-700 rounded-full" style={{ width: `${archiveProgress}%` }} />
                 </div>
               </div>

               <div className="bg-black/60 border border-white/5 rounded-[30px] p-6 h-48 font-mono text-[10px] text-amber-500/60 uppercase overflow-y-auto no-scrollbar shadow-inner leading-relaxed">
                  {archiveLog.map((log, i) => (
                    <div key={i} className={i === 0 ? 'text-amber-400 border-l-2 border-amber-400 pl-3 mb-2' : 'pl-3 opacity-40 mb-1'}>
                      [{new Date().toLocaleTimeString([], {hour12: false})}] {log}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
      
      <footer className="text-center opacity-10 pb-10">
         <p className="text-[9px] font-black uppercase tracking-[0.8em]">Exodus Migration Status: {isAuthenticated ? 'LINK_ACTIVE' : 'AWAITING_AUTH'}</p>
      </footer>
    </div>
  );
};

export default SystemCommand;
