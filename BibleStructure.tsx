
import React from 'react';

const BibleStructure: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 text-white">
      <div className="glass p-8 text-center bg-gradient-to-b from-white/10 to-transparent border-t border-white/20">
        <h2 className="text-3xl serif font-bold mb-2">The Living Word</h2>
        <p className="text-sm text-white/60">Understanding sacred organization.</p>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 border-white/10">
          <h3 className="text-xl serif font-bold mb-4 flex items-center gap-2">
            📜 <span>Two Testaments</span>
          </h3>
          <div className="space-y-4 text-sm text-white/70 leading-relaxed">
            <p>
              <strong className="text-indigo-400">Old Testament (39 Books):</strong> The foundation of our faith, covering creation, the law, and the prophets anticipating the Messiah.
            </p>
            <p>
              <strong className="text-indigo-400">New Testament (27 Books):</strong> The life of Jesus Christ, the birth of the Church, and the promise of His return.
            </p>
          </div>
        </div>

        <div className="glass p-6 border-white/10">
          <h3 className="text-xl serif font-bold mb-4 flex items-center gap-2">
            🏗️ <span>Hierarchy of Truth</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-xs font-bold uppercase text-white/40 block mb-1">Books</span>
              <p className="text-sm">The Bible is a library of 66 separate books written by 40 authors over 1,500 years.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-xs font-bold uppercase text-white/40 block mb-1">Chapters</span>
              <p className="text-sm">Added in the 13th century to help navigate longer texts. There are 1,189 chapters in total.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-xs font-bold uppercase text-white/40 block mb-1">Verses</span>
              <p className="text-sm">The smallest unit of study, added in the 16th century for precise reference and memorization.</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 text-center italic text-sm text-white/60">
          "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
          <p className="text-[10px] font-bold mt-2">— 2 Timothy 3:16</p>
        </div>
      </div>
    </div>
  );
};

export default BibleStructure;
