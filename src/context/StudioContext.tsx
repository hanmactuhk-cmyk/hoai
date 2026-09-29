import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  FlowAccount,
  VideoTask,
  WorkerThread,
  SystemLog,
  StudioSettings,
  FlowModel,
  AspectRatio,
  VideoResolution
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TASKS,
  INITIAL_LOGS,
  INITIAL_SETTINGS
} from '../utils/mockData';
import { generatePlayableVideo, generateTaskThumbnail } from '../utils/videoRenderer';

interface StudioContextType {
  activeTab: 'video' | 'image' | 'character' | 'logs' | 'settings';
  setActiveTab: (tab: 'video' | 'image' | 'character' | 'logs' | 'settings') => void;

  // Accounts
  accounts: FlowAccount[];
  addAccount: (acc: Omit<FlowAccount, 'id' | 'tasksCompleted' | 'creditRemaining'> & { creditRemaining?: number }) => void;
  updateAccount: (id: string, updates: Partial<FlowAccount>) => void;
  deleteAccount: (id: string) => void;
  testProxy: (id: string) => Promise<boolean>;
  testAllProxies: () => Promise<void>;
  reloadAccountToken: (id: string) => void;
  resetAccountCredits: (id: string) => void;
  toggleAccountEnabled: (id: string) => void;

  // Tasks & Queue
  tasks: VideoTask[];
  addBatchTasks: (
    prompts: string[],
    config: {
      model: FlowModel;
      aspectRatio: AspectRatio;
      resolution: VideoResolution;
      duration: number;
      variations: number;
      startFrameUrl?: string;
      endFrameUrl?: string;
    }
  ) => void;
  removeTask: (id: string) => void;
  removeSelectedTasks: () => void;
  removeAllTasks: () => void;
  retryTask: (id: string) => void;
  retryFailedTasks: () => void;
  runSelectedTasks: () => void;
  clearCache: () => void;
  toggleSelectTask: (id: string) => void;
  selectAllTasks: (select: boolean) => void;
  updateTask: (id: string, updates: Partial<VideoTask>) => void;

  // Workers & Execution Engine
  workers: WorkerThread[];
  isRunning: boolean;
  isPaused: boolean;
  startQueue: () => void;
  pauseQueue: () => void;
  stopQueue: () => void;

  // Logs
  logs: SystemLog[];
  addLog: (level: SystemLog['level'], message: string, meta?: any) => void;
  clearLogs: () => void;

  // Settings
  settings: StudioSettings;
  updateSettings: (newSettings: Partial<StudioSettings>) => void;

  // Stats
  activeThreadsCount: number;
  completedTasksCount: number;
  activeAccountsCount: number;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TASKS = 'flow_studio_tasks_v2';
const LOCAL_STORAGE_KEY_ACCOUNTS = 'flow_studio_accounts_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'flow_studio_settings_v2';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'character' | 'logs' | 'settings'>('video');

  // Load accounts from localStorage or initial
  const [accounts, setAccounts] = useState<FlowAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACCOUNTS;
  });

  // Load tasks from localStorage or initial
  const [tasks, setTasks] = useState<VideoTask[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  // Load settings
  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  // Logs state
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Workers (4 concurrent worker threads as required)
  const [workers, setWorkers] = useState<WorkerThread[]>([
    { id: 1, name: 'Thread 1', status: 'rendering', currentTaskId: 'task-104', currentPrompt: 'Space exploration spacecraft...', accountEmail: 'creator.pro.01@gmail.com', progress: 68, fps: 32, speed: '18.9 MB/s', etaSeconds: 12 },
    { id: 2, name: 'Thread 2', status: 'rendering', currentTaskId: 'task-105', currentPrompt: 'Fashion model walking down...', accountEmail: 'flow.render.studio02@gmail.com', progress: 52, fps: 28, speed: '22.0 MB/s', etaSeconds: 19 },
    { id: 3, name: 'Thread 3', status: 'downloading', currentTaskId: 'task-106', currentPrompt: 'Anime samurai duel in bamboo...', accountEmail: 'motion.craft.vn03@gmail.com', progress: 84, fps: 45, speed: '35.4 MB/s', etaSeconds: 6 },
    { id: 4, name: 'Thread 4', status: 'rendering', currentTaskId: 'task-107', currentPrompt: 'Hypercar racing through coastal...', accountEmail: 'viral.video.fast04@gmail.com', progress: 29, fps: 30, speed: '15.2 MB/s', etaSeconds: 28 },
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Log helper
  const addLog = (level: SystemLog['level'], message: string, meta?: any) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const newLog: SystemLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: timeStr,
      level,
      message,
      meta
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 500)]); // Keep latest 500 logs
  };

  const clearLogs = () => setLogs([]);

  // Account Helpers
  const addAccount = (acc: Omit<FlowAccount, 'id' | 'tasksCompleted' | 'creditRemaining'> & { creditRemaining?: number }) => {
    const newAcc: FlowAccount = {
      ...acc,
      id: 'acc-' + Date.now(),
      creditRemaining: acc.creditRemaining ?? acc.creditTotal,
      tasksCompleted: 0
    };
    setAccounts((prev) => [newAcc, ...prev]);
    addLog('SUCCESS', `Đã thêm tài khoản mới: ${acc.email} (${acc.tier}) - Proxy: ${acc.proxy.host}:${acc.proxy.port}`);
  };

  const updateAccount = (id: string, updates: Partial<FlowAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    if (acc) {
      addLog('WARN', `Đã xóa tài khoản: ${acc.email}`);
    }
  };

  const toggleAccountEnabled = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const resetAccountCredits = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, creditRemaining: a.creditTotal, status: 'active' } : a))
    );
    addLog('INFO', `Đã nạp lại tín dụng tối đa cho tài khoản #${id}`);
  };

  const reloadAccountToken = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    addLog('INFO', `Đang làm mới Token cho ${acc.email}...`);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: a.creditRemaining > 0 ? 'active' : 'exhausted',
                token: 'tok_' + Math.random().toString(36).substr(2, 16)
              }
            : a
        )
      );
      addLog('SUCCESS', `Làm mới Token thành công cho ${acc.email} (Status: 200 OK)`);
    }, 800);
  };

  const testProxy = async (id: string): Promise<boolean> => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return false;

    updateAccount(id, {
      proxy: { ...acc.proxy, status: 'testing' }
    });
    addLog('INFO', `Đang kiểm tra kết nối Proxy ${acc.proxy.host}:${acc.proxy.port} cho ${acc.email}...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.08;
        const latency = Math.floor(Math.random() * 80 + 25);
        if (isSuccess) {
          updateAccount(id, {
            proxy: {
              ...acc.proxy,
              status: 'active',
              latencyMs: latency,
              lastChecked: 'Vừa xong'
            },
            status: acc.status === 'error' ? 'active' : acc.status
          });
          addLog('SUCCESS', `Proxy ${acc.proxy.host}:${acc.proxy.port} (${acc.proxy.country}) hoạt động tốt! Độ trễ: ${latency}ms`);
          resolve(true);
        } else {
          updateAccount(id, {
            proxy: {
              ...acc.proxy,
              status: 'error',
              latencyMs: 999,
              lastChecked: 'Thất bại'
            },
            status: 'error'
          });
          addLog('ERROR', `Proxy ${acc.proxy.host}:${acc.proxy.port} không phản hồi (Connection timed out)!`);
          resolve(false);
        }
      }, 900);
    });
  };

  const testAllProxies = async () => {
    addLog('INFO', `Bắt đầu kiểm tra hàng loạt Proxy cho ${accounts.length} tài khoản...`);
    for (const acc of accounts) {
      await testProxy(acc.id);
    }
    addLog('SUCCESS', `Hoàn tất kiểm tra proxy toàn bộ tài khoản.`);
  };

  // Task & Queue Helpers
  const addBatchTasks = (
    prompts: string[],
    config: {
      model: FlowModel;
      aspectRatio: AspectRatio;
      resolution: VideoResolution;
      duration: number;
      variations: number;
      startFrameUrl?: string;
      endFrameUrl?: string;
    }
  ) => {
    const currentMaxIndex = tasks.length > 0 ? Math.max(...tasks.map((t) => t.indexNumber)) : 0;
    const newTasks: VideoTask[] = prompts
      .filter((p) => p.trim().length > 0)
      .map((prompt, idx) => ({
        id: 'task-' + Date.now() + '-' + idx,
        indexNumber: currentMaxIndex + idx + 1,
        prompt: prompt.trim(),
        model: config.model,
        aspectRatio: config.aspectRatio,
        resolution: config.resolution,
        duration: config.duration,
        variations: config.variations,
        startFrameUrl: config.startFrameUrl,
        endFrameUrl: config.endFrameUrl,
        status: 'queued',
        progress: 0,
        stageMessage: `Đang trong hàng đợi (Vị trí #${currentMaxIndex + idx + 1})`,
        retryCount: 0,
        maxRetries: settings.autoRetryCount,
        createdAt: new Date().toLocaleString('vi-VN')
      }));

    if (newTasks.length > 0) {
      setTasks((prev) => [...prev, ...newTasks]);
      addLog('INFO', `Đã thêm ${newTasks.length} tác vụ mới vào hàng chờ xử lý.`);
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const removeSelectedTasks = () => {
    const count = tasks.filter((t) => t.selected).length;
    setTasks((prev) => prev.filter((t) => !t.selected));
    if (count > 0) {
      addLog('WARN', `Đã xóa ${count} tác vụ đã chọn.`);
    }
  };

  const removeAllTasks = () => {
    setTasks([]);
    setWorkers((prev) =>
      prev.map((w) => ({
        ...w,
        status: 'idle',
        currentTaskId: null,
        currentPrompt: null,
        progress: 0,
        etaSeconds: 0
      }))
    );
    addLog('WARN', 'Đã xóa toàn bộ hàng tác vụ.');
  };

  const clearCache = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        videoBlobUrl: undefined,
        downloadSpeed: undefined
      }))
    );
    addLog('INFO', 'Đã xóa bộ nhớ đệm video và cache tạm thời.');
  };

  const retryTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'queued',
              progress: 0,
              errorMessage: undefined,
              stageMessage: 'Chờ chạy lại...'
            }
          : t
      )
    );
    addLog('INFO', `Đã đưa Task #${id} vào hàng chờ để chạy lại.`);
  };

  const retryFailedTasks = () => {
    let count = 0;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.status === 'failed') {
          count++;
          return {
            ...t,
            status: 'queued',
            progress: 0,
            errorMessage: undefined,
            stageMessage: 'Chờ chạy lại...'
          };
        }
        return t;
      })
    );
    addLog('INFO', `Đã đưa ${count} tác vụ bị lỗi trở lại hàng chờ.`);
  };

  const runSelectedTasks = () => {
    setTasks((prev) =>
      prev.map((t) => (t.selected && t.status !== 'processing' ? { ...t, status: 'queued', progress: 0 } : t))
    );
    setIsRunning(true);
    setIsPaused(false);
    addLog('INFO', 'Bắt đầu chạy các tác vụ đã chọn.');
  };

  const toggleSelectTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)));
  };

  const selectAllTasks = (select: boolean) => {
    setTasks((prev) => prev.map((t) => ({ ...t, selected: select })));
  };

  const updateTask = (id: string, updates: Partial<VideoTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addLog('INFO', 'Đã cập nhật cấu hình hệ thống.');
  };

  // Execution engine: Controls the 4 worker threads in parallel
  const startQueue = () => {
    setIsRunning(true);
    setIsPaused(false);
    addLog('WORKER', `Kích hoạt tiến trình 4 luồng xử lý đồng thời (Concurrency: 4)...`);
  };

  const pauseQueue = () => {
    setIsPaused(true);
    addLog('WARN', 'Đã tạm dừng hàng chờ (Các task đang xử lý sẽ hoàn tất trước khi dừng).');
  };

  const stopQueue = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTasks((prev) =>
      prev.map((t) =>
        t.status === 'processing'
          ? { ...t, status: 'queued', progress: 0, stageMessage: 'Đã dừng' }
          : t
      )
    );
    setWorkers((prev) =>
      prev.map((w) => ({
        ...w,
        status: 'idle',
        currentTaskId: null,
        currentPrompt: null,
        progress: 0,
        etaSeconds: 0
      }))
    );
    addLog('WARN', 'Đã hủy bỏ toàn bộ tiến trình đang thực thi.');
  };

  // Smart Account Rotation Helper
  const pickAvailableAccount = (excludeIds: string[] = []): FlowAccount | null => {
    // Pick enabled accounts with credit > 10 and status active or in_use
    const pool = accounts.filter(
      (a) => a.enabled && a.creditRemaining > 10 && a.status !== 'error' && !excludeIds.includes(a.id)
    );
    if (pool.length === 0) return null;
    // Prefer Ultra > Pro > Free, then least tasks completed
    return pool.sort((a, b) => {
      const tierScore = { ULTRA: 3, PRO: 2, FREE: 1 };
      const scoreDiff = tierScore[b.tier] - tierScore[a.tier];
      if (scoreDiff !== 0) return scoreDiff;
      return a.tasksCompleted - b.tasksCompleted;
    })[0];
  };

  // Multi-threading parallel worker runner loop
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      // For each worker thread (1 to 4)
      setWorkers((prevWorkers) => {
        return prevWorkers.map((worker) => {
          // If worker currently has a task that is processing
          if (worker.currentTaskId) {
            const currentTask = tasks.find((t) => t.id === worker.currentTaskId);
            if (!currentTask || currentTask.status !== 'processing') {
              return {
                ...worker,
                status: 'idle',
                currentTaskId: null,
                currentPrompt: null,
                progress: 0,
                etaSeconds: 0
              };
            }

            // Advance progress smoothly
            const increment = Math.floor(Math.random() * 4) + 2;
            const newProgress = Math.min(100, currentTask.progress + increment);

            // Update task progress in task list
            if (newProgress >= 100) {
              // Task completed!
              (async () => {
                const renderRes = await generatePlayableVideo(
                  currentTask.prompt,
                  currentTask.aspectRatio,
                  currentTask.duration
                );

                const fileName = `${currentTask.indexNumber}_${currentTask.prompt.substring(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}_${currentTask.resolution}.mp4`;
                const fullPath = `${settings.outputDirectory}/${fileName}`;

                updateTask(currentTask.id, {
                  status: 'completed',
                  progress: 100,
                  activeWorkerId: null,
                  thumbnailUrl: renderRes.thumbnailUrl,
                  videoBlobUrl: renderRes.videoBlobUrl,
                  outputFilePath: fullPath,
                  completedAt: new Date().toLocaleTimeString('vi-VN'),
                  downloadSpeed: `${(Math.random() * 15 + 20).toFixed(1)} MB/s`,
                  fileSizeBytes: Math.floor(Math.random() * 30000000 + 20000000)
                });

                // Deduct credit from assigned account & increase completed count
                if (currentTask.assignedAccountId) {
                  setAccounts((prevAccs) =>
                    prevAccs.map((acc) => {
                      if (acc.id === currentTask.assignedAccountId) {
                        const newCredit = Math.max(0, acc.creditRemaining - 10);
                        const isExhausted = newCredit <= 0;
                        if (isExhausted) {
                          addLog(
                            'WARN',
                            `[Auto Rotate] Tài khoản ${acc.email} đã HẾT CREDIT! Hệ thống sẽ tự động xoay sang tài khoản khác cho task tiếp theo.`
                          );
                        }
                        return {
                          ...acc,
                          creditRemaining: newCredit,
                          tasksCompleted: acc.tasksCompleted + 1,
                          status: isExhausted ? 'exhausted' : 'active'
                        };
                      }
                      return acc;
                    })
                  );
                }

                addLog(
                  'SUCCESS',
                  `[${worker.name}] Hoàn thành render Task #${currentTask.indexNumber}. Đã lưu: ${fileName}`
                );
              })();

              return {
                ...worker,
                status: 'idle',
                currentTaskId: null,
                currentPrompt: null,
                progress: 100,
                etaSeconds: 0
              };
            } else {
              // Update task progress in state
              const stage =
                newProgress < 30
                  ? `Sampling Step ${Math.floor(newProgress * 0.5)}/50`
                  : newProgress < 75
                  ? `Latent Diffusion Frame ${Math.floor(newProgress * 0.6)}/60`
                  : newProgress < 90
                  ? `Post-processing & Upscale 1080p`
                  : `Đang tải video về máy...`;

              updateTask(currentTask.id, {
                progress: newProgress,
                stageMessage: `Đang tạo (${worker.name}) - ${stage}`
              });

              return {
                ...worker,
                status: newProgress > 85 ? 'downloading' : 'rendering',
                progress: newProgress,
                fps: Math.floor(Math.random() * 8 + 28),
                etaSeconds: Math.max(1, Math.round(((100 - newProgress) / increment) * 1.5))
              };
            }
          }

          // Worker is idle: try to pick the next queued task
          const nextQueuedTask = tasks.find(
            (t) => t.status === 'queued' && !prevWorkers.some((w) => w.currentTaskId === t.id)
          );

          if (nextQueuedTask) {
            // Assign available account
            const chosenAcc = pickAvailableAccount();

            if (!chosenAcc) {
              addLog('ERROR', `[${worker.name}] Không có tài khoản Flow nào còn credit! Vui lòng thêm hoặc nạp lại tài khoản.`);
              return worker;
            }

            // Assign task to this worker
            updateTask(nextQueuedTask.id, {
              status: 'processing',
              progress: 5,
              activeWorkerId: worker.id,
              assignedAccountId: chosenAcc.id,
              assignedAccountEmail: chosenAcc.email,
              stageMessage: `Khởi tạo (${worker.name}) - Gửi prompt đến Flow API`
            });

            addLog(
              'WORKER',
              `[${worker.name}] Bắt đầu xử lý Task #${nextQueuedTask.indexNumber} bằng tài khoản ${chosenAcc.email} (${chosenAcc.tier} - Credit: ${chosenAcc.creditRemaining})`
            );

            return {
              ...worker,
              status: 'rendering',
              currentTaskId: nextQueuedTask.id,
              currentPrompt: nextQueuedTask.prompt,
              accountEmail: chosenAcc.email,
              progress: 5,
              fps: 30,
              speed: '24 MB/s',
              etaSeconds: 30
            };
          }

          return worker;
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, tasks, accounts, settings]);

  const activeThreadsCount = workers.filter((w) => w.status === 'rendering' || w.status === 'downloading').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const activeAccountsCount = accounts.filter((a) => a.enabled && a.status === 'active' || a.status === 'in_use').length;

  return (
    <StudioContext.Provider
      value={{
        activeTab,
        setActiveTab,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        testProxy,
        testAllProxies,
        reloadAccountToken,
        resetAccountCredits,
        toggleAccountEnabled,
        tasks,
        addBatchTasks,
        removeTask,
        removeSelectedTasks,
        removeAllTasks,
        retryTask,
        retryFailedTasks,
        runSelectedTasks,
        clearCache,
        toggleSelectTask,
        selectAllTasks,
        updateTask,
        workers,
        isRunning,
        isPaused,
        startQueue,
        pauseQueue,
        stopQueue,
        logs,
        addLog,
        clearLogs,
        settings,
        updateSettings,
        activeThreadsCount,
        completedTasksCount,
        activeAccountsCount
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
