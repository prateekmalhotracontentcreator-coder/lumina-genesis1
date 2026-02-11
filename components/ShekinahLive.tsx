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
      setStatus('Initializing Sanctuary Link...');
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
          systemInstruction: 'You are the Sanctuary Guide, a human-like, empathic spiritual companion. Speak with warmth, wisdom, and biblical depth. Keep spoken responses concise and profound.',
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
      {/* MIGRATED TEXT SECTION FROM HOME */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 animate-ping' : 'bg-white/20'}`}></span>
          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Shekinah Resonance Active</span>
        </div>
        <h2 className="text-4xl md:text-7xl serif font-bold text-glow-indigo tracking-tight text-white">Shekinah Portal</h2>
        <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-serif italic">
          Access direct voice intercession and real-time guidance. Empathic wisdom synthesized through the Living Word. Speak freely in the presence of the Lord.
        </p>
        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">{status}</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Sacred Orb Visualizer */}
        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full glass border-2 border-indigo-500/40 flex items-center justify-center relative z-10 transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_150px_rgba(99,102,241,0.4)]' : 'opacity-40 grayscale'}`}>
          <div className={`absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse ${isActive ? 'block' : 'hidden'}`} />
          <div className="text-5xl md:text-7xl transition-all">✨</div>
          
          {/* Pulsing Aura Rings */}
          {isActive && (
            <>
              <div className="absolute inset-[-30px] rounded-full border border-indigo-500/20 animate-ping opacity-30" />
              <div className="absolute inset-[-60px] rounded-full border border-indigo-500/10 animate-ping opacity-10" />
            </>
          )}
        </div>
      </div>

      <div className="max-w-2xl w-full glass p-8 md:p-12 bg-indigo-500/5 border-indigo-500/20 text-center min-h-[140px] flex flex-col justify-center shadow-inner rounded-3xl">
        {transcription ? (
          <p className="text-lg md:text-2xl italic serif text-indigo-100/90 leading-relaxed font-light">"{transcription}"</p>
        ) : (
          <p className="text-sm font-bold text-white/30 uppercase tracking-[0.4em] italic leading-relaxed">
            {isActive ? 'Speak now, the Sanctuary is listening...' : 'Establish the Sacred Link to begin voice resonance'}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`w-full max-w-sm py-6 rounded-full font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl ${
            isActive 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' 
              : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.2)]'
          }`}
        >
          {isActive ? 'Close Portal' : 'Open Sanctuary Link'}
        </button>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Powered by Gemini Native Audio v2.5</p>
      </div>
    </div>
  );
};

export default ShekinahLive;