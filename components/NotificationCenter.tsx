
import React from 'react';
import { NOTIFICATIONS } from '../constants';

const typeConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  success: {
    color: 'text-green-400',
    bg: 'bg-green-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    color: 'text-amber-400',
    bg: 'bg-amber-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  info: {
    color: 'text-blue-400',
    bg: 'bg-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const NotificationCenter: React.FC = () => {
  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
      {NOTIFICATIONS.map((notif) => {
        const cfg = typeConfig[notif.type] || typeConfig.info;
        return (
          <div key={notif.id} className="flex gap-3 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors group">
            <div className={`mt-0.5 w-5 h-5 rounded-full ${cfg.bg}/10 border ${cfg.bg.replace('bg-', 'border-')}/30 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5 gap-2">
                <h4 className="text-[10px] font-black uppercase text-white tracking-wider truncate">{notif.title}</h4>
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">{notif.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationCenter;
