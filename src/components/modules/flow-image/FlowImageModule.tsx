import React, { useState, useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { generateTaskThumbnail } from '../../../utils/videoRenderer';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';
import { FlowAgentSettingsModal } from '../../modals/FlowAgentSettingsModal';
import { FlowImageModel, AspectRatio } from '../../../types';
import {
  Image as ImageIcon,
  Sparkles,
  Layers,
  Send,
  Download,
  Plus,
  Play,
  Upload,
  Trash2,
  ZoomIn,
  AlertCircle,
  CheckCircle2,
  Copy,
  FolderOpen,
  Settings2,
  ExternalLink
} from 'lucide-react';

interface ReferenceImageItem {
  id: string;
  url: string;
  name: string;
  addedAt: string;
}

interface GeneratedImageItem {
  id: string;
  prompt: string;
  url: string;
  aspectRatio: string;
  createdAt: string;
  usedReferencesCount?: number;
}

export const FlowImageModule: React.FC = () => {
  const { addBatchTasks, setActiveTab, addLog, settings } = useStudio();
  const [promptsText, setPromptsText] = useState(
    'Hyper-realistic portrait of cyberpunk warrior in rainy neon street, reflective visor, cinematic 4k\n' +
    'Cozy wooden coffee shop interior in winter with snow outside the warm glowing windows\n' +
    'Mythical dragon soaring through golden clouds above majestic mountain peaks at sunset'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(settings.defaultImageAspectRatio || '1:1');
  const [imageModel, setImageModel] = useState<FlowImageModel>(settings.defaultImageModel || 'nano_banana_2_lite');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);

  // Flow Ảnh Reference Images (Tối đa 3 ảnh per user request)
  const [referenceImages, setReferenceImages] = useState<ReferenceImageItem[]>([
    {
      id: 'ref-1',
      name: 'Nguyen Mai (Cyber Face)',
      url: generateTaskThumbnail('Cyberpunk anime female detective neon street', '1:1'),
      addedAt: '19:30'
    },
    {
      id: 'ref-2',
      name: 'Neon Tokyo Palette',
      url: generateTaskThumbnail('Cyberpunk street food stall in futuristic Saigon, neon reflections', '16:9'),
      addedAt: '19:32'
    }
  ]);

  // Modal preview state
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewTitle, setActivePreviewTitle] = useState<string>('');
  const [activePreviewRefId, setActivePreviewRefId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [images, setImages] = useState<GeneratedImageItem[]>([
    {
      id: 'img-1',
      prompt: 'Cinematic golden hour drone shot of Mu Cang Chai terraced rice fields',
      url: generateTaskThumbnail('Cinematic golden hour drone shot of Mu Cang Chai rice fields', '16:9'),
      aspectRatio: '16:9',
      createdAt: '19:22:10',
      usedReferencesCount: 2
    },
    {
      id: 'img-2',
      prompt: 'Cyberpunk ramen noodle chef with bionic prosthetic arm in rainy Tokyo',
      url: generateTaskThumbnail('Cyberpunk ramen noodle chef with bionic arm rainy Tokyo', '9:16'),
      aspectRatio: '9:16',
      createdAt: '19:23:45',
      usedReferencesCount: 2
    },
    {
      id: 'img-3',
      prompt: 'Luxury gold swiss watch movement with exposed gears and jewels',
      url: generateTaskThumbnail('Luxury gold swiss watch movement exposed gears', '1:1'),
      aspectRatio: '1:1',
      createdAt: '19:25:00',
      usedReferencesCount: 0
    }
  ]);

  // Handle uploading up to 3 reference images
  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - referenceImages.length;
    if (remainingSlots <= 0) {
      alert('Đã đạt giới hạn tối đa 3 ảnh tham chiếu cho Flow Ảnh! Vui lòng xóa bớt ảnh trước khi tải thêm.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newRef: ReferenceImageItem = {
            id: 'ref-' + Date.now() + '-' + index,
            url: dataUrl,
            name: file.name || `Ảnh tham chiếu #${referenceImages.length + index + 1}`,
            addedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };

          setReferenceImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, newRef];
          });
          addLog('INFO', `Đã thêm ảnh tham chiếu Flow Ảnh: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddFromUrl = () => {
    if (!customUrlInput.trim()) return;
    if (referenceImages.length >= 3) {
      alert('Đã đạt giới hạn tối đa 3 ảnh tham chiếu!');
      return;
    }

    const newRef: ReferenceImageItem = {
      id: 'ref-' + Date.now(),
      url: customUrlInput.trim(),
      name: `Ảnh tham chiếu #${referenceImages.length + 1}`,
      addedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setReferenceImages((prev) => [...prev, newRef]);
    addLog('INFO', `Đã thêm ảnh tham chiếu từ URL cho Flow Ảnh.`);
    setCustomUrlInput('');
  };

  const handleRemoveReferenceImage = (id: string) => {
    setReferenceImages((prev) => prev.filter((r) => r.id !== id));
    addLog('WARN', 'Đã xóa ảnh tham chiếu khỏi Flow Ảnh.');
  };

  const handleClearAllReferences = () => {
    setReferenceImages([]);
    addLog('WARN', 'Đã xóa tất cả ảnh tham chiếu của Flow Ảnh.');
  };

  const openPreview = (url: string, title: string, refId?: string) => {
    setActivePreviewUrl(url);
    setActivePreviewTitle(title);
    setActivePreviewRefId(refId || null);
  };

  const handleGenerateBatch = () => {
    const lines = promptsText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;

    setIsGenerating(true);
    addLog(
      'INFO',
      `Đang render hàng loạt ${lines.length} hình ảnh bằng Flow Image Engine v2026 (Áp dụng ${referenceImages.length}/3 ảnh tham chiếu)...`
    );

    setTimeout(() => {
      const newItems: GeneratedImageItem[] = lines.map((p, idx) => ({
        id: 'img-' + Date.now() + '-' + idx,
        prompt: p,
        url: generateTaskThumbnail(p, aspectRatio),
        aspectRatio,
        createdAt: new Date().toLocaleTimeString('vi-VN'),
        usedReferencesCount: referenceImages.length
      }));

      setImages((prev) => [...newItems, ...prev]);
      setIsGenerating(false);
      addLog(
        'SUCCESS',
        `Đã tạo thành công ${newItems.length} ảnh Flow mới (Kết hợp phong cách từ ${referenceImages.length} ảnh tham chiếu).`
      );
    }, 1200);
  };

  const handleSendToVideoQueue = (img: GeneratedImageItem) => {
    // Map ratio to video ratio
    const vRatio = (img.aspectRatio === '4:3' || img.aspectRatio === '3:4' ? '16:9' : img.aspectRatio) as AspectRatio;
    addBatchTasks([img.prompt], {
      model: settings.defaultVideoModel || 'omni_1_1_flash',
      aspectRatio: vRatio,
      resolution: '1080p',
      duration: 6,
      variations: 1,
      startFrameUrl: img.url
    });
    addLog('INFO', `Đã chuyển ảnh sang hàng chờ tạo video (Image-to-Video 1 ảnh tham chiếu): "${img.prompt}"`);
    setActiveTab('video');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0f17]">
      {/* Header with flow.google.com Agent settings */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              Phân Hệ Flow Ảnh (Flow Image Studio · flow.google.com)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Tối Đa 3 Ảnh Tham Chiếu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mô hình Nano Banana 2 & Imagen 3 từ <a href="https://flow.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">flow.google.com</a>. Tải lên tối đa 3 ảnh tham chiếu để khóa nét mặt/phong cách, xem ảnh, xóa ảnh hoặc gửi 1-click sang Flow Video.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAgentModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Agent Settings</span>
        </button>
      </div>

      {/* SECTION 1: TẢI VÀ QUẢN LÝ 3 ẢNH THAM CHIẾU (PER USER REQUEST) */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Ảnh Tham Chiếu Flow Ảnh (Tối đa 3 ảnh)
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${
                referenceImages.length === 3
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {referenceImages.length}/3 Ảnh Đã Tải
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {referenceImages.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllReferences}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Tất Cả 3 Ảnh</span>
              </button>
            )}

            <button
              type="button"
              disabled={referenceImages.length >= 3}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Tải Thêm Ảnh Từ Máy</span>
            </button>
          </div>
        </div>

        {/* 3 Reference Image Slots Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((slotIndex) => {
            const refItem = referenceImages[slotIndex];

            if (refItem) {
              return (
                <div
                  key={refItem.id}
                  className="bg-[#131b29] border border-indigo-500/40 rounded-lg p-2.5 flex flex-col justify-between space-y-2 group shadow-sm shadow-indigo-950/20 hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-slate-800">
                    <span className="font-bold text-indigo-300">Ảnh Tham Chiếu #{slotIndex + 1}</span>
                    <span>{refItem.addedAt}</span>
                  </div>

                  {/* Thumbnail with Click to Zoom */}
                  <div
                    onClick={() => openPreview(refItem.url, `Ảnh Tham Chiếu #${slotIndex + 1}: ${refItem.name}`, refItem.id)}
                    className="relative aspect-video w-full bg-black/70 rounded overflow-hidden cursor-pointer border border-slate-700/80 group-hover:border-indigo-500 transition-colors"
                    title="Bấm để xem ảnh phóng to chi tiết"
                  >
                    <img
                      src={refItem.url}
                      alt={refItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Xem Ảnh</span>
                      </div>
                    </div>
                  </div>

                  <div className="truncate text-xs font-medium text-slate-200" title={refItem.name}>
                    {refItem.name}
                  </div>

                  {/* Action buttons: Xem & Xóa */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80 text-xs">
                    <button
                      type="button"
                      onClick={() => openPreview(refItem.url, `Ảnh Tham Chiếu #${slotIndex + 1}: ${refItem.name}`, refItem.id)}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded font-medium flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>Xem</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveReferenceImage(refItem.id)}
                      className="py-1 px-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Empty Slot
            return (
              <div
                key={`empty-${slotIndex}`}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#0e1420]/50 min-h-[140px]"
              >
                <Upload className="w-6 h-6 text-slate-500 mb-1" />
                <div className="text-xs font-semibold text-slate-400">
                  + Ô Tham Chiếu #{slotIndex + 1} Trống
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Bấm để tải ảnh lên (Tối đa 3 ảnh)
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick URL Input for Reference Image */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 shrink-0">Thêm qua URL:</span>
          <input
            type="text"
            placeholder="Dán link ảnh https://... để thêm vào danh sách tham chiếu"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFromUrl()}
            className="flex-1 bg-[#151f33] border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddFromUrl}
            disabled={!customUrlInput.trim() || referenceImages.length >= 3}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-40"
          >
            Thêm
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleUploadFiles}
          className="hidden"
        />
      </div>

      {/* SECTION 2: PROMPT INPUT & GENERATION */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Cấu Hình & Nhập Prompt Tạo Ảnh Hàng Loạt
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Model Flow:</span>
              <select
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value as FlowImageModel)}
                className="bg-[#151f33] border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="nano_banana_2_lite">Nano Banana 2 Lite (Siêu tốc · Mặc định)</option>
                <option value="nano_banana_2_pro">Nano Banana 2 Pro (Chi tiết cao)</option>
                <option value="imagen_3">Imagen 3 (Google DeepMind)</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Tỷ lệ:</span>
              {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors ${
                    aspectRatio === r
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-[#151f33] text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <textarea
          rows={4}
          value={promptsText}
          onChange={(e) => setPromptsText(e.target.value)}
          placeholder="Mỗi dòng 1 câu prompt..."
          className="w-full bg-[#151f33] border border-slate-700 rounded-md p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="text-slate-400">
            {referenceImages.length > 0 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đang kích hoạt đồng nhất phong cách với {referenceImages.length} ảnh tham chiếu
              </span>
            ) : (
              <span className="text-slate-500">Chưa có ảnh tham chiếu (Tạo ảnh thuần prompt)</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerateBatch}
            disabled={isGenerating}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Đang tạo ảnh...' : 'Tạo Ảnh Hàng Loạt'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: THƯ VIỆN ẢNH ĐÃ TẠO */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-bold text-slate-200">
            Thư Viện Ảnh Đã Tạo ({images.length} Ảnh)
          </span>
          <span className="text-[11px] text-slate-400">
            Bấm "Tạo Video Từ Ảnh" để chuyển sang Flow Video (dùng làm 1 ảnh tham chiếu)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-[#131b29] border border-slate-800 rounded-lg overflow-hidden group hover:border-indigo-500/50 transition-colors flex flex-col"
            >
              <div
                onClick={() => openPreview(img.url, `Ảnh: ${img.prompt}`)}
                className="relative aspect-video bg-black/60 overflow-hidden cursor-pointer"
                title="Bấm để xem ảnh phóng to"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white">
                  {img.aspectRatio}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="bg-black/70 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Xem Phóng To</span>
                  </div>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {img.prompt}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">{img.createdAt}</span>

                  <div className="flex items-center gap-1.5">
                    {/* Add as Reference Image */}
                    {referenceImages.length < 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          setReferenceImages((prev) => [
                            ...prev,
                            {
                              id: 'ref-' + Date.now(),
                              name: img.prompt.substring(0, 20),
                              url: img.url,
                              addedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            }
                          ]);
                          addLog('INFO', 'Đã thêm ảnh vào bộ tham chiếu Flow Ảnh.');
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded"
                        title="Đặt làm 1 trong 3 ảnh tham chiếu"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Send to Video */}
                    <button
                      type="button"
                      onClick={() => handleSendToVideoQueue(img)}
                      className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Tạo Video Từ Ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Image Preview Modal */}
      <ImagePreviewModal
        isOpen={Boolean(activePreviewUrl)}
        imageUrl={activePreviewUrl}
        title={activePreviewTitle}
        onClose={() => setActivePreviewUrl(null)}
        onDelete={activePreviewRefId ? () => handleRemoveReferenceImage(activePreviewRefId) : undefined}
      />

      {/* flow.google.com Agent Settings Modal */}
      <FlowAgentSettingsModal
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />
    </div>
  );
};
