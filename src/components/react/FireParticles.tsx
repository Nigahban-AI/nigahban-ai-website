import { useEffect, useRef } from "react";

interface FireParticlesProps {
  intensity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = ["#F59E0B", "#D97706", "#EF4444", "#FF6B35"];

function createParticle(width: number, height: number): Particle {
  const maxLife = 120 + Math.random() * 180;
  return {
    x: Math.random() * width,
    y: height + Math.random() * 20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(0.5 + Math.random() * 1.5),
    size: 1 + Math.random() * 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 0.6 + Math.random() * 0.4,
    life: 0,
    maxLife,
  };
}

export function FireParticles({
  intensity = 60,
  className = "",
}: FireParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles spread across their lifecycle
    const count = Math.min(Math.max(intensity, 10), 200);
    for (let i = 0; i < count; i++) {
      const p = createParticle(canvas.width, canvas.height);
      p.life = Math.random() * p.maxLife;
      p.y = canvas.height - (p.life / p.maxLife) * canvas.height;
      particles.push(p);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.03) * 0.3;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        if (p.life >= p.maxLife || alpha <= 0.01) {
          particles[i] = createParticle(canvas.width, canvas.height);
          continue;
        }

        // Glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 4;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
