import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  className?: string;
}

export function GlowText({ children, className = '' }: GlowTextProps) {
  return (
    <motion.span
      className={className}
      animate={{
        textShadow: [
          '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)',
          '0 0 30px rgba(217, 119, 6, 0.6), 0 0 60px rgba(245, 158, 11, 0.3)',
          '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
