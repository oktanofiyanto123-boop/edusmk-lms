'use client';

import React, { useState } from 'react';
import { RoleSwitchBanner } from './RoleSwitchBanner';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <RoleSwitchBanner />
      <div className="flex-1 flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
          <DashboardHeader
            title={title}
            subtitle={subtitle}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
