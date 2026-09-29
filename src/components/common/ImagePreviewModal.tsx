import React from 'react';
import { X, ZoomIn, Download, Trash2 } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
  onDelete?: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  imageUrl,
  title = 'Xem Ảnh Tham Chiếu Chi Tiết',
  onClose,
  onDelete
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1624] border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#131b29] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded text-xs flex items-center gap-1 transition-colors"
                title="Xóa ảnh này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Ảnh</span>
              </button>
            )}

            <a
              href={imageUrl}
              download="reference_image.jpg"
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
              title="Tải ảnh về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Về</span>
            </a>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-4 bg-black/80 flex items-center justify-center overflow-auto max-h-[75vh]">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-[70vh] max-w-full object-contain rounded shadow-lg"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0c111c] border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Định dạng: JPEG/PNG Image · Tham chiếu Flow AI</span>
          <span>Bấm ra ngoài hoặc phím ESC để đóng</span>
        </div>
      </div>
    </div>
  );
};
