import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  isHeart?: boolean;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars & glowing romantic dust
    const count = Math.min(85, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];

    const colors = [
      'rgba(255, 220, 235, ',
      'rgba(251, 113, 133, ',
      'rgba(244, 63, 94, ',
      'rgba(232, 121, 249, ',
      'rgba(254, 240, 138, '
    ];

    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() < 0.15; // 15% are floating mini hearts
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHeart ? Math.random() * 7 + 5 : Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: isHeart ? -(Math.random() * 0.45 + 0.2) : -(Math.random() * 0.18 + 0.05),
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart
      });
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(
        -size / 2, -topCurveHeight,
        -size, size / 3,
        0, size
      );
      // top right curve
      c.bezierCurveTo(
        size, size / 3,
        size / 2, -topCurveHeight,
        0, topCurveHeight
      );
      c.closePath();
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = `${color}0.8)`;
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    };

    let lastTime = performance.now();
    const render = (now: number) => {
      // Throttle slightly if needed
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render cosmic background glows
      const radialWine = ctx.createRadialGradient(
        width * 0.2, height * 0.3, 50,
        width * 0.2, height * 0.3, Math.max(width, height) * 0.6
      );
      radialWine.addColorStop(0, 'rgba(74, 11, 31, 0.25)');
      radialWine.addColorStop(1, 'transparent');
      ctx.fillStyle = radialWine;
      ctx.fillRect(0, 0, width, height);

      const radialPurple = ctx.createRadialGradient(
        width * 0.85, height * 0.7, 50,
        width * 0.85, height * 0.7, Math.max(width, height) * 0.65
      );
      radialPurple.addColorStop(0, 'rgba(56, 9, 48, 0.22)');
      radialPurple.addColorStop(1, 'transparent');
      ctx.fillStyle = radialPurple;
      ctx.fillRect(0, 0, width, height);

      // Render particles & stars
      particles.forEach((p) => {
        p.x += p.speedX * (delta * 60);
        p.y += p.speedY * (delta * 60);

        // Wrap around bounds
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Gentle twinkle
        const alpha = p.opacity + Math.sin(now * 0.002 + p.x) * 0.15;
        const clampedAlpha = Math.max(0.1, Math.min(0.85, alpha));

        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size, p.color, clampedAlpha * 0.75);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${clampedAlpha})`;
          ctx.shadowColor = `${p.color}0.7)`;
          ctx.shadowBlur = p.size > 1.5 ? 6 : 2;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.92 }}
    />
  );
};
