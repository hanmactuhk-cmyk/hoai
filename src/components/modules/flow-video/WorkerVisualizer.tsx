import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { Cpu, Activity, Download, Play, Shield, Zap } from 'lucide-react';

export const WorkerVisualizer: React.FC = () => {
  const { workers } = useStudio();

  return (
    <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80">
        <span className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          Giám Sát 4 Luồng Đa Nhiệm (Parallel Execution)
        </span>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> 4/4 Workers Song Song
          </span>
        </div>
      </div>

      {/* 4 Parallel Worker Thread Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {workers.map((worker) => {
          const isBusy = worker.status === 'rendering' || worker.status === 'downloading';
          return (
            <div
              key={worker.id}
              className={`p-2.5 rounded-md border transition-all ${
                isBusy
                  ? 'bg-[#131b29] border-indigo-500/40 shadow-sm shadow-indigo-950/20'
                  : 'bg-[#111827]/70 border-slate-800 text-slate-500'
              }`}
            >
              {/* Thread Header */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold font-mono text-slate-200 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      worker.status === 'rendering'
                        ? 'bg-indigo-400 animate-pulse'
                        : worker.status === 'downloading'
                        ? 'bg-cyan-400 animate-pulse'
                        : 'bg-slate-600'
                    }`}
                  />
                  {worker.name}
                </span>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                    worker.status === 'rendering'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : worker.status === 'downloading'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {worker.status === 'rendering'
                    ? 'RENDERING'
                    : worker.status === 'downloading'
                    ? 'DOWNLOADING'
                    : 'IDLE (CHỜ)'}
                </span>
              </div>

              {/* Progress & Speed */}
              {isBusy ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Tiến trình:</span>
                    <span className="text-indigo-300 font-bold">{worker.progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        worker.status === 'downloading' ? 'bg-cyan-400' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${worker.progress}%` }}
                    />
                  </div>

                  <div className="truncate text-[11px] text-slate-300 font-sans italic" title={worker.currentPrompt || ''}>
                    "{worker.currentPrompt?.substring(0, 32)}..."
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                    <span>{worker.fps} FPS · {worker.speed}</span>
                    <span>Còn {worker.etaSeconds}s</span>
                  </div>
                </div>
              ) : (
                <div className="h-14 flex items-center justify-center text-slate-500 text-[11px] italic">
                  Đang đợi tác vụ mới trong hàng...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
