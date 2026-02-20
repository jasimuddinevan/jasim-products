'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, subMonths, subYears, startOfDay, endOfDay, parseISO } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'alltime';

interface AnalyticsData {
  date: string;
  visits: number;
}

export default function AdminAnalyticsPage() {
  const { session, isLoading } = useAdminAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [avgDaily, setAvgDaily] = useState(0);

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return subDays(now, 1);
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subMonths(now, 1);
      case 'year':
        return subYears(now, 1);
      case 'alltime':
        return new Date(0);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const startDate = getDateRange();

      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('visited_at, ip_address')
        .gte('visited_at', startDate.toISOString())
        .order('visited_at', { ascending: true });

      if (error) throw error;

      const grouped: { [key: string]: number } = {};

      data?.forEach((record) => {
        const date = parseISO(record.visited_at);
        let dateKey: string;

        if (timeRange === 'day') {
          dateKey = format(date, 'HH:00');
        } else if (timeRange === 'week' || timeRange === 'month') {
          dateKey = format(date, 'MMM dd');
        } else {
          dateKey = format(date, 'MMM yyyy');
        }

        grouped[dateKey] = (grouped[dateKey] || 0) + 1;
      });

      const chartData = Object.entries(grouped).map(([date, visits]) => ({
        date,
        visits,
      }));

      setChartData(chartData);
      setTotalVisits(data?.length || 0);

      const uniqueIPs = new Set(data?.filter(record => record.ip_address).map(record => record.ip_address));
      setUniqueVisitors(uniqueIPs.size);

      const days = timeRange === 'day' ? 1 :
                   timeRange === 'week' ? 7 :
                   timeRange === 'month' ? 30 :
                   timeRange === 'year' ? 365 :
                   Math.max(1, Math.ceil((Date.now() - new Date(data?.[0]?.visited_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)));

      setAvgDaily(Math.round((data?.length || 0) / days));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'alltime', label: 'All Time' },
  ];

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
          title="Visitor Analytics"
          subtitle="Track and analyze your website traffic"
        />

        <div className="space-y-8">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              {timeRangeButtons.map((btn) => (
                <Button
                  key={btn.value}
                  onClick={() => setTimeRange(btn.value)}
                  variant={timeRange === btn.value ? 'default' : 'outline'}
                  className={timeRange === btn.value ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : ''}
                  size="sm"
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Eye className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {timeRange === 'alltime' ? 'All time' : `Last ${timeRange}`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Based on unique IP addresses
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDaily.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Average per day
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              Visitor Trend
            </CardTitle>
            <CardDescription>
              Visitor traffic over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-slate-400">Loading analytics...</div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-slate-400">No visitor data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Visits"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
        </div>
      </main>
    </div>
  );
}
