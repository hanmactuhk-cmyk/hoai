import React, { useState, useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FlowModel, AspectRatio, VideoResolution } from '../../../types';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';
import { FlowAgentSettingsModal } from '../../modals/FlowAgentSettingsModal';
import {
  Sliders,
  FolderOpen,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Clock,
  Gauge,
  Film,
  Upload,
  Trash2,
  ZoomIn,
  AlertCircle,
  ExternalLink,
  Settings2
} from 'lucide-react';

interface ConfigPanelProps {
  model: FlowModel;
  setModel: (m: FlowModel) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  concurrency: number;
  setConcurrency: (c: number) => void;
  delaySec: number;
  setDelaySec: (d: number) => void;
  outputFolder: string;
  setOutputFolder: (f: string) => void;
  enableWatermark: boolean;
  setEnableWatermark: (w: boolean) => void;
  resolution: VideoResolution;
  setResolution: (r: VideoResolution) => void;
  duration: number;
  setDuration: (d: number) => void;
  variations: number;
  setVariations: (v: number) => void;
  startFrameUrl: string;
  setStartFrameUrl: (u: string) => void;
  endFrameUrl: string;
  setEndFrameUrl: (u: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  model,
  setModel,
  aspectRatio,
  setAspectRatio,
  concurrency,
  setConcurrency,
  delaySec,
  setDelaySec,
  outputFolder,
  setOutputFolder,
  enableWatermark,
  setEnableWatermark,
  resolution,
  setResolution,
  duration,
  setDuration,
  variations,
  setVariations,
  startFrameUrl,
  setStartFrameUrl,
  endFrameUrl,
  setEndFrameUrl
}) => {
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [showReferenceFrames, setShowReferenceFrames] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const modelOptions = [
    {
      id: 'omni_1_1_flash',
      name: 'Omni 1.1 Flash (Google Flow · Mới Nhất)',
      badge: 'Mới Nhất',
      desc: 'Mô hình video thế hệ mới của Google Flow: Tốc độ tạo cực nhanh, tương tác đa phương thức mượt mà, tối ưu hàng loạt.'
    },
    {
      id: 'veo_3_1_quality',
      name: 'Veo 3.1 Quality (Google DeepMind Cinematic)',
      badge: 'Điện ảnh HDR',
      desc: 'Mô hình chất lượng điện ảnh cao cấp nhất của DeepMind: Độ chi tiết 4K, đổ bóng và vật lý chân thực đỉnh cao.'
    },
    {
      id: 'veo_3_1_fast',
      name: 'Veo 3.1 Fast (Google DeepMind Fast Render)',
      badge: 'Tốc độ cao',
      desc: 'Tối ưu cho sản xuất video ngắn TikTok/Reels: Tốc độ render nhanh hơn 40%, chuyển động camera mượt mà.'
    },
    {
      id: 'veo_3_1_lite',
      name: 'Veo 3.1 Lite (Google DeepMind Tiết Kiệm Credit)',
      badge: 'Tiết kiệm',
      desc: 'Chi phí tín dụng thấp nhất, phù hợp chạy kiểm tra prompt và sản xuất hàng loạt với 20+ tài khoản.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setStartFrameUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveReferenceImage = () => {
    setStartFrameUrl('');
  };

  return (
    <div className="space-y-4">
      {/* Basic Configuration Section */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-3.5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            A. Cấu Hình Cơ Bản
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Parallel: 4 Threads</span>
        </div>

        {/* flow.google.com Platform Banner */}
        <div className="flex items-center justify-between p-2 rounded-md bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-300">
              Nền tảng: <span className="text-indigo-300 font-mono font-semibold">flow.google.com</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAgentModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded transition-colors"
            title="Mở bảng cấu hình Agent Settings của flow.google.com"
          >
            <Settings2 className="w-3 h-3 text-indigo-400" />
            <span>Agent Settings</span>
          </button>
        </div>

        {/* Model Selection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              Chọn Model Flow AI (Mới nhất):
            </label>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Flow 2026 Engine
            </span>
          </div>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as FlowModel)}
              className="w-full bg-[#151f33] border border-slate-700 hover:border-slate-600 rounded-md px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {modelOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
            {modelOptions.find((m) => m.id === model)?.desc}
          </p>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Tỷ Lệ Khung Hình:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '9:16', label: '9:16 Dọc', desc: 'TikTok, Reels, Shorts' },
              { id: '16:9', label: '16:9 Ngang', desc: 'YouTube, TV, Cinema' },
              { id: '1:1', label: '1:1 Vuông', desc: 'Instagram, Feed' }
            ].map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                className={`p-2 rounded-md border text-center transition-all ${
                  aspectRatio === ratio.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-[#151f33] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{ratio.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{ratio.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Concurrency and Delay Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Concurrency */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Gauge className="w-3 h-3 text-indigo-400" />
                Số Luồng Song Song:
              </span>
              <span className="font-mono text-indigo-400 font-bold">{concurrency} Video</span>
            </div>
            <div className="flex items-center gap-1 bg-[#151f33] border border-slate-700/80 rounded-md p-1">
              {[1, 2, 4, 8].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setConcurrency(c)}
                  className={`flex-1 py-1 rounded text-xs font-bold font-mono transition-colors ${
                    concurrency === c
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Delay between rows */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                Thời Gian Chờ:
              </span>
              <span className="font-mono text-indigo-400 font-bold">{delaySec}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={delaySec}
              onChange={(e) => setDelaySec(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5s</span>
              <span>15s</span>
              <span>30s (An toàn)</span>
            </div>
          </div>
        </div>

        {/* Output Directory */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">
            Thư Mục Lưu Trữ Video Xuất:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={outputFolder}
              onChange={(e) => setOutputFolder(e.target.value)}
              className="flex-1 bg-[#151f33] border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                const newPath = prompt('Nhập đường dẫn thư mục xuất:', outputFolder);
                if (newPath) setOutputFolder(newPath);
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium flex items-center gap-1 shrink-0 border border-slate-700"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Duyệt</span>
            </button>
          </div>
        </div>

        {/* Watermark Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-semibold text-slate-300">Hiển thị Watermark/Logo:</div>
            <div className="text-[11px] text-slate-500">Tắt logo thương hiệu Flow (Chỉ áp dụng với Pro/Ultra)</div>
          </div>
          <button
            type="button"
            onClick={() => setEnableWatermark(!enableWatermark)}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
              enableWatermark ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                enableWatermark ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Configuration & Reference Frames */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-3.5 space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider"
        >
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            B. Cấu Hình Nâng Cao & Ảnh Tham Chiếu (1 Ảnh)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            {/* Resolution */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Độ Phân Giải:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['720p', '1080p', '4k'] as VideoResolution[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-1 text-xs font-mono font-bold rounded border ${
                        resolution === res
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#151f33] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thời Lượng:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[4, 6, 8, 10].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`py-1 text-xs font-mono font-bold rounded border ${
                        duration === dur
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-[#151f33] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Variations */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Biến thể mỗi Prompt:</span>
                <span className="font-mono text-indigo-400 font-bold">{variations} Video / Prompt</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariations(v)}
                    className={`flex-1 py-1 text-xs font-mono font-semibold rounded border ${
                      variations === v
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-[#151f33] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {v} video
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Image for Flow Video: 1 ảnh tham chiếu, xem được và xóa được */}
            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Ảnh Tham Chiếu Video (Image-to-Video - Tối đa 1 ảnh)
                </span>
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  {startFrameUrl ? '1/1 Ảnh' : '0/1 Ảnh'}
                </span>
              </div>

              <div className="bg-[#131b29] p-3 rounded-lg border border-slate-800 space-y-3">
                {startFrameUrl ? (
                  /* Display the uploaded 1 reference image with view & delete buttons */
                  <div className="flex items-center gap-3 bg-[#182235] p-2.5 rounded-md border border-indigo-500/30">
                    <div
                      onClick={() => setPreviewModalOpen(true)}
                      className="relative w-20 h-14 bg-black/60 rounded overflow-hidden border border-slate-700 cursor-pointer group shrink-0"
                      title="Bấm để xem ảnh phóng to"
                    >
                      <img
                        src={startFrameUrl}
                        alt="Reference Video Frame"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Ảnh tham chiếu bắt đầu (Start Frame)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {startFrameUrl.startsWith('data:') ? 'Tệp ảnh tải từ máy cục bộ' : startFrameUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-xs flex items-center gap-1 transition-colors border border-slate-700"
                        title="Xem ảnh phóng to"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveReferenceImage}
                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded text-xs flex items-center gap-1 transition-colors"
                        title="Xóa ảnh tham chiếu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload box when no image is selected */
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-3 text-center cursor-pointer transition-colors bg-[#0f1624]/60"
                    >
                      <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="text-xs font-semibold text-slate-300">
                        Bấm để tải 1 ảnh tham chiếu từ máy (.jpg, .png)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Dùng làm khuôn mặt nhân vật hoặc khung hình gốc cho video
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0">Hoặc dán URL:</span>
                      <input
                        type="text"
                        placeholder="https://... hoặc link ảnh"
                        value={startFrameUrl}
                        onChange={(e) => setStartFrameUrl(e.target.value)}
                        className="flex-1 bg-[#1a2336] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reusable Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModalOpen}
        imageUrl={startFrameUrl}
        title="Xem Ảnh Tham Chiếu Flow Video (Image-to-Video)"
        onClose={() => setPreviewModalOpen(false)}
        onDelete={handleRemoveReferenceImage}
      />

      {/* flow.google.com Agent Settings Modal */}
      <FlowAgentSettingsModal
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />
    </div>
  );
};

