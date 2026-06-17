import { Business, Conversation, KnowledgeDetail, CustomQA, TokenUsage, Message } from '../types';
import http, { setToken, clearToken } from './http';

// ── Backend response shapes ─────────────────────────────────────────────────

interface BackendBusiness {
  id: string;
  name: string;
  type: 'shop' | 'education' | 'service';
  field: string;
  contact: string;
  working_hours: string;
  welcome_message: string;
  response_style: 'friendly' | 'formal' | 'brief';
  details: Record<string, string>;
  faq: Array<{ id: string; question: string; answer: string }>;
  api_key: string;
}

interface BackendEscalation {
  id: string;
  business_id: string;
  question: string;
  status: 'pending' | 'answered' | 'closed';
  asked_at: string;
  answer: string | null;
  answered_at: string | null;
}

// ── Type adapters ───────────────────────────────────────────────────────────

const BACKEND_TO_FRONTEND_TYPE: Record<string, Business['type']> = {
  shop: 'retail',
  education: 'education',
  service: 'services',
};

const FRONTEND_TO_BACKEND_TYPE: Record<Business['type'], string> = {
  retail: 'shop',
  education: 'education',
  services: 'service',
};

function toBackendStyle(s: Business['responseStyle']): string {
  return s === 'technical' ? 'brief' : s;
}

function adaptBusiness(b: BackendBusiness): Business {
  return {
    id: b.id,
    name: b.name,
    type: BACKEND_TO_FRONTEND_TYPE[b.type] ?? 'education',
    field: b.field ?? '',
    contact: b.contact ?? '',
    workingHours: b.working_hours ?? '',
    welcomeMessage: b.welcome_message ?? '',
    responseStyle: (b.response_style === 'brief' ? 'technical' : b.response_style) as Business['responseStyle'],
    maxTokens: 1000,
    apiKey: b.api_key ?? '',
    isActive: true,
    brandColor: '#2563eb',
  };
}

function adaptEscalation(e: BackendEscalation): Conversation {
  const statusMap: Record<string, Conversation['status']> = {
    pending: 'escalated',
    answered: 'resolved',
    closed: 'resolved',
  };

  const messages: Message[] = [
    {
      id: `${e.id}_q`,
      sender: 'customer',
      content: e.question,
      timestamp: new Date(e.asked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
  if (e.answer) {
    messages.push({
      id: `${e.id}_a`,
      sender: 'ai',
      content: e.answer,
      timestamp: e.answered_at
        ? new Date(e.answered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
    });
  }

  return {
    id: e.id,
    customerName: 'مشتری',
    channel: 'web',
    status: statusMap[e.status] ?? 'escalated',
    lastMessage: e.answer ?? e.question,
    lastMessageTime: new Date(e.asked_at).toLocaleDateString('fa-IR'),
    messagesCount: messages.length,
    updatedAt: e.asked_at,
    messages,
  };
}

// ── Seed local token usage (no backend endpoint for this) ───────────────────

if (!localStorage.getItem('db_tokens')) {
  const defaultTokens: TokenUsage = {
    current: 0,
    limit: 50000,
    resetDate: '۱ مرداد ۱۴۰۵',
    history: [],
  };
  localStorage.setItem('db_tokens', JSON.stringify(defaultTokens));
}

// ── Public API ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    sendOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
      const { data } = await http.post<{ detail: string; expires_in: number; dev_code?: string }>(
        '/auth/request-otp',
        { phone },
      );
      return { success: true, message: data.detail };
    },

    verifyOtp: async (phone: string, otp: string): Promise<{ token: string; existing: boolean }> => {
      const { data } = await http.post<{
        token: string;
        token_type: string;
        business_id: string | null;
        business_name: string | null;
      }>('/auth/verify-otp', { phone, code: otp });

      // Store token in cookie (7-day expiry) and keep localStorage for legacy compat
      setToken(data.token);
      localStorage.setItem('access_token', data.token);

      return { token: data.token, existing: data.business_id !== null };
    },

    logout: async (): Promise<void> => {
      try {
        await http.post('/auth/logout');
      } catch {
        // ignore — clear session regardless
      }
      clearToken();
      localStorage.removeItem('access_token');
    },

    getMe: async () => {
      const { data } = await http.get<{
        id: string;
        phone: string;
        business: { id: string; name: string; type: string } | null;
      }>('/auth/me');
      return data;
    },
  },

  business: {
    create: async (data: Partial<Business>): Promise<Business> => {
      const { data: res } = await http.post<BackendBusiness>('/me/business', {
        name: data.name,
        type: FRONTEND_TO_BACKEND_TYPE[data.type ?? 'education'],
        field: data.field,
        contact: data.contact,
        working_hours: data.workingHours,
        welcome_message: data.welcomeMessage,
        response_style: toBackendStyle(data.responseStyle ?? 'friendly'),
      });
      localStorage.setItem('onboarding_completed', 'true');
      return adaptBusiness(res);
    },

    getMe: async (): Promise<Business | null> => {
      try {
        const { data } = await http.get<BackendBusiness>('/me/business');
        return adaptBusiness(data);
      } catch {
        return null;
      }
    },

    update: async (_id: string, updates: Partial<Business>): Promise<Business> => {
      const payload: Record<string, unknown> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.type !== undefined) payload.type = FRONTEND_TO_BACKEND_TYPE[updates.type];
      if (updates.field !== undefined) payload.field = updates.field;
      if (updates.contact !== undefined) payload.contact = updates.contact;
      if (updates.workingHours !== undefined) payload.working_hours = updates.workingHours;
      if (updates.welcomeMessage !== undefined) payload.welcome_message = updates.welcomeMessage;
      if (updates.responseStyle !== undefined) payload.response_style = toBackendStyle(updates.responseStyle);

      const { data } = await http.patch<BackendBusiness>('/me/business', payload);
      return adaptBusiness(data);
    },

    regenerateKey: async (_id: string): Promise<string> => {
      // No user-facing endpoint — return existing key
      const b = await api.business.getMe();
      return b?.apiKey ?? '';
    },

    deactivate: async (_id: string): Promise<void> => {
      // No user-facing endpoint — clear session locally
      clearToken();
      localStorage.removeItem('access_token');
    },
  },

  details: {
    getAll: async (): Promise<KnowledgeDetail[]> => {
      const { data } = await http.get<BackendBusiness>('/me/business');
      return Object.entries(data.details ?? {}).map(([key, value]) => ({
        key,
        value,
        title: key.replace(/_/g, ' '),
      }));
    },

    saveAll: async (items: KnowledgeDetail[]): Promise<KnowledgeDetail[]> => {
      const details: Record<string, string> = {};
      items.forEach(i => { details[i.key] = i.value; });
      await http.patch('/me/business', { details });
      return items;
    },

    add: async (item: KnowledgeDetail): Promise<KnowledgeDetail> => {
      const { data } = await http.get<BackendBusiness>('/me/business');
      const details = { ...(data.details ?? {}), [item.key]: item.value };
      await http.patch('/me/business', { details });
      return item;
    },

    update: async (key: string, value: string): Promise<void> => {
      const { data } = await http.get<BackendBusiness>('/me/business');
      const details = { ...(data.details ?? {}), [key]: value };
      await http.patch('/me/business', { details });
    },

    delete: async (key: string): Promise<void> => {
      const { data } = await http.get<BackendBusiness>('/me/business');
      const details = { ...(data.details ?? {}) };
      delete details[key];
      await http.patch('/me/business', { details });
    },
  },

  qas: {
    getAll: async (): Promise<CustomQA[]> => {
      const { data } = await http.get<CustomQA[]>('/me/business/faq');
      return data;
    },

    add: async (qa: Omit<CustomQA, 'id'>): Promise<CustomQA> => {
      const { data } = await http.post<CustomQA>('/me/business/faq', {
        question: qa.question,
        answer: qa.answer,
      });
      return data;
    },

    update: async (id: string, updates: Partial<CustomQA>): Promise<CustomQA> => {
      // No per-item PATCH — fetch all, update in memory, PUT back
      const { data: all } = await http.get<CustomQA[]>('/me/business/faq');
      const idx = all.findIndex(q => q.id === id);
      if (idx === -1) throw new Error('آیتم یافت نشد');
      all[idx] = { ...all[idx], ...updates };
      await http.put(
        '/me/business/faq',
        all.map(q => ({ question: q.question, answer: q.answer })),
      );
      return all[idx];
    },

    delete: async (id: string): Promise<void> => {
      await http.delete(`/me/business/faq/${id}`);
    },
  },

  conversations: {
    getAll: async (): Promise<Conversation[]> => {
      const { data } = await http.get<{ items: BackendEscalation[]; total: number }>('/me/escalations');
      return (data.items ?? []).map(adaptEscalation);
    },

    getById: async (id: string): Promise<Conversation | null> => {
      try {
        const { data } = await http.get<{ items: BackendEscalation[] }>('/me/escalations');
        const found = (data.items ?? []).find(e => e.id === id);
        return found ? adaptEscalation(found) : null;
      } catch {
        return null;
      }
    },

    updateStatus: async (id: string, _status: Conversation['status']): Promise<Conversation> => {
      const conv = await api.conversations.getById(id);
      if (!conv) throw new Error('مکالمه یافت نشد');
      return conv;
    },

    addMessage: async (conversationId: string, content: string, _sender: Message['sender'] = 'customer'): Promise<Message> => {
      const { data } = await http.post<BackendEscalation>(
        `/me/escalations/${conversationId}/answer`,
        { answer: content },
      );
      return {
        id: `${data.id}_a`,
        sender: 'ai',
        content: data.answer ?? content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    },
  },

  tokens: {
    get: async (): Promise<TokenUsage> => {
      const tk = localStorage.getItem('db_tokens');
      return tk
        ? JSON.parse(tk)
        : { current: 0, limit: 50000, resetDate: '۱ مرداد ۱۴۰۵', history: [] };
    },
    updateLimit: async (newLimit: number): Promise<void> => {
      const tkStr = localStorage.getItem('db_tokens');
      if (tkStr) {
        const tk: TokenUsage = JSON.parse(tkStr);
        tk.limit = newLimit;
        localStorage.setItem('db_tokens', JSON.stringify(tk));
      }
    },
  },
};

// ── AI question suggestions (local — no backend equivalent) ─────────────────

export const aiSuggestQuestions = async (
  businessType: string,
  field: string,
): Promise<{ question: string; placeholder: string }[]> => {
  await new Promise(r => setTimeout(r, 1400));

  const educationMap: Record<string, { question: string; placeholder: string }[]> = {
    default: [
      { question: 'دوره‌های آموزشی شما شامل چه موضوعاتی می‌شود؟', placeholder: 'مثال: دوره پایتون مقدماتی، جاوااسکریپت پیشرفته، هوش مصنوعی کاربردی' },
      { question: 'کلاس‌ها به صورت آنلاین هستند یا حضوری؟', placeholder: 'مثال: ترکیبی – جلسات آنلاین در زوم + کارگاه ماهانه حضوری' },
      { question: 'شهریه دوره‌ها و شرایط پرداخت چطور است؟', placeholder: 'مثال: ۳ میلیون تومان – اقساط ۲ ماهه امکان‌پذیر است' },
      { question: 'مدرک پایان دوره اعطا می‌شود؟', placeholder: 'مثال: بله، گواهینامه معتبر با کد یکتا قابل استعلام آنلاین' },
      { question: 'پیش‌نیاز ورود به دوره‌ها چیست؟', placeholder: 'مثال: آشنایی با کامپیوتر در حد کار با اینترنت کافی است' },
      { question: 'مدرسین دوره‌ها چه سابقه‌ای دارند؟', placeholder: 'مثال: مدرسین با ۵+ سال تجربه صنعتی از شرکت‌های بزرگ' },
    ],
    برنامه‌نویسی: [
      { question: 'چه زبان‌های برنامه‌نویسی تدریس می‌کنید؟', placeholder: 'مثال: Python، JavaScript، Flutter، Java' },
      { question: 'دوره‌های حضوری دارید یا فقط آنلاین؟', placeholder: 'مثال: آنلاین از طریق زوم، با ضبط جلسات' },
      { question: 'شهریه دوره‌ها چقدر است؟', placeholder: 'مثال: بسته به دوره از ۲ تا ۵ میلیون تومان' },
      { question: 'پروژه عملی در دوره‌ها وجود دارد؟', placeholder: 'مثال: بله، هر دوره شامل ۳ پروژه واقعی می‌شود' },
      { question: 'پس از اتمام دوره چه پشتیبانی‌ای ارائه می‌شود؟', placeholder: 'مثال: دسترسی مادام‌العمر به محتوا و گروه پشتیبانی' },
    ],
    زبان: [
      { question: 'چه زبان‌هایی تدریس می‌کنید؟', placeholder: 'مثال: انگلیسی، آلمانی، فرانسه، ترکی استانبولی' },
      { question: 'آیا دوره آمادگی آزمون‌های بین‌المللی دارید؟', placeholder: 'مثال: آیلتس، تافل، دولینگو، گوته' },
      { question: 'آزمون تعیین سطح اولیه دارید؟', placeholder: 'مثال: بله، آزمون آنلاین رایگان ۲۰ دقیقه‌ای' },
      { question: 'کلاس‌های کودکان و نوجوانان هم دارید؟', placeholder: 'مثال: بله، گروه‌های سنی ۶ تا ۱۲ و ۱۲ تا ۱۸ سال' },
      { question: 'شهریه و شرایط پرداخت اقساطی چطور است؟', placeholder: 'مثال: ۲.۵ میلیون تومان در ترم – پرداخت دو قسط' },
    ],
    ریاضی: [
      { question: 'کلاس‌ها برای کدام پایه‌های تحصیلی است؟', placeholder: 'مثال: هفتم تا دوازدهم + کنکور' },
      { question: 'تدریس حضوری است یا آنلاین؟', placeholder: 'مثال: هر دو گزینه موجود است' },
      { question: 'آیا جزوه و تمرین اضافی ارائه می‌دهید؟', placeholder: 'مثال: بله، جزوه PDF هر هفته ارسال می‌شود' },
      { question: 'گروه‌های آموزشی چند نفره هستند؟', placeholder: 'مثال: حداکثر ۸ نفر در هر گروه' },
      { question: 'شهریه ماهانه چقدر است؟', placeholder: 'مثال: ماهی ۱.۵ میلیون تومان – ۸ جلسه' },
    ],
  };

  const servicesMap: Record<string, { question: string; placeholder: string }[]> = {
    default: [
      { question: 'خدماتی که ارائه می‌دهید چیست؟', placeholder: 'مثال: مشاوره تخصصی، بازرسی فنی، نصب و راه‌اندازی' },
      { question: 'فرآیند رزرو نوبت یا قرار ملاقات چطور است؟', placeholder: 'مثال: از طریق واتس‌اپ، تلفن یا فرم آنلاین' },
      { question: 'ساعات کاری شما چه زمانی است؟', placeholder: 'مثال: شنبه تا پنجشنبه ۸ صبح تا ۸ شب' },
      { question: 'آیا خدمات در محل مشتری ارائه می‌شود؟', placeholder: 'مثال: بله، با هماهنگی قبلی امکان‌پذیر است' },
      { question: 'سیاست لغو نوبت چگونه است؟', placeholder: 'مثال: تا ۲۴ ساعت قبل بدون جریمه لغو می‌شود' },
    ],
    دندانپزشکی: [
      { question: 'چه خدمات دندانپزشکی ارائه می‌دهید؟', placeholder: 'مثال: ایمپلنت، ارتودنسی، جرم‌گیری، کامپوزیت' },
      { question: 'چطور نوبت بگیریم؟', placeholder: 'مثال: از طریق واتس‌اپ یا تلفن ۰۲۱...' },
      { question: 'آیا بیمه درمانی قبول دارید؟', placeholder: 'مثال: بله، بیمه تامین اجتماعی و خدمات درمانی' },
      { question: 'هزینه جرم‌گیری چقدر است؟', placeholder: 'مثال: ۱.۵ میلیون تومان برای هر فک' },
      { question: 'آیا امکان پرداخت اقساط دارید؟', placeholder: 'مثال: بله، برای ایمپلنت اقساط ۶ ماهه داریم' },
    ],
    آرایشگاه: [
      { question: 'چه خدماتی ارائه می‌دهید؟', placeholder: 'مثال: کوتاهی، رنگ، شینیون، مانیکور پدیکور' },
      { question: 'نوبت آنلاین دارید؟', placeholder: 'مثال: بله از طریق پیج اینستاگرام یا واتس‌اپ' },
      { question: 'ساعات کاری چه زمانی است؟', placeholder: 'مثال: شنبه تا پنجشنبه ۱۰ صبح تا ۸ شب' },
      { question: 'هزینه تقریبی خدمات چقدر است؟', placeholder: 'مثال: کوتاهی از ۸۰۰ هزار تومان شروع می‌شود' },
      { question: 'برای عروس خدمات ویژه دارید؟', placeholder: 'مثال: بله، پکیج کامل عروس از ۵ میلیون تومان' },
    ],
    تعمیرات: [
      { question: 'چه دستگاه‌هایی تعمیر می‌کنید؟', placeholder: 'مثال: موبایل، لپ‌تاپ، تبلت، کنسول بازی' },
      { question: 'مدت زمان تعمیر چقدر طول می‌کشد؟', placeholder: 'مثال: بیشتر تعمیرات در ۲۴ تا ۴۸ ساعت انجام می‌شود' },
      { question: 'ضمانت تعمیرات چقدر است؟', placeholder: 'مثال: ۳ ماه ضمانت کتبی روی تعمیرات' },
      { question: 'آیا قطعه اصلی استفاده می‌کنید؟', placeholder: 'مثال: بله، فقط قطعات اورجینال یا برند A+' },
      { question: 'آیا تعمیرات در محل انجام می‌شود؟', placeholder: 'مثال: برای برخی تعمیرات با هماهنگی بله' },
    ],
    پزشکی: [
      { question: 'چه تخصص‌هایی در مطب دارید؟', placeholder: 'مثال: عمومی، متخصص داخلی، قلب' },
      { question: 'نوبت‌دهی چطور انجام می‌شود؟', placeholder: 'مثال: تلفنی یا از طریق سیستم آنلاین نوبت' },
      { question: 'ساعات حضور پزشک چه زمانی است؟', placeholder: 'مثال: شنبه تا سه‌شنبه ۱۶ تا ۲۰' },
      { question: 'آیا ویزیت آنلاین دارید؟', placeholder: 'مثال: بله، مشاوره آنلاین از طریق اپلیکیشن' },
      { question: 'کدام بیمه‌ها را قبول دارید؟', placeholder: 'مثال: تامین اجتماعی، خدمات درمانی، نیروهای مسلح' },
    ],
  };

  const fieldNorm = field.trim().toLowerCase();

  if (businessType === 'education') {
    const keys = Object.keys(educationMap).filter(k => k !== 'default');
    const matched = keys.find(k => fieldNorm.includes(k) || k.includes(fieldNorm));
    return (matched ? educationMap[matched] : null) ?? educationMap.default;
  } else if (businessType === 'services') {
    const keys = Object.keys(servicesMap).filter(k => k !== 'default');
    const matched = keys.find(k => fieldNorm.includes(k) || k.includes(fieldNorm));
    return (matched ? servicesMap[matched] : null) ?? servicesMap.default;
  }

  return educationMap.default;
};
