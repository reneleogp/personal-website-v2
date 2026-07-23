import { useEffect, useRef } from 'react';

type Point = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const container = canvas?.parentElement;

    if (!canvas || !context || !container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000 };
    let points: Point[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const readColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--cp-border-strong').trim();

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(24, Math.min(54, Math.floor(width / 22)));
      points = Array.from({ length: count }, (_, index) => ({
        x: ((index * 97) % 101) / 101 * width,
        y: ((index * 61) % 89) / 89 * height,
        dx: ((index % 5) - 2) * 0.035,
        dy: (((index * 3) % 5) - 2) * 0.03,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = readColor();
      context.fillStyle = readColor();

      for (const point of points) {
        if (!reducedMotion) {
          point.x = (point.x + point.dx + width) % width;
          point.y = (point.y + point.dy + height) % height;
        }

        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        context.globalAlpha = pointerDistance < 150 ? 0.55 : 0.22;
        context.beginPath();
        context.arc(point.x, point.y, pointerDistance < 150 ? 1.6 : 1, 0, Math.PI * 2);
        context.fill();

        if (pointerDistance < 150) {
          context.globalAlpha = Math.max(0, 0.26 * (1 - pointerDistance / 150));
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }

      context.globalAlpha = 1;
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });

    resizeObserver.observe(container);
    container.addEventListener('pointermove', handlePointer);
    container.addEventListener('pointerleave', clearPointer);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointer);
      container.removeEventListener('pointerleave', clearPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}