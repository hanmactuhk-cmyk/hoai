import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FlowAccount, AccountTier } from '../../../types';
import { AddAccountModal } from './AddAccountModal';
import { FlowAgentSettingsModal } from '../../modals/FlowAgentSettingsModal';
import {
  Users,
  Plus,
  RefreshCw,
  Globe,
  Trash2,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Search,
  RotateCw,
  FolderOpen,
  Settings2,
  ExternalLink
} from 'lucide-react';

export const AccountSettingsModule: React.FC = () => {
  const {
    accounts,
    deleteAccount,
    testProxy,
    testAllProxies,
    reloadAccountToken,
    resetAccountCredits,
    toggleAccountEnabled,
    settings,
    updateSettings,
    addLog
  } = useStudio();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingAll, setTestingAll] = useState(false);

  const filteredAccounts = accounts.filter((acc) => {
    const matchesTier = filterTier === 'ALL' || acc.tier === filterTier;
    const matchesSearch =
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.proxy.host.includes(searchQuery);
    return matchesTier && matchesSearch;
  });

  const totalCredits = accounts.reduce((acc, curr) => acc + curr.creditRemaining, 0);
  const activeCount = accounts.filter((a) => a.enabled && a.creditRemaining > 0 && a.status !== 'error').length;
  const exhaustedCount = accounts.filter((a) => a.creditRemaining <= 0).length;

  const handleTestAll = async () => {
    setTestingAll(true);
    await testAllProxies();
    setTestingAll(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0f17]">
      {/* Top Banner & Stats Overview */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Quản Lý Tài Khoản Multi-Acc & Cấu Hình Xoay Vòng Thông Minh
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ quản lý 20-50 tài khoản Gmail/Flow, gán Proxy riêng biệt và tự động xoay tua khi hết Credit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAgentModal(true)}
              className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>flow.google.com Agent</span>
            </button>

            <button
              onClick={handleTestAll}
              disabled={testingAll}
              className="px-3 py-1.5 bg-[#151f33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Globe className={`w-3.5 h-3.5 text-cyan-400 ${testingAll ? 'animate-spin' : ''}`} />
              <span>{testingAll ? 'Đang kiểm tra...' : 'Kiểm Tra Tất Cả Proxy'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Tài Khoản Flow</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-3 border-t border-slate-800/80">
          <div className="bg-[#131b29] p-2.5 rounded border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Tổng Số Tài Khoản:</div>
            <div className="text-lg font-bold font-mono text-slate-100">{accounts.length} Accs</div>
          </div>

          <div className="bg-[#131b29] p-2.5 rounded border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Khả Dụng & Sẵn Sàng:</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{activeCount} Accs</div>
          </div>

          <div className="bg-[#131b29] p-2.5 rounded border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Hết Credit (Cần nạp):</div>
            <div className="text-lg font-bold font-mono text-amber-400">{exhaustedCount} Accs</div>
          </div>

          <div className="bg-[#131b29] p-2.5 rounded border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Tổng Credit Còn Lại:</div>
            <div className="text-lg font-bold font-mono text-indigo-400">{totalCredits.toLocaleString()} Credits</div>
          </div>
        </div>
      </div>

      {/* Account List Filter & Table */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg overflow-hidden flex flex-col">
        {/* Table Filter Toolbar */}
        <div className="p-3 bg-[#131b29] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm email, proxy IP, tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#151f33] border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-56"
              />
            </div>

            {/* Filter Tier Tabs */}
            <div className="flex items-center gap-1 bg-[#0b101a] p-1 rounded border border-slate-800 text-xs">
              {['ALL', 'ULTRA', 'PRO', 'FREE'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTier(t)}
                  className={`px-2.5 py-0.5 rounded font-mono font-medium transition-colors ${
                    filterTier === t
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Hiển thị: <strong className="text-slate-200">{filteredAccounts.length}</strong> / {accounts.length} tài khoản
          </div>
        </div>

        {/* Accounts Table per SRS Module 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0b101a] border-b border-slate-800 text-slate-400 font-semibold select-none">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">Bật/Tắt</th>
                <th className="py-2.5 px-3">Tài Khoản (Email)</th>
                <th className="py-2.5 px-3 w-28 text-center">Gói Phân Loại</th>
                <th className="py-2.5 px-3 w-48">Tín Dụng (Credit)</th>
                <th className="py-2.5 px-3 w-56">Proxy Gán Kèm</th>
                <th className="py-2.5 px-3 w-36 text-center">Trạng Thái</th>
                <th className="py-2.5 px-3 w-40 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAccounts.map((acc) => {
                const percent = Math.round((acc.creditRemaining / acc.creditTotal) * 100);
                const isExhausted = acc.creditRemaining <= 0;
                const isError = acc.status === 'error';
                const isBusy = acc.status === 'in_use';

                return (
                  <tr
                    key={acc.id}
                    className={`hover:bg-[#131b29]/70 transition-colors ${
                      !acc.enabled ? 'opacity-50 bg-[#090d14]' : ''
                    }`}
                  >
                    {/* Bật/Tắt Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => toggleAccountEnabled(acc.id)}
                        className={`w-8 h-4 rounded-full transition-colors relative p-0.5 inline-block ${
                          acc.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                        title={acc.enabled ? 'Đang bật' : 'Đang tắt'}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            acc.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Email & Name */}
                    <td className="py-2.5 px-3 space-y-0.5">
                      <div className="font-semibold text-slate-200">{acc.email}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {acc.name} · Đã render {acc.tasksCompleted} video
                      </div>
                    </td>

                    {/* Gói Phân Loại */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          acc.tier === 'ULTRA'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : acc.tier === 'PRO'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {acc.tier}
                      </span>
                    </td>

                    {/* Credit Bar */}
                    <td className="py-2.5 px-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Còn lại:</span>
                        <span className="font-bold text-slate-200">
                          {acc.creditRemaining} / {acc.creditTotal}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent > 50
                              ? 'bg-emerald-500'
                              : percent > 20
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>

                    {/* Proxy Info */}
                    <td className="py-2.5 px-3 space-y-0.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{acc.proxy.host}:{acc.proxy.port}</span>
                        <span className="text-[10px] text-slate-400">{acc.proxy.type} ({acc.proxy.country})</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold ${
                            acc.proxy.status === 'active'
                              ? 'text-emerald-400'
                              : acc.proxy.status === 'testing'
                              ? 'text-indigo-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {acc.proxy.latencyMs ? `${acc.proxy.latencyMs}ms` : 'Chưa test'}
                        </span>
                        <button
                          onClick={() => testProxy(acc.id)}
                          className="text-indigo-400 hover:text-indigo-300 underline"
                        >
                          Test Proxy
                        </button>
                      </div>
                    </td>

                    {/* Trạng Thái */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                          isBusy
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : isExhausted
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : isError
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isBusy
                              ? 'bg-cyan-400 animate-pulse'
                              : isExhausted
                              ? 'bg-amber-400'
                              : isError
                              ? 'bg-rose-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span>
                          {isBusy
                            ? 'ĐANG DÙNG'
                            : isExhausted
                            ? 'HẾT CREDIT'
                            : isError
                            ? 'LỖI PROXY'
                            : 'HOẠT ĐỘNG'}
                        </span>
                      </span>
                    </td>

                    {/* Nút Thao Tác per SRS */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => reloadAccountToken(acc.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                          title="Làm mới Token (Reload Token)"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => resetAccountCredits(acc.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors"
                          title="Nạp lại đầy Credit"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        <button
                          onClick={() => {
                            const newProxy = prompt('Nhập IP:Port proxy mới:', `${acc.proxy.host}:${acc.proxy.port}`);
                            if (newProxy) {
                              const [host, port] = newProxy.split(':');
                              acc.proxy.host = host;
                              acc.proxy.port = Number(port) || 8080;
                              testProxy(acc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                          title="Đổi Proxy"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${acc.email}?`)) {
                              deleteAccount(acc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Rotation & System Automation Configuration */}
      <div className="bg-[#0f1624] border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="border-b border-slate-800/80 pb-2">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Cấu Hình Hệ Thống & Cơ Chế Xoay Vòng Thông Minh (Smart Rotation Rules)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Rule 1: Auto Rotate on Exhausted */}
          <div className="bg-[#131b29] p-3 rounded border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Xoay Vòng Khi Hết Credit:</span>
              <input
                type="checkbox"
                checked={settings.autoRotateAccountOnExhausted}
                onChange={(e) => updateSettings({ autoRotateAccountOnExhausted: e.target.checked })}
                className="accent-indigo-500 rounded"
              />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tự động chuyển tiếp sang tài khoản tiếp theo trong danh sách 20+ Acc khi tài khoản hiện tại hết tín dụng hoặc bị báo lỗi 429 Rate Limit.
            </p>
          </div>

          {/* Rule 2: Auto Retry count */}
          <div className="bg-[#131b29] p-3 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Cơ Chế Thử Lại (Auto Retry):</span>
              <span className="font-mono text-indigo-400 font-bold">{settings.autoRetryCount} Lần</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.autoRetryCount}
              onChange={(e) => updateSettings({ autoRetryCount: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <p className="text-slate-400 text-[11px]">
              Tự động thử lại tác vụ với tài khoản và proxy khác tối đa {settings.autoRetryCount} lần nếu xảy ra lỗi mạng.
            </p>
          </div>

          {/* Rule 3: File Naming Syntax */}
          <div className="bg-[#131b29] p-3 rounded border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200">Cú Pháp Đặt Tên File:</div>
            <input
              type="text"
              value={settings.fileNamingPattern}
              onChange={(e) => updateSettings({ fileNamingPattern: e.target.value })}
              className="w-full bg-[#1a2336] border border-slate-700 rounded px-2 py-1 text-xs font-mono text-indigo-300"
            />
            <p className="text-slate-400 text-[10px]">
              Hỗ trợ: &#123;STT&#125;, &#123;Prompt&#125;, &#123;Res&#125;, &#123;Model&#125;
            </p>
          </div>

          {/* Rule 4: flow.google.com Agent Settings */}
          <div className="bg-[#131b29] p-3 rounded border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-indigo-300 flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
                flow.google.com Agent
              </span>
              <button
                type="button"
                onClick={() => setShowAgentModal(true)}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold"
              >
                Cấu Hình
              </button>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 font-mono">
              <div>Xác nhận: <span className="text-emerald-400 uppercase font-semibold">{settings.confirmationBeforeCreation}</span></div>
              <div>Video: <span className="text-indigo-400 font-semibold">{settings.defaultVideoModel}</span> ({settings.defaultVideoAspectRatio})</div>
              <div>Ảnh: <span className="text-indigo-400 font-semibold">{settings.defaultImageModel}</span> ({settings.defaultImageAspectRatio})</div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddAccountModal onClose={() => setShowAddModal(false)} />}
      <FlowAgentSettingsModal isOpen={showAgentModal} onClose={() => setShowAgentModal(false)} />
    </div>
  );
};
