import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { AccountTier, ProxyType } from '../../../types';
import {
  X,
  Chrome,
  KeyRound,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

interface AddAccountModalProps {
  onClose: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ onClose }) => {
  const { addAccount, addLog } = useStudio();
  const [tab, setTab] = useState<'browser' | 'cookie' | 'bulk'>('cookie');

  // Manual Cookie method state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<AccountTier>('PRO');
  const [cookieString, setCookieString] = useState('');
  const [creditTotal, setCreditTotal] = useState(500);
  const [proxyHost, setProxyHost] = useState('');
  const [proxyPort, setProxyPort] = useState<number>(8080);
  const [proxyType, setProxyType] = useState<ProxyType>('HTTP');
  const [proxyUser, setProxyUser] = useState('');
  const [proxyPass, setProxyPass] = useState('');

  // Browser login simulation state
  const [browserStep, setBrowserStep] = useState<'ready' | 'launching' | 'authenticated'>('ready');
  const [detectedEmail, setDetectedEmail] = useState('');

  // Bulk import state
  const [bulkText, setBulkText] = useState(
    'creator.auto25@gmail.com|flow_auth_tok_991823|104.28.192.99:8080:user:pass|PRO|500\n' +
    'motion.studio26@gmail.com|flow_auth_tok_882910|143.198.220.77:1080:user:pass|ULTRA|1500\n' +
    'agency.video27@gmail.com|flow_auth_tok_773819|167.99.78.44:8080:user:pass|PRO|500'
  );

  const handleSaveCookieAcc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Vui lòng nhập địa chỉ Email!');
      return;
    }

    addAccount({
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      tier,
      creditTotal,
      creditRemaining: creditTotal,
      proxy: {
        host: proxyHost.trim() || '104.28.192.' + Math.floor(Math.random() * 200 + 10),
        port: proxyPort || 8080,
        username: proxyUser || undefined,
        password: proxyPass || undefined,
        type: proxyType,
        country: 'VN',
        latencyMs: Math.floor(Math.random() * 60 + 20),
        status: 'active',
        lastChecked: 'Vừa thêm'
      },
      status: 'active',
      enabled: true,
      cookiesSnippet: cookieString.substring(0, 40) + '...'
    });

    onClose();
  };

  const handleLaunchBrowser = () => {
    setBrowserStep('launching');
    addLog('INFO', 'Đang khởi chạy phiên Chromium tự động hóa (Automated Chromium Sandbox)...');

    setTimeout(() => {
      const generated = 'creator.auto.' + Math.floor(Math.random() * 900 + 100) + '@gmail.com';
      setDetectedEmail(generated);
      setBrowserStep('authenticated');
      addLog('SUCCESS', `Đã lấy được phiên đăng nhập Google Auth từ Chromium: ${generated}`);
    }, 2200);
  };

  const handleConfirmBrowserAcc = () => {
    if (!detectedEmail) return;

    addAccount({
      email: detectedEmail,
      name: 'Google Auth User',
      tier: 'PRO',
      creditTotal: 500,
      creditRemaining: 500,
      proxy: {
        host: '104.28.192.15',
        port: 8080,
        type: 'HTTP',
        country: 'VN',
        latencyMs: 32,
        status: 'active',
        lastChecked: 'Vừa xác thực'
      },
      status: 'active',
      enabled: true,
      cookiesSnippet: 'flow_sess_auth=oauth2_google_' + Math.random().toString(36).substr(2, 20)
    });

    onClose();
  };

  const handleBulkImport = () => {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    let count = 0;

    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length >= 1) {
        const importEmail = parts[0].trim();
        const cookie = parts[1] || 'flow_sess_' + Math.random().toString(36).substr(2, 10);
        const proxyPart = parts[2] || '104.28.192.50:8080';
        const proxyHostPort = proxyPart.split(':');
        const importTier = (parts[3]?.trim().toUpperCase() as AccountTier) || 'PRO';
        const importCredit = Number(parts[4]) || 500;

        addAccount({
          email: importEmail,
          name: importEmail.split('@')[0],
          tier: ['FREE', 'PRO', 'ULTRA'].includes(importTier) ? importTier : 'PRO',
          creditTotal: importCredit,
          creditRemaining: importCredit,
          proxy: {
            host: proxyHostPort[0] || '104.28.192.88',
            port: Number(proxyHostPort[1]) || 8080,
            type: 'HTTP',
            country: 'VN',
            latencyMs: Math.floor(Math.random() * 50 + 20),
            status: 'active',
            lastChecked: 'Vừa import'
          },
          status: 'active',
          enabled: true,
          cookiesSnippet: cookie.substring(0, 30) + '...'
        });
        count++;
      }
    }

    addLog('SUCCESS', `Đã nhập hàng loạt thành công ${count} tài khoản Flow vào hệ thống.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1624] border border-slate-700/80 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-[#131b29] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">
              Thêm Tài Khoản Flow Mới (Multi-Account Setup)
            </span>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Add Tabs per SRS */}
        <div className="flex border-b border-slate-800 bg-[#0c111c] p-1.5 gap-1.5">
          <button
            onClick={() => setTab('cookie')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'cookie'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>1. Nhập Cookie Thủ Công</span>
          </button>

          <button
            onClick={() => setTab('browser')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'browser'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Chrome className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Đăng Nhập Trình Duyệt</span>
          </button>

          <button
            onClick={() => setTab('bulk')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              tab === 'bulk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Thêm Hàng Loạt (Bulk)</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* TAB 1: Cookie Exporter */}
          {tab === 'cookie' && (
            <form onSubmit={handleSaveCookieAcc} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Tài Khoản Flow / Gmail: *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="creator.fast@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#151f33] border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gói Tài Khoản (Tier):
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => {
                      const t = e.target.value as AccountTier;
                      setTier(t);
                      setCreditTotal(t === 'ULTRA' ? 1500 : t === 'PRO' ? 500 : 50);
                    }}
                    className="w-full bg-[#151f33] border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PRO">PRO (500 Credit - Khuyên dùng)</option>
                    <option value="ULTRA">ULTRA (1500 Credit - Cao cấp)</option>
                    <option value="FREE">FREE (50 Credit)</option>
                  </select>
                </div>
              </div>

              {/* Cookie string */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chuỗi Cookie (Dán từ Cookie Exporter hoặc DevTools):
                </label>
                <textarea
                  rows={3}
                  placeholder="Dán chuỗi cookie: flow_sess_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... hoặc dạng JSON"
                  value={cookieString}
                  onChange={(e) => setCookieString(e.target.value)}
                  className="w-full bg-[#151f33] border border-slate-700 rounded p-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Proxy Settings */}
              <div className="bg-[#131b29] p-3 rounded border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300 block">
                  Cấu Hình Proxy Riêng (Tránh Khóa IP / Rate Limit):
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-400 block mb-1">Địa chỉ IP / Host:</span>
                    <input
                      type="text"
                      placeholder="104.28.192.44"
                      value={proxyHost}
                      onChange={(e) => setProxyHost(e.target.value)}
                      className="w-full bg-[#1a2336] border border-slate-700 rounded p-1.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Port:</span>
                    <input
                      type="number"
                      placeholder="8080"
                      value={proxyPort}
                      onChange={(e) => setProxyPort(Number(e.target.value))}
                      className="w-full bg-[#1a2336] border border-slate-700 rounded p-1.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Loại Proxy:</span>
                    <select
                      value={proxyType}
                      onChange={(e) => setProxyType(e.target.value as ProxyType)}
                      className="w-full bg-[#1a2336] border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                    >
                      <option value="HTTP">HTTP Proxy</option>
                      <option value="SOCKS5">SOCKS5 Proxy</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">User (Tùy chọn):</span>
                    <input
                      type="text"
                      placeholder="user"
                      value={proxyUser}
                      onChange={(e) => setProxyUser(e.target.value)}
                      className="w-full bg-[#1a2336] border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Pass (Tùy chọn):</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={proxyPass}
                      onChange={(e) => setProxyPass(e.target.value)}
                      className="w-full bg-[#1a2336] border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold shadow-sm"
                >
                  Lưu Tài Khoản
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Browser Login Automation */}
          {tab === 'browser' && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-[#131b29] rounded border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Chrome className="w-4 h-4 text-amber-400" />
                  Mô phỏng Đăng nhập Trình duyệt Chromium Tự Động
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Hệ thống sẽ mở cửa sổ Chromium riêng biệt với profile độc lập. Bạn chỉ cần đăng nhập tài khoản Google Flow, phần mềm sẽ tự động bắt lấy Cookie và Session Token mà không cần copy thủ công.
                </p>
              </div>

              {browserStep === 'ready' && (
                <div className="text-center py-6 space-y-3">
                  <button
                    onClick={handleLaunchBrowser}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-indigo-950/40 inline-flex items-center gap-2"
                  >
                    <Chrome className="w-4 h-4" />
                    <span>Mở Chromium Để Đăng Nhập</span>
                  </button>
                </div>
              )}

              {browserStep === 'launching' && (
                <div className="text-center py-8 space-y-3">
                  <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs text-indigo-300 font-semibold font-mono">
                    Đang mở Chromium và bắt Auth Token...
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Vui lòng đợi giây lát...
                  </div>
                </div>
              )}

              {browserStep === 'authenticated' && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã nhận diện phiên đăng nhập thành công!</span>
                  </div>
                  <div className="text-xs text-slate-200 font-mono bg-black/40 p-2 rounded">
                    Email: <strong>{detectedEmail}</strong> (PRO - 500 Credits)
                  </div>
                  <button
                    onClick={handleConfirmBrowserAcc}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded"
                  >
                    Hoàn Tất & Lưu Vào Hệ Thống
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Bulk Import */}
          {tab === 'bulk' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 font-semibold">
                Định dạng: <span className="text-indigo-400 font-mono">Email|Cookie|ProxyIP:Port:User:Pass|Tier|Credit</span>
              </div>
              <textarea
                rows={8}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="email1@gmail.com|cookie_string|104.28.192.44:8080|PRO|500"
                className="w-full bg-[#151f33] border border-slate-700 rounded p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">
                  Dòng nhập: {bulkText.split('\n').filter((l) => l.trim().length > 0).length} tài khoản
                </span>
                <button
                  onClick={handleBulkImport}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-sm"
                >
                  Xác Nhận Thêm Hàng Loạt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
