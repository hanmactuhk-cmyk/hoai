import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Play, Pause, Square, Sparkles, Shield, Cpu, RefreshCw, Folder, Settings2 } from 'lucide-react';
import { FlowAgentSettingsModal } from '../modals/FlowAgentSettingsModal';

export const AppHeader: React.FC = () => {
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const {
    isRunning,
    isPaused,
    startQueue,
    pauseQueue,
    stopQueue,
    workers,
    activeThreadsCount,
    accounts,
    tasks,
    settings
  } = useStudio();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeAccs = accounts.filter((a) => a.enabled && a.creditRemaining > 0).length;

  return (
    <header className="h-14 bg-[#0d121d] border-b border-slate-800/80 px-4 flex items-center justify-between select-none shrink-0 z-30">
      {/* Zone 1: Desktop Window & Brand */}
      <div className="flex items-center gap-3">
        {/* macOS / Desktop window controls */}
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer" title="Đóng cửa sổ" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" title="Thu nhỏ" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" title="Toàn màn hình" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xs">
            H
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-sm flex items-center gap-2">
            HOAI STUDIO AUTOMATION
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              DESKTOP V2.4
            </span>
          </span>
        </div>
      </div>

      {/* Zone 2: Parallel 4-Thread Monitor & Account Status */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#131b2a] border border-slate-800 px-2.5 py-1 rounded-md text-xs">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-medium">4 Luồng Xử Lý:</span>
          <div className="flex items-center gap-1">
            {workers.map((w) => (
              <div
                key={w.id}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[11px] ${
                  w.status === 'rendering'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : w.status === 'downloading'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800/60 text-slate-500'
                }`}
                title={`Worker ${w.id}: ${w.status} - ${w.progress}%`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'rendering' || w.status === 'downloading' ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>T{w.id}:{w.status === 'idle' ? 'IDLE' : `${w.progress}%`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Pool Summary */}
        <div className="flex items-center gap-1.5 bg-[#131b2a] border border-slate-800 px-2.5 py-1 rounded-md text-xs text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Accs Khả Dụng:</span>
          <span className="font-mono font-semibold text-emerald-400">{activeAccs}/{accounts.length}</span>
        </div>

        {/* Task Progress */}
        <div className="flex items-center gap-1.5 bg-[#131b2a] border border-slate-800 px-2.5 py-1 rounded-md text-xs text-slate-300">
          <span className="text-slate-400">Tiến Độ:</span>
          <span className="font-mono font-semibold text-slate-200">{completedTasks}/{totalTasks}</span>
        </div>
      </div>

      {/* Zone 3: Quick Action Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#131b2a] border border-slate-800 rounded-md p-0.5">
          <button
            onClick={startQueue}
            disabled={isRunning && !isPaused}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all ${
              isRunning && !isPaused
                ? 'bg-emerald-600/30 text-emerald-300 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
            title="Kích hoạt 4 luồng xử lý đồng thời"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>CHẠY NGAY</span>
          </button>

          <button
            onClick={pauseQueue}
            disabled={!isRunning || isPaused}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Tạm dừng hàng chờ"
          >
            <Pause className="w-3 h-3" />
            <span>TẠM DỪNG</span>
          </button>

          <button
            onClick={stopQueue}
            disabled={!isRunning}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
            title="Dừng tất cả"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>DỪNG</span>
          </button>
        </div>

        <button
          onClick={() => alert(`Thư mục lưu trữ: ${settings.outputDirectory}`)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          title="Mở thư mục xuất video"
        >
          <Folder className="w-4 h-4" />
        </button>

        {/* flow.google.com Agent Settings */}
        <button
          onClick={() => setAgentModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-md transition-colors"
          title="Cài đặt Agent Settings từ flow.google.com"
        >
          <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">flow.google.com Agent</span>
        </button>
      </div>

      <FlowAgentSettingsModal
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />
    </header>
  );
};
