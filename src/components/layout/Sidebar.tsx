import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquareCode,
  BrainCircuit,
  Landmark,
  Settings,
  LogOut,
  GraduationCap,
  Wrench,
  ShoppingBag
} from 'lucide-react';
import TokenBar from '../common/TokenBar';
import { Business, TokenUsage } from '../../types';

interface SidebarProps {
  business: Business | null;
  tokenUsage: TokenUsage | null;
  onLogout: () => void;
}

export default function Sidebar({ business, tokenUsage, onLogout }: SidebarProps) {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: 'داشبورد اصلی', path: '/dashboard', icon: Home },
    { label: 'مکالمات و چت‌ها', path: '/dashboard/conversations', icon: MessageSquareCode },
    { label: 'پایگاه دانش', path: '/dashboard/knowledge', icon: BrainCircuit },
    { label: 'مدیریت توکن و مالی', path: '/dashboard/tokens', icon: Landmark },
    { label: 'تنظیمات سیستم', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return path === '/dashboard' || path === '/dashboard/';
    }
    return path.startsWith(itemPath);
  };

  const getBadgeIcon = (type?: string) => {
    switch (type) {
      case 'education': return <GraduationCap className="w-4 h-4 text-blue-400 ml-1.5" />;
      case 'services': return <Wrench className="w-4 h-4 text-emerald-400 ml-1.5" />;
      case 'retail': return <ShoppingBag className="w-4 h-4 text-amber-400 ml-1.5" />;
      default: return null;
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-l border-slate-800 h-screen fixed top-0 right-0 z-20 text-right">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
            {(business?.name || 'س')[0]}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate leading-none mb-1.5 text-right">
              {business?.name || 'آکادمی آیلتس'}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 justify-start">
              {getBadgeIcon(business?.type)}
              <span className="leading-none">
                {business?.type === 'education' ? 'صنف آموزشی' : business?.type === 'services' ? 'صنف خدمات تخصصی' : 'صنف فروشگاهی'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation middle list */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const ActiveIcon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all justify-start ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <ActiveIcon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer statistics + user actions */}
      <div className="p-5 border-t border-slate-850 space-y-4">
        {/* Little status check helper */}
        {tokenUsage && (
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400">
              <span>مصرف توکن‌ها</span>
              <span className="font-mono">
                {Math.round((tokenUsage.current / tokenUsage.limit) * 100)}٪
              </span>
            </div>
            {/* 3px Token consumption mini meter */}
            <div className="rounded-full overflow-hidden">
              <TokenBar current={tokenUsage.current} limit={tokenUsage.limit} className="h-2" />
            </div>
            <p className="text-[10px] text-slate-550 font-normal">
              کاهش بر اساس حجم پاسخ‌ها
            </p>
          </div>
        )}

        {/* Exit portal call */}
        <button
          onClick={() => {
            if (confirm('آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟')) {
              onLogout();
            }
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-rose-950/40 hover:border-rose-900/30 border border-transparent transition cursor-pointer justify-start"
        >
          <LogOut className="w-5 h-5 text-slate-500" />
          <span>خروج از پنل مدیریت</span>
        </button>
      </div>
    </aside>
  );
}
