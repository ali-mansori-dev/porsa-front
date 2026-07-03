import React from 'react';
import { Bell01, GraduationHat01, Tool01, ShoppingBag01 } from '@untitled-ui/icons-react';
import { Business } from '../../types';

interface TopBarProps {
  business: Business | null;
  onLogout: () => void;
}

export default function TopBar({ business, onLogout }: TopBarProps) {
  const getBadgeIcon = (type?: string) => {
    switch (type) {
      case 'education': return <GraduationHat01 className="w-3.5 h-3.5" />;
      case 'services': return <Tool01 className="w-3.5 h-3.5" />;
      case 'retail': return <ShoppingBag01 className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getBadgeLabel = (type?: string) => {
    switch (type) {
      case 'education': return 'آموزشی';
      case 'services': return 'خدماتی';
      case 'retail': return 'فروشگاهی';
      default: return 'کسب‌وکار هوشمند';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-30 lg:hidden pt-safe text-right" dir="rtl">
      {/* Brand Profile Left */}
      <div className="flex items-center gap-2 max-w-[65%] text-right">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
          {(business?.name || 'س')[0]}
        </div>
        <div className="min-w-0 text-right">
          <h1 className="text-sm font-semibold truncate text-slate-800 leading-none mb-0.5 text-right">
            {business?.name || 'آکادمی آیلتس'}
          </h1>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 border border-slate-200">
            {getBadgeIcon(business?.type)}
            <span>{getBadgeLabel(business?.type)}</span>
          </span>
        </div>
      </div>

      {/* Interactions Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('اعلان‌ها به‌زودی فعال خواهند شد! همگام‌سازی از طریق وب‌سوکت.')}
          className="relative p-2 rounded-xl text-slate-500 active:bg-slate-50 focus:outline-none"
        >
          <Bell01 className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User avatar triggers logout */}
        <button
          onClick={() => {
            if (confirm('آیا مایل به خروج از پنل مدیریت سیستم هستید؟')) {
              onLogout();
            }
          }}
          className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600"
          title="Logout"
        >
          {business?.name ? business.name.slice(0, 2) : 'کاربر'}
        </button>
      </div>
    </header>
  );
}
