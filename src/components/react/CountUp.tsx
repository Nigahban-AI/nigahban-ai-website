import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountUpProps {
  /** The target number to count up to. */
  end: number;
  /** Optional suffix appended after the number (e.g. '+', '%', 'k'). */
  suffix?: string;
  /** Total animation duration in seconds. Defaults to 2. */
  duration?: number;
  className?: string;
}

/**
 * Easing function — easeOutCubic.
 * Returns a value in [0, 1] for a given progress in [0, 1].
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * CountUp
 *
 * Animates a number from 0 to `end` using `requestAnimationFrame` when the
 * component enters the viewport. Designed for use as an Astro island with
 * `client:visible`.
 *
 * @example
 * <CountUp end={500} suffix="+" duration={2.5} className="text-4xl font-bold" />
 */
export function CountUp({ end, suffix = '', duration = 2, className }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // The ref is attached to the rendered element so useInView can observe it.
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Track whether the animation has already been started so it only runs once.
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const durationMs = duration * 1000;
    let startTime: number | null = null;
    let rafId: number;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(rawProgress);
      const current = Math.round(easedProgress * end);

      setDisplayValue(current);

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(step);
      }
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={cn(className)}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
