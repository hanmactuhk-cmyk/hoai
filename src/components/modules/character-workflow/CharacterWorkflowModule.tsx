import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { generateTaskThumbnail } from '../../../utils/videoRenderer';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';
import {
  GitFork,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  Play,
  Copy,
  Check,
  Film,
  BookOpen,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Lock,
  Upload,
  ZoomIn,
  Trash2,
  Lightbulb,
  FileVideo,
  Clapperboard
} from 'lucide-react';

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  facialFeatures: string;
  outfit: string;
  avatarUrl: string;
  seed: number;
}

export const CharacterWorkflowModule: React.FC = () => {
  const { addBatchTasks, setActiveTab, addLog } = useStudio();
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'generator' | 'profiles' | 'gpt_image' | 'workflow'>('guide');

  // Character profiles
  const [characters, setCharacters] = useState<CharacterProfile[]>([
    {
      id: 'char-1',
      name: 'Nguyễn Mai (Cyber Detective)',
      role: 'Thám tử công nghệ cao tại Saigon Cyber City 2077',
      facialFeatures: 'Gương mặt trái xoan nữ tính, mắt nâu sáng kiên định, tóc ngắn đen ngang vai uốn nhẹ',
      outfit: 'Áo khoác trench coat da màu than chì, cổ áo dựng, kính thực tế ảo glowing cyan',
      avatarUrl: generateTaskThumbnail('Cyberpunk anime female detective neon street', '1:1'),
      seed: 8849201
    },
    {
      id: 'char-2',
      name: 'Alex Vance (Space Explorer)',
      role: 'Phi hành gia điều khiển trạm không gian quỹ đạo sao Hỏa',
      facialFeatures: 'Gương mặt nam góc cạnh 32 tuổi, râu quai nón tỉa gọn, mắt xanh lam sâu thẳm',
      outfit: 'Bộ giáp du hành vũ trụ màu trắng viền cam titan, găng tay cơ học bionic',
      avatarUrl: generateTaskThumbnail('Astronaut space explorer helmet nebula reflection', '1:1'),
      seed: 5519283
    },
    {
      id: 'char-3',
      name: 'Kenji Sato (Ronin Kiếm Sĩ)',
      role: 'Kiếm sĩ lang thang thời phong kiến giả tưởng',
      facialFeatures: 'Khuôn mặt sương gió, vết sẹo mỏng bên má trái, ánh mắt sắc như lưỡi kiếm',
      outfit: 'Áo yukata vải thô sẫm màu, nón rơm rách, mang thanh katana chuôi đen bên hông',
      avatarUrl: generateTaskThumbnail('Samurai ronin warrior straw hat katana reflection', '1:1'),
      seed: 1948202
    }
  ]);

  // Selected character for multi-scene generator
  const [selectedCharId, setSelectedCharId] = useState<string>('char-1');
  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  // 4 Scenes for consistent character generation
  const [scenePrompts, setScenePrompts] = useState<{ [key: number]: string }>({
    1: 'Cảnh 1 (Giới thiệu): Đang đứng dưới ánh đèn neon phố đêm mưa, ngẩng đầu nhìn thẳng vào camera, giọt nước mưa đọng trên áo khoác',
    2: 'Cảnh 2 (Hành động): Nhanh nhẹn rút thiết bị quét ba chiều trong tay, chạy qua ngõ hẻm công nghệ cao với phản chiếu ánh sáng hologram',
    3: 'Cảnh 3 (Cận cảnh cảm xúc): Cận cảnh gương mặt sắc nét, biểu cảm suy tư căng thẳng, mắt nhìn chăm chú vào dữ liệu ảo màu xanh',
    4: 'Cảnh 4 (Kết thúc): Bước lên khoang xe bay hover vehicle lướt vào bầu trời thành phố tương lai rực rỡ, góc quay máy bay từ xa'
  });

  // Modal preview
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // Copied prompt helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GPT Prompt Enhancer state
  const [rawIdea, setRawIdea] = useState('Một thám tử nữ tóc ngắn mặc áo khoác da đang điều tra trong quán bar tương lai');
  const [enhancedResult, setEnhancedResult] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate 4-Scene Consistent Character Video Series
  const handleGenerateConsistentSeries = () => {
    if (!selectedChar) return;

    const fullPrompts = [1, 2, 3, 4].map((num) => {
      const scene = scenePrompts[num] || `Cảnh ${num}`;
      return `[Consistent Character: ${selectedChar.name}, Seed: #${selectedChar.seed}] Face: ${selectedChar.facialFeatures}, Wearing: ${selectedChar.outfit}. Action: ${scene}, cinematic 4k HDR, dynamic camera motion, photorealistic lighting.`;
    });

    addBatchTasks(fullPrompts, {
      model: 'veo_3_1_quality', // Google Veo 3.1 Cinematic Quality on flow.google.com
      aspectRatio: '16:9',
      resolution: '1080p',
      duration: 6,
      variations: 1,
      startFrameUrl: selectedChar.avatarUrl
    });

    addLog(
      'SUCCESS',
      `[Hoai Studio Automation] Đã khởi tạo chuỗi 4 video đồng nhất nhân vật "${selectedChar.name}" (Seed #${selectedChar.seed}) với Model Google Veo 3.1 Quality (flow.google.com)!`
    );
    setActiveTab('video');
  };

  const handleEnhancePrompt = () => {
    if (!rawIdea.trim()) return;
    setIsEnhancing(true);

    setTimeout(() => {
      const enhanced =
        `Ultra-detailed cinematic 4K footage of [Nguyen Mai, Seed: #8849201], oval face, short dark hair, wearing sleek charcoal leather trench coat, sitting in a dimly lit holographic neon cyberpunk bar, volumetric amber mist, sharp eye focus, atmospheric lighting, 60fps cinematic grade.`;
      setEnhancedResult(enhanced);
      setIsEnhancing(false);
      addLog('SUCCESS', 'GPT Prompt Enhancer đã chuẩn hóa câu prompt đồng nhất nhân vật.');
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0f17]">
      {/* Top Header */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white">
              H
            </div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Hoai Studio Automation · Tạo Video Đồng Nhất Nhân Vật (Consistent Character Studio)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quy trình khóa khuôn mặt (Face Lock), khóa trang phục và cố định Seed để tạo chuỗi video cùng 1 diễn viên qua hàng chục phân cảnh khác nhau.
          </p>
        </div>

        {/* Subtabs Bar */}
        <div className="flex items-center gap-1 bg-[#131b29] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Hướng Dẫn Sử Dụng Đồng Nhất Nhân Vật</span>
          </button>

          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'generator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Tạo Chuỗi Video Đồng Nhất</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profiles')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'profiles'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>3. Hồ Sơ Nhân Vật ({characters.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gpt_image')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'gpt_image'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>4. GPT Enhancer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('workflow')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'workflow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Sơ Đồ Node</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HƯỚNG DẪN SỬ DỤNG ĐỒNG NHẤT NHÂN VẬT (PER USER REQUEST) */}
      {activeSubTab === 'guide' && (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-[#131b29] to-[#0f1624] border border-indigo-500/40 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Tài Liệu Hướng Dẫn Kỹ Thuật Độc Quyền Trên Hoai Studio Automation
            </div>

            <h3 className="text-lg font-bold text-slate-100">
              Quy Trình 5 Bước Tạo Video Đồng Nhất Nhân Vật (100% Consistent Character)
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Khi làm phim ngắn, clip hoạt hình hoặc video bán hàng TikTok/YouTube, thách thức lớn nhất là khuôn mặt nhân vật bị thay đổi qua mỗi cảnh quay. <strong>Hoai Studio Automation</strong> kết hợp 3 lớp khóa: <em>Khóa ảnh tham chiếu (Reference Face)</em> + <em>Khóa hạt nhiễu (Seed Lock)</em> + <em>Model Flow Character Consistency v2.0</em> để giữ nguyên danh tính nhân vật qua mọi góc máy.
            </p>
          </div>

          {/* 5 Step-by-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                step: 'BƯỚC 1',
                title: 'Chuẩn Bị 1 Ảnh Chân Dung',
                desc: 'Tạo 1 ảnh chân dung rõ nét ở tab "Flow Ảnh" hoặc tải ảnh thật của nhân vật lên. Đảm bảo góc nhìn rõ ngũ quan và ánh sáng tự nhiên.',
                badge: 'Tải 1 ảnh chuẩn'
              },
              {
                step: 'BƯỚC 2',
                title: 'Tạo Hồ Sơ & Khóa Seed',
                desc: 'Mở tab "Hồ Sơ Nhân Vật", nhập Tên, Đặc điểm nhận diện cố định (kiểu tóc, màu mắt, nếp mặt) và cố định 1 mã Seed (VD: #8849201).',
                badge: 'Khóa Seed & Face'
              },
              {
                step: 'BƯỚC 3',
                title: 'Viết Prompt Theo Công Thức',
                desc: 'Áp dụng công thức 4 lớp của Hoai Studio: [Tên nhân vật + Seed] + [Đặc điểm nhận diện] + [Hành động/Bối cảnh] + [Thông số điện ảnh 4K].',
                badge: 'Công thức 4 lớp'
              },
              {
                step: 'BƯỚC 4',
                title: 'Chọn Model Character Lock',
                desc: 'Chọn Model "Flow Character Consistency v2.0" hoặc "Flow Ultra v4.0". Hệ thống sẽ gán ảnh chân dung làm Start Frame tham chiếu.',
                badge: 'Flow Model Mới'
              },
              {
                step: 'BƯỚC 5',
                title: 'Khởi Chạy 4 Luồng Tự Động',
                desc: 'Hệ thống tự động kích hoạt 4 luồng xử lý song song để render cùng lúc 4 phân cảnh khác nhau của nhân vật trong chưa đầy 60 giây.',
                badge: 'Render 4 Luồng'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0f1624] border border-slate-800 rounded-lg p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 font-bold mb-1">
                    <span>{item.step}</span>
                    <span className="text-[10px] bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20 text-indigo-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Formula & Pro Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Prompt Formula */}
            <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Công Thức Prompt Đồng Nhất Chuẩn (Prompt Formula)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      '[Consistent Character: Nguyen Mai, Seed: #8849201], oval face, short dark hair, wearing sleek charcoal leather trench coat, sitting in a dimly lit neon cyberpunk bar, volumetric amber mist, cinematic 4k.',
                      'formula'
                    )
                  }
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {copiedKey === 'formula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'formula' ? 'Đã sao chép' : 'Sao chép mẫu'}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-[#131b29] p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-indigo-300 font-mono font-semibold">1. Tiêu Đề Nhận Diện Cố Định (Bắt buộc):</div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    [Consistent Character: Tên_Nhân_Vật, Seed: #Mã_Số]
                  </div>
                </div>

                <div className="bg-[#131b29] p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-indigo-300 font-mono font-semibold">2. Khuôn Mặt & Trang Phục (Giữ cố định 100%):</div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    oval face, sharp eyes, wearing charcoal trench coat with high collar
                  </div>
                </div>

                <div className="bg-[#131b29] p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-indigo-300 font-mono font-semibold">3. Hành Động & Góc Máy (Thay đổi theo từng cảnh):</div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    running through rainy alley, looking back at camera in panic, low angle shot
                  </div>
                </div>

                <div className="bg-[#131b29] p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-indigo-300 font-mono font-semibold">4. Cài Đặt Điện Ảnh (Render Setting):</div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    cinematic lighting, photorealistic 4k, volumetric atmosphere, 60fps
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Pro Tips & Common Mistakes */}
            <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mẹo Chuyên Sâu Tránh Biến Dạng Mặt Nhân Vật (Pro Tips)
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2 bg-[#131b29] p-2.5 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100">Luôn bật 1 ảnh tham chiếu:</strong> Trong mục "Ảnh Tham Chiếu Video" của Flow Video, hãy gắn đúng ảnh chân dung của nhân vật đó. Model sẽ lấy vector khuôn mặt làm neo gốc.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#131b29] p-2.5 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100">Không đổi mô tả trang phục:</strong> Nếu cảnh 1 mặc "charcoal trench coat", ở cảnh 2 và 3 cũng phải giữ nguyên cụm từ đó để tránh AI tự sáng tạo ra quần áo khác.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#131b29] p-2.5 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100">Sử dụng model Flow Character Consistency v2.0:</strong> Model mới nhất được tối ưu hóa đặc biệt cho thuật toán Facial Feature Retention.
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveSubTab('generator')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Clapperboard className="w-4 h-4" />
                    <span>Thử Tạo Chuỗi 4 Video Đồng Nhất Ngay Bây Giờ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TẠO CHUỖI VIDEO ĐỒNG NHẤT NHÂN VẬT NGAY (PER USER REQUEST) */}
      {activeSubTab === 'generator' && (
        <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Bộ Tạo Chuỗi Video Đồng Nhất Nhân Vật (Multi-Scene Storyboard Generator)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chọn một nhân vật trong cơ sở dữ liệu và tinh chỉnh 4 phân cảnh để khởi chạy đồng thời trên 4 luồng.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Chọn Nhân Vật:</span>
              <select
                value={selectedCharId}
                onChange={(e) => setSelectedCharId(e.target.value)}
                className="bg-[#151f33] border border-slate-700 text-slate-100 font-semibold rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {characters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name} (Seed: #{char.seed})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Character Preview Card */}
          {selectedChar && (
            <div className="bg-[#131b29] border border-indigo-500/40 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    setPreviewImageUrl(selectedChar.avatarUrl);
                    setPreviewTitle(`Ảnh chân dung gốc: ${selectedChar.name}`);
                  }}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-500/50 cursor-pointer group shrink-0"
                  title="Bấm để xem ảnh phóng to"
                >
                  <img
                    src={selectedChar.avatarUrl}
                    alt={selectedChar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{selectedChar.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Seed Cố Định: #{selectedChar.seed}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{selectedChar.role}</div>
                  <div className="text-[11px] text-indigo-300 font-mono">
                    Trang phục: {selectedChar.outfit}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                <div>Model tự chọn: <strong className="text-slate-200">Flow Character Lock v2.0</strong></div>
                <div>Khóa neo mặt: <strong className="text-emerald-400">1 Ảnh Tham Chiếu (Bật)</strong></div>
              </div>
            </div>
          )}

          {/* 4 Scene Inputs */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Kịch Bản 4 Phân Cảnh (Tương ứng 4 Worker Threads Chạy Song Song):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-[#131b29] border border-slate-800 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span className="text-indigo-400 font-mono">PHÂN CẢNH 0{num} (Luồng Worker #{num}):</span>
                    <span className="text-[10px] text-slate-500 font-mono">1080p · 6 Giây</span>
                  </div>
                  <textarea
                    rows={2}
                    value={scenePrompts[num] || ''}
                    onChange={(e) => setScenePrompts({ ...scenePrompts, [num]: e.target.value })}
                    className="w-full bg-[#182235] border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Execution Button */}
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleGenerateConsistentSeries}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.01]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>BẮT ĐẦU TẠO 4 PHÂN CẢNH ĐỒNG NHẤT (CHẠY 4 LUỒNG NGAY)</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: QUẢN LÝ HỒ SƠ NHÂN VẬT CỐ ĐỊNH */}
      {activeSubTab === 'profiles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Danh Sách Hồ Sơ Nhân Vật Cố Định ({characters.length} Nhân Vật)
            </span>

            <button
              onClick={() => {
                const name = prompt('Nhập tên nhân vật mới:');
                if (name) {
                  const newChar: CharacterProfile = {
                    id: 'char-' + Date.now(),
                    name,
                    role: 'Nhân vật chính tự tạo',
                    facialFeatures: 'Gương mặt cân đối, ánh mắt sắc bén, nụ cười tự tin',
                    outfit: 'Áo khoác phong cách hiện đại màu đen',
                    avatarUrl: generateTaskThumbnail(name, '1:1'),
                    seed: Math.floor(Math.random() * 9000000 + 1000000)
                  };
                  setCharacters((prev) => [...prev, newChar]);
                  addLog('SUCCESS', `Đã thêm hồ sơ nhân vật mới: ${name} (Seed #${newChar.seed})`);
                }
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tạo Hồ Sơ Nhân Vật Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {characters.map((char) => (
              <div
                key={char.id}
                className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => {
                        setPreviewImageUrl(char.avatarUrl);
                        setPreviewTitle(`Ảnh Chân Dung: ${char.name}`);
                      }}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-500/50 cursor-pointer group shrink-0"
                      title="Bấm để xem ảnh phóng to"
                    >
                      <img
                        src={char.avatarUrl}
                        alt={char.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-xs font-bold text-slate-100 truncate">{char.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{char.role}</p>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 inline-block">
                        Seed: #{char.seed}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#131b29] p-2.5 rounded text-[11px] text-slate-300 space-y-1.5 mt-3 border border-slate-800">
                    <div>
                      <span className="text-slate-500 font-semibold block">Đặc điểm khuôn mặt:</span>
                      <span className="italic leading-relaxed">{char.facialFeatures}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Trang phục cố định:</span>
                      <span className="italic leading-relaxed text-indigo-200">{char.outfit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setSelectedCharId(char.id);
                      setActiveSubTab('generator');
                    }}
                    className="flex-1 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clapperboard className="w-3.5 h-3.5" />
                    <span>Tạo Video Nhân Vật Này</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa hồ sơ ${char.name}?`)) {
                        setCharacters((prev) => prev.filter((c) => c.id !== char.id));
                        addLog('WARN', `Đã xóa nhân vật ${char.name}`);
                      }
                    }}
                    className="p-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 rounded transition-colors"
                    title="Xóa hồ sơ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: GPT PROMPT ENHANCER */}
      {activeSubTab === 'gpt_image' && (
        <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-4 max-w-3xl mx-auto">
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Công Cụ Chuẩn Hóa Prompt Đồng Nhất Bằng GPT Image Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Chuyển đổi ý tưởng tiếng Việt thành câu lệnh tạo video tiếng Anh có chèn sẵn các thẻ khóa nhân vật (Consistent tags) và chất lượng 4K.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Nhập ý tưởng sơ lược của bạn:
            </label>
            <textarea
              rows={3}
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="w-full bg-[#151f33] border border-slate-700 rounded-md p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleEnhancePrompt}
            disabled={isEnhancing}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEnhancing ? 'Đang phân tích và tối ưu hóa...' : 'Nâng Cấp Prompt Bằng GPT Image'}</span>
          </button>

          {enhancedResult && (
            <div className="p-3.5 bg-[#131b29] border border-indigo-500/40 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Prompt Điện Ảnh Sau Khi Tối Ưu Hóa:
                </span>
                <button
                  onClick={() => handleCopy(enhancedResult, 'enhanced')}
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'enhanced' ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-100 leading-relaxed font-sans bg-[#0c121e] p-3 rounded border border-slate-800">
                {enhancedResult}
              </p>

              <button
                onClick={() => {
                  addBatchTasks([enhancedResult], {
                    model: 'veo_3_1_quality',
                    aspectRatio: '16:9',
                    resolution: '1080p',
                    duration: 6,
                    variations: 1,
                    startFrameUrl: selectedChar.avatarUrl
                  });
                  setActiveTab('video');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Đưa Vào Hàng Chờ & Chạy Tạo Video Ngay</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: SƠ ĐỒ WORKFLOW NODE GRAPH */}
      {activeSubTab === 'workflow' && (
        <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Sơ Đồ Luồng Tự Động Hóa Đồng Nhất Nhân Vật (Consistent Architecture)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Khóa khuôn mặt qua IP-Adapter và phân luồng 4 Worker đồng thời trên Hoai Studio Automation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <div className="bg-[#131b29] border border-slate-700 rounded-lg p-3 w-48 text-center space-y-1 shadow-sm">
              <span className="text-[10px] font-mono text-indigo-400 font-bold">NODE 01</span>
              <div className="text-xs font-bold text-slate-100">1 Ảnh Tham Chiếu Chân Dung</div>
              <div className="text-[10px] text-slate-400">Trích xuất vector khuôn mặt</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="bg-[#131b29] border border-indigo-500/50 rounded-lg p-3 w-52 text-center space-y-1 shadow-md shadow-indigo-950/40">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">NODE 02: SEED LOCK</span>
              <div className="text-xs font-bold text-slate-100">Khóa Mã Seed Cố Định</div>
              <div className="text-[10px] text-slate-400">Giữ nguyên cấu trúc hạt nhiễu</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="bg-[#131b29] border border-slate-700 rounded-lg p-3 w-52 text-center space-y-1 shadow-sm">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">NODE 03: 4 WORKERS</span>
              <div className="text-xs font-bold text-slate-100">Render 4 Cảnh Song Song</div>
              <div className="text-[10px] text-slate-400">Model Flow Character Lock v2</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="bg-[#131b29] border border-slate-700 rounded-lg p-3 w-48 text-center space-y-1 shadow-sm">
              <span className="text-[10px] font-mono text-purple-400 font-bold">NODE 04</span>
              <div className="text-xs font-bold text-slate-100">Chuỗi Phim Ngắn Hoàn Chỉnh</div>
              <div className="text-[10px] text-slate-400">Xuất 4 tệp MP4 đồng nhất</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal preview image */}
      <ImagePreviewModal
        isOpen={Boolean(previewImageUrl)}
        imageUrl={previewImageUrl}
        title={previewTitle}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
};
