import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { VideoTask } from '../../../types';
import { WorkerVisualizer } from './WorkerVisualizer';
import { VideoPlayerModal } from './VideoPlayerModal';
import {
  Play,
  RotateCw,
  Trash2,
  FolderOpen,
  Download,
  CheckSquare,
  Square,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Film,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const TaskOutputTable: React.FC = () => {
  const {
    tasks,
    removeTask,
    removeSelectedTasks,
    removeAllTasks,
    retryTask,
    retryFailedTasks,
    runSelectedTasks,
    clearCache,
    toggleSelectTask,
    selectAllTasks,
    updateTask
  } = useStudio();

  // Subtabs per SRS Module 4:
  // 1. Văn bản / Khung hình -> Video
  // 2. Ảnh / Video thành phần -> Video
  // 3. Nối cảnh -> Video (Merge Video)
  const [activeSubTab, setActiveSubTab] = useState<'text_to_video' | 'component_to_video' | 'merge_video'>('text_to_video');
  const [previewTask, setPreviewTask] = useState<VideoTask | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState<string>('');

  const selectedCount = tasks.filter((t) => t.selected).length;
  const allSelected = tasks.length > 0 && selectedCount === tasks.length;
  const failedCount = tasks.filter((t) => t.status === 'failed').length;

  const handleStartEditPrompt = (task: VideoTask) => {
    setEditingTaskId(task.id);
    setEditingPromptText(task.prompt);
  };

  const handleSaveEditPrompt = (id: string) => {
    if (editingPromptText.trim()) {
      updateTask(id, { prompt: editingPromptText.trim() });
    }
    setEditingTaskId(null);
  };

  const handleExportCSV = () => {
    const headers = ['STT', 'Task ID', 'Model', 'Tỷ lệ', 'Độ phân giải', 'Trạng thái', 'Tiến độ', 'Tài khoản', 'Prompt', 'Đường dẫn tệp'];
    const rows = tasks.map((t) => [
      t.indexNumber,
      t.id,
      t.model,
      t.aspectRatio,
      t.resolution,
      t.status,
      `${t.progress}%`,
      t.assignedAccountEmail || 'Chưa gán',
      `"${t.prompt.replace(/"/g, '""')}"`,
      t.outputFilePath || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Flow_Studio_Tasks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* 4 Parallel Worker Threads Live Monitor */}
      <WorkerVisualizer />

      {/* Main Task Management Section */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg flex flex-col flex-1 min-h-[480px] overflow-hidden">
        {/* Subtabs Header per SRS */}
        <div className="px-4 py-2.5 bg-[#131b29] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Subtabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[#0a0e17] rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('text_to_video')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'text_to_video'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Văn bản / Khung hình → Video ({tasks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('component_to_video')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'component_to_video'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Ảnh / Video thành phần → Video
            </button>
            <button
              onClick={() => setActiveSubTab('merge_video')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'merge_video'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Nối cảnh → Video (Merge)
            </button>
          </div>

          {/* Quick Selection Status */}
          <div className="text-xs text-slate-400 font-mono">
            Đã chọn: <span className="text-indigo-400 font-bold">{selectedCount}</span>/{tasks.length}
          </div>
        </div>

        {/* Task Table View */}
        <div className="flex-1 overflow-auto">
          {tasks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Film className="w-10 h-10 text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-400">Chưa có tác vụ nào trong danh sách</p>
              <p className="text-xs text-slate-500">Nhập danh sách prompt ở cột bên trái và bấm "+ Thêm vào hàng chờ"</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0b101a] sticky top-0 z-10 border-b border-slate-800 text-slate-400 font-semibold select-none">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">
                    <button
                      onClick={() => selectAllTasks(!allSelected)}
                      className="p-1 hover:text-indigo-400"
                      title={allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    >
                      {allSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-2 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 w-40">Tác Vụ & Cấu Hình</th>
                  <th className="py-2.5 px-3 w-28 text-center">Ảnh Đầu - Cuối</th>
                  <th className="py-2.5 px-3">Nội Dung Prompt</th>
                  <th className="py-2.5 px-3 w-44 text-center">Kết Quả (Player)</th>
                  <th className="py-2.5 px-3 w-44">Tiến Độ & Trạng Thái</th>
                  <th className="py-2.5 px-3 w-24 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tasks.map((task) => {
                  const isProcessing = task.status === 'processing';
                  const isCompleted = task.status === 'completed';
                  const isFailed = task.status === 'failed';

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-[#131b29]/70 transition-colors ${
                        task.selected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => toggleSelectTask(task.id)}
                          className="p-1 text-slate-400 hover:text-indigo-400"
                        >
                          {task.selected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* STT */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                        #{task.indexNumber}
                      </td>

                      {/* Tác vụ & Cấu hình */}
                      <td className="py-2 px-3 space-y-1">
                        <div className="font-semibold text-slate-200 truncate font-mono text-[11px]">
                          {task.id}
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono text-[10px] border border-purple-500/25 font-bold">
                            {task.model === 'omni_1_1_flash'
                              ? 'Omni 1.1 Flash'
                              : task.model === 'veo_3_1_quality'
                              ? 'Veo 3.1 Quality'
                              : task.model === 'veo_3_1_fast'
                              ? 'Veo 3.1 Fast'
                              : task.model === 'veo_3_1_lite'
                              ? 'Veo 3.1 Lite'
                              : task.model}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                            {task.aspectRatio}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[10px] border border-indigo-500/20">
                            {task.resolution}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                            {task.duration}s
                          </span>
                        </div>
                        {task.assignedAccountEmail && (
                          <div className="text-[10px] text-slate-500 truncate" title={task.assignedAccountEmail}>
                            Acc: {task.assignedAccountEmail.split('@')[0]}
                          </div>
                        )}
                      </td>

                      {/* Ảnh đầu - Ảnh cuối */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {task.thumbnailUrl ? (
                            <div
                              onClick={() => setPreviewTask(task)}
                              className="w-12 h-8 rounded bg-black/60 border border-slate-700 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors group relative"
                              title="Bấm để xem ảnh tham chiếu"
                            >
                              <img
                                src={task.thumbnailUrl}
                                alt="Frame"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const url = prompt('Nhập link ảnh tham chiếu (Image-to-Video):');
                                if (url) updateTask(task.id, { startFrameUrl: url, thumbnailUrl: url });
                              }}
                              className="w-12 h-8 rounded border border-dashed border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 flex items-center justify-center text-[10px] transition-colors"
                              title="Gán ảnh tham chiếu"
                            >
                              + Ảnh
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Prompt */}
                      <td className="py-2 px-3 max-w-xs xl:max-w-md">
                        {editingTaskId === task.id ? (
                          <div className="space-y-1">
                            <textarea
                              value={editingPromptText}
                              onChange={(e) => setEditingPromptText(e.target.value)}
                              rows={2}
                              className="w-full bg-[#1a2336] border border-indigo-500 rounded p-1.5 text-xs text-slate-100 focus:outline-none"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSaveEditPrompt(task.id)}
                                className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setEditingTaskId(null)}
                                className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px]"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEditPrompt(task)}
                            className="text-slate-200 line-clamp-2 hover:line-clamp-none cursor-pointer hover:text-indigo-300 transition-colors leading-relaxed"
                            title="Bấm để chỉnh sửa câu prompt"
                          >
                            {task.prompt}
                          </div>
                        )}
                      </td>

                      {/* Kết quả (Mini Video Player per SRS) */}
                      <td className="py-2 px-3 text-center">
                        {isCompleted ? (
                          <div className="flex items-center justify-center gap-2">
                            <div
                              onClick={() => setPreviewTask(task)}
                              className="relative w-20 h-11 bg-black rounded border border-indigo-500/50 overflow-hidden cursor-pointer group shadow-sm"
                              title="Bấm để phát video"
                            >
                              <img
                                src={task.thumbnailUrl}
                                alt="Video Result"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                                <Play className="w-4 h-4 text-white fill-current drop-shadow" />
                              </div>
                              <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded">
                                {task.duration}s
                              </span>
                            </div>

                            <button
                              onClick={() => setPreviewTask(task)}
                              className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded transition-colors"
                              title="Mở toàn màn hình"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : isProcessing ? (
                          <div className="text-[11px] text-indigo-400 font-mono flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                            <span>Đang render...</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Chờ xử lý</span>
                        )}
                      </td>

                      {/* Tiến độ & Trạng thái */}
                      <td className="py-2 px-3 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isCompleted
                                ? 'text-emerald-400'
                                : isProcessing
                                ? 'text-indigo-400'
                                : isFailed
                                ? 'text-rose-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isFailed && <AlertCircle className="w-3.5 h-3.5" />}
                            {isProcessing && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                            {!isCompleted && !isFailed && !isProcessing && <Clock className="w-3.5 h-3.5" />}
                            <span>
                              {isCompleted
                                ? `Hoàn thành (${task.resolution})`
                                : isProcessing
                                ? `Đang tạo (${task.activeWorkerId ? `Luồng ${task.activeWorkerId}` : '1/4'})`
                                : isFailed
                                ? 'Thất bại'
                                : 'Đang hàng đợi'}
                            </span>
                          </span>

                          <span className="font-bold text-slate-300">{task.progress}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isProcessing
                                ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                                : isFailed
                                ? 'bg-rose-500'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>

                        {task.stageMessage && (
                          <div className="text-[10px] text-slate-400 truncate font-mono">
                            {task.stageMessage}
                          </div>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Chạy lại */}
                          <button
                            onClick={() => retryTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                            title="Chạy lại tác vụ này"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Mở thư mục / Tải video */}
                          {isCompleted && (
                            <button
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = task.videoBlobUrl || task.thumbnailUrl || '';
                                a.download = `${task.indexNumber}_video_${task.resolution}.mp4`;
                                a.click();
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors"
                              title="Tải video về máy"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Xóa dòng */}
                          <button
                            onClick={() => removeTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                            title="Xóa tác vụ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Toolbar per SRS */}
        <div className="px-4 py-2.5 bg-[#0b101a] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
          {/* Left bulk action buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={removeSelectedTasks}
              disabled={selectedCount === 0}
              className="px-2.5 py-1.5 bg-[#151f33] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 rounded text-xs font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Xóa ({selectedCount})
            </button>

            <button
              onClick={removeAllTasks}
              disabled={tasks.length === 0}
              className="px-2.5 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Xóa Hết
            </button>

            <button
              onClick={clearCache}
              className="px-2.5 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-medium transition-colors"
            >
              Xóa Cache
            </button>

            <button
              onClick={retryFailedTasks}
              disabled={failedCount === 0}
              className="px-2.5 py-1.5 bg-[#151f33] hover:bg-amber-950/40 text-amber-300 border border-slate-700 hover:border-amber-700/60 rounded text-xs font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Chạy Lại Các Câu Bị Lỗi ({failedCount})
            </button>

            <button
              onClick={runSelectedTasks}
              disabled={selectedCount === 0}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
            >
              Chạy Các Mục Đã Chọn ({selectedCount})
            </button>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
              title="Xuất file báo cáo nhiệm vụ (.csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xuất Báo Cáo Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Full Preview Modal */}
      {previewTask && (
        <VideoPlayerModal task={previewTask} onClose={() => setPreviewTask(null)} />
      )}
    </div>
  );
};
