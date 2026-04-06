import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  /** Controls drawer slide direction: 'ur' (Urdu/RTL) opens from the left; all
   *  other locales open from the right. */
  locale?: 'en' | 'ur';
}

// ─── Animation variants ──────────────────────────────────────────────────────

/** The drawer slides in from the right for LTR and from the left for RTL. */
function drawerVariants(isRtl: boolean): Variants {
  const offscreen = isRtl ? '-100%' : '100%';
  return {
    hidden: { x: offscreen, opacity: 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: {
      x: offscreen,
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeIn' as const },
    },
  };
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const navListVariants: Variants = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

// ─── Hamburger / Close icon ───────────────────────────────────────────────────

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

function HamburgerIcon({ isOpen, onClick, className }: HamburgerProps) {
  return (
    <button
      type="button"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
      onClick={onClick}
      className={cn(
        'relative flex h-10 w-10 flex-col items-center justify-center gap-[6px]',
        'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
        className,
      )}
    >
      {/* Top bar */}
      <motion.span
        animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="block h-[2px] w-6 rounded-full bg-current origin-center"
      />
      {/* Middle bar */}
      <motion.span
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className="block h-[2px] w-6 rounded-full bg-current origin-center"
      />
      {/* Bottom bar */}
      <motion.span
        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="block h-[2px] w-6 rounded-full bg-current origin-center"
      />
    </button>
  );
}

// ─── MobileNav ────────────────────────────────────────────────────────────────

/**
 * MobileNav
 *
 * A hamburger button + slide-in drawer for mobile navigation. The drawer
 * slides from the right for LTR locales and from the left for the Urdu (`ur`)
 * locale. Designed for use as an Astro island with `client:load`.
 *
 * @example
 * <MobileNav
 *   links={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
 *   ctaLabel="Get Started"
 *   ctaHref="/contact"
 *   locale="en"
 * />
 */
export function MobileNav({ links, ctaLabel, ctaHref, locale = 'en' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = locale === 'ur';

  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  // Lock body scroll and shift focus into the drawer when open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Defer focus so the drawer has rendered before we try to focus.
      const id = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
      return () => clearTimeout(id);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) close();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Trigger button — rendered inline wherever this component is placed */}
      <HamburgerIcon isOpen={isOpen} onClick={toggle} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-nav-backdrop"
              className="fixed inset-0 z-40 bg-black/60"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={close}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className={cn(
                'fixed top-0 z-50 flex h-full w-4/5 max-w-xs flex-col',
                'bg-[#0A1628] px-6 py-8 shadow-2xl',
                isRtl ? 'left-0' : 'right-0',
              )}
              variants={drawerVariants(isRtl)}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button inside drawer */}
              <div className={cn('flex', isRtl ? 'justify-start' : 'justify-end')}>
                <HamburgerIcon isOpen={true} onClick={close} className="text-white" />
              </div>

              {/* Nav links */}
              <motion.ul
                className="mt-10 flex flex-col gap-1"
                variants={navListVariants}
                initial="hidden"
                animate="visible"
              >
                {links.map((link, index) => (
                  <motion.li key={link.href} variants={navItemVariants}>
                    <a
                      href={link.href}
                      ref={index === 0 ? firstLinkRef : undefined}
                      onClick={close}
                      className={cn(
                        'block rounded-md px-3 py-3 text-base font-medium text-white/80',
                        'transition-colors duration-150 hover:bg-white/10 hover:text-white',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA */}
              <motion.div
                className="mt-auto pt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.25 } }}
              >
                <a
                  href={ctaHref}
                  onClick={close}
                  className={cn(
                    'block w-full rounded-lg bg-blue-600 px-5 py-3 text-center',
                    'text-sm font-semibold text-white shadow',
                    'transition-colors duration-150 hover:bg-blue-500',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                  )}
                >
                  {ctaLabel}
                </a>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
