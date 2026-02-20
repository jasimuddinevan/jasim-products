'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Star, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { getSupabase } from '@/lib/supabase';

interface DashboardStats {
  totalProducts: number;
  featuredProducts: number;
  recentProducts: number;
}

export default function AdminDashboardPage() {
  const { session, isLoading } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    featuredProducts: 0,
    recentProducts: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = getSupabase();
        const [totalRes, featuredRes, recentRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('is_featured', true),
          supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .gte(
              'created_at',
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            ),
        ]);

        setStats({
          totalProducts: totalRes.count || 0,
          featuredProducts: featuredRes.count || 0,
          recentProducts: recentRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    if (session?.isAuthenticated) {
      fetchStats();
    }
  }, [session]);

  if (isLoading || !session?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <AdminHeader
          title="Dashboard"
          subtitle="Welcome back! Here's an overview of your products."
        />

        {isLoadingStats ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              gradient="from-cyan-500 to-blue-500"
              delay={0}
            />
            <StatsCard
              title="Featured"
              value={stats.featuredProducts}
              icon={Star}
              gradient="from-amber-500 to-orange-500"
              delay={0.1}
            />
            <StatsCard
              title="Added This Week"
              value={stats.recentProducts}
              icon={Clock}
              gradient="from-emerald-500 to-teal-500"
              delay={0.2}
            />
            <StatsCard
              title="Growth"
              value="+12%"
              icon={TrendingUp}
              gradient="from-rose-500 to-pink-500"
              delay={0.3}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:from-cyan-500/20 hover:to-teal-500/20 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Add New Product</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/products')}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Manage Products</span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
