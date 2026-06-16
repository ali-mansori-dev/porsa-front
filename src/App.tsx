import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import PricingPage from './pages/PricingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/dashboard/Home';
import Conversations from './pages/dashboard/Conversations';
import Knowledge from './pages/dashboard/Knowledge';
import Tokens from './pages/dashboard/Tokens';
import SettingsPage from './pages/dashboard/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/pricing',
    element: <PricingPage />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/onboarding',
    element: <Onboarding />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'conversations',
        element: <Conversations />
      },
      {
        path: 'knowledge',
        element: <Knowledge />
      },
      {
        path: 'tokens',
        element: <Tokens />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <RouterProvider router={router} />
    </div>
  );
}
