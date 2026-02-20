'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 dark:from-slate-950 dark:via-blue-950/20 dark:to-teal-950/30" />

      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-300/30 dark:from-cyan-900/20 dark:to-blue-800/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-200/40 to-emerald-300/30 dark:from-teal-900/20 dark:to-emerald-800/20 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-bl from-sky-200/30 to-cyan-300/20 dark:from-sky-900/15 dark:to-cyan-800/15 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-200/30 to-teal-300/20 dark:from-emerald-900/15 dark:to-teal-800/15 blur-3xl"
        animate={{
          x: [0, 35, 0],
          y: [0, -15, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="noise-overlay" />
    </div>
  );
}
