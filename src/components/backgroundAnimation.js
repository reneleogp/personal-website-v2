import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const pointer = { x: 0, y: 0, active: false };
    const follower = { x: 0, y: 0 };
    let particles = [];
    let frameId;
    let width = 0;
    let height = 0;

    const getColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--animation-rgb').trim();

    const seedParticles = () => {
      const particleCount = Math.max(22, Math.min(44, Math.floor(width / 32)));
      particles = Array.from({ length: particleCount }, (_, index) => ({
        x: (((index * 89) % 101) / 101) * width,
        y: (((index * 53) % 97) / 97) * height,
        dx: ((index % 5) - 2) * 0.035,
        dy: (((index * 3) % 5) - 2) * 0.03,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      pointer.x = width * 0.72;
      pointer.y = height * 0.48;
      follower.x = pointer.x;
      follower.y = pointer.y;
      seedParticles();
    };

    const draw = () => {
      const color = getColor();
      context.clearRect(0, 0, width, height);

      follower.x += (pointer.x - follower.x) * 0.08;
      follower.y += (pointer.y - follower.y) * 0.08;

      particles.forEach(particle => {
        particle.x = (particle.x + particle.dx + width) % width;
        particle.y = (particle.y + particle.dy + height) % height;

        const distance = Math.hypot(particle.x - follower.x, particle.y - follower.y);
        const isNearPointer = distance < 170;

        context.beginPath();
        context.fillStyle = `rgba(${color}, ${isNearPointer ? 0.5 : 0.2})`;
        context.arc(particle.x, particle.y, isNearPointer ? 1.7 : 1.1, 0, Math.PI * 2);
        context.fill();

        if (isNearPointer) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(follower.x, follower.y);
          context.strokeStyle = `rgba(${color}, ${0.2 * (1 - distance / 170)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      });

      if (pointer.active) {
        context.beginPath();
        context.fillStyle = `rgba(${color}, 0.65)`;
        context.arc(follower.x, follower.y, 2.5, 0, Math.PI * 2);
        context.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    const handlePointerMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.x = width * 0.72;
      pointer.y = height * 0.48;
      pointer.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />;
};

export default BackgroundAnimation;
