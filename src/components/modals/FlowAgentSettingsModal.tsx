import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ConfirmationBeforeCreation, AspectRatio, FlowImageModel, FlowVideoModel } from '../../types';
import { X, Sparkles, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface FlowAgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowAgentSettingsModal: React.FC<FlowAgentSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, addLog } = useStudio();

  // Local state initialized with current settings
  const [confirmation, setConfirmation] = useState<ConfirmationBeforeCreation>(
    settings.confirmationBeforeCreation || 'always'
  );
  const [imageRatio, setImageRatio] = useState<AspectRatio>(
    settings.defaultImageAspectRatio || '1:1'
  );
  const [imageModel, setImageModel] = useState<FlowImageModel>(
    settings.defaultImageModel || 'nano_banana_2_lite'
  );
  const [videoRatio, setVideoRatio] = useState<AspectRatio>(
    settings.defaultVideoAspectRatio || '16:9'
  );
  const [videoModel, setVideoModel] = useState<FlowVideoModel>(
    settings.defaultVideoModel || 'omni_1_1_flash'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      confirmationBeforeCreation: confirmation,
      defaultImageAspectRatio: imageRatio,
      defaultImageModel: imageModel,
      defaultVideoAspectRatio: videoRatio,
      defaultVideoModel: videoModel
    });
    addLog('SUCCESS', `[flow.google.com] Đã lưu cấu hình Agent: Xác nhận=${confirmation}, Ảnh=${imageModel} (${imageRatio}), Video=${videoModel} (${videoRatio})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-[#1e232e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-[11px] font-bold">
                  G
                </div>
                <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Agent Settings</h2>
                <a
                  href="https://flow.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors ml-1 font-mono"
                  title="Mở https://flow.google.com/"
                >
                  flow.google.com
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-xs text-slate-400">
                These settings apply across all of the agents in this space.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-3 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Confirmation Before Creation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirmation Before Creation
            </label>
            <div className="space-y-2.5">
              {/* Option 1: Always */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  confirmation === 'always'
                    ? 'bg-indigo-600/15 border-indigo-500 text-slate-100'
                    : 'bg-[#151922] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="confirmation"
                  value="always"
                  checked={confirmation === 'always'}
                  onChange={() => setConfirmation('always')}
                  className="mt-0.5 accent-indigo-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-semibold text-slate-100">Always</div>
                  <div className="text-slate-400 text-[11px]">
                    Agent will confirm with you before creating images and videos.
                  </div>
                </div>
              </label>

              {/* Option 2: Images Only */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  confirmation === 'images_only'
                    ? 'bg-indigo-600/15 border-indigo-500 text-slate-100'
                    : 'bg-[#151922] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="confirmation"
                  value="images_only"
                  checked={confirmation === 'images_only'}
                  onChange={() => setConfirmation('images_only')}
                  className="mt-0.5 accent-indigo-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-semibold text-slate-100">Images Only</div>
                  <div className="text-slate-400 text-[11px]">
                    Agent will create images without confirmation, but will confirm before creating videos.
                  </div>
                </div>
              </label>

              {/* Option 3: Never */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  confirmation === 'never'
                    ? 'bg-indigo-600/15 border-indigo-500 text-slate-100'
                    : 'bg-[#151922] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="confirmation"
                  value="never"
                  checked={confirmation === 'never'}
                  onChange={() => setConfirmation('never')}
                  className="mt-0.5 accent-indigo-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-semibold text-slate-100">Never</div>
                  <div className="text-slate-400 text-[11px]">
                    Agent will create images and videos without confirmation.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Image Generation */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Image Generation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Aspect Ratio
                </label>
                <select
                  value={imageRatio}
                  onChange={(e) => setImageRatio(e.target.value as AspectRatio)}
                  className="w-full bg-[#141822] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:3">4:3</option>
                  <option value="3:4">3:4</option>
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Model
                </label>
                <select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value as FlowImageModel)}
                  className="w-full bg-[#141822] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="nano_banana_2_lite">Nano Banana 2 Lite</option>
                  <option value="nano_banana_2_pro">Nano Banana 2 Pro</option>
                  <option value="imagen_3">Imagen 3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Video Generation */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Video Generation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Aspect Ratio
                </label>
                <select
                  value={videoRatio}
                  onChange={(e) => setVideoRatio(e.target.value as AspectRatio)}
                  className="w-full bg-[#141822] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Model
                </label>
                <select
                  value={videoModel}
                  onChange={(e) => setVideoModel(e.target.value as FlowVideoModel)}
                  className="w-full bg-[#141822] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="omni_1_1_flash">Omni 1.1 Flash</option>
                  <option value="veo_3_1_quality">Veo 3.1 Quality</option>
                  <option value="veo_3_1_fast">Veo 3.1 Fast</option>
                  <option value="veo_3_1_lite">Veo 3.1 Lite</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#181d27] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đồng bộ tự động với 20+ tài khoản Flow</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
