import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollHeaderProps {
  children: ReactNode;
  className?: string;
}

const SCROLL_THRESHOLD = 50;

/**
 * ScrollHeader
 *
 * A fixed `<header>` that transitions from a transparent background to a
 * semi-opaque, blurred background once the user scrolls past 50 px.
 * Designed for use as an Astro island with `client:load`.
 *
 * @example
 * <ScrollHeader>
 *   <Nav />
 * </ScrollHeader>
 */
export function ScrollHeader({ children, className }: ScrollHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Initialise correctly when the component mounts mid-page (e.g. after
    // navigation with `client:load` hydration).
    setScrolled(window.scrollY > SCROLL_THRESHOLD);

    let rafId: number;

    function handleScroll() {
      // Debounce via rAF to avoid layout thrashing on rapid scroll events.
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header
      className={cn(
        // Positioning — always fixed at the top of the viewport.
        'fixed top-0 left-0 right-0 z-50',
        // Smooth background transition.
        'transition-[background-color,backdrop-filter,box-shadow] duration-300 ease-in-out',
        scrolled
          ? 'bg-[#0A1628]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent',
        className,
      )}
    >
      {children}
    </header>
  );
}
