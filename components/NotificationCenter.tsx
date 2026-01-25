
import React from 'react';
import { NOTIFICATIONS } from '../constants';

const NotificationCenter: React.FC = () => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
      {NOTIFICATIONS.map((notif) => (
        <div key={notif.id} className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            notif.type === 'success' ? 'bg-green-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
          }`}></div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-[10px] font-black uppercase text-white tracking-widest">{notif.title}</h4>
            <span className="text-[9px] text-slate-500 font-mono">{notif.time}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{notif.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
