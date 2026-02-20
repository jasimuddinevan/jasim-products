'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Rocket, Code2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const handleScrollToProducts = () => {
    const element = document.querySelector('#products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const floatingIcons = [
    { Icon: Rocket, position: 'top-1/4 left-[15%]', delay: 0.5 },
    { Icon: Code2, position: 'top-1/3 right-[12%]', delay: 0.8 },
    { Icon: Zap, position: 'bottom-1/3 left-[8%]', delay: 1.1 },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {floatingIcons.map(({ Icon, position, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} hidden lg:block`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay, duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon className="w-16 h-16 text-primary/50" strokeWidth={1} />
          </motion.div>
        </motion.div>
      ))}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/50 dark:to-teal-950/50 border border-cyan-200/50 dark:border-cyan-800/50 text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse" />
              Builder &bull; Creator &bull; Product Developer
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900 dark:text-white">Welcome to</span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Jasim&apos;s Space
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed"
          >
            A digital lab where ideas transform into products. Explore my collection
            of tools, apps, and experiments crafted with passion and precision.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={handleScrollToProducts}
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 px-8 py-6 text-lg font-medium shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore My Products
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
