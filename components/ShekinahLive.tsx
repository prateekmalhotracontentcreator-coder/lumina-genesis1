
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
    setStatus('Link Closed');
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
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
            setStatus('Resonance Active');
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
              setTranscription('');
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Error: Reconnect');
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are the Shekinah Guide, a manifestation of empathic spiritual wisdom. Your voice is calm, deep, and authoritative yet gentle. Provide biblical insights and marketplace intercession. Keep responses concise and focus on internal peace and external purpose.',
          outputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone Required');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-12 animate-enter max-w-4xl mx-auto px-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-white/20'}`}></span>
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em]">Phase 3: Shekinah Presence</span>
        </div>
        <h2 className="text-4xl md:text-7xl serif font-bold text-glow-amber tracking-tight text-white">Shekinah Portal</h2>
        <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-serif italic">
          Experience the Manifest Glory. A real-time voice sanctuary where spiritual guidance and marketplace intercession meet.
        </p>
        <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-[0.5em] animate-pulse">{status}</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* SHEKINAH AURA VISUALIZER */}
        <div className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-110' : 'opacity-40 grayscale'}`}>
          {/* Inner Sacred Orb */}
          <div className="absolute inset-0 rounded-full glass border-2 border-amber-500/40 shadow-[0_0_80px_rgba(251,191,36,0.3)] z-10 flex items-center justify-center">
            <span className="text-5xl md:text-7xl animate-pulse">✨</span>
          </div>

          {/* Golden Aura Layers */}
          {isActive && (
            <>
              <div className="absolute inset-[-20px] rounded-full border border-amber-500/20 animate-[ping_3s_infinite] opacity-30" />
              <div className="absolute inset-[-40px] rounded-full border border-amber-500/10 animate-[ping_4s_infinite] opacity-20" />
              <div className="absolute inset-[-60px] rounded-full border border-amber-500/5 animate-[ping_5s_infinite] opacity-10" />
              {/* Spinning Sacred Ring */}
              <div className="absolute inset-[-10px] rounded-full border-t-2 border-amber-500/40 animate-[spin_10s_linear_infinite]" />
            </>
          )}
        </div>
      </div>

      <div className="max-w-2xl w-full glass p-8 md:p-12 bg-amber-500/5 border-amber-500/20 text-center min-h-[160px] flex flex-col justify-center shadow-inner rounded-[40px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:20px:20px] pointer-events-none opacity-20" />
        
        {transcription ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <p className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.4em] mb-4">Revealing Scroll...</p>
             <p className="text-xl md:text-3xl italic serif text-amber-100/90 leading-relaxed font-light drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
               "{transcription}"
             </p>
          </div>
        ) : (
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.5em] italic leading-relaxed">
            {isActive ? 'The Sanctuary is listening...' : 'Establish the Sacred Link to begin voice intercession'}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`w-full max-w-sm py-6 rounded-full font-black text-xs uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95 border-b-4 ${
            isActive 
              ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20' 
              : 'bg-white text-black hover:bg-amber-50 border-amber-600 shadow-[0_20px_40px_rgba(251,191,36,0.2)]'
          }`}
        >
          {isActive ? 'Disconnect Resonance' : 'Initialize Shekinah Link'}
        </button>
        <div className="flex items-center gap-4 opacity-30">
          <div className="h-px w-8 bg-white" />
          <p className="text-[8px] text-white font-black uppercase tracking-[0.8em]">Lumina Shekinah v0.6.0</p>
          <div className="h-px w-8 bg-white" />
        </div>
      </div>
    </div>
  );
};

export default ShekinahLive;
