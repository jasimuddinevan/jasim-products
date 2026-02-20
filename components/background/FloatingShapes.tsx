'use client';

import { motion } from 'framer-motion';

const shapes = [
  { size: 60, x: '10%', y: '20%', delay: 0, duration: 8 },
  { size: 40, x: '85%', y: '15%', delay: 1, duration: 10 },
  { size: 80, x: '75%', y: '60%', delay: 2, duration: 12 },
  { size: 50, x: '20%', y: '70%', delay: 0.5, duration: 9 },
  { size: 35, x: '50%', y: '85%', delay: 1.5, duration: 11 },
  { size: 45, x: '90%', y: '40%', delay: 2.5, duration: 7 },
];

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-2xl border border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/0 backdrop-blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
