import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  RefreshCw01,
} from '@untitled-ui/icons-react';
import { Bot, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { setToken } from '../services/http';
import { Button } from '../components/ui';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth() {
  const navigate = useNavigate();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpCodes, setOtpCodes] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (timerActive && countdown > 0) {
      id = setInterval(() => setCountdown(p => p - 1), 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(id);
  }, [timerActive, countdown]);

  const validatePhone = (num: string) => {
    if (!num) return 'شماره همراه الزامی است.';
    if (!/^(\+98|0)9[0-9]{9}$/.test(num)) return 'شماره همراه وارد شده صحیح نیست. (نمونه: ۰۹۱۲۳۴۵۶۷۸۹)';
    return '';
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setIsSubmitting(true);
    try {
      await api.auth.sendOtp(phone);
      setStep('otp');
      setCountdown(120);
      setTimerActive(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setPhoneError(err?.message || 'خطا در ارسال پیامک. دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (val && !/^[0-9]$/.test(val)) return;
    const codes = [...otpCodes];
    codes[idx] = val;
    setOtpCodes(codes);
    setOtpError('');
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key !== 'Backspace') return;
    const codes = [...otpCodes];
    if (codes[idx] === '' && idx > 0) {
      codes[idx - 1] = '';
      setOtpCodes(codes);
      otpRefs.current[idx - 1]?.focus();
    } else {
      codes[idx] = '';
      setOtpCodes(codes);
    }
    setOtpError('');
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) return;
    setOtpCodes(pasted.split(''));
    otpRefs.current[5]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const fullOtp = otpCodes.join('');
    if (fullOtp.length < 6) { setOtpError('لطفاً هر ۶ رقم کد تایید را وارد نمایید.'); return; }
    setIsSubmitting(true);
    try {
      const res = await api.auth.verifyOtp(phone, fullOtp);
      navigate(res.existing ? '/dashboard' : '/onboarding');
    } catch (err: any) {
      setOtpError(err?.message || 'کد فعال‌سازی نامعتبر است.');
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
    } catch {
      setOtpError('ارسال مجدد با خطا مواجه شد.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const mockToken = 'jwt_google_' + Math.random().toString(36).slice(2, 10);
    setToken(mockToken);
    localStorage.setItem('access_token', mockToken);
    const hasOnboarding = localStorage.getItem('onboarding_completed') === 'true';
    setIsGoogleLoading(false);
    navigate(hasOnboarding ? '/dashboard' : '/onboarding');
  };

  const handleDemoBypass = () => {
    setPhone('09123456789');
    setPhoneError('');
    setStep('otp');
    setOtpCodes(['1', '1', '1', '1', '1', '1']);
    setCountdown(120);
    setTimerActive(true);
    setTimeout(() => otpRefs.current[5]?.focus(), 150);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white sm:rounded-2xl sm:shadow-xl border border-slate-100 flex flex-col min-h-screen sm:min-h-0 py-8 px-6 sm:px-10 justify-between sm:justify-start gap-8">
        {/* ── Header ── */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => step === 'otp' ? setStep('phone') : navigate('/')}
            >
              بازگشت
            </Button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 shadow-md shadow-blue-500/15 relative shrink-0">
                <div className="absolute bottom-0.5 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
                <span className="w-0.5 h-0.5 rounded-full bg-white" />
                <span className="w-0.5 h-0.5 rounded-full bg-white" />
                <span className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
              <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">پرسا</span>
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 'phone' ? 'ورود یا عضویت سریع' : 'بررسی کد امنیتی'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {step === 'phone'
                ? 'برای ساخت دستیار هوشمند کسب‌وکار خود ثبت‌نام کنید'
                : `کد ۶ رقمی ارسال شده به ${phone} را وارد کنید`}
            </p>
          </div>

          {/* ── Phone step ── */}
          {step === 'phone' && (
            <div className="space-y-4">
              <Button
                variant="secondary"
                size="xl"
                fullWidth
                loading={isGoogleLoading}
                leftIcon={!isGoogleLoading ? <GoogleIcon /> : undefined}
                onClick={handleGoogleSignIn}
              >
                {isGoogleLoading ? 'در حال اتصال...' : 'ورود با حساب گوگل'}
              </Button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-semibold">یا با شماره همراه</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-sm font-medium text-slate-700">شماره همراه کسب‌وکار</label>
                  <div className="relative" dir="ltr">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-slate-200 pr-2 pointer-events-none">
                      <span className="text-sm">🇮🇷</span>
                      <span className="text-xs font-bold text-slate-400">+98</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
                      placeholder="09123456789"
                      autoFocus
                      className="w-full h-11 pl-16 pr-3 bg-white border border-slate-300 rounded-lg text-sm font-semibold tracking-wide outline-none shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-left"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {phoneError}
                    </p>
                  )}
                </div>

                <Button type="submit" fullWidth size="xl" loading={isSubmitting}>
                  ارسال کد تایید پیامکی
                </Button>
              </form>
            </div>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide text-center">
                  کد تایید ۶ رقمی
                </label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  {otpCodes.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-12 sm:w-14 sm:h-14 font-mono text-xl font-bold text-center bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-blue-500 rounded-xl outline-none transition shadow-sm"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-600 text-xs text-center flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {otpError}
                  </p>
                )}
              </div>

              <div className="text-center text-xs">
                {countdown > 0 ? (
                  <p className="text-slate-400">
                    امکان ارسال مجدد تا{' '}
                    <span className="font-mono font-bold text-slate-700">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              <Button type="submit" fullWidth size="xl" loading={isSubmitting}>
                تایید کد و ورود به پنل
              </Button>
            </form>
          )}
        </div>

        {/* ── Demo helper ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حالت آزمایشی توسعه‌دهندگان</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            کد تایید تستی <b>111111</b> است.
          </p>
          <button
            type="button"
            onClick={handleDemoBypass}
            className="text-[11px] text-blue-600 font-extrabold hover:underline"
          >
            ورود سریع به پنل دمو ←
          </button>
        </div>
      </div>
    </div>
  );
}
