'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  FileText,
  Star,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createProduct } from '@/lib/products';
import { triggerProductSync } from '@/lib/sync-products';

interface FormData {
  title: string;
  description: string;
  image_url: string;
  button_url: string;
  is_featured: boolean;
}

interface FormErrors {
  title?: string;
  button_url?: string;
}

export default function NewProductPage() {
  const { session, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image_url: '',
    button_url: '',
    is_featured: false,
  });

  useEffect(() => {
    if (!authLoading && !session?.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [session, authLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.button_url.trim()) {
      newErrors.button_url = 'URL is required';
    } else {
      try {
        new URL(formData.button_url);
      } catch {
        newErrors.button_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const product = await createProduct(formData);

      if (product) {
        triggerProductSync();
        router.push('/admin/products');
      } else {
        setErrors({ title: 'Failed to create product. Please try again.' });
      }
    } catch {
      setErrors({ title: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (authLoading || !session?.isAuthenticated) {
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/products')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <AdminHeader title="New Product" subtitle="Add a new product to your showcase" />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-2xl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter product title"
                className={`h-12 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Short description of your product"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Product Image
              </Label>
              <ImageUploader
                onImageUploaded={(url) => updateField('image_url', url)}
                currentImageUrl={formData.image_url}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Or enter Image URL manually
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button_url" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                Button URL
              </Label>
              <Input
                id="button_url"
                value={formData.button_url}
                onChange={(e) => updateField('button_url', e.target.value)}
                placeholder="https://example.com/product"
                className={`h-12 ${errors.button_url ? 'border-red-500' : ''}`}
              />
              {errors.button_url && (
                <p className="text-sm text-red-500">{errors.button_url}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Featured Product
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Show this product with a featured badge
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => updateField('is_featured', checked)}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
