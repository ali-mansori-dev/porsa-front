import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BrainCircuit,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { KnowledgeDetail, CustomQA, Business, ResponseStyle } from '../../types';
import { DashboardOutletContext } from '../../components/layout/DashboardLayout';
import BottomDrawer from '../../components/common/BottomDrawer';

export default function Knowledge() {
  const { business, refetchWorkspace } = useOutletContext<DashboardOutletContext>();
  
  // Navigation tabs: 'core' | 'details' | 'qas'
  const [activeTab, setActiveTab] = useState<'core' | 'details' | 'qas'>('core');

  // Core Info forms
  const [name, setName] = useState('');
  const [field, setField] = useState('');
  const [contact, setContact] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>('friendly');
  const [savingCore, setSavingCore] = useState(false);

  // Knowledge Details
  const [details, setDetails] = useState<KnowledgeDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [editingDetail, setEditingDetail] = useState<KnowledgeDetail | null>(null);
  const [detailValue, setDetailValue] = useState('');
  const [newDetailKey, setNewDetailKey] = useState('');
  const [newDetailTitle, setNewDetailTitle] = useState('');
  const [addDetailOpen, setAddDetailOpen] = useState(false);
  const [savingDetail, setSavingDetail] = useState(false);

  // Custom Q&As
  const [qas, setQas] = useState<CustomQA[]>([]);
  const [qasLoading, setQasLoading] = useState(true);
  const [editingQA, setEditingQA] = useState<CustomQA | null>(null);
  const [addQAOpen, setAddQAOpen] = useState(false);
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [savingQA, setSavingQA] = useState(false);

  // Toast indicator
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (business) {
      setName(business.name);
      setField(business.field);
      setContact(business.contact);
      setWorkingHours(business.workingHours);
      setWelcomeMessage(business.welcomeMessage);
      setResponseStyle(business.responseStyle);
    }
    fetchDetailsAndQAs();
  }, [business]);

  const fetchDetailsAndQAs = async () => {
    setDetailsLoading(true);
    setQasLoading(true);
    try {
      const dList = await api.details.getAll();
      const qList = await api.qas.getAll();
      setDetails(dList);
      setQas(qList);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
      setQasLoading(false);
    }
  };

  // Submit Core parameters
  const handleSaveCore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingCore(true);
    try {
      await api.business.update(business.id, {
        name,
        field,
        contact,
        workingHours,
        welcomeMessage,
        responseStyle
      });
      await refetchWorkspace();
      showToast('مشخصات پایه میز کار با موفقیت ذخیره گردید.');
    } catch (err) {
      console.error(err);
      showToast('عملیات با خطا مواجه شد. دوباره تلاش کنید.', 'error');
    } finally {
      setSavingCore(false);
    }
  };

  // Details updates or deletions
  const handleEditDetail = (det: KnowledgeDetail) => {
    setEditingDetail(det);
    setDetailValue(det.value);
  };

  const handleUpdateDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDetail) return;
    setSavingDetail(true);
    try {
      await api.details.update(editingDetail.key, detailValue);
      setDetails((prev) =>
        prev.map((d) => (d.key === editingDetail.key ? { ...d, value: detailValue } : d))
      );
      setEditingDetail(null);
      showToast('اطلاعات پایگاه دانش صنف بروزرسانی شد.');
    } catch (err) {
      console.error(err);
      showToast('بروزرسانی داده‌ها با خطا مواجه گردید.', 'error');
    } finally {
      setSavingDetail(false);
    }
  };

  const handleDeleteDetail = async (key: string) => {
    if (!confirm('آیا مایل هستید این توصیف و بخش پایگاه دانش را برای همیشه حذف کنید؟')) return;
    try {
      await api.details.delete(key);
      setDetails((prev) => prev.filter((d) => d.key !== key));
      showToast('گره دانش با موفقیت برچیده شد.');
    } catch (err) {
      console.error(err);
      showToast('خطا در حذف گره دانش صنف.', 'error');
    }
  };

  const handleAddDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDetailKey.trim() || !newDetailTitle.trim() || !detailValue.trim()) return;
    setSavingDetail(true);
    try {
      const added = await api.details.add({
        key: newDetailKey.trim().toLowerCase().replace(/\s+/g, '_'),
        title: newDetailTitle.trim(),
        value: detailValue.trim()
      });
      setDetails((prev) => [...prev, added]);
      setAddDetailOpen(false);
      setNewDetailKey('');
      setNewDetailTitle('');
      setDetailValue('');
      showToast('ورودی دانش صنف با موفقیت درج و آموزش داده شد.');
    } catch (err) {
      console.error(err);
      showToast('ثبت گره با خطا مواجه گردید.', 'error');
    } finally {
      setSavingDetail(false);
    }
  };

  // Q&A actions
  const handleAddQASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuestion.trim() || !qaAnswer.trim()) return;
    setSavingQA(true);
    try {
      if (editingQA) {
        const updated = await api.qas.update(editingQA.id, {
          question: qaQuestion.trim(),
          answer: qaAnswer.trim()
        });
        setQas((prev) => prev.map((q) => (q.id === editingQA.id ? updated : q)));
        setEditingQA(null);
        showToast('پرسش و پاسخ متداول ویرایش شد.');
      } else {
        const added = await api.qas.add({
          question: qaQuestion.trim(),
          answer: qaAnswer.trim()
        });
        setQas((prev) => [...prev, added]);
        showToast('پرسش و پاسخ متداول جدید ثبت و فعال گردید.');
      }
      setAddQAOpen(false);
      setQaQuestion('');
      setQaAnswer('');
    } catch (err) {
      console.error(err);
      showToast('خطا در ثبت روند پرسش و پاسخ متداول.', 'error');
    } finally {
      setSavingQA(false);
    }
  };

  const handleEditQA = (q: CustomQA) => {
    setEditingQA(q);
    setQaQuestion(q.question);
    setQaAnswer(q.answer);
    setAddQAOpen(true);
  };

  const handleDeleteQA = async (id: string) => {
    if (!confirm('آیا از حذف این پرسش و پاسخ متداول اختصاصی مطمئن هستید؟')) return;
    try {
      await api.qas.delete(id);
      setQas((prev) => prev.filter((q) => q.id !== id));
      showToast('پرسش و پاسخ با موفقیت از سیستم حذف گردید.');
    } catch (err) {
      console.error(err);
      showToast('خطا در برچیدن پرسش و پاسخ متداول.', 'error');
    }
  };

  const handleOpenNewQA = () => {
    setEditingQA(null);
    setQaQuestion('');
    setQaAnswer('');
    setAddQAOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 text-right animate-in fade-in duration-200" dir="rtl">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl border font-semibold text-xs shadow-md transition flex items-center gap-2 ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-905 tracking-tight flex items-center gap-2 justify-start">
            <BrainCircuit className="w-6 h-6 text-blue-600 ml-1.5 shrink-0" />
            <span>پایگاه دانش دستیار هوشمند</span>
          </h2>
          <p className="text-xs text-slate-400">
            برنامه‌ها، شیوه نوبت‌دهی، قوانین و پاسخ‌های گوناگون را ویرایش کنید تا هوش مصنوعی طبق میل شما به مشتری پاسخ دهد.
          </p>
        </div>
      </div>

      {/* TABS SELECTOR ROSET */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 text-right">
        <button
          onClick={() => setActiveTab('core')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'core' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          مشخصات و تنظیمات پایه
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'details' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          دانش صنف و خدمات تخصصی
        </button>
        <button
          onClick={() => setActiveTab('qas')}
          className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'qas' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          سؤال و جواب متداول اختصاصی
        </button>
      </div>

      {/* TAB 1: CORE PARAMS */}
      {activeTab === 'core' && (
        <form onSubmit={handleSaveCore} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-5 animate-in fade-in duration-150 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">نام کسب‌وکار / پرتال</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none transition text-right"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">زمینه یا صنف فعالیت تخصصی</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none transition text-right"
              />
            </div>
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">پل‌های تماس عمومی (تلفن/سایت/کانال)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none transition text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">ساعات کاری و پاسخ‌گویی رسمی</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none transition text-right"
              />
            </div>
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500">پیام خوش‌آمدگویی اولیه هوش مصنوعی</label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none transition resize-none text-right placeholder-slate-350"
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">حدود سبک و لحن گفتمان دستیار</label>
            <div className="grid grid-cols-3 gap-2">
              {['friendly', 'formal', 'technical'].map((sty) => (
                <button
                  key={sty}
                  type="button"
                  onClick={() => setResponseStyle(sty as ResponseStyle)}
                  className={`py-2.5 px-3 border rounded-xl text-center text-xs font-bold transition cursor-pointer capitalize active-scale ${
                    responseStyle === sty
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                  }`}
                >
                  {sty === 'friendly' ? 'صمیمی و صبورانه' : sty === 'formal' ? 'رسمی و اداری' : 'تخصصی و فنی'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={savingCore}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-450 text-white font-bold h-11 px-6 rounded-xl shadow-md transition text-xs active-scale flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savingCore ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ذخیره تغییرات و برنوشته پایه</span>}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: INDUSTRY FAQ NODES */}
      {activeTab === 'details' && (
        <div className="space-y-5 animate-in fade-in duration-150 text-right">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl shadow-sm text-right">
            <div>
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">دانشکده صنف و متغیرهای تخصصی</h3>
              <p className="text-[10px] text-slate-400">متغیرهای تعبیه‌شده زیر به ربات هوشمند چارچوب اصلی فعالیتتان را دیكته می‌کند.</p>
            </div>
            <button
              type="button"
              onClick={() => setAddDetailOpen(true)}
              className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-xl active-scale flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>ایجاد گره جدید</span>
            </button>
          </div>

          {detailsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 bg-white border border-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              {details.map((node) => (
                <div key={node.key} className="bg-white border border-slate-200 hover:border-slate-300 transition rounded-xl p-4 shadow-sm flex flex-col justify-between relative group text-right">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-slate-200" dir="ltr">
                        {node.key.replace(/_/g, ' ')}
                      </span>
                      <div className="flex gap-1.5 items-center">
                        <button
                          onClick={() => handleEditDetail(node)}
                          className="p-1 text-slate-400 hover:text-slate-805 rounded-full hover:bg-slate-50 transition cursor-pointer"
                          title="ویرایش"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDetail(node.key)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-50 transition cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {/* Value */}
                    <div className="text-right">
                      <h4 className="font-bold text-slate-900 text-xs mb-1.5">{node.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed whitespace-pre-line text-right">
                        {node.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline Edit form overlays */}
          {editingDetail && (
            <form onSubmit={handleUpdateDetailSubmit} className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-xl border border-slate-800 animate-in slide-in-from-bottom-2 duration-150 text-right">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-400">در حال ویرایش: {editingDetail.title}</span>
                <button type="button" onClick={() => setEditingDetail(null)} className="text-xs text-slate-400 hover:text-white cursor-pointer">انصراف از تغییر</button>
              </div>
              <textarea
                value={detailValue}
                onChange={(e) => setDetailValue(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-850 border border-slate-800 text-xs font-semibold rounded-xl outline-none text-white focus:border-blue-500 resize-none leading-relaxed text-right"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingDetail || !detailValue.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 px-5 h-9 font-bold rounded-xl text-xs active-scale transition cursor-pointer"
                >
                  {savingDetail ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'ثبت و اعمال تغییر صنف'}
                </button>
              </div>
            </form>
          )}

          {/* Add custom entry Drawer popup */}
          <BottomDrawer isOpen={addDetailOpen} onClose={() => setAddDetailOpen(false)} title="ایجاد گره دانش جدید صنف برای ربات">
            <form onSubmit={handleAddDetailSubmit} className="space-y-4 text-right" dir="rtl">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">کد شناسایی کلیدی (انگلیسی بدون فاصله)</label>
                <input
                  type="text"
                  value={newDetailKey}
                  onChange={(e) => setNewDetailKey(e.target.value)}
                  placeholder="مثلا: courses_duration_rules"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none text-left font-mono"
                  dir="ltr"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">عنوان ملموس فارسی</label>
                <input
                  type="text"
                  value={newDetailTitle}
                  onChange={(e) => setNewDetailTitle(e.target.value)}
                  placeholder="مثلا: مقررات طول دوره و جلسات غیبت"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none text-right"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">متن مستندات آموزشی (ملاك پاسخ ربات)</label>
                <textarea
                  value={detailValue}
                  onChange={(e) => setDetailValue(e.target.value)}
                  rows={4}
                  placeholder="توضیحات مبسوط و متنی را برای آموزش ربات در کادر زیر وارد کنید..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none resize-none leading-relaxed text-right"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingDetail || !newDetailKey.trim() || !newDetailTitle.trim() || !detailValue.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md transition text-xs active-scale flex items-center justify-center cursor-pointer"
              >
                {savingDetail ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'آموزش گره جدید به دستیار هوشمند'}
              </button>
            </form>
          </BottomDrawer>
        </div>
      )}

      {/* TAB 3: CUSTOM Q&A PAIRS */}
      {activeTab === 'qas' && (
        <div className="space-y-4 animate-in fade-in duration-150 text-right">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div>
              <h3 className="font-bold text-xs text-slate-805 uppercase tracking-wide">پرسش و پاسخ‌های متداول اختصاصی</h3>
              <p className="text-[10px] text-slate-400">مجموعه سوالاتی که دقیقا شامل کلمات هدف هستند را به همراه بهترین پاسخ دستی ست کنید.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenNewQA}
              className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-xl active-scale flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>ثبت جدید</span>
            </button>
          </div>

          {qasLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3 text-right">
              {qas.map((qaItem) => (
                <div key={qaItem.id} className="bg-white border border-slate-180 p-4 rounded-xl shadow-sm flex justify-between relative group animate-in slide-in-from-bottom-1 border-r-4 border-r-blue-500 text-right">
                  <div className="space-y-1.5 max-w-[85%] text-right">
                    <h4 className="font-extrabold text-xs text-slate-900 text-right">س: {qaItem.question}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold whitespace-pre-line text-right">ج: {qaItem.answer}</p>
                  </div>
                  {/* Action triggers */}
                  <div className="flex gap-1 items-start justify-end mr-2 shrink-0">
                    <button
                      onClick={() => handleEditQA(qaItem)}
                      className="p-1 px-1.5 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-800 transition cursor-pointer"
                      title="ویرایش"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQA(qaItem.id)}
                      className="p-1 px-1.5 hover:bg-rose-50 rounded text-slate-450 hover:text-rose-650 transition cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {qas.length === 0 && (
                <div className="text-center py-10 bg-slate-100/40 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">هنوز هیچ سوال و جوابی مپ یا ثبت نکرده‌اید (اختیاری).</p>
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Custom QA Drawer */}
          <BottomDrawer
            isOpen={addQAOpen}
            onClose={() => setAddQAOpen(false)}
            title={editingQA ? 'ویرایش پرسش و پاسخ متداول' : 'ثبت پرسش و پاسخ متداول جدید'}
          >
            <form onSubmit={handleAddQASubmit} className="space-y-4 text-right" dir="rtl">
              <div className="space-y-1 text-right">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">متن پرسش فرضی کاربر</label>
                <input
                  type="text"
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  placeholder="مثلا: آیا شعبه فیزیکی در غرب تهران دارید؟"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none text-right"
                  required
                />
              </div>
              <div className="space-y-1 text-right">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">پاسخ متناسب دستیار هوشمند</label>
                <textarea
                  value={qaAnswer}
                  onChange={(e) => setQaAnswer(e.target.value)}
                  rows={4}
                  placeholder="مثلا: بله! پرتال اصلی شعبه غرب ما واقع در فلکه دوم صادقیه آماده خدمات است."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none resize-none leading-relaxed text-right"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingQA || !qaQuestion.trim() || !qaAnswer.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md transition text-xs active-scale flex items-center justify-center cursor-pointer"
              >
                {savingQA ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'ثبت و پیوند قطعی پرسش و پاسخ'}
              </button>
            </form>
          </BottomDrawer>
        </div>
      )}

    </div>
  );
}
