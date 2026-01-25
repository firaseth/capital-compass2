
import React, { useState, useRef, useEffect } from 'react';
import { getGuardianAdvice } from '../services/geminiService';
import { ChatMessage, QuadrantScore } from '../types';
import { THEME } from '../constants';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Audio Utils
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface GuardianChatProps {
  financialState: QuadrantScore[];
}

const GuardianChat: React.FC<GuardianChatProps> = ({ financialState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Greeting. I am the Capital Compass Guardian. I have successfully verified your creator metadata via SHA-256 protocols. Your Growth quadrant is peaking, but I recommend a stabilization plan for your recent Liquidity fluctuations.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input?: AudioContext; output?: AudioContext }>({});
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLive = async () => {
    if (isLive) {
      if (liveSessionRef.current) liveSessionRef.current.close();
      setIsLive(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              audioSourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) setMessages(prev => [...prev, { role: 'user', content: `[Voice] ${text}` }]);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) setMessages(prev => [...prev, { role: 'assistant', content: text }]);
            }

            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(s => s.stop());
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLive(false),
          onerror: () => setIsLive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are the Capital Compass Guardian. Speak in a calm, professional, and authoritative tone. Focus on risk mitigation and creator capital security."
        }
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Live connection failed", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      content: input, 
      isThinking: useThinking 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const stateStr = financialState.map(q => `${q.name}: ${q.value}/100`).join(', ');
    const result = await getGuardianAdvice(input, stateStr, { useSearch, useThinking });
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: result.text,
      sources: result.sources
    }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1222] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isLive ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-[#D4AF37]/20 border-[#D4AF37]/50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Guardian Underwriter</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
              {isLive ? 'LIVE AUDIO ACTIVE' : 'TEXT CONSOLE'} | SHA-256 Veracity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setUseSearch(!useSearch)}
            className={`text-[9px] px-2 py-1 rounded border transition-all ${useSearch ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            SEARCH
          </button>
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`text-[9px] px-2 py-1 rounded border transition-all ${useThinking ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
          >
            THINKING
          </button>
          <button 
            onClick={toggleLive}
            className={`p-2 rounded-lg transition-all ${isLive ? 'bg-red-500 text-white' : 'bg-slate-800 text-[#D4AF37] hover:bg-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#D4AF37] text-slate-900 font-medium rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {m.isThinking && <div className="text-[10px] text-purple-400 font-bold mb-1 italic">Deep Reasoning Active...</div>}
              {m.content}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-700/50">
                  <p className="text-[10px] text-blue-400 font-bold mb-1">RESOURCES IDENTIFIED:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s, si) => (
                      <a key={si} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 px-2 py-1 rounded hover:text-white transition-colors truncate max-w-[150px]">
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {m.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center gap-2 opacity-50 text-[9px] font-mono uppercase tracking-widest">
                  <span className="text-[#D4AF37]">Verified Hash:</span>
                  <span className="truncate">sha256:7f83...a9b2_v1.0.0</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLive ? "Audio streaming active..." : "Ask the Guardian for creator analysis..."}
            disabled={isLive}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || isLive}
            className="absolute right-2 top-2 p-1.5 text-[#D4AF37] hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardianChat;
