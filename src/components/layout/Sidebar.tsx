import React from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Video,
  Image as ImageIcon,
  GitFork,
  Terminal,
  Settings,
  HardDrive,
  Users,
  Activity,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, accounts, tasks, workers } = useStudio();

  const activeWorkerCount = workers.filter((w) => w.status !== 'idle').length;
  const queuedCount = tasks.filter((t) => t.status === 'queued' || t.status === 'processing').length;
  const readyAccs = accounts.filter((a) => a.enabled && a.creditRemaining > 0).length;

  const navItems = [
    {
      id: 'video' as const,
      label: 'Flow Video',
      sublabel: 'Video Hàng Loạt (1 Ảnh Ref)',
      icon: Video,
      badge: queuedCount > 0 ? queuedCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'image' as const,
      label: 'Flow Ảnh',
      sublabel: 'Tạo Ảnh (Tối Đa 3 Ảnh Ref)',
      icon: ImageIcon,
    },
    {
      id: 'character' as const,
      label: 'Đồng Nhất Nhân Vật',
      sublabel: 'Tạo Video & Hướng Dẫn',
      icon: GitFork,
    },
    {
      id: 'logs' as const,
      label: 'Log Chi Tiết',
      sublabel: 'Terminal Console',
      icon: Terminal,
    },
    {
      id: 'settings' as const,
      label: 'Cài Đặt & Tài Khoản',
      sublabel: 'Quản Lý 20+ Acc & Proxy',
      icon: Settings,
      badge: `${readyAccs}/${accounts.length}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Phân Hệ Chức Năng
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="truncate">
                  <div className="font-semibold truncate">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono border font-semibold shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Resource & Automation Status Panel */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070b12]/60">
        <div className="rounded-lg bg-[#0f1624] border border-slate-800/80 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Động Cơ Đa Luồng
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-400">
              {activeWorkerCount}/4 Online
            </span>
          </div>

          {/* 4 Mini Progress bars for the 4 concurrent threads */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {workers.map((w) => (
              <div key={w.id} className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      w.status === 'rendering'
                        ? 'bg-indigo-500'
                        : w.status === 'downloading'
                        ? 'bg-cyan-400'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${w.progress}%` }}
                  />
                </div>
                <div className="text-[9px] font-mono text-center text-slate-500">T{w.id}</div>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-500" />
              Bộ Nhớ Đệm
            </span>
            <span className="font-mono text-slate-300">Ổ D: 142 GB Trống</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-500" />
              Xoay Vòng Acc
            </span>
            <span className="font-mono text-emerald-400 font-semibold">Tự động (On)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
