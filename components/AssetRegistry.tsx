
import React from 'react';
import { SAMPLE_ASSETS } from '../constants';

const AssetRegistry: React.FC = () => {
  return (
    <div className="bg-[#081a1a] p-8 rounded-2xl border border-teal-900/30 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Institutional Asset Ledger</h2>
        <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/30 font-black">SHA-256 SECURED</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="py-4 px-2">Asset ID</th>
              <th className="py-4 px-2">Portfolio Component</th>
              <th className="py-4 px-2">Type</th>
              <th className="py-4 px-2">AUM Value</th>
              <th className="py-4 px-2">Veracity Hash</th>
              <th className="py-4 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {SAMPLE_ASSETS.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors group">
                <td className="py-4 px-2 font-mono text-xs">{asset.id}</td>
                <td className="py-4 px-2 font-bold text-white">{asset.name}</td>
                <td className="py-4 px-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[9px] uppercase font-bold">{asset.type}</span>
                </td>
                <td className="py-4 px-2 font-mono">${asset.value.toLocaleString()}</td>
                <td className="py-4 px-2 font-mono text-[9px] text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
                  {asset.veracityHash}
                </td>
                <td className="py-4 px-2 text-right">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                    asset.status === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500 animate-pulse'
                  }`}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetRegistry;
