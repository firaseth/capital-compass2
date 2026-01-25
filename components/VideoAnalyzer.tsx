
import React, { useState } from 'react';
import { analyzeVideo } from '../services/geminiService';

const VideoAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [prompt, setPrompt] = useState('Analyze this video for financial trends and capital indicators.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeVideo(base64, prompt);
      setAnalysis(result || "No analysis available.");
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30">
      <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Video Intelligence Engine</h2>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Asset Analysis</label>
          <input 
            type="file" 
            accept="video/mp4" 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#D4AF37] file:text-slate-900 hover:file:bg-[#B8962F] cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analysis Protocol</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-black/40 border border-teal-900/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] min-h-[100px]"
            placeholder="Describe what you want to extract from the video..."
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className="w-full bg-[#D4AF37] text-slate-900 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-[#B8962F] transition-all disabled:opacity-50"
        >
          {isAnalyzing ? 'Processing Intelligence...' : 'Execute Video Underwriting'}
        </button>

        {analysis && (
          <div className="mt-8 p-6 bg-black/40 border border-teal-900/10 rounded-2xl">
             <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-4">Underwriting Report</h3>
             <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
               {analysis}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalyzer;
