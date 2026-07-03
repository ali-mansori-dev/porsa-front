import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/http';

import LandingHeader from './landing/LandingHeader';
import HeroSection from './landing/HeroSection';
import HowItWorks from './landing/HowItWorks';
import FeaturesGrid from './landing/FeaturesGrid';
import Verticals from './landing/Verticals';
import ComparisonSection from './landing/ComparisonSection';
import ChannelsSection from './landing/ChannelsSection';
import CtaSection from './landing/CtaSection';
import LandingFooter from './landing/LandingFooter';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/auth');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <LandingHeader mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />
      <Verticals />
      <ComparisonSection onCTA={handleCTA} isLoggedIn={isLoggedIn} />
      <ChannelsSection />
      <CtaSection onCTA={handleCTA} isLoggedIn={isLoggedIn} />
      <LandingFooter />
    </div>
  );
}
