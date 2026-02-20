'use client';

import { motion } from 'framer-motion';
import { Sparkles, Facebook, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { Icon: Facebook, href: 'https://bio.link/jasimuddin', label: 'Facebook' },
  { Icon: Github, href: 'https://bio.link/jasimuddin', label: 'GitHub' },
  { Icon: Twitter, href: 'https://bio.link/jasimuddin', label: 'Twitter' },
  { Icon: Linkedin, href: 'https://bio.link/jasimuddin', label: 'LinkedIn' },
  { Icon: Mail, href: 'https://bio.link/jasimuddin', label: 'Email' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-16 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <motion.a
            href="#home"
            className="flex items-center gap-2 mb-6 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Jasim&apos;s Space
            </span>
          </motion.a>

          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-md">
            Built to showcase my tools &amp; apps. A digital lab where ideas transform into products.
          </p>

          <div className="flex items-center gap-4 mb-8">
            {socialLinks.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          <div className="w-full pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              &copy; {currentYear} Jasim&apos;s Space. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
