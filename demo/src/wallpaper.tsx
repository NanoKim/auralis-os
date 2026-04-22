import { useEffect, useRef } from "react";

export function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const STAR_COUNT = 140;

    const stars = Array.from({ length: STAR_COUNT }).map(() => {
      const x = Math.random() * width;
      const y = Math.random() * height;

      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random(),
        vx: 0,
        vy: 0,
      };
    });

    let time = 0;

    function drawAurora() {
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      const t = time * 0.0005;

      gradient.addColorStop(0, `hsl(${200 + Math.sin(t) * 40}, 80%, 60%)`);
      gradient.addColorStop(0.5, `hsl(${260 + Math.sin(t + 1) * 40}, 80%, 60%)`);
      gradient.addColorStop(1, `hsl(${180 + Math.sin(t + 2) * 40}, 80%, 60%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, width, height);
    }

    function drawStars() {
      for (let star of stars) {
        star.baseY -= star.speed;
        if (star.baseY < 0) {
          star.baseY = height;
          star.baseX = Math.random() * width;
        }

        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 120;

        if (dist < radius) {
          const force = (radius - dist) / radius;

          const angle = Math.atan2(dy, dx);

          star.vx += Math.cos(angle) * force * 2;
          star.vy += Math.sin(angle) * force * 2;
        }

        const ease = 0.02;
        star.vx += (star.baseX - star.x) * ease;
        star.vy += (star.baseY - star.y) * ease;

        star.vx *= 0.92;
        star.vy *= 0.92;

        star.x += star.vx;
        star.y += star.vy;

        star.alpha += (Math.random() - 0.5) * 0.05;
        star.alpha = Math.max(0.2, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      }
    }

    function animate() {
      time++;

      drawAurora();
      drawStars();

      requestAnimationFrame(animate);
    }

    animate();

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
}