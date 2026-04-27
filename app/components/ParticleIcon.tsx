"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  /** grid-snapped position */
  x: number;
  y: number;
  /** staggered phase for breathing */
  phase: number;
}

/* ── tunables ── */
const CELL = 8;       // particle square size (px)
const GAP  = 3;       // gap between squares (px)
const STEP = CELL + GAP;

export default function ParticleIcon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const maskRef = useRef<ImageData | null>(null);
  const reducedMotion = useRef(false);

  /* Load SVG once and rasterise to a small mask bitmap */
  const loadMask = useCallback((): Promise<ImageData> => {
    if (maskRef.current) return Promise.resolve(maskRef.current);

    return new Promise((resolve) => {
      const img = new Image();
      img.src = "/favicon.svg";
      img.onload = () => {
        const S = 1024;
        const off = document.createElement("canvas");
        off.width = S;
        off.height = S;
        const c = off.getContext("2d")!;
        c.imageSmoothingEnabled = false;
        c.drawImage(img, 0, 0, S, S);
        const data = c.getImageData(0, 0, S, S);
        maskRef.current = data;
        resolve(data);
      };
    });
  }, []);

  /* Build a strict grid; keep only cells whose centre overlaps the shape */
  const buildGrid = useCallback(
    (mask: ImageData, w: number, h: number) => {
      const iconSize = Math.min(w, h) * 0.72;
      const ox = (w - iconSize) / 2;
      const oy = (h - iconSize) / 2;
      const S = mask.width; // 256

      const cols = Math.floor(iconSize / STEP);
      const rows = Math.floor(iconSize / STEP);
      // centre the grid inside the icon area
      const gridW = cols * STEP - GAP;
      const gridH = rows * STEP - GAP;
      const startX = ox + (iconSize - gridW) / 2;
      const startY = oy + (iconSize - gridH) / 2;

      const list: Particle[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = startX + c * STEP;
          const py = startY + r * STEP;

          // map centre of this cell back to mask coordinates
          const mx = Math.round(((px - ox + CELL / 2) / iconSize) * S);
          const my = Math.round(((py - oy + CELL / 2) / iconSize) * S);

          if (mx < 0 || mx >= S || my < 0 || my >= S) continue;
          if (mask.data[(my * S + mx) * 4 + 3] > 128) {
            list.push({
              x: px,
              y: py,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      particlesRef.current = list;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let running = true;

    const fitCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const init = async () => {
      fitCanvas();
      const mask = await loadMask();
      buildGrid(mask, window.innerWidth, window.innerHeight);
    };

    const onResize = () => {
      fitCanvas();
      if (maskRef.current) {
        buildGrid(maskRef.current, window.innerWidth, window.innerHeight);
      }
    };

    let t = 0;
    const draw = () => {
      if (!running) return;
      if (!reducedMotion.current) t += 0.008;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const ps = particlesRef.current;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // breathing: smooth sin wave per particle, staggered by phase
        const breath = Math.sin(t * 0.6 + p.phase);          // −1 … 1
        const alpha = 0.12 + breath * 0.10;                    // 0.02 … 0.22
        const size  = CELL + breath * 1.2;                     // subtle size pulse

        // centre the size pulse so particles stay grid-aligned
        const offset = (CELL - size) / 2;

        ctx.fillStyle = `rgba(124, 148, 190, ${alpha})`;
        ctx.fillRect(p.x + offset, p.y + offset, size, size);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    init().then(draw);
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [loadMask, buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
