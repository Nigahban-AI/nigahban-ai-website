import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right';

interface FadeInProps {
  children: ReactNode;
  /** Direction from which the element enters. Defaults to 'up'. */
  direction?: Direction;
  /** Animation start delay in seconds. Defaults to 0. */
  delay?: number;
  /** Animation duration in seconds. Defaults to 0.5. */
  duration?: number;
  className?: string;
}

/**
 * Resolves the initial translate offset for the given direction.
 * The element starts displaced in the opposite of the entry direction and
 * animates toward its natural position (x: 0, y: 0).
 */
function resolveInitialOffset(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: 20 };
    case 'down':
      return { x: 0, y: -20 };
    case 'left':
      return { x: 20, y: 0 };
    case 'right':
      return { x: -20, y: 0 };
  }
}

/**
 * FadeIn
 *
 * A Framer Motion wrapper that triggers a fade + slide animation when the
 * element enters the viewport. Designed for use as an Astro island with
 * `client:visible`.
 *
 * @example
 * <FadeIn direction="up" delay={0.1}>
 *   <MyCard />
 * </FadeIn>
 */
export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className,
}: FadeInProps) {
  const { x, y } = resolveInitialOffset(direction);

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // custom ease approximating easeOutQuart
      }}
    >
      {children}
    </motion.div>
  );
}
