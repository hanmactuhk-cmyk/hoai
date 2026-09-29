import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FlowModel, AspectRatio, VideoResolution } from '../../../types';
import { SAMPLE_PROMPT_PRESETS } from '../../../utils/mockData';
import {
  FileText,
  Upload,
  PlusCircle,
  Play,
  Pause,
  Square,
  Sparkles,
  BookOpen,
  Copy,
  Trash2
} from 'lucide-react';

interface PromptInputSectionProps {
  model: FlowModel;
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  duration: number;
  variations: number;
  startFrameUrl: string;
  endFrameUrl: string;
}

export const PromptInputSection: React.FC<PromptInputSectionProps> = ({
  model,
  aspectRatio,
  resolution,
  duration,
  variations,
  startFrameUrl,
  endFrameUrl
}) => {
  const { addBatchTasks, isRunning, isPaused, startQueue, pauseQueue, stopQueue, tasks } = useStudio();

  const [promptText, setPromptText] = useState<string>(
    'Cinematic wide aerial drone shot of modern Da Nang Dragon Bridge breathing fire at night, reflections in Han river, 4k ultra realistic\n' +
    'Cozy traditional Japanese tea room with paper shoji doors sliding open to reveal serene zen garden with koi pond, soft rain falling\n' +
    'Extreme macro slow motion of water droplet splashing into calm indigo pool creating perfect crown ripple effect, studio lighting\n' +
    'Futuristic electric sports car accelerating on coastal cliff highway at golden hour sunset, tire smoke drift, cinematic lighting'
  );

  const [useOnePromptForAll, setUseOnePromptForAll] = useState(false);
  const [repeatCount, setRepeatCount] = useState(4);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | ''>('');

  const promptLines = promptText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const totalCalculatedTasks = useOnePromptForAll
    ? (promptLines[0] ? repeatCount : 0)
    : promptLines.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPromptText((prev) => (prev ? prev + '\n' + content : content));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = SAMPLE_PROMPT_PRESETS[index];
    if (preset) {
      setPromptText(preset.prompts.join('\n'));
    }
  };

  const handleAddToQueue = () => {
    if (promptLines.length === 0) {
      alert('Vui lòng nhập ít nhất 1 câu prompt!');
      return;
    }

    let promptsToAdd: string[] = [];
    if (useOnePromptForAll) {
      const basePrompt = promptLines[0];
      promptsToAdd = Array.from({ length: repeatCount }, (_, i) => `${basePrompt} (Biến thể #${i + 1})`);
    } else {
      promptsToAdd = promptLines;
    }

    addBatchTasks(promptsToAdd, {
      model,
      aspectRatio,
      resolution,
      duration,
      variations,
      startFrameUrl: startFrameUrl || undefined,
      endFrameUrl: endFrameUrl || undefined
    });
  };

  const handleRunNow = () => {
    if (promptLines.length > 0) {
      handleAddToQueue();
    }
    startQueue();
  };

  return (
    <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-3.5 space-y-3">
      {/* Header and Preset Dropdown */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          Khu Vực Nhập Prompt Hàng Loạt
        </span>

        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <select
            value={selectedPresetIndex}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== '') handleSelectPreset(Number(val));
            }}
            className="bg-[#151f33] border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Chọn Mẫu Prompt Có Sẵn --</option>
            {SAMPLE_PROMPT_PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Textarea for Multi-prompt */}
      <div className="relative">
        <textarea
          rows={6}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Dán hàng chục hoặc hàng trăm câu prompt vào đây (mỗi dòng 1 câu prompt)..."
          className="w-full bg-[#151f33] border border-slate-700 hover:border-slate-600 rounded-md p-3 text-xs text-slate-100 placeholder:text-slate-500 font-sans focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
        />

        {/* Floating helper badges */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span>Đã nhập: <strong className="text-indigo-400 font-mono">{promptLines.length}</strong> câu prompt</span>
            <span>·</span>
            <span>Sẽ tạo: <strong className="text-emerald-400 font-mono">{totalCalculatedTasks}</strong> video</span>
          </div>

          <button
            type="button"
            onClick={() => setPromptText('')}
            className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa trắng</span>
          </button>
        </div>
      </div>

      {/* Options & Upload Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
        {/* Checkbox: Use one prompt for all */}
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useOnePromptForAll}
            onChange={(e) => setUseOnePromptForAll(e.target.checked)}
            className="accent-indigo-500 rounded cursor-pointer"
          />
          <span>Dùng một prompt cho tất cả</span>
          {useOnePromptForAll && (
            <div className="flex items-center gap-1 ml-1">
              <input
                type="number"
                min="1"
                max="50"
                value={repeatCount}
                onChange={(e) => setRepeatCount(Math.max(1, Number(e.target.value)))}
                className="w-14 bg-[#1a2336] border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono text-indigo-300 text-center"
              />
              <span className="text-[11px] text-slate-400">lần lặp</span>
            </div>
          )}
        </label>

        {/* Upload file button */}
        <label className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Tải tệp .txt / .xlsx</span>
          <input
            type="file"
            accept=".txt,.csv,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Execution Button Bar (Per SRS Module 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {/* + Thêm vào hàng chờ */}
        <button
          type="button"
          onClick={handleAddToQueue}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-slate-700 rounded-md text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>+ THÊM HÀNG CHỜ</span>
        </button>

        {/* CHẠY NGAY */}
        <button
          type="button"
          onClick={handleRunNow}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>CHẠY NGAY (4 LUỒNG)</span>
        </button>

        {/* TẠM DỪNG */}
        <button
          type="button"
          onClick={pauseQueue}
          disabled={!isRunning || isPaused}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md text-xs font-bold transition-all ${
            isPaused
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-[#151f33] border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Pause className="w-3.5 h-3.5" />
          <span>{isPaused ? 'ĐANG TẠM DỪNG' : 'TẠM DỪNG'}</span>
        </button>

        {/* DỪNG */}
        <button
          type="button"
          onClick={stopQueue}
          disabled={!isRunning}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 rounded-md text-xs font-bold transition-all"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>HỦY TIẾN TRÌNH</span>
        </button>
      </div>
    </div>
  );
};
