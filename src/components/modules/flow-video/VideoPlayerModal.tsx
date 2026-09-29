import React, { useRef, useState, useEffect } from 'react';
import { VideoTask } from '../../../types';
import {
  X,
  Play,
  Pause,
  Download,
  Folder,
  Volume2,
  VolumeX,
  Maximize2,
  Copy,
  Check,
  Film
} from 'lucide-react';

interface VideoPlayerModalProps {
  task: VideoTask | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ task, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
  }, [task]);

  if (!task) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!task.videoBlobUrl && !task.thumbnailUrl) return;
    const a = document.createElement('a');
    a.href = task.videoBlobUrl || task.thumbnailUrl || '';
    a.download = `${task.indexNumber}_Flow_${task.resolution}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPromptText = () => {
    navigator.clipboard.writeText(task.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1624] border border-slate-700/80 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#131b29] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">
              Xem Video Hoàn Thiện · Task #{task.indexNumber}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {task.resolution} · {task.aspectRatio}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[500px] overflow-hidden">
          {task.videoBlobUrl ? (
            <video
              ref={videoRef}
              src={task.videoBlobUrl}
              autoPlay
              loop
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              className="max-h-[480px] w-auto max-w-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={task.thumbnailUrl}
                alt="Preview"
                className="max-h-[440px] w-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white space-y-2">
                <span className="text-sm font-semibold">Video Render Mẫu Hoàn Thành</span>
                <span className="text-xs text-slate-300 font-mono">Đã xuất định dạng {task.resolution} ({task.duration}s)</span>
              </div>
            </div>
          )}

          {/* Quick Play/Pause overlay button */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
        </div>

        {/* Video Details & Actions */}
        <div className="p-4 space-y-3 bg-[#0f1624]">
          {/* Prompt description */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-400">Nội dung Prompt:</span>
              <button
                onClick={copyPromptText}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Đã sao chép' : 'Sao chép prompt'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 bg-[#151f33] p-2.5 rounded border border-slate-800 leading-relaxed font-sans">
              {task.prompt}
            </p>
          </div>

          {/* File Metadata & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="space-y-0.5 text-slate-400 font-mono text-[11px]">
              <div>Đường dẫn: <span className="text-slate-200">{task.outputFilePath || 'D:/FlowVideoStudio/Exports/video.mp4'}</span></div>
              <div>Tốc độ tải: <span className="text-emerald-400">{task.downloadSpeed || '24.5 MB/s'}</span> · Dung lượng: <span className="text-slate-200">28.4 MB</span></div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Tải Video Xuống Máy</span>
              </button>

              <button
                onClick={() => alert(`Mở thư mục: ${task.outputFilePath || 'D:/FlowVideoStudio/Exports'}`)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Folder className="w-4 h-4" />
                <span>Mở Thư Mục</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
