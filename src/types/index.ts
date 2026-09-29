export type AccountTier = 'FREE' | 'PRO' | 'ULTRA';

export type AccountStatus = 'active' | 'exhausted' | 'error' | 'disabled' | 'in_use';

export type ProxyType = 'HTTP' | 'SOCKS5';

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: ProxyType;
  country?: string;
  latencyMs?: number;
  status: 'active' | 'testing' | 'error' | 'untested';
  lastChecked?: string;
}

export interface FlowAccount {
  id: string;
  email: string;
  name: string;
  tier: AccountTier;
  creditRemaining: number;
  creditTotal: number;
  proxy: ProxyConfig;
  status: AccountStatus;
  enabled: boolean;
  cookiesSnippet?: string;
  token?: string;
  lastUsedAt?: string;
  assignedWorkerId?: number | null;
  tasksCompleted: number;
}

export type FlowVideoModel = 
  | 'omni_1_1_flash'
  | 'veo_3_1_quality'
  | 'veo_3_1_fast'
  | 'veo_3_1_lite';

export type FlowImageModel =
  | 'nano_banana_2_lite'
  | 'nano_banana_2_pro'
  | 'imagen_3';

// Alias for backward compatibility
export type FlowModel = FlowVideoModel;

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export type VideoResolution = '720p' | '1080p' | '4k';

export type ConfirmationBeforeCreation = 'always' | 'images_only' | 'never';

export type TaskStatus = 
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'paused';

export interface VideoTask {
  id: string;
  indexNumber: number;
  prompt: string;
  negativePrompt?: string;
  model: FlowModel;
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  duration: number; // in seconds (4, 6, 8, 10)
  variations: number; // 1, 2, 3, 4
  startFrameUrl?: string;
  endFrameUrl?: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  stageMessage?: string;
  activeWorkerId?: number | null;
  assignedAccountId?: string | null;
  assignedAccountEmail?: string | null;
  videoBlobUrl?: string;
  thumbnailUrl?: string;
  downloadSpeed?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  completedAt?: string;
  outputFilePath?: string;
  fileSizeBytes?: number;
  selected?: boolean;
}

export interface WorkerThread {
  id: number;
  name: string;
  status: 'idle' | 'rendering' | 'downloading' | 'paused' | 'error';
  currentTaskId?: string | null;
  currentPrompt?: string | null;
  accountEmail?: string | null;
  progress: number;
  fps: number;
  speed: string;
  etaSeconds: number;
}

export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'WORKER';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  accountEmail?: string;
  taskId?: string;
  meta?: Record<string, any>;
}

export interface StudioSettings {
  concurrency: number; // default 4
  delayBetweenTasksSec: number; // 5 - 30s
  outputDirectory: string; // e.g., D:/FlowVideoStudio/Exports
  autoRetryCount: number; // 1 - 5
  fileNamingPattern: string; // {STT}_{Prompt}_{Res}.mp4
  enableSoundNotification: boolean;
  enableWatermark: boolean;
  lowVramMode: boolean;
  autoRotateAccountOnExhausted: boolean;
  proxyTimeoutSec: number;
  // Flow.google.com Agent Settings (trực tiếp từ https://flow.google.com)
  flowServiceUrl: string; // 'https://flow.google.com/'
  confirmationBeforeCreation: ConfirmationBeforeCreation; // 'always' | 'images_only' | 'never'
  defaultImageAspectRatio: AspectRatio; // '1:1' (Square), '16:9', '9:16', '4:3', '3:4'
  defaultImageModel: FlowImageModel; // 'nano_banana_2_lite' | 'nano_banana_2_pro' | 'imagen_3'
  defaultVideoAspectRatio: AspectRatio; // '16:9' (Landscape), '9:16' (Portrait), '1:1' (Square)
  defaultVideoModel: FlowVideoModel; // 'omni_1_1_flash' | 'veo_3_1_quality' | 'veo_3_1_fast' | 'veo_3_1_lite'
}
