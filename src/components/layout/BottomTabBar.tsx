import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquareCode, BrainCircuit, Landmark, Settings } from 'lucide-react';
import TokenBar from '../common/TokenBar';
import { TokenUsage } from '../../types';

interface BottomTabBarProps {
  tokenUsage: TokenUsage | null;
}

export default function BottomTabBar({ tokenUsage }: BottomTabBarProps) {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: 'خانه', path: '/dashboard', icon: Home },
    { label: 'چت‌ها', path: '/dashboard/conversations', icon: MessageSquareCode },
    { label: 'پایگاه دانش', path: '/dashboard/knowledge', icon: BrainCircuit },
    { label: 'توکن‌ها', path: '/dashboard/tokens', icon: Landmark },
    { label: 'تنظیمات', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return path === '/dashboard' || path === '/dashboard/';
    }
    return path.startsWith(itemPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-slate-400 border-t border-slate-800 lg:hidden pb-safe flex flex-col">
      {/* 3px Token utilization bar at the very top of bottom menu */}
      {tokenUsage && (
        <TokenBar current={tokenUsage.current} limit={tokenUsage.limit} className="h-[3px] w-full" />
      )}

      {/* Grid of Navigation Items */}
      <div className="h-16 grid grid-cols-5 items-center justify-around px-2">
        {navItems.map((item) => {
          const ActiveIcon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full active-scale relative text-center focus:outline-none ${
                active ? 'text-blue-500 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ActiveIcon className={`w-5 h-5 mb-0.5 transition-colors ${active ? 'text-blue-500 scale-105' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-wide truncate max-w-full font-medium">
                {item.label}
              </span>
              
              {/* Dot indicator below active tab */}
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
