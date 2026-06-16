import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, RefreshCw, Key, Landmark, AlertTriangle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Auth() {
  const navigate = useNavigate();

  // Form step: 'phone' | 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpCodes, setOtpCodes] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Countdown timer
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [timerActive, setTimerActive] = useState(false);

  // References for OTP fields auto-focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timerInterval: any = null;
    if (timerActive && countdown > 0) {
      timerInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [timerActive, countdown]);

  const validatePhone = (num: string) => {
    // Iranian format regex: /^(\+98|0)9[0-9]{9}$/
    const regex = /^(\+98|0)9[0-9]{9}$/;
    if (!num) {
      return 'شماره همراه برای تماس کسب‌وکار الزامی است.';
    }
    if (!regex.test(num)) {
      return 'شماره همراه وارد شده صحیح نیست. (نمونه: ۰۹۱۲۳۴۵۶۷۸۹)';
    }
    return '';
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.sendOtp(phone);
      setStep('otp');
      setCountdown(120);
      setTimerActive(true);
      setOtpError('');
      // Focus first OTP field, short delay for React rendering sheet
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setPhoneError(err?.message || 'خطا در ارسال پیامک فعال‌سازی. دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    // Only permit digits
    if (val && !/^[0-9]$/.test(val)) return;

    const newCodes = [...otpCodes];
    newCodes[index] = val;
    setOtpCodes(newCodes);
    setOtpError('');

    // Auto-advance
    if (val !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newCodes = [...otpCodes];
      
      if (newCodes[index] === '' && index > 0) {
        // If current box is already empty, go back and wipe previous
        newCodes[index - 1] = '';
        setOtpCodes(newCodes);
        otpRefs.current[index - 1]?.focus();
      } else {
        // Just empty current box
        newCodes[index] = '';
        setOtpCodes(newCodes);
      }
      setOtpError('');
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const arr = pastedData.split('');
    setOtpCodes(arr);
    otpRefs.current[5]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const fullOtp = otpCodes.join('');
    if (fullOtp.length < 6) {
      setOtpError('لطفاً هر ۶ رقم کد تایید را وارد نمایید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.auth.verifyOtp(phone, fullOtp);
      // Success triggers navigation
      if (response.existing) {
        navigate('/dashboard');
      } else {
        // Fresh sign up goes to Business onboarding questionnaire
        navigate('/onboarding');
      }
    } catch (err: any) {
      setOtpError(err?.message || 'کد فعال‌سازی نامعتبر است. لطفاً ارقام را بررسی کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setCountdown(120);
    setTimerActive(true);
    setOtpCodes(Array(6).fill(''));
    setOtpError('');
    try {
      await api.auth.sendOtp(phone);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setOtpError('ارسال مجدد با خطا مواجه شد. لطفاً دوباره درخواست کنید.');
    }
  };

  // Safe guest bypass trigger
  const handleDemoBypass = () => {
    setPhone('09123456789');
    setPhoneError('');
    setStep('otp');
    setOtpCodes(['1', '1', '1', '1', '1', '1']);
    setCountdown(120);
    setTimerActive(true);
    setTimeout(() => {
      otpRefs.current[5]?.focus();
    }, 150);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
      {/* Container wrapper: full mobile height/width or standard card on desktop */}
      <div className="w-full max-w-md bg-white sm:rounded-2xl sm:shadow-xl border border-slate-100 flex flex-col min-h-screen sm:min-h-0 py-8 px-6 sm:px-10 justify-between sm:justify-start">
        
        {/* Top Header Card */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (step === 'otp') {
                  setStep('phone');
                } else {
                  navigate('/');
                }
              }}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-550 transition flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 ml-1" />
              <span>بازگشت</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 shadow-md shadow-blue-500/15 relative shrink-0">
                <div className="absolute bottom-0.5 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5"></div>
                <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
                <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
                <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
              </div>
              <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">پرسا</span>
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 'phone' ? 'ورود یا عضویت سریع' : 'بررسی و تایید کد امنیتی'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {step === 'phone' 
                ? 'شماره همراه خود را وارد کنید. در صورتی که دفعه نخست است، جهت جمع‌آوری مشخصات به صفحه تنظیمات اولیه هدایت خواهید شد.' 
                : `ما یک پیامک حاوی کد تایید ۶ رقمی به شماره ${phone} ارسال کردیم.`}
            </p>
          </div>

          {/* STEP 1: PHONE FORM */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-505 uppercase tracking-wide text-right">
                  شماره همراه کسب‌وکار
                </label>
                <div className="relative" dir="ltr">
                  {/* Flag integration inside input */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-slate-200 pr-2 pointer-events-none">
                    <span className="text-sm">🇮🇷</span>
                    <span className="text-xs font-bold text-slate-400">+98</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError('');
                    }}
                    placeholder="09123456789"
                    className="w-full h-12 pl-16 pr-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none text-left"
                    autoFocus
                  />
                </div>
                {phoneError && (
                  <p className="text-rose-600 text-xs font-medium mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                id="phone-submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl active-scale flex items-center justify-center gap-2 text-sm shadow-md transition cursor-pointer"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>ارسال کد تایید پیامکی</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP FORM */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-505 uppercase tracking-wide text-center">
                  کد تایید ۶ رقمی
                </label>
                {/* 6 Digit Box spread */}
                <div className="flex gap-2 justify-center" dir="ltr">
                  {otpCodes.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-12 sm:w-14 sm:h-14 font-mono text-xl font-bold text-center bg-slate-50 focus:bg-white border-2 border-slate-250 focus:border-blue-500 rounded-xl focus:ring-1 focus:ring-blue-100 outline-none transition"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-rose-600 text-xs font-semibold text-center mt-2 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              {/* Timer metrics & Resend */}
              <div className="text-center text-xs">
                {countdown > 0 ? (
                  <p className="text-slate-400">
                    امکان ارسال مجدد کد تا{' '}
                    <span className="font-mono font-bold text-slate-700">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    ارسال پیامک مجدد کد فعال‌سازی
                  </button>
                )}
              </div>

              <button
                type="submit"
                id="otp-submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl active-scale flex items-center justify-center gap-2 text-sm shadow-md transition cursor-pointer"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>تایید کد و ورود به پنل</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Guest bypassed sandbox helper info card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حالت آزمایشی توسعه‌دهندگان</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
            تست و بررسی سریع پنل بدون نیاز به پیامک واقعی! برای تکمیل خودکار اطلاعات و مشاهده قالب نمونه آکادمی آیلتس روی دکمه زیر کلیک کنید. کد تایید تستی <b>111111</b> است.
          </p>
          <button
            type="button"
            onClick={handleDemoBypass}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-extrabold tracking-wide hover:underline focus:outline-none"
          >
            ورود سریع به پنل دمو و آزمایشی ←
          </button>
        </div>

      </div>
    </div>
  );
}
