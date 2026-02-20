'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="group"
    >
      <a
        href={product.button_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800">
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={product.image_url || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="p-6">
            {product.is_featured && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-full mb-3">
                Featured
              </span>
            )}

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
              {product.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
              {product.description}
            </p>

            <div className="flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
              <span>View Now</span>
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}
