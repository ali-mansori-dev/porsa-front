import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Settings01,
  Key01,
  ShieldOff,
  Copy01,
  Eye,
  EyeOff,
  RefreshCw01,
  AlertTriangle,
  File01,
  ChevronRight,
} from '@untitled-ui/icons-react';
import { Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Business, ResponseStyle } from '../../types';
import { DashboardOutletContext } from '../../components/layout/DashboardLayout';
import BottomDrawer from '../../components/common/BottomDrawer';
import { Button, Input, Textarea } from '../../components/ui';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { business, refetchWorkspace } = useOutletContext<DashboardOutletContext>();

  // Settings page subtabs: 'general' | 'key' | 'danger'
  const [activeTab, setActiveTab] = useState<'general' | 'key' | 'danger'>('general');

  // General profile state
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [field, setField] = useState('');
  const [contact, setContact] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>('friendly');
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Key state
  const [revealKey, setRevealKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Deactivate states
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [deactivating, setDeactivating] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (business) {
      setName(business.name);
      setBusinessType(business.type);
      setField(business.field);
      setContact(business.contact);
      setWorkingHours(business.workingHours);
      setWelcomeMessage(business.welcomeMessage);
      setResponseStyle(business.responseStyle);
    }
  }, [business]);

  // Submit General settings changes
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingGeneral(true);
    try {
      await api.business.update(business.id, {
        name,
        type: businessType as any,
        field,
        contact,
        workingHours,
        welcomeMessage,
        responseStyle
      });
      await refetchWorkspace();
      showToast('مشخصات و تنظیمات هویتی پرتال با موفقیت ذخیره شد.');
    } catch (err) {
      console.error(err);
      showToast('بروزرسانی داده‌ها با خطا مواجه شد.');
    } finally {
      setSavingGeneral(false);
    }
  };

  // Copy API key to clipboard
  const handleCopyKey = () => {
    if (!business) return;
    navigator.clipboard.writeText(business.apiKey);
    showToast('کلید دسترسی با موفقیت در کلیپ‌بورد کپی شد.');
  };

  // Regenerate live key
  const handleRegenerateKey = async () => {
    if (!confirm('⚠️ هشدار جدی: بازسازی مجدد کلید دسترسی موجب می‌شود کلیه ابزارک‌ها، وب هوک‌ها و درگاه‌های چتی که در حال استفاده از کلید قدیمی هستند بلافاصله قطع گردند. آیا ادامه می‌دهید؟')) return;
    setRegenerating(true);
    try {
      await api.business.regenerateKey(business.id);
      await refetchWorkspace();
      showToast('کلید دسترسی محرمانه جدید با موفقیت ایجاد و فعال گردید.');
    } catch (err) {
      console.error(err);
      showToast('بروزرسانی کلید با خطا روبرو شد.');
    } finally {
      setRegenerating(false);
    }
  };

  // Deactivate operations
  const handleDeactivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmName.trim() !== business.name) {
      alert('نام پرتال وارد شده تفاوتی با نام فعلی این میز کار دارد.');
      return;
    }
    setDeactivating(true);
    try {
      await api.business.deactivate(business.id);
      showToast('پرتال با موفقیت معلق شد. خروج از سیستم...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error(err);
      setDeactivating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-right animate-in fade-in duration-200" dir="rtl">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900 border border-slate-800 text-white font-semibold text-xs rounded-xl shadow-lg transition select-none">
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 justify-start">
            <Settings01 className="w-6 h-6 text-blue-600 ml-1.5 shrink-0" />
            <span>تنظیمات عمومی و سیستمی پرتال</span>
          </h2>
          <p className="text-xs text-slate-400">
            طرح اطلاعات پایه هویتی، کدهای امنیتی یا تعلیق میز کار را به راحتی مدیریت کنید.
          </p>
        </div>
      </div>

      {/* HORIZONTAL TAB SELECTORS */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 text-right">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'general' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          نمایه و هویت کسب‌وکار
        </button>
        <button
          onClick={() => setActiveTab('key')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'key' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          کلیدهای دسترسی API
        </button>
        <button
          onClick={() => setActiveTab('danger')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all text-rose-600 cursor-pointer ${
            activeTab === 'danger' ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-100/30' : 'hover:text-rose-700'
          }`}
        >
          تنظیمات حساس و امنیتی
        </button>
      </div>

      {/* TAB 1: GENERAL PROFILE FROM */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6 animate-in fade-in duration-150 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام کسب‌وکار / پرتال" value={name} onChange={e => setName(e.target.value)} required />

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-sm font-medium text-slate-700">نوع دسته‌بندی صنف</label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="education">آموزشگاه آنلاین و آکادمی تخصصی</option>
                <option value="services">خدماتی، کلینیک‌ها و نوبت‌دهی آنلاین</option>
                <option value="retail">فروشگاهی، گالری‌ها و کاتالوگ آنلاین</option>
              </select>
            </div>

            <Input label="تخصص اصلی خدمات" value={field} onChange={e => setField(e.target.value)} />
            <Input label="اطلاعات تماس عمومی" value={contact} onChange={e => setContact(e.target.value)} dir="ltr" className="text-left font-mono" />

            <div className="col-span-1 md:col-span-2">
              <Input label="ساعات کاری روزانه" value={workingHours} onChange={e => setWorkingHours(e.target.value)} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Textarea label="متن خوش‌آمدگویی دستیار" value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="space-y-2.5 text-right">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">سبک و لحن گفتمان هوش مصنوعی</label>
            <div className="grid grid-cols-3 gap-2">
              {['friendly', 'formal', 'technical'].map((styKey) => (
                <button
                  key={styKey}
                  type="button"
                  onClick={() => setResponseStyle(styKey as ResponseStyle)}
                  className={`py-2.5 bg-white border rounded-xl text-center text-xs font-bold transition capitalize cursor-pointer active-scale ${
                    responseStyle === styKey
                      ? 'border-blue-600 bg-blue-50/15 text-blue-700 font-extrabold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-350'
                  }`}
                >
                  {styKey === 'friendly' ? 'صمیمی و صبورانه' : styKey === 'formal' ? 'رسمی و اداری' : 'تخصصی و فنی'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Button type="submit" loading={savingGeneral}>
              ذخیره نهایی تغییر نمایه
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: API KEY SECRETS */}
      {activeTab === 'key' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-6 animate-in fade-in duration-150 text-right">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 uppercase tracking-wider justify-start">
              <Key01 className="w-4 h-4 text-indigo-500 ml-1.5 shrink-0" />
              <span>کدهای دسترسی محرمانه و اعتبارسنجی خارجی</span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 text-right">اتصال ابزارک‌ها و وب‌هوک‌های کمکی API</h3>
            <p className="text-[11px] text-slate-450 leading-relaxed font-semibold text-right">
              از این کدهای امنیتی می‌توانید برای متصل ساختن ربات به ابزارک گفتگو، ربات تلگرام مپ و یا درگاه‌های واتس‌اپ استفاده کنید تا هوش مصنوعی قادر به پاسخ‌گویی زنده در پیام‌رسان‌های کسب‌وکارتان باشد.
            </p>
          </div>

          {/* Mask / Monospace list */}
          <div className="space-y-4 text-right">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs select-all text-slate-700 text-left" dir="ltr">
                <span className="truncate max-w-xs md:max-w-none">
                  {revealKey ? business?.apiKey : '••••••••••••••••' + business?.apiKey.slice(-6)}
                </span>
                <div className="flex gap-1.5 ml-2">
                  <button
                    onClick={() => setRevealKey(!revealKey)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  >
                    {revealKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  >
                    <Copy01 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Copy button */}
              <Button
                variant="secondary"
                leftIcon={<Copy01 className="w-4 h-4" />}
                onClick={handleCopyKey}
                className="shrink-0"
              >
                کپی کردن کلید
              </Button>
            </div>

            <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-2.5 rounded-xl font-semibold leading-relaxed flex items-start gap-1.5 mt-2 text-right">
              <ShieldOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 ml-1.5" />
              <span>
                <b>احتیاط بسیار مهم امنیتی:</b> هرگز این کد کلید محرمانه را در کدهای خام سمت مخاطب، مخازن اشتراکی گیت یا صفحات عمومی قرار ندهید تا از هدررفت سهمیه توکن‌ها چلوگیری شود.
              </span>
            </p>
          </div>

          {/* Regen keys */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-right">
            <div className="text-right">
              <h4 className="font-bold text-xs text-slate-800 leading-none mb-1">باطل ساختن و بازنشانی سریع کلید دسترسی</h4>
              <p className="text-[10px] text-slate-400 font-medium">بلافاصله رمز قدیمی را منقضی و کلید جدید جایگزین می‌کند</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              loading={regenerating}
              onClick={handleRegenerateKey}
              className="shrink-0 text-red-600 border-red-200 hover:bg-red-50"
            >
              ابطال و تولید کلید جدید
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: DANGER ZONE PORTAL */}
      {activeTab === 'danger' && (
        <div className="bg-rose-50/10 border-2 border-rose-200 rounded-2xl p-5 sm:p-6 space-y-6 animate-in fade-in duration-150 border-dashed text-right">
          <div className="flex items-start gap-3 justify-start text-right">
            <div className="p-2 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl shadow-inner shrink-0 ml-1.5">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div className="space-y-1 text-right">
              <h3 className="font-extrabold text-sm text-rose-800 uppercase tracking-wide">ناحیه حساس امنیتی (تعلیق پرتال)</h3>
              <p className="text-[11px] text-rose-700 leading-normal font-semibold text-right">
                اقدامات موجود در این بخش به طور موقت یا دائم پاسخ دستیار، داده‌های همسان و سوابق را متوقف می‌سازد. این امور قابل بازگشت نیستند.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-rose-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-right">
            <div className="space-y-0.5 text-right">
              <h4 className="font-extrabold text-xs text-slate-800 text-right">بستن موقت و تعلیق کامل پرتال کسب‌وکار</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed font-semibold text-right">
                فعالیت خودمختار دستیار هوش مصنوعی در واتس‌اپ، وب‌سایت و تلگرام بلافاصله قطع گردیده و وضعیت غیرفعال می‌شود.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeactivateOpen(true)}
              className="self-start sm:self-center shrink-0"
            >
              تعلیق فوری پرتال
            </Button>
          </div>

          {/* Confirm names bottom drawer */}
          <BottomDrawer
            isOpen={deactivateOpen}
            onClose={() => setDeactivateOpen(false)}
            title="تایید نهایی تعلیق و زدن کلید توقف پرتال"
          >
            <form onSubmit={handleDeactivateSubmit} className="space-y-4 text-right" dir="rtl">
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                برای متوقف ساختن <b>"{business?.name}"</b>، نام کامل پرتال را دقیقاً تایپ کنید.
              </p>
              <Input
                value={confirmName}
                onChange={e => setConfirmName(e.target.value)}
                placeholder="نام کامل پرتال..."
                required
              />
              <div className="flex gap-2">
                <Button type="button" variant="secondary" fullWidth onClick={() => setDeactivateOpen(false)}>
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  fullWidth
                  loading={deactivating}
                  disabled={confirmName.trim() !== business?.name}
                >
                  تایید انسداد و خروج
                </Button>
              </div>
            </form>
          </BottomDrawer>
        </div>
      )}

    </div>
  );
}
