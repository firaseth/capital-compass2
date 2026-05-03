
import React, { useState } from 'react';
import { SAMPLE_ASSETS } from '../constants';

const typeColors: Record<string, { text: string; bg: string; dot: string }> = {
  'Equity':               { text: 'text-blue-400',   bg: 'bg-blue-500/10',   dot: 'bg-blue-400' },
  'Intellectual Property':{ text: 'text-purple-400', bg: 'bg-purple-500/10', dot: 'bg-purple-400' },
  'Cash':                 { text: 'text-green-400',  bg: 'bg-green-500/10',  dot: 'bg-green-400' },
  'Derivative':           { text: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-400' },
  'Fixed Income':         { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   dot: 'bg-cyan-400' },
  'Real Estate':          { text: 'text-[#D4AF37]',  bg: 'bg-yellow-500/10', dot: 'bg-[#D4AF37]' },
};

const statusConfig: Record<string, { label: string; text: string; bg: string; dot: string }> = {
  verified: { label: 'Verified',  text: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-500' },
  pending:  { label: 'Pending',   text: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500 animate-pulse' },
  flagged:  { label: 'Flagged',   text: 'text-red-400',   bg: 'bg-red-500/10',   dot: 'bg-red-500 animate-pulse' },
};

const riskColor: Record<string, string> = {
  None: 'text-slate-500',
  Low:  'text-green-400',
  Med:  'text-amber-400',
  High: 'text-red-400',
};

const AssetRegistry: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totalAUM = SAMPLE_ASSETS.reduce((sum, a) => sum + a.value, 0);
  const verifiedCount = SAMPLE_ASSETS.filter(a => a.status === 'verified').length;
  const flaggedCount = SAMPLE_ASSETS.filter(a => a.status === 'flagged').length;
  const pendingCount = SAMPLE_ASSETS.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total AUM</p>
          <p className="text-2xl font-bold text-white tabular-nums">${(totalAUM / 1_000_000).toFixed(2)}<span className="text-sm text-slate-500 font-normal ml-1">M</span></p>
          <p className="text-[9px] text-green-400 font-bold mt-1">+16.8% Blended YTD</p>
        </div>
        <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Assets</p>
          <p className="text-2xl font-bold text-white">{SAMPLE_ASSETS.length}</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1">Institutional Grade</p>
        </div>
        <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Verified</p>
          <p className="text-2xl font-bold text-green-400">{verifiedCount}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(verifiedCount / SAMPLE_ASSETS.length) * 100}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">{Math.round((verifiedCount / SAMPLE_ASSETS.length) * 100)}%</span>
          </div>
        </div>
        <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Flagged / Pending</p>
          </div>
          <div className="flex items-end gap-2">
            <p className={`text-2xl font-bold ${flaggedCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>{flaggedCount}</p>
            <p className="text-slate-600 font-bold mb-1">/ {pendingCount} pending</p>
          </div>
          <p className={`text-[9px] font-bold mt-1 ${flaggedCount > 0 ? 'text-red-400' : 'text-slate-600'}`}>
            {flaggedCount > 0 ? '⚠ Requires Review' : 'No active flags'}
          </p>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Portfolio Allocation by Asset Class</p>
          <span className="text-[9px] font-mono text-[#D4AF37]">SHA-256 SECURED</span>
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
          {SAMPLE_ASSETS.map(asset => {
            const pct = (asset.value / totalAUM) * 100;
            const cfg = typeColors[asset.type] || typeColors['Cash'];
            return (
              <div
                key={asset.id}
                className={`h-full ${cfg.dot} transition-all hover:opacity-80 cursor-pointer`}
                style={{ width: `${pct}%` }}
                title={`${asset.name}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
          {SAMPLE_ASSETS.map(asset => {
            const pct = ((asset.value / totalAUM) * 100).toFixed(1);
            const cfg = typeColors[asset.type] || typeColors['Cash'];
            return (
              <div key={asset.id} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></div>
                <span className="text-[9px] text-slate-400 font-medium">{asset.type}</span>
                <span className="text-[9px] text-slate-600 font-mono">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-[#081a1a] border border-teal-900/25 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Institutional Asset Ledger</h2>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">Real-time veracity monitoring — click any row for details</p>
          </div>
          <button className="text-[9px] font-black text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-widest">
            + Add Asset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Asset ID</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Portfolio Component</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Type</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">AUM Value</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Allocation</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">YTD</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ASSETS.map((asset) => {
                const pct = (asset.value / totalAUM) * 100;
                const typeCfg = typeColors[asset.type] || typeColors['Cash'];
                const statusCfg = statusConfig[asset.status] || statusConfig.pending;
                const isSelected = selectedId === asset.id;
                const ytdUp = (asset as any).ytd?.startsWith('+');

                return (
                  <React.Fragment key={asset.id}>
                    <tr
                      onClick={() => setSelectedId(isSelected ? null : asset.id)}
                      className={`border-b border-slate-800/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#D4AF37]/5 border-[#D4AF37]/10' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{asset.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isSelected && <span className="text-[#D4AF37] text-xs">▼</span>}
                          <p className="text-sm font-bold text-white">{asset.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide ${typeCfg.bg} ${typeCfg.text}`}>
                          <span className={`w-1 h-1 rounded-full ${typeCfg.dot}`}></span>
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-mono text-sm text-white font-bold">${asset.value.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${typeCfg.dot} rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 w-8 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-black text-xs ${ytdUp ? 'text-green-400' : 'text-red-400'}`}>{(asset as any).ytd}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${statusCfg.bg} ${statusCfg.text}`}>
                          <span className={`w-1 h-1 rounded-full ${statusCfg.dot}`}></span>
                          {statusCfg.label}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isSelected && (
                      <tr className="border-b border-[#D4AF37]/10 bg-black/20">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Veracity Hash</p>
                              <p className="font-mono text-[10px] text-[#D4AF37]">{asset.veracityHash}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Risk Rating</p>
                              <p className={`font-black text-sm ${riskColor[(asset as any).risk]}`}>{(asset as any).risk}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Allocation</p>
                              <p className="text-white font-bold text-sm">{pct.toFixed(2)}% of portfolio</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Veracity Protocol</p>
                              <p className="text-green-400 font-black text-[10px] uppercase">SHA-256 v1.0 ✓</p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button className="text-[9px] font-black text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-widest">
                              View Full Report
                            </button>
                            <button className="text-[9px] font-black text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">
                              Audit Trail
                            </button>
                            {asset.status === 'flagged' && (
                              <button className="text-[9px] font-black text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors uppercase tracking-widest">
                                Escalate to Compliance
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-800/40 flex justify-between items-center">
          <p className="text-[9px] font-mono text-slate-600">VERACITY_LOCK: sha256_institutional_v1.0 — {verifiedCount}/{SAMPLE_ASSETS.length} assets independently verified</p>
          <p className="text-[9px] text-slate-600 font-mono">Updated just now</p>
        </div>
      </div>
    </div>
  );
};

export default AssetRegistry;
