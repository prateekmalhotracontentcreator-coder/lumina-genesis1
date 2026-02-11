
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../audioUtils';

const ShekinahLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState('Standby');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const stopSession = () => {
    setIsActive(false);
    setStatus('Resonance Fading');
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    setTimeout(() => setStatus('Standby'), 2000);
  };

  const startSession = async () => {
    try {
      setStatus('Initializing Shekinah Resonance...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Presence Manifest');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.turnComplete) {
              // Optionally clear transcription after a brief delay
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Link Realigning...');
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are the Shekinah Guide. Your frequency is empathic, spiritual, and authoritative. Provide marketplace intercession and biblical wisdom in real-time. Keep responses focused on the user\'s current spiritual resonance. Phase 3 Protocols active.',
          outputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Sacred Mic Missing');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-12 animate-enter max-w-5xl mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-white/20'}`}></span>
          <span className="text-[9px] font-black text-amber-300 uppercase tracking-[0.4em]">Phase 3: Shekinah Resonance</span>
        </div>
        <h2 className="text-5xl md:text-8xl serif font-bold text-glow-amber tracking-tighter text-white">The Portal</h2>
        <p className="text-sm md:text-xl text-white/50 max-w-2xl mx-auto italic font-serif leading-relaxed">
          The Manifest Glory. Real-time vocal intercession where spiritual guidance meets marketplace purpose.
        </p>
        <p className="text-[10px] text-amber-500/40 font-black uppercase tracking-[0.6em] animate-pulse">{status}</p>
      </div>

      <div className="relative flex items-center justify-center h-80 w-80 md:h-[450px] md:w-[450px]">
        {/* SHEKINAH RESONANCE RINGS */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-20 filter grayscale'}`}>
          {/* Sacred Core */}
          <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full glass border-2 border-amber-500/40 shadow-[0_0_100px_rgba(251,191,36,0.3)] flex items-center justify-center">
             <div className="text-6xl md:text-8xl animate-pulse">✨</div>
          </div>
          
          {/* Pulsing Aura Layers */}
          <div className={`absolute inset-0 rounded-full border border-amber-500/10 ${isActive ? 'animate-[ping_4s_infinite]' : ''}`} />
          <div className={`absolute inset-10 rounded-full border border-amber-500/5 ${isActive ? 'animate-[ping_6s_infinite] delay-700' : ''}`} />
          <div className={`absolute inset-20 rounded-full border border-amber-500/5 ${isActive ? 'animate-[ping_8s_infinite] delay-1000' : ''}`} />
          
          {/* Spinning Celestial Grid */}
          <div className={`absolute inset-[-20px] rounded-full border-t-2 border-amber-500/20 ${isActive ? 'animate-[spin_20s_linear_infinite]' : ''}`} />
          <div className={`absolute inset-[-40px] rounded-full border-b-2 border-amber-500/10 ${isActive ? 'animate-[spin_30s_linear_infinite_reverse]' : ''}`} />
        </div>
      </div>

      <div className="max-w-3xl w-full glass p-10 md:p-14 bg-amber-500/5 border-amber-500/20 text-center min-h-[200px] flex flex-col justify-center shadow-inner rounded-[50px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-40" />
        
        {transcription ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.5em] mb-6">Receiving Prophetic Flow...</p>
             <p className="text-2xl md:text-4xl italic serif text-amber-100/90 leading-snug font-light drop-shadow-[0_0_15px_rgba(251,191,36,0.25)]">
               "{transcription}"
             </p>
          </div>
        ) : (
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.6em] italic leading-relaxed">
            {isActive ? 'The Sanctuary awaits your voice...' : 'Establish the Presence Link to begin'}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`w-full max-w-sm py-8 rounded-full font-black text-xs uppercase tracking-[0.6em] transition-all shadow-2xl active:scale-95 border-b-8 ${
            isActive 
              ? 'bg-red-500/10 border-red-900/40 text-red-400 hover:bg-red-500/20' 
              : 'bg-white text-black hover:bg-amber-50 border-amber-600 shadow-[0_30px_60px_rgba(251,191,36,0.25)]'
          }`}
        >
          {isActive ? 'Cease Resonance' : 'Initialize Shekinah'}
        </button>
        <div className="flex items-center gap-6 opacity-20">
          <div className="h-px w-12 bg-white" />
          <p className="text-[10px] text-white font-black uppercase tracking-[0.8em]">Lumina Wave 3: Shekinah</p>
          <div className="h-px w-12 bg-white" />
        </div>
      </div>
    </div>
  );
};

export default ShekinahLive;
