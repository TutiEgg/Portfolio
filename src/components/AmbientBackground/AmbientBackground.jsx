import { useEffect, useRef } from 'react';
import styles from './AmbientBackground.module.css';

const NODE_COLORS = [
  'rgba(139, 124, 246, 0.82)',
  'rgba(34, 211, 238, 0.78)',
  'rgba(45, 212, 191, 0.72)',
  'rgba(251, 191, 36, 0.58)',
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let nodes = [];
    const random = seededRandom(42);

    function createNodes() {
      const count = Math.min(86, Math.max(42, Math.round(width / 24)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: random() * width,
        y: random() * height,
        vx: (random() - 0.5) * 0.22,
        vy: (random() - 0.5) * 0.18,
        size: 1 + random() * 1.8,
        color: NODE_COLORS[index % NODE_COLORS.length],
      }));
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createNodes();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 145) {
            const alpha = (1 - distance / 145) * 0.14;
            context.strokeStyle = `rgba(120, 220, 255, ${alpha})`;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        context.fillStyle = node.color;
        context.fillRect(node.x, node.y, node.size, node.size);
      }

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grid} />
      <div className={styles.sweep} />
    </div>
  );
}
