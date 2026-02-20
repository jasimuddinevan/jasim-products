'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Mail, Lock, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
}

export default function AdminSettingsPage() {
  const { session, isLoading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState(session?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!session?.email) {
      setEmailError('No active session');
      return;
    }

    if (!currentPassword.trim()) {
      setEmailError('Please enter your current password');
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      setEmailError('Incorrect captcha answer. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setIsUpdatingEmail(true);

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: currentUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.email)
        .maybeSingle();

      if (!currentUser) {
        setEmailError('User not found');
        setIsUpdatingEmail(false);
        return;
      }

      if (currentUser.password_hash !== currentPassword) {
        setEmailError('Current password is incorrect');
        setIsUpdatingEmail(false);
        return;
      }

      const { error } = await supabase
        .from('admin_users')
        .update({ email: email.trim().toLowerCase() })
        .eq('id', currentUser.id);

      if (error) {
        setEmailError('Failed to update email');
        return;
      }

      setEmailSuccess('Email updated successfully. Please log in again with your new email.');
      setEmail('');
      setCurrentPassword('');
      setCaptchaInput('');
      setCaptcha(generateCaptcha());
    } catch {
      setEmailError('An error occurred');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!session?.email) {
      setPasswordError('No active session');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: currentUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.email)
        .maybeSingle();

      if (!currentUser) {
        setPasswordError('User not found');
        setIsUpdatingPassword(false);
        return;
      }

      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: newPassword })
        .eq('id', currentUser.id);

      if (error) {
        setPasswordError('Failed to update password');
        return;
      }

      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('An error occurred');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
          title="Settings"
          subtitle="Manage your admin account settings"
        />

        <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-500" />
                Update Email
              </CardTitle>
              <CardDescription>
                Change your admin email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                {emailSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {emailSuccess}
                  </div>
                )}
                {emailError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {emailError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new-email">New Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captcha" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-500" />
                    Security Verification
                  </Label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {captcha.num1} + {captcha.num2} =
                    </span>
                    <Input
                      id="captcha"
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="?"
                      required
                      className="w-20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingEmail}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                >
                  {isUpdatingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Update Email
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-500" />
                Update Password
              </CardTitle>
              <CardDescription>
                Change your admin password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {passwordError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </main>
    </div>
  );
}
