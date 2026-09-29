import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { LogLevel } from '../../../types';
import {
  Terminal,
  Copy,
  Trash2,
  Download,
  FolderOpen,
  Search,
  Filter,
  Check,
  ArrowDown
} from 'lucide-react';

export const LogViewerModule: React.FC = () => {
  const { logs, clearLogs, settings } = useStudio();
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.accountEmail && log.accountEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.taskId && log.taskId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleCopyAll = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogFile = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Flow_Studio_Console_${new Date().toISOString().slice(0, 10)}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-hidden p-4 flex flex-col space-y-3 bg-[#0b0f17]">
      {/* Log Console Header & Toolbar */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Nhật Ký Hệ Thống & Tiến Trình API (Realtime Developer Console)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Theo dõi kết nối Proxy, vòng lặp 4 luồng, request API Flow server và tốc độ tải video xuống ổ cứng.
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép' : 'Sao Chép Tất Cả'}</span>
          </button>

          <button
            onClick={handleExportLogFile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Tệp Log (.txt)</span>
          </button>

          <button
            onClick={() => alert(`Thư mục lưu trữ Log: ${settings.outputDirectory}/logs`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Mở Thư Mục Log</span>
          </button>

          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#090d14] p-1 rounded border border-slate-800 font-mono">
            {['ALL', 'WORKER', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  filterLevel === lvl
                    ? lvl === 'ERROR'
                      ? 'bg-rose-600 text-white'
                      : lvl === 'WARN'
                      ? 'bg-amber-600 text-white'
                      : lvl === 'SUCCESS'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Lọc từ khóa, mã lỗi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#151f33] border border-slate-700 rounded pl-8 pr-2.5 py-1 text-xs text-slate-200 w-48 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Hiển thị: <strong className="text-slate-200">{filteredLogs.length}</strong> dòng</span>
        </div>
      </div>

      {/* Terminal Screen (Dark Console styling per SRS Module 5) */}
      <div className="flex-1 bg-[#060910] border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-y-auto space-y-1.5 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 italic">
            Không tìm thấy bản ghi log nào phù hợp với bộ lọc...
          </div>
        ) : (
          filteredLogs.map((log) => {
            let levelColor = 'text-slate-400';
            let badgeBg = 'bg-slate-800 text-slate-400 border-slate-700';

            if (log.level === 'SUCCESS') {
              levelColor = 'text-emerald-300';
              badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            } else if (log.level === 'ERROR') {
              levelColor = 'text-rose-300';
              badgeBg = 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold';
            } else if (log.level === 'WARN') {
              levelColor = 'text-amber-300';
              badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            } else if (log.level === 'WORKER') {
              levelColor = 'text-cyan-300';
              badgeBg = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            } else if (log.level === 'INFO') {
              levelColor = 'text-indigo-200';
              badgeBg = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            }

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 hover:bg-[#0c121e] px-2 py-1 rounded transition-colors"
              >
                {/* Timestamp */}
                <span className="text-slate-500 select-none shrink-0 text-[11px]">
                  [{log.timestamp}]
                </span>

                {/* Level Badge */}
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold border select-none shrink-0 ${badgeBg}`}
                >
                  {log.level}
                </span>

                {/* Message */}
                <span className={`leading-relaxed break-all ${levelColor}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
