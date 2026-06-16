import { Business, Conversation, KnowledgeDetail, CustomQA, TokenUsage, Message } from '../types';

// Simulate random delays to mimic server latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper to initialize LocalStorage with rich seed data
const initLocalStorage = () => {
  if (!localStorage.getItem('access_token')) {
    // We do not pre-login, let the user complete auth/onboarding or click "Demo Login"
  }

  // Pre-populate mock database
  if (!localStorage.getItem('db_business')) {
    const defaultBusiness: Business = {
      id: 'b_123',
      name: 'آکادمی اپکس',
      type: 'education',
      field: 'آموزش زبان انگلیسی و آمادگی آزمون',
      contact: '+۹۸۹۱۲۳۴۵۶۷۸۹',
      workingHours: 'شنبه تا پنجشنبه ۹:۰۰ صبح تا ۷:۰۰ عصر',
      welcomeMessage: 'سلام! به آکادمی اپکس خوش آمدید. امروز چطور می‌توانم در مورد دوره‌ها یا برنامه‌های آموزشی به شما کمک کنم؟',
      responseStyle: 'friendly',
      maxTokens: 1200,
      apiKey: 'sk_live_apex_6fa8b92c4d10123e4f',
      isActive: true,
      brandColor: '#2563eb'
    };
    localStorage.setItem('db_business', JSON.stringify(defaultBusiness));
  }

  if (!localStorage.getItem('db_details')) {
    const defaultDetails: KnowledgeDetail[] = [
      { key: 'courses_offered', title: 'دوره‌های ارائه شده', value: 'ما دوره‌های آمادگی آزمون آیلتس عمومی/آکادمیک (هدف نمره +۶.۵)، تافل، مکالمه زبان انگلیسی عمومی، مکاتبات تجاری و کلاس‌های فونیکس کودکان را ارائه می‌دهیم.' },
      { key: 'schedule_timing', title: 'برنامه و زمان‌بندی', value: 'عصرهای روزهای زوج (شنبه/دوشنبه/چهارشنبه) از ساعت ۱۸:۰۰ تا ۲۰:۳۰، یا دوره‌های فشرده پنجشنبه‌ها یا جمعه‌ها از ساعت ۹:۰۰ صبح تا ۱۴:۰۰.' },
      { key: 'enrollment_process', title: 'فرآیند ثبت‌نام', value: '۱. شرکت در آزمون تعیین سطح آنلاین رایگان (۱۵ دقیقه گرامر و واژگان).\n۲. هماهنگی مصاحبه شفاهی ۵ دقیقه‌ای در زوم یا اسکایپ.\n۳. انتخاب کلاس و واریز شهریه به صورت آنلاین.' },
      { key: 'tuition_fees', title: 'شهریه و هزینه‌ها', value: 'دوره آمادگی آیلتس: ۲,۵۰۰,۰۰۰ تومان (۱۲ هفته). انگلیسی عمومی: ۱,۸۰۰,۰۰۰ تومان (۸ هفته). همراه با ۱۰٪ تخفیف ثبت‌نام زودهنگام.' },
      { key: 'format', title: 'شیوه برگزاری کلاس‌ها', value: 'آنلاین تعاملی (اسکایپ/زوم)، حضوری (شعبه غرب تهران) یا به صورت ترکیبی (هیبرید).' }
    ];
    localStorage.setItem('db_details', JSON.stringify(defaultDetails));
  }

  if (!localStorage.getItem('db_qas')) {
    const defaultQAs: CustomQA[] = [
      { id: 'q_1', question: 'آیا در پایان دوره مدرک یا گواهینامه معتبر اعطا می‌شود؟', answer: 'بله! تمامی دوره‌ها شامل گواهینامه معتبر حضور و سطح شایستگی ممهور به مهر آکادمی اپکس پس از قبولی در آزمون پایان دوره می‌باشند.' },
      { id: 'q_2', question: 'شرایط انصراف و استرداد شهریه به چه صورت است؟', answer: 'استرداد کامل شهریه در صورت درخواست تا ۳ روز کاری قبل از شروع اولین جلسه. استرداد ۵۰٪ پس از جلسه اول. از جلسه دوم به بعد هیچ هزینه‌ای عودت داده نخواهد شد.' }
    ];
    localStorage.setItem('db_qas', JSON.stringify(defaultQAs));
  }

  if (!localStorage.getItem('db_tokens')) {
    const defaultTokens: TokenUsage = {
      current: 41250,
      limit: 50000,
      resetDate: '۱ تیر ۱۴۰۵',
      history: [
        { date: '۲۰ خرداد', count: 1240, conversations: 12 },
        { date: '۲۱ خرداد', count: 1850, conversations: 16 },
        { date: '۲۲ خرداد', count: 2100, conversations: 19 },
        { date: '۲۳ خرداد', count: 1540, conversations: 14 },
        { date: '۲۴ خرداد', count: 2950, conversations: 22 },
        { date: '۲۵ خرداد', count: 3220, conversations: 28 },
      ]
    };
    localStorage.setItem('db_tokens', JSON.stringify(defaultTokens));
  }

  if (!localStorage.getItem('db_conversations')) {
    const defaultConversations: Conversation[] = [
      {
        id: 'c_8812',
        customerName: 'کاربر شماره ۸۸۱۲',
        channel: 'whatsapp',
        status: 'active',
        lastMessage: 'آیا می‌توانم با گوشی وارد کلاس آنلاین شوم؟',
        lastMessageTime: '۱۵ دقیقه پیش',
        messagesCount: 4,
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        messages: [
          { id: 'm_1', sender: 'customer', content: 'سلام، برنامه زمانی کلاس‌های آمادگی آیلتس به چه صورت است؟', timestamp: '۱۰:۳۰' },
          { id: 'm_2', sender: 'ai', content: 'سلام! دوره‌های آمادگی آیلتس فشرده ما عصرهای دوشنبه و چهارشنبه از ساعت ۱۸:۰۰ تا ۲۰:۳۰ و کلاس‌های فشرده پنجشنبه‌ها از ۹:۰۰ صبح تا ۱۳:۳۰ برگزار می‌شوند. کدام برنامه برای شما مناسب‌تر است؟', timestamp: '۱۰:۳۱' },
          { id: 'm_3', sender: 'customer', content: 'آیا کلاس آنلاین هم دارید؟', timestamp: '۱۰:۳۳' },
          { id: 'm_4', sender: 'ai', content: 'بله! تمام جلسات آنلاین ما در پلتفرم زوم با بازخورد زنده برگزار می‌شوند. آیا می‌خواهید با گوشی وارد شوید؟ بله امکان‌پذیر است، اما لپ‌تاپ برای تمرین‌های نوشتاری بیشتر توصیه می‌شود!', timestamp: '۱۰:۳۴' },
        ]
      },
      {
        id: 'c_9041',
        customerName: 'کاربر شماره ۹۰۴۱',
        channel: 'telegram',
        status: 'escalated',
        lastMessage: 'لطفاً مرا به پشتیبان متصل کنید، پیام خطای تراکنش ناموفق دریافت می‌کنم.',
        lastMessageTime: '۲ ساعت پیش',
        messagesCount: 3,
        updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        messages: [
          { id: 'm_5', sender: 'customer', content: 'آیا پرداخت بین‌المللی با مسترکارت قبول می‌کنید؟', timestamp: '۰۸:۴۵' },
          { id: 'm_6', sender: 'ai', content: 'برای پرداخت‌های بین‌المللی، ما آن‌ها را از طریق پی‌پال یا لینک‌های پرداخت امن پردازش می‌کنیم. بفرمایید تا لینک پرداخت را برایتان ارسال کنم!', timestamp: '۰۸:۴۷' },
          { id: 'm_7', sender: 'customer', content: 'لطفاً مرا به پشتیبان متصل کنید، پیام خطای تراکنش ناموفق دریافت می‌کنم.', timestamp: '۰۸:۵۲' },
          { id: 'm_8', sender: 'system', content: 'این گفتگو به کارشناس پشتیبانی ارجاع داده شد.', timestamp: '۰۸:۵۳' }
        ]
      },
      {
        id: 'c_7632',
        customerName: 'کاربر شماره ۷۶۳۲',
        channel: 'web',
        status: 'resolved',
        lastMessage: 'عالیه، انتقال با موفقیت انجام شد!',
        lastMessageTime: 'دیروز',
        messagesCount: 4,
        updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        messages: [
          { id: 'm_9', sender: 'customer', content: 'آیا محدوده سنی برای کلاس‌های فونیکس کودکان وجود دارد؟', timestamp: 'دیروز' },
          { id: 'm_10', sender: 'ai', content: 'کلاس‌های کودکان ما برای سنین ۶ تا ۱۱ سال طراحی شدهند. این یک سیستم یادگیری کاملاً تعاملی و بازی‌محور است.', timestamp: 'دیروز' },
          { id: 'm_11', sender: 'customer', content: 'بسیار عالی، سپاسگزارم. برای ثبت‌نام دوره اقدام می‌کنم.', timestamp: 'دیروز' },
          { id: 'm_12', sender: 'ai', content: 'بسیار عالی! مشتاقانه منتظر پذیرش فرزند شما هستیم. هر زمان سوالی داشتید با ما در تماس باشید.', timestamp: 'دیروز' }
        ]
      },
    ];
    localStorage.setItem('db_conversations', JSON.stringify(defaultConversations));
  }
};

// Fire initialization
initLocalStorage();

// Standard CRUD Simulated Store Actions
export const api = {
  auth: {
    sendOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
      await delay(800);
      return { success: true, message: 'Verification code sent successfully' };
    },
    verifyOtp: async (phone: string, otp: string): Promise<{ token: string; existing: boolean }> => {
      await delay(900);
      if (otp === '111111' || otp.length === 6) {
        localStorage.setItem('access_token', 'jwt_mock_token_abcdef12345');
        // If they enter a demo phone or have a business already
        const hasBusiness = localStorage.getItem('onboarding_completed') === 'true' || localStorage.getItem('db_business') !== null;
        return { token: 'jwt_mock_token_abcdef12345', existing: !!hasBusiness };
      }
      throw new Error('Invalid verification code. Please try 111111 for trial!');
    },
    logout: () => {
      localStorage.removeItem('access_token');
    }
  },

  business: {
    create: async (data: Partial<Business>): Promise<Business> => {
      await delay(1200);
      const newBusiness: Business = {
        id: 'b_' + Math.floor(Math.random() * 1000),
        name: data.name || 'My New Business',
        type: data.type || 'education',
        field: data.field || '',
        contact: data.contact || '',
        workingHours: data.workingHours || '',
        welcomeMessage: data.welcomeMessage || 'How can I assist you?',
        responseStyle: data.responseStyle || 'friendly',
        maxTokens: data.maxTokens || 1000,
        apiKey: 'sk_live_' + Math.random().toString(36).substr(2, 16),
        isActive: true,
        brandColor: data.brandColor || '#2563eb'
      };
      localStorage.setItem('db_business', JSON.stringify(newBusiness));
      localStorage.setItem('onboarding_completed', 'true');
      return newBusiness;
    },

    getMe: async (): Promise<Business | null> => {
      await delay(400);
      const dataStr = localStorage.getItem('db_business');
      if (!dataStr) return null;
      return JSON.parse(dataStr);
    },

    update: async (id: string, updates: Partial<Business>): Promise<Business> => {
      await delay(600);
      const current = localStorage.getItem('db_business');
      if (!current) throw new Error('Business details not found');
      const bObj: Business = JSON.parse(current);
      const updated: Business = { ...bObj, ...updates };
      localStorage.setItem('db_business', JSON.stringify(updated));
      return updated;
    },

    regenerateKey: async (id: string): Promise<string> => {
      await delay(800);
      const newKey = 'sk_live_' + Math.random().toString(36).substr(2, 18);
      const current = localStorage.getItem('db_business');
      if (current) {
        const bObj: Business = JSON.parse(current);
        bObj.apiKey = newKey;
        localStorage.setItem('db_business', JSON.stringify(bObj));
      }
      return newKey;
    },

    deactivate: async (id: string): Promise<void> => {
      await delay(1000);
      const current = localStorage.getItem('db_business');
      if (current) {
        const bObj: Business = JSON.parse(current);
        bObj.isActive = false;
        localStorage.setItem('db_business', JSON.stringify(bObj));
      }
      localStorage.removeItem('access_token');
    }
  },

  details: {
    getAll: async (): Promise<KnowledgeDetail[]> => {
      await delay(300);
      const items = localStorage.getItem('db_details');
      return items ? JSON.parse(items) : [];
    },

    saveAll: async (items: KnowledgeDetail[]): Promise<KnowledgeDetail[]> => {
      await delay(500);
      localStorage.setItem('db_details', JSON.stringify(items));
      return items;
    },

    add: async (item: KnowledgeDetail): Promise<KnowledgeDetail> => {
      await delay(400);
      const items = localStorage.getItem('db_details');
      const list: KnowledgeDetail[] = items ? JSON.parse(items) : [];
      list.push(item);
      localStorage.setItem('db_details', JSON.stringify(list));
      return item;
    },

    update: async (key: string, value: string): Promise<void> => {
      await delay(400);
      const items = localStorage.getItem('db_details');
      if (items) {
        const list: KnowledgeDetail[] = JSON.parse(items);
        const idx = list.findIndex(i => i.key === key);
        if (idx !== -1) {
          list[idx].value = value;
          localStorage.setItem('db_details', JSON.stringify(list));
        }
      }
    },

    delete: async (key: string): Promise<void> => {
      await delay(450);
      const items = localStorage.getItem('db_details');
      if (items) {
        const list: KnowledgeDetail[] = JSON.parse(items);
        const filtered = list.filter(i => i.key !== key);
        localStorage.setItem('db_details', JSON.stringify(filtered));
      }
    }
  },

  qas: {
    getAll: async (): Promise<CustomQA[]> => {
      await delay(300);
      const items = localStorage.getItem('db_qas');
      return items ? JSON.parse(items) : [];
    },

    add: async (qa: Omit<CustomQA, 'id'>): Promise<CustomQA> => {
      await delay(400);
      const items = localStorage.getItem('db_qas');
      const list: CustomQA[] = items ? JSON.parse(items) : [];
      const newQA: CustomQA = {
        id: 'q_' + Math.floor(Math.random() * 100000),
        question: qa.question,
        answer: qa.answer
      };
      list.push(newQA);
      localStorage.setItem('db_qas', JSON.stringify(list));
      return newQA;
    },

    update: async (id: string, updates: Partial<CustomQA>): Promise<CustomQA> => {
      await delay(400);
      const items = localStorage.getItem('db_qas');
      if (!items) throw new Error('No Q&A found');
      const list: CustomQA[] = JSON.parse(items);
      const idx = list.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Q&A item not found');
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('db_qas', JSON.stringify(list));
      return list[idx];
    },

    delete: async (id: string): Promise<void> => {
      await delay(400);
      const items = localStorage.getItem('db_qas');
      if (items) {
        const list: CustomQA[] = JSON.parse(items);
        const filtered = list.filter(i => i.id !== id);
        localStorage.setItem('db_qas', JSON.stringify(filtered));
      }
    }
  },

  conversations: {
    getAll: async (): Promise<Conversation[]> => {
      await delay(500);
      const list = localStorage.getItem('db_conversations');
      return list ? JSON.parse(list) : [];
    },

    getById: async (id: string): Promise<Conversation | null> => {
      await delay(300);
      const listStr = localStorage.getItem('db_conversations');
      if (!listStr) return null;
      const list: Conversation[] = JSON.parse(listStr);
      return list.find(c => c.id === id) || null;
    },

    updateStatus: async (id: string, status: 'active' | 'escalated' | 'resolved'): Promise<Conversation> => {
      await delay(400);
      const listStr = localStorage.getItem('db_conversations');
      if (!listStr) throw new Error('No chats');
      const list: Conversation[] = JSON.parse(listStr);
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Conversation not found');
      list[idx].status = status;
      localStorage.setItem('db_conversations', JSON.stringify(list));
      return list[idx];
    },

    addMessage: async (conversationId: string, content: string, sender: 'customer' | 'ai' | 'system' = 'customer'): Promise<Message> => {
      await delay(100);
      const listStr = localStorage.getItem('db_conversations');
      if (!listStr) throw new Error('No chats');
      const list: Conversation[] = JSON.parse(listStr);
      const idx = list.findIndex(c => c.id === conversationId);
      if (idx === -1) throw new Error('Conversation not found');

      const newMessage: Message = {
        id: 'msg_' + Math.floor(Math.random() * 100000),
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      list[idx].messages.push(newMessage);
      list[idx].lastMessage = content;
      list[idx].lastMessageTime = 'Just now';
      list[idx].messagesCount += 1;
      list[idx].updatedAt = new Date().toISOString();

      localStorage.setItem('db_conversations', JSON.stringify(list));

      // Simulate a small delay and trigger an auto response of the AI if sent by customer, unless escalated!
      if (sender === 'customer' && list[idx].status !== 'escalated') {
        setTimeout(() => {
          triggerAiAutoResponse(conversationId, content);
        }, 1200);
      }

      return newMessage;
    }
  },

  tokens: {
    get: async (): Promise<TokenUsage> => {
      await delay(300);
      const tk = localStorage.getItem('db_tokens');
      return tk ? JSON.parse(tk) : { current: 0, limit: 50000, resetDate: 'July 1, 2026', history: [] };
    },
    updateLimit: async (newLimit: number): Promise<void> => {
      await delay(500);
      const tkStr = localStorage.getItem('db_tokens');
      if (tkStr) {
        const tk: TokenUsage = JSON.parse(tkStr);
        tk.limit = newLimit;
        localStorage.setItem('db_tokens', JSON.stringify(tk));
      }
    }
  }
};

// Private simulated automated AI response based on standard topics
async function triggerAiAutoResponse(conversationId: string, prompt: string) {
  const p = prompt.toLowerCase();
  let reply = '';

  const details = JSON.parse(localStorage.getItem('db_details') || '[]');
  const qas = JSON.parse(localStorage.getItem('db_qas') || '[]');
  const business = JSON.parse(localStorage.getItem('db_business') || '{}');

  // Search in QAs
  const matchQA = qas.find((q: CustomQA) => p.includes(q.question.toLowerCase()) || q.question.toLowerCase().includes(p));
  
  if (matchQA) {
    reply = matchQA.answer;
  } else if (p.includes('course') || p.includes('class') || p.includes('ielts') || p.includes('prep') || p.includes('دوره') || p.includes('کلاس') || p.includes('آیلتس') || p.includes('آموزش')) {
    const courseObj = details.find((d: KnowledgeDetail) => d.key === 'courses_offered');
    reply = courseObj ? courseObj.value : "ما دوره‌های مختلفی از جمله دوره‌های آمادگی زبان و آزمون‌های بین‌المللی مانند آیلتس ارائه می‌دهیم. در صورت تمایل به من اطلاع دهید!";
  } else if (p.includes('hours') || p.includes('open') || p.includes('when') || p.includes('ساعت') || p.includes('کار') || p.includes('کی') || p.includes('باز')) {
    reply = `ساعات کاری رسمی ما به این ترتیب است: ${business.workingHours || 'شنبه تا پنجشنبه ۹ صبح تا ۶ عصر'}.`;
  } else if (p.includes('fee') || p.includes('cost') || p.includes('price') || p.includes('how much') || p.includes('هزینه') || p.includes('قیمت') || p.includes('شهریه') || p.includes('چقدر')) {
    const feeObj = details.find((d: KnowledgeDetail) => d.key === 'tuition_fees');
    reply = feeObj ? feeObj.value : "هزینه‌های ما بسیار مناسب بوده و از ۱,۸۰۰,۰۰۰ تومان در هر دوره شروع می‌شود. لطفاً هر چه زودتر ثبت‌نام کنید!";
  } else if (p.includes('refund') || p.includes('cancel') || p.includes('انصراف') || p.includes('پس') || p.includes('استرداد')) {
    const policy = details.find((d: KnowledgeDetail) => d.key === 'cancellation_policy');
    reply = policy ? policy.value : "ما از انصراف و استرداد کامل وجه تا ۳ روز کاری قبل از شروع اولین جلسه کلاس پشتیبانی می‌کنیم.";
  } else if (p.includes('human') || p.includes('person') || p.includes('agent') || p.includes('manager') || p.includes('real') || p.includes('انسان') || p.includes('پشتیبان') || p.includes('مدیر')) {
    reply = "متوجه شدم که می‌خواهید با یکی از کارشناسان پشتیبان صحبت کنید. اجازه دهید این گفتگو را به همکارانم متصل کنم.";
    // Also escalate in localStorage
    const listStr = localStorage.getItem('db_conversations');
    if (listStr) {
      const list: Conversation[] = JSON.parse(listStr);
      const idx = list.findIndex(c => c.id === conversationId);
      if (idx !== -1) {
        list[idx].status = 'escalated';
        list[idx].messages.push({
          id: 'msg_sys_' + Date.now(),
          sender: 'system',
          content: 'این گفتگو به کارشناس پشتیبانی ارجاع داده شد.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('db_conversations', JSON.stringify(list));
      }
    }
  } else {
    reply = `با تشکر از سوال شما. به عنوان دستیار هوش مصنوعی برای ${business.name || 'آکادمی اپکس'}، در حال بررسی پایگاه دانش هستم. آیا مورد خاصی در ارتباط با خدمات یا ساعات کاری ما هست که بتوانم پاسخ دهم؟`;
  }

  // Save the AI response and draw update
  const listStr = localStorage.getItem('db_conversations');
  if (listStr) {
    const list: Conversation[] = JSON.parse(listStr);
    const idx = list.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      const newMessage: Message = {
        id: 'msg_ai_' + Math.floor(Math.random() * 100000),
        sender: 'ai',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      list[idx].messages.push(newMessage);
      list[idx].lastMessage = reply;
      list[idx].lastMessageTime = 'Just now';
      list[idx].messagesCount += 1;
      list[idx].updatedAt = new Date().toISOString();
      localStorage.setItem('db_conversations', JSON.stringify(list));

      // Deduct mock tokens
      const tkStr = localStorage.getItem('db_tokens');
      if (tkStr) {
        const tkObj = JSON.parse(tkStr);
        tkObj.current = Math.min(tkObj.current + Math.floor(Math.random() * 40 + 20), tkObj.limit);
        localStorage.setItem('db_tokens', JSON.stringify(tkObj));
      }

      // Dispatch event to allow real-time listeners inside the UI to update their chat window immediately!
      window.dispatchEvent(new CustomEvent('ai_message_added', { detail: { id: conversationId } }));
    }
  }
}
