import { type ReactNode, useEffect, useRef } from 'react';

interface AnimatedBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  glowOnHover?: boolean;
}

export function AnimatedBorderCard({
  children,
  className = '',
  borderWidth = 1,
  glowOnHover = true,
}: AnimatedBorderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let angle = 0;
    let animId: number;

    const animate = () => {
      angle = (angle + 0.5) % 360;
      card.style.setProperty('--border-angle', `${angle}deg`);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl transition-shadow duration-500 ${glowOnHover ? 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]' : ''} ${className}`}
      style={{
        padding: borderWidth,
        background: `conic-gradient(from var(--border-angle, 0deg), #F59E0B, #EF4444, #D97706, #FF6B35, transparent 40%, #F59E0B)`,
      }}
    >
      <div className="relative rounded-2xl bg-[#0A1628] p-6 h-full backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}
