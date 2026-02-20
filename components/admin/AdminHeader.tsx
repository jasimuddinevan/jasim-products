'use client';

import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { session } = useAdminAuth();

  return (
    <header className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {session?.email}
        </span>
      </div>
    </header>
  );
}
