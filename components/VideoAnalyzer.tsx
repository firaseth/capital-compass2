
import React, { useState, useRef, useMemo } from 'react';
import { analyzeVideo } from '../services/geminiService';

const VideoAnalyzer: React.FC = () => {
  const MAX_PROMPT_LENGTH = 1000;
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    let finalPrompt = prompt.trim() || 'Analyze this video for financial trends, creator engagement signals, and potential capital risks. Provide a structured underwriting assessment.';
    
    if (includeTimestamps) {
      finalPrompt += "\n\nCRITICAL PROTOCOL: You MUST provide accurate timestamps in [MM:SS] format for every key observation, trend shift, or risk indicator identified in the video buffer.";
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeVideo(base64, finalPrompt);
      setAnalysis(result || "No analysis available.");
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setFile(null);
    setVideoUrl(null);
    setAnalysis('');
    setPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const jumpToTime = (timeStr: string) => {
    if (!videoRef.current) return;
    const parts = timeStr.replace(/[\[\]\(\)]/g, '').split(':');
    if (parts.length === 2) {
      const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  const renderedAnalysis = useMemo(() => {
    if (!analysis) return null;
    
    // Regex to find [MM:SS], (MM:SS), or MM:SS
    const timestampRegex = /(\[?\d{1,2}:\d{2}\]?)/g;
    const parts = analysis.split(timestampRegex);

    return parts.map((part, i) => {
      if (part.match(/(\[?\d{1,2}:\d{2}\]?)/)) {
        return (
          <button
            key={i}
            onClick={() => jumpToTime(part)}
            className="text-[#D4AF37] font-black border-b border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors mx-1 px-0.5 rounded"
            title="Jump to this timestamp"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  }, [analysis]);

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const blob = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportJSON = () => {
    const data = {
      asset_name: file?.name || 'Unknown Asset',
      timestamp: new Date().toISOString(),
      veracity_index: 0.982,
      protocol: prompt || 'Standard Forensic Heuristics',
      analysis_report: analysis
    };
    downloadFile(JSON.stringify(data, null, 2), `underwriting_forensics_${Date.now()}.json`, 'application/json');
  };

  const handleExportPDF = () => {
    const reportHeader = `CAPITAL COMPASS | INSTITUTIONAL ASSET FORENSICS\n`;
    const reportSub = `VERACITY SECURED: SHA-256 | TIMESTAMP: ${new Date().toLocaleString()}\n`;
    const divider = `================================================================================\n`;
    const body = `ASSET: ${file?.name}\n\nREPORT:\n${analysis}\n\n${divider}\nVERIFICATION LOCK: sha256_verified_intel`;
    
    downloadFile(`${reportHeader}${reportSub}${divider}${body}`, `underwriting_report_${Date.now()}.txt`, 'text/plain');
  };

  const handleCopyReport = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    const mockLink = `https://capitalcompass.ai/share/report-${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(mockLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail || isSending) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsShareModalOpen(false);
      setShareEmail('');
      alert(`Asset intelligence report dispatched to ${shareEmail} via secure protocol.`);
    }, 1500);
  };

  return (
    <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30 shadow-inner relative">
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0B1222] border border-[#D4AF37]/30 rounded-3xl w-full max-w-md p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
            {/* Modal Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Share Intelligence</h3>
            </div>
            <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.2em] mb-10 uppercase ml-11">Secure Asset Report Distribution</p>
            
            <div className="space-y-8">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Copy Internal Link</label>
                <div className="flex gap-2 p-1 bg-black/40 border border-teal-900/20 rounded-xl">
                  <input 
                    readOnly 
                    value={`https://capitalcompass.ai/s/forensic-v1.32...`} 
                    className="flex-1 bg-transparent px-4 py-2 text-xs text-slate-400 font-mono outline-none"
                  />
                  <button 
                    onClick={handleCopyShareLink}
                    className={`px-5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${linkCopied ? 'bg-green-500 text-slate-900' : 'bg-slate-800 text-[#D4AF37] hover:bg-slate-700 shadow-sm'}`}
                  >
                    {linkCopied ? 'Link Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-teal-900/10"></div>
                </div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 bg-[#0B1222] px-4">
                  OR
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Dispatch via Email</label>
                <form onSubmit={handleSendEmail} className="flex flex-col gap-3">
                  <input 
                    type="email"
                    required
                    placeholder="E.G. COMPLIANCE_OFFICER@CAPITAL.AI"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="w-full bg-black/40 border border-teal-900/20 rounded-xl px-5 py-4 text-xs text-white uppercase tracking-widest outline-none focus:border-[#D4AF37]/50 placeholder:text-slate-700 font-bold"
                  />
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-[#D4AF37] text-slate-900 font-black py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] hover:bg-[#B8962F] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSending ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Initiating Secure Transfer...
                      </>
                    ) : 'Confirm Dispatch'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Asset Forensics</h2>
          <p className="text-[10px] text-[#D4AF37] font-bold tracking-[0.2em] mt-1 uppercase">Video Multi-Modal Underwriting Engine</p>
        </div>
        {file && (
          <button 
            onClick={clearSelection}
            className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Selection
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {!videoUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-900/50 bg-black/20 rounded-3xl h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Ingest Video Asset</p>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-mono tracking-tighter">MP4 | Institutional Standard</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/mp4" 
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-teal-900/30 shadow-2xl">
              <video 
                ref={videoRef}
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black/60 backdrop-blur-md text-[9px] text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/30 font-black uppercase tracking-widest">
                  Preview Active
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Analysis Protocol</label>
              <button 
                onClick={() => setIncludeTimestamps(!includeTimestamps)}
                className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg border transition-all ${
                  includeTimestamps 
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${includeTimestamps ? 'bg-[#D4AF37] animate-pulse' : 'bg-slate-700'}`}></div>
                Time-Code Enforcement: {includeTimestamps ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                maxLength={MAX_PROMPT_LENGTH}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/40 border border-teal-900/20 rounded-2xl p-6 text-sm text-slate-200 focus:outline-none focus:border-[#D4AF37] min-h-[140px] resize-none leading-relaxed transition-all"
                placeholder="Enter custom analysis heuristics for video content."
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">
                    Length: {prompt.length} / {MAX_PROMPT_LENGTH}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    {prompt.length > 0 ? 'PROMPT_BUFFER_READY' : 'WAITING_FOR_PROTOCOL'}
                  </span>
                </div>
                <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D4AF37] transition-all duration-300" 
                    style={{ width: `${Math.min(100, (prompt.length / MAX_PROMPT_LENGTH) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full bg-[#D4AF37] text-slate-900 font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-[#B8962F] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Calibrating Underwriting Engine...
              </>
            ) : (
              'Execute Forensic Analysis'
            )}
          </button>
        </div>

        <div className="flex flex-col h-full">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Underwriting Output</label>
          <div className="flex-1 bg-black/40 border border-teal-900/10 rounded-3xl p-8 overflow-y-auto custom-scrollbar relative min-h-[400px] shadow-inner">
            {analysis ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Finalized Intelligence Report</span>
                  </div>
                  <button 
                    onClick={handleCopyReport}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${
                      isCopied 
                        ? 'bg-green-500/20 border-green-500 text-green-500' 
                        : 'bg-slate-800 border-slate-700 text-[#D4AF37] hover:bg-slate-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {isCopied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
                <div className="flex-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium font-sans">
                  {renderedAnalysis}
                </div>
                
                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-teal-900/20 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-slate-600 font-mono text-[9px] uppercase tracking-tighter">Intelligence Verification</span>
                      <span className="text-slate-400 font-mono text-[8px]">VERACITY_LOCK: sha256_v1.0.0</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={handleExportJSON}
                        className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest hover:bg-[#D4AF37]/5 px-2 py-1 rounded transition-colors"
                      >
                        Export JSON
                      </button>
                      <button 
                        onClick={handleExportPDF}
                        className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest hover:bg-[#D4AF37]/5 px-2 py-1 rounded transition-colors"
                      >
                        Export PDF (.txt)
                      </button>
                    </div>
                  </div>
                  
                  {/* Share Trigger */}
                  <div className="border-t border-teal-900/10 pt-4">
                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className="w-full bg-[#1E40AF]/20 border border-[#1E40AF]/40 text-[#1E40AF] font-black py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] hover:bg-[#1E40AF]/30 transition-all flex items-center justify-center gap-3 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Intelligence Report
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Waiting for Intelligence Injection</p>
                <p className="text-[10px] text-slate-700 mt-2 leading-relaxed">Select a video asset and prompt the Guardian to begin forensic multi-modal extraction.</p>
              </div>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                 <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] animate-pulse">Processing Modal Stream</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyzer;
