import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../../services/http';
import { Menu01, XClose, ArrowLeft, ChevronDown } from '@untitled-ui/icons-react';
import { Button } from '../../components/ui';

interface MegaMenuItem {
  label: string;
  href?: string;
  to?: string;
  description?: string;
}

interface MegaMenuProps {
  title: string;
  items: MegaMenuItem[];
}

function MegaMenu({ title, items }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-blue-600 transition text-sm font-medium text-slate-600"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg shadow-black/10 border border-slate-100 p-4 z-50 text-right">
            <div className="space-y-3">
              {items.map((item) => (
                item.to ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                    )}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                    )}
                  </a>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface LandingHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function LandingHeader({ mobileMenuOpen, setMobileMenuOpen }: LandingHeaderProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/auth');

  return (
    <header className="sticky top-0 bg-white border-b border-slate-100 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 relative shrink-0">
            <div className="absolute bottom-1 right-0 w-2 h-2 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">پرسا</span>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5">دستیار هوشمند کسب‌وکار</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <MegaMenu
            title="نحوه کارکرد"
            items={[
              { label: 'مراحل راه‌اندازی', href: '#how-it-works' },
              { label: 'مقایسه با روشهای سنتی', href: '#comparison' },
            ]}
          />
          <MegaMenu
            title="امکانات"
            items={[
              { label: 'هوش مصنوعی اختصاصی', href: '#features', description: 'آموزش با داده‌های کسب‌وکار شما' },
              { label: 'کانال‌های ارتباطی', href: '#channels', description: 'واتساپ، تلگرام، وب و غیره' },
              { label: 'اطلاع‌رسانی SMS', href: '#sms-highlight', description: 'هشدار فوری برای سوالات جدید' },
            ]}
          />
          <a href="#channels" className="hover:text-blue-600 transition">کانال‌ها</a>
          <Link to="/pricing" className="hover:text-blue-600 transition">تعرفه‌ها</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 transition text-sm font-semibold">
              داشبورد <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium text-sm">ورود</Link>
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-sm shadow-blue-500/20 transition">
                شروع رایگان
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50 transition"
        >
          {mobileMenuOpen ? <XClose className="w-5 h-5" /> : <Menu01 className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-5 flex flex-col gap-5 md:hidden shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {[['#how-it-works', 'نحوه کارکرد'], ['#features', 'امکانات'], ['#channels', 'کانال‌ها']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50">{label}</a>
            ))}
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50">تعرفه‌ها</Link>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}
              className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold text-sm">شروع رایگان</button>
            {isLoggedIn && (
              <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-bold text-sm">ورود به داشبورد</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
