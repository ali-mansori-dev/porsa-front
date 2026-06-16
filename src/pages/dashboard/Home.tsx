import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  MessageSquareCode,
  AlertOctagon,
  Sparkles,
  Layers,
  ChevronLeft,
  TrendingUp,
  BrainCircuit,
  Key,
  ServerCrash,
  RefreshCw,
  Clock,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { DashboardOutletContext } from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { Conversation } from '../../types';
import BottomDrawer from '../../components/common/BottomDrawer';

export default function Home() {
  const { business, tokenUsage } = useOutletContext<DashboardOutletContext>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active chat drawer
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchConversationsData = async () => {
    try {
      const data = await api.conversations.getAll();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversationsData();

    // Re-trigger updates if an automated AI message ticks in
    const handleAiMessageAdded = (e: any) => {
      fetchConversationsData();
      if (selectedChat && e.detail?.id === selectedChat.id) {
        api.conversations.getById(selectedChat.id).then((uChat) => {
          if (uChat) setSelectedChat(uChat);
        });
      }
    };

    window.addEventListener('ai_message_added', handleAiMessageAdded);
    return () => {
      window.removeEventListener('ai_message_added', handleAiMessageAdded);
    };
  }, [selectedChat]);

  // Handle support escalation
  const handleEscalate = async (id: string) => {
    try {
      const updated = await api.conversations.updateStatus(id, 'escalated');
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelectedChat(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle resolve
  const handleResolve = async (id: string) => {
    try {
      const updated = await api.conversations.updateStatus(id, 'resolved');
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelectedChat(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedChat) return;
    setIsSending(true);
    try {
      await api.conversations.addMessage(selectedChat.id, replyMessage, 'customer');
      setReplyMessage('');
      const updatedChat = await api.conversations.getById(selectedChat.id);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
      fetchConversationsData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Stats
  const openTickets = conversations.filter((c) => c.status === 'escalated').length;
  const activeChats = conversations.filter((c) => c.status === 'active').length;

  // Chart 1: 30 days conversation mockup stats (derived from token usage days)
  const chartData = tokenUsage?.history.map((h) => ({
    name: h.date,
    مکالمات: h.conversations,
    توکن‌ها: h.count * 100, // Multiply for readable scaling
  })) || [];

  // Chart 2: Channel split donut chart data
  const channelsCount = conversations.reduce(
    (acc, next) => {
      acc[next.channel] = (acc[next.channel] || 0) + 1;
      return acc;
    },
    { whatsapp: 0, telegram: 0, web: 0, ticket: 0 } as Record<string, number>
  );

  const pieData = [
    { name: 'واتس‌اپ', value: channelsCount.whatsapp, color: '#10b981' },
    { name: 'تلگرام', value: channelsCount.telegram, color: '#0ea5e9' },
    { name: 'ابزارک وب‌سایت', value: channelsCount.web, color: '#6366f1' },
    { name: 'پشتیبانی آفلاین', value: channelsCount.ticket, color: '#f59e0b' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 pb-10 text-right" dir="rtl">
      
      {/* Intro headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-905 tracking-tight">
            مرور وضعیت میز کار
          </h2>
          <p className="text-xs text-slate-400">
            تحلیل بی‌وقفه سلامت تعاملات و جریان زنده چت‌ها با مشتریان در {business?.name}.
          </p>
        </div>
        <div className="text-slate-400 text-[11px] font-bold flex items-center gap-1.5 font-mono">
          <Clock className="w-4 h-4 text-slate-350 shrink-0" />
          <span>پایداری شبکه: <b className="text-emerald-600 animate-pulse uppercase">برخط (سالم)</b></span>
        </div>
      </div>

      {/* STATS CARDS (GRID 2x2 MOBILE, 4x1 DESKTOP) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Chats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1 relative overflow-hidden flex flex-col justify-between h-28 text-right">
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              کل گفتگوها
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 leading-none">
              {conversations.length}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-none flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500 ml-1 shrink-0" />
            <span>مشتریان تعاملی فعال</span>
          </p>
        </div>

        {/* Escalated Tickets */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1 relative overflow-hidden flex flex-col justify-between h-28 text-right">
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              ارجاع به اپراتور
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 leading-none">
              {openTickets}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-none flex items-center gap-1 font-semibold">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500 ml-1 shrink-0" />
            <span>در انتظار حمایت انسانی</span>
          </p>
        </div>

        {/* Active Session Tokens */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1 relative overflow-hidden flex flex-col justify-between h-28 text-right">
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              توکن‌های مصرف‌شده
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 leading-none font-mono" dir="ltr">
              {tokenUsage ? (tokenUsage.current / 1000).toFixed(1) : '۰'}K
            </div>
          </div>
          <p className="text-[10px] text-slate-450 leading-none flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 ml-1 shrink-0" />
            <span>شارژ ماهیانه خودکار</span>
          </p>
        </div>

        {/* Channels */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1 relative overflow-hidden flex flex-col justify-between h-28 text-right">
          <div>
            <span className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              کانال‌های فعال
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 leading-none">
              ۳
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-none flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-500 ml-1 shrink-0" />
            <span>منسجم و متمرکز</span>
          </p>
        </div>
      </div>

      {/* CHARTS CONTAINER CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Area Chart: Conversations count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm lg:col-span-2 space-y-4 text-right">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 justify-start">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600 ml-1" />
              <span>پیک لود و ترافیک پاسخ‌گویی</span>
            </h3>
            <p className="text-[11px] text-slate-400">نمودار نوسانات تعاملی دستیار هوشمند به صورت روزانه</p>
          </div>
          <div className="w-full h-48 sm:h-64" dir="ltr">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConvs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'right' }} />
                  <Area type="monotone" name="کل تعاملات" dataKey="مکالمات" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConvs)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">در حال آماده‌سازی اطلاعات فنی...</div>
            )}
          </div>
        </div>

        {/* Donut Chart: Channel proportions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between text-right">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">توزیع مشتریان در کانال‌ها</h3>
            <p className="text-[11px] text-slate-400">درصد نفوذ ارتباطی هر درگاه ورودی</p>
          </div>
          <div className="w-full h-48 flex items-center justify-center relative" dir="ltr">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} گفتگو`, 'سهم']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: 650 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-1.5"><ServerCrash className="w-4 h-4" /> درگاهی فعال نشده است</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT CONVERSATIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-5 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">آخرین فعالیت مخاطبان</h3>
            <p className="text-[11px] text-slate-450">مکالمات بی‌وقفه‌ای که اخیراً برقرار شده است</p>
          </div>
          <Link
            to="/dashboard/conversations"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>نمایش تمام چت‌ها</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* MOBILE: STACKED CARD VIEW */}
            <div className="block md:hidden space-y-3">
              {conversations.slice(0, 3).map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-slate-50 active:bg-slate-100 border border-slate-150 p-4 rounded-xl transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1.5 max-w-[80%] text-right">
                    <div className="flex items-center gap-2 justify-start">
                      <span className="text-xs font-extrabold text-slate-750">{chat.customerName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        chat.status === 'escalated'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : chat.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {chat.status === 'escalated' ? 'ارجاع به اپراتور' : chat.status === 'resolved' ? 'حل‌شده' : 'فعال'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate text-right">
                      {chat.lastMessage}
                    </p>
                    <div className="text-[9px] text-slate-400 font-semibold tracking-wide text-right">
                      {chat.channel === 'web' ? 'ابزارک وب' : chat.channel === 'whatsapp' ? 'واتس‌اپ' : chat.channel === 'telegram' ? 'تلگرام' : 'تیکت'} · {chat.lastMessageTime}
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>

            {/* DESKTOP: TABLE GRID */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs font-medium text-slate-500" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                    <th className="py-2.5 text-right">مخاطب گفتگو</th>
                    <th className="text-right">درگاه ارتباطی</th>
                    <th className="text-right">خلاصه پیام نهایی</th>
                    <th className="text-right">وضعیت پرونده</th>
                    <th className="text-right">آخرین تعامل</th>
                    <th className="text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {conversations.slice(0, 3).map((chat) => (
                    <tr key={chat.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-slate-800 text-right">{chat.customerName}</td>
                      <td className="font-semibold text-slate-600 text-right">
                        {chat.channel === 'web' ? 'ابزارک سایت' : chat.channel === 'whatsapp' ? 'واتس‌اپ' : chat.channel === 'telegram' ? 'تلگرام' : 'مرکز پشتیبانی'}
                      </td>
                      <td className="max-w-xs truncate text-slate-500 font-normal text-right">{chat.lastMessage}</td>
                      <td className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          chat.status === 'escalated'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : chat.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {chat.status === 'escalated' ? 'ارجاع پشتیبان' : chat.status === 'resolved' ? 'حل‌شده' : 'فعال'}
                        </span>
                      </td>
                      <td className="text-slate-455 font-mono text-[10px] text-right">{chat.lastMessageTime}</td>
                      <td className="text-left">
                        <button
                          onClick={() => setSelectedChat(chat)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-extrabold cursor-pointer"
                        >
                          بررسی عمیق چت
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* QUICK QUICK WORKSPACE SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-2 text-right">
        <Link
          to="/dashboard/knowledge"
          className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition shadow-sm font-semibold active-scale group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition shrink-0"><BrainCircuit className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">ویرایش پایگاه دانش</h4>
            <span className="text-[10px] text-slate-400 font-normal">تغییر ساعات کار، خدمات و برنوشته‌ها</span>
          </div>
        </Link>

        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition shadow-sm font-semibold active-scale group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition shrink-0"><Key className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">بررسی دسترسی‌های API</h4>
            <span className="text-[10px] text-slate-400 font-normal">مدیریت کلیدهای امنیتی و کانکتورها</span>
          </div>
        </Link>

        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition shadow-sm font-semibold active-scale group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition shrink-0"><Layers className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">یکپارچه‌سازی ابزارک سایت</h4>
            <span className="text-[10px] text-slate-400 font-normal">دریافت سریع افزونه ابزارک برای پرتال‌ها</span>
          </div>
        </Link>
      </div>

      {/* CHAT TRANSCRIPTS BOTTOM DRAWER OR MODAL */}
      <BottomDrawer
        isOpen={selectedChat !== null}
        onClose={() => setSelectedChat(null)}
        title={selectedChat ? `مدیریت گفتگوی ${selectedChat.customerName}` : 'جعبه کنترل چت'}
        subtitle={selectedChat ? `درگاه ورودی: ${selectedChat.channel === 'web' ? 'ابزارک سایت' : selectedChat.channel === 'whatsapp' ? 'واتس‌اپ' : 'تلگرام'} · وضعیت پرونده: ${selectedChat.status === 'escalated' ? 'ارجاع شده به اپراتور' : selectedChat.status === 'resolved' ? 'بسته شده' : 'پاسخ‌گویی توسط هوش مصنوعی'}` : ''}
      >
        {selectedChat && (
          <div className="space-y-6 text-right" dir="rtl">
            
            {/* Status indicators */}
            <div className="flex gap-2 justify-start">
              {selectedChat.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleEscalate(selectedChat.id)}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 rounded-lg uppercase cursor-pointer"
                >
                  ⚠️ ارجاع به اپراتور انسانی
                </button>
              )}
              {selectedChat.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={() => handleResolve(selectedChat.id)}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-250 rounded-lg uppercase cursor-pointer"
                >
                  ✓ نشان کردن به عنوان حل‌شده
                </button>
              )}
            </div>

            {/* Escalated Alert Banner */}
            {selectedChat.status === 'escalated' && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-semibold text-right leading-relaxed">
                ⚠️ <b>ربات هوشمند خاموش شد:</b> این مکالمه در حالت هدایت دستی قرار دارد. اپراتور می‌تواند از کادر زیر پیام خود را برای کاربر ارسال کند.
              </div>
            )}

            {/* Chat bubble list */}
            <div className="space-y-3.5 h-64 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 no-scrollbar" dir="rtl">
              {selectedChat.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'customer'
                      ? 'items-start'
                      : m.sender === 'system'
                      ? 'items-center'
                      : 'items-end'
                  }`}
                >
                  {m.sender === 'system' ? (
                    <span className="text-[10px] text-amber-600 bg-amber-100/40 px-3 py-0.5 rounded-full border border-amber-200 text-center select-none font-bold">
                      {m.content}
                    </span>
                  ) : (
                    <>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed ${
                          m.sender === 'customer'
                            ? 'bg-slate-200 text-slate-800 rounded-tr-none text-right'
                            : 'bg-blue-600 text-white rounded-tl-none shadow-sm shadow-blue-500/10 text-right'
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold tracking-tight mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Text input reply trigger */}
            {selectedChat.status !== 'resolved' ? (
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={selectedChat.status === 'escalated' ? 'پیام اپراتور پشتیبان را اینجا تایپ کنید...' : 'پیام آزمایشی شبیه‌سازی کاربر...'}
                  className="w-full h-11 px-3 bg-slate-50 focus:bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide text-right"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold h-11 px-4 rounded-xl shadow-md transition text-xs shrink-0 cursor-pointer"
                >
                  {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'ارسال'}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl text-center text-xs text-emerald-800 font-bold select-none">
                این چت یا تیکت برچسب حل‌شده خورده است. برای فرستادن مجدد پیام روند را باز کنید.
              </div>
            )}

          </div>
        )}
      </BottomDrawer>

    </div>
  );
}
