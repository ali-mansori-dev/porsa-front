import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { api } from '../../services/api';
import { Business, TokenUsage } from '../../types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaceData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const activeBusiness = await api.business.getMe();
      if (!activeBusiness) {
        navigate('/onboarding');
        return;
      }

      if (!activeBusiness.isActive) {
        localStorage.removeItem('access_token');
        navigate('/auth');
        return;
      }

      const tu = await api.tokens.get();

      setBusiness(activeBusiness);
      setTokenUsage(tu);
    } catch (err) {
      console.error('Failed to load workspace details', err);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();

    // Set up live event listener to update tokens when AI triggers responses organically
    const handleAiMessageAdded = () => {
      api.tokens.get().then(setTokenUsage);
    };

    window.addEventListener('ai_message_added', handleAiMessageAdded);
    return () => {
      window.removeEventListener('ai_message_added', handleAiMessageAdded);
    };
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50" dir="rtl">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6 shrink-0" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-slate-800 text-sm">همگام‌سازی داشبورد مدیریت</h3>
            <p className="text-xs text-slate-400 mt-1">در حال اتصال به میز کار و کانال‌های پاسخ‌گویی...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Desktop left sidebar */}
      <Sidebar business={business} tokenUsage={tokenUsage} onLogout={handleLogout} />

      {/* Mobile top header bar */}
      <TopBar business={business} onLogout={handleLogout} />

      {/* Primary content view container */}
      <main className="flex-1 lg:pr-64 min-h-0 pt-16 pb-20 lg:pt-0 lg:pb-0 flex flex-col">
        <div className="px-4 py-6 md:p-8 flex-1 max-w-6xl w-full mx-auto">
          {/* Allow children views to receive parent contexts if needed */}
          <Outlet context={{ business, tokenUsage, refetchWorkspace: fetchWorkspaceData }} />
        </div>
      </main>

      {/* Mobile interactive tab bottom navigation */}
      <BottomTabBar tokenUsage={tokenUsage} />
    </div>
  );
}
export interface DashboardOutletContext {
  business: Business;
  tokenUsage: TokenUsage;
  refetchWorkspace: () => Promise<void>;
}
