import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  MessageCircle,
  Globe2,
  HelpCircle,
  AlertCircle,
  ChevronLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { api } from '../../services/api';
import { Conversation, ChannelType, ConversationStatus, Message } from '../../types';
import { DashboardOutletContext } from '../../components/layout/DashboardLayout';
import BottomDrawer from '../../components/common/BottomDrawer';

export default function Conversations() {
  const { business } = useOutletContext<DashboardOutletContext>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter systems
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drawer Chat Console
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Keep live console drawer scrolled to bottom on status/message update without page jump
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      const all = await api.conversations.getAll();
      setConversations(all);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Listen to live automated messages
    const handleAiMessageAdded = (e: any) => {
      fetchConversations();
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

  // Handle status changes
  const handleUpdateStatus = async (id: string, newStatus: ConversationStatus) => {
    try {
      const updated = await api.conversations.updateStatus(id, newStatus);
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelectedChat(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Reply message
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;
    setIsSending(true);
    try {
      await api.conversations.addMessage(selectedChat.id, replyText, 'customer');
      setReplyText('');
      const updated = await api.conversations.getById(selectedChat.id);
      if (updated) {
        setSelectedChat(updated);
      }
      fetchConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setChannelFilter('all');
    setStatusFilter('all');
  };

  // Filter mechanics
  const filteredChats = conversations.filter((c) => {
    const matchesSearch = c.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'telegram': return <Globe2 className="w-4 h-4 text-sky-500" />;
      case 'web': return <HelpCircle className="w-4 h-4 text-indigo-500" />;
      case 'ticket': return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 text-right animate-in fade-in duration-200" dir="rtl">
      
      {/* Page Headers */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-905 tracking-tight">
            مکالمات و مانیتورینگ گفتگوها
          </h2>
          <p className="text-xs text-slate-400">
            سوالات و موضوعاتی که توسط دستیار هوش مصنوعی پاسخ داده شده‌اند را کنترل کنید و در زمان نیاز پاسخ دهید.
          </p>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {/* Main Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در نام مخاطبان، متن چت‌ها و جزییات گفتمان..."
              className="w-full h-11 pr-10 pl-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none shadow-sm transition text-right"
            />
          </div>

          {/* Expanded button */}
          <button
            onClick={() => setFilterExpanded(!filterExpanded)}
            className={`px-4 h-11 border rounded-xl flex items-center gap-1.5 font-bold text-xs select-none cursor-pointer duration-200 active-scale shadow-sm ${
              filterExpanded
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 font-extrabold'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-350'
            }`}
          >
            <Filter className="w-4 h-4 ml-1" />
            <span className="hidden sm:inline">فیلتر پیشرفته</span>
          </button>
        </div>

        {/* Dynamic drop expand selectors */}
        {filterExpanded && (
          <div className="grid grid-cols-2 gap-3 bg-white p-4 border border-slate-200 rounded-xl shadow-inner animate-in fade-in slide-in-from-top-2 duration-150 text-right">
            {/* Channel filter */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">کانال ارتباطی ورودی</label>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none text-right"
              >
                <option value="all">تمامی صنف درگاه‌ها</option>
                <option value="whatsapp">واتس‌اپ پشتیبان</option>
                <option value="telegram">کانال تلگرام</option>
                <option value="web">ابزارک چت آنلاین سایت</option>
                <option value="ticket">تیکت‌های مجزا</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wide">وضعیت پشتیبانی چت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none text-right"
              >
                <option value="all">هر وضعیتی</option>
                <option value="active">پاسخ‌دهی خودکار ربات</option>
                <option value="escalated">ارجاع شده به اپراتور انسان</option>
                <option value="resolved">تکمیل و حل شده</option>
              </select>
            </div>
          </div>
        )}

        {/* Filter chips indicators */}
        {(channelFilter !== 'all' || statusFilter !== 'all' || search) && (
          <div className="flex gap-1.5 flex-wrap items-center pt-1 text-xs">
            <span className="text-[10px] text-slate-400 font-bold ml-1.5 select-none">فیلترهای فعال:</span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-750 px-2.5 py-0.5 rounded-full border border-slate-20 border-slate-200 font-semibold text-[10px]">
                پیمایش: "{search}"
                <X className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer mr-1" onClick={() => setSearch('')} />
              </span>
            )}
            {channelFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-750 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold text-[10px]">
                درگاه: {channelFilter === 'web' ? 'ابزارک سایت' : channelFilter === 'whatsapp' ? 'واتس‌اپ' : channelFilter === 'telegram' ? 'تلگرام' : 'تیکت'}
                <X className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer mr-1" onClick={() => setChannelFilter('all')} />
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-750 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold text-[10px]">
                موقعیت: {statusFilter === 'escalated' ? 'ارجاع پشتیبان' : statusFilter === 'resolved' ? 'حل‌شده' : 'پاسخ خودکار'}
                <X className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer mr-1" onClick={() => setStatusFilter('all')} />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[10px] text-blue-600 hover:text-blue-750 font-bold mr-1 hover:underline cursor-pointer"
            >
              پاک کردن تمام فیلترها
            </button>
          </div>
        )}
      </div>

      {/* CORE CORE CHAT DISPATCH TABLES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* MOBILE LIST LAYOUT */}
            <div className="block md:hidden space-y-3">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-4 rounded-xl transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1.5 max-w-[85%] text-right">
                    <div className="flex items-center gap-2 justify-start">
                      <div className="flex items-center gap-1.5">
                        {getChannelIcon(chat.channel)}
                        <span className="text-xs font-extrabold text-slate-800">{chat.customerName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        chat.status === 'escalated'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : chat.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {chat.status === 'escalated' ? 'ارجاع‌شده' : chat.status === 'resolved' ? 'حل‌شده' : 'فعال'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate leading-relaxed text-right">
                      {chat.lastMessage}
                    </p>
                    <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1 justify-start">
                      <span>{chat.channel === 'web' ? 'ابزارک وب' : chat.channel === 'whatsapp' ? 'واتس‌اپ' : 'تلگرام'}</span>
                      <span>•</span>
                      <span>{chat.messagesCount} پیام تعاملی</span>
                      <span>•</span>
                      <span>{chat.lastMessageTime}</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              ))}

              {filteredChats.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400">گفتگویی مطابق با فیلترهای بالا یافت نشد.</p>
                </div>
              )}
            </div>

            {/* DESKTOP TABLE LAYOUT */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs font-semibold text-slate-500" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] pb-2.5">
                    <th className="py-2.5 text-right">نام / شناسه مشتری</th>
                    <th className="text-right">درگاه ورودی</th>
                    <th className="text-right">خلاصه پیام آخر</th>
                    <th className="text-right">وضعیت پرونده</th>
                    <th className="text-right">آخرین تغییر زمان</th>
                    <th className="text-left">عملیات کنترلی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChats.map((chat) => (
                    <tr key={chat.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-slate-900 text-right">{chat.customerName}</td>
                      <td className="font-semibold text-slate-700 flex items-center gap-1.5 py-4 text-right justify-start">
                        {getChannelIcon(chat.channel)}
                        <span>{chat.channel === 'web' ? 'ابزارک سایت' : chat.channel === 'whatsapp' ? 'واتس‌اپ' : chat.channel === 'telegram' ? 'تلگرام' : 'تیکت'}</span>
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
                          {chat.status === 'escalated' ? 'ارجاعStaff' : chat.status === 'resolved' ? 'حل‌شده' : 'ربات هوشمند'}
                        </span>
                      </td>
                      <td className="text-[10px] font-mono text-slate-450 text-right">{chat.lastMessageTime}</td>
                      <td className="text-left">
                        <button
                          onClick={() => setSelectedChat(chat)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-extrabold cursor-pointer"
                        >
                          بررسی عمیق و چت
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredChats.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">
                  هیچ سابقه گفتگویی متناسب با جستجوی فعلی در آرشیو یافت نشد.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* DETAILED INTERACTION PANEL DRAWER */}
      <BottomDrawer
        isOpen={selectedChat !== null}
        onClose={() => setSelectedChat(null)}
        title={selectedChat ? `مدیریت گفتگوی ${selectedChat.customerName}` : 'جعبه تعاملی زنده'}
        subtitle={selectedChat ? `درگاه ورودی: ${selectedChat.channel === 'web' ? 'ابزارک سایت' : selectedChat.channel === 'whatsapp' ? 'واتس‌اپ' : 'تلگرام'} · وضعیت کلید: ${selectedChat.status === 'escalated' ? 'هدایت دستی' : selectedChat.status === 'resolved' ? 'بسته شده' : 'پاسخ‌دهی خودکار ربات'}` : ''}
      >
        {selectedChat && (
          <div className="space-y-5 text-right" dir="rtl">
            
            {/* Quick status changes inside console */}
            <div className="flex gap-2 justify-start">
              {selectedChat.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedChat.id, 'escalated')}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 rounded-lg uppercase cursor-pointer animate-pulse"
                >
                  ⚠️ ارجاع به اپراتور انسان
                </button>
              )}
              {selectedChat.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedChat.id, 'resolved')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-250 rounded-lg uppercase cursor-pointer"
                >
                  ✓ نشان کردن به عنوان حل‌شده
                </button>
              )}
              {selectedChat.status === 'resolved' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedChat.id, 'active')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-250 rounded-lg uppercase cursor-pointer"
                >
                  بازگشایی مجدد چت
                </button>
              )}
            </div>

            {/* Warn Escalation banner */}
            {selectedChat.status === 'escalated' && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-semibold flex items-start gap-1.5 text-right">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 ml-1" />
                <span>
                  این گفتگو در وضعیت ارجاع دستی قرار دارد. مکالمه خودکار هوش مصنوعی متوقف شده تا مستقیماً به کاربر پیام دهید.
                </span>
              </div>
            )}

            {/* Scrollable bubble lists */}
            <div ref={chatScrollRef} className="space-y-4 max-h-[300px] overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-150 no-scrollbar" dir="rtl">
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
                    <span className="text-[10px] text-amber-600 bg-amber-100/40 px-3 py-0.5 rounded-full border border-amber-200 select-none font-bold text-center">
                      {m.content}
                    </span>
                  ) : (
                    <>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed ${
                          m.sender === 'customer'
                            ? 'bg-slate-200 text-slate-800 rounded-tr-none text-right'
                            : 'bg-blue-600 text-white rounded-tl-none shadow-sm text-right'
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold tracking-tight mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Input logs replies */}
            {selectedChat.status !== 'resolved' ? (
              <form onSubmit={handleReplySubmit} className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={selectedChat.status === 'escalated' ? 'پاسخ پشتیبان انسانی را بنویسید...' : 'پیام شبیه‌ساز ورودی مشتری...'}
                  className="w-full h-11 px-3 bg-slate-50 focus:bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide text-right"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold h-11 px-4 rounded-xl shadow-md cursor-pointer text-xs shrink-0 active-scale transition"
                >
                  {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'ارسال'}
                </button>
              </form>
            ) : (
              <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl text-center text-xs text-slate-500 font-bold select-none">
                پرونده‌های بسته‌شده قفل گردیده‌اند. برای تبادل پیام ابتدا قفل گفتگو را باز کنید.
              </div>
            )}

          </div>
        )}
      </BottomDrawer>

    </div>
  );
}
