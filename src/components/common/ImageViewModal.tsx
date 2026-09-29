import React from 'react';
import { X, Trash2, Download, ZoomIn, Image as ImageIcon } from 'lucide-react';

interface ImageViewModalProps {
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
  onDelete?: () => void;
}

export const ImageViewModal: React.FC<ImageViewModalProps> = ({
  imageUrl,
  title = 'Xem Ảnh Tham Chiếu',
  onClose,
  onDelete
}) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `Reference_Image_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1624] border border-slate-700/80 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#131b29] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Xóa ảnh tham chiếu này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Ảnh</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Tải ảnh về máy"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="relative bg-black/90 p-4 flex items-center justify-center min-h-[300px] max-h-[65vh] overflow-auto">
          <img
            src={imageUrl}
            alt="Reference preview"
            className="max-h-[60vh] max-w-full object-contain rounded border border-slate-800 shadow-lg"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0f1624] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">Chế độ xem ảnh gốc độ nét cao</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
