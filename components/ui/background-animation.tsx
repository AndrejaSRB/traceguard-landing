"use client";

import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

interface BackgroundAnimationProps {
  particleCount?: number;
  rangeY?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
  primaryColor?: string;
  className?: string;
  staticity?: number;
  ease?: number;
}

// Mouse position hook - similar to particles.tsx
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Initialize to center of screen after component mounts (client-side only)
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

// Convert hex to HSL
function hexToHSL(hex: string): [number, number, number] {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

  // Find the min and max values to calculate the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to the appropriate ranges
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
}

export const BackgroundAnimation = (props: BackgroundAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isInitialized = useRef<boolean>(false);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get global mouse position
  const mousePosition = useMousePosition();

  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 200;
  const baseTTL = 120;
  const rangeTTL = 300;
  const baseSpeed = props.baseSpeed || 0.03;
  const rangeSpeed = props.rangeSpeed || 0.5;
  const baseRadius = props.baseRadius || 0.7; // Reduced for a more delicate look
  const rangeRadius = props.rangeRadius || 1.5;
  const primaryColor = props.primaryColor || "#cfaaff"; // Restored original color
  const backgroundColor = props.backgroundColor || "transparent";
  const staticity = props.staticity || 30;
  const ease = props.ease || 20;

  // Connection lines properties
  const connectionDistance = 150; // Maximum distance to draw connections
  const connectionOpacity = 0.08; // Reduced from 0.15 for better text visibility

  // Convert primary color to HSL to use as base hue
  const [baseHue] = hexToHSL(primaryColor);
  const rangeHue = 30;

  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  const center = useRef<[number, number]>([0, 0]);

  const HALF_PI: number = 0.5 * Math.PI;
  const TAU: number = 2 * Math.PI;
  const TO_RAD: number = Math.PI / 180;
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  const resize = (
    canvas: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) => {
    // Safely access window dimensions only if window is defined (client-side)
    const width = typeof window !== "undefined" ? window.innerWidth : 0;
    const height = typeof window !== "undefined" ? window.innerHeight : 0;

    canvas.width = width;
    canvas.height = height; // Changed from innerHeight * 1.2 to exactly match viewport height

    center.current = [0.5 * canvas.width, 0.5 * canvas.height];

    // Re-initialize particles after resize
    if (isInitialized.current) {
      initParticles();
    }
  };

  const initParticles = () => {
    tick = 0;
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    let x, y, vx, vy, life, ttl, speed, radius, hue;

    x = rand(canvas.width);
    // Distribute particles across the full height of the canvas instead of around the center
    y = rand(canvas.height);
    vx = 0;
    vy = 0;
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    speed = baseSpeed + rand(rangeSpeed);
    radius = baseRadius + rand(rangeRadius);
    hue = baseHue + rand(rangeHue) - rangeHue / 2; // Center the range around baseHue

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;

    // Use the HSL color model with our custom hue
    // Adjusted for better text visibility
    ctx.strokeStyle = `hsla(${hue},85%,60%,${fadeInOut(life, ttl) * 0.6})`;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    // Add a small hexagon at the end point for a more tech/web3 look
    const hexSize = radius * 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x2 + hexSize * Math.cos(angle);
      const hy = y2 + hexSize * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();
    ctx.fillStyle = `hsla(${hue},85%,65%,${fadeInOut(life, ttl) * 0.2})`;
    ctx.fill();

    ctx.restore();
  };

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  // Update mouse position relative to canvas
  const updateMousePosition = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { width, height } = rect;

      // Calculate mouse position relative to canvas center
      const x = mousePosition.x - rect.left - width / 2;
      const y = mousePosition.y - rect.top - height / 2;

      // Update mouse position with some smoothing to prevent jumps
      mouse.current.x = lerp(mouse.current.x, x, 0.1);
      mouse.current.y = lerp(mouse.current.y, y, 0.1);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

    x = particleProps[i];
    y = particleProps[i2];

    // Calculate mouse influence
    const magnetism = 3; // Reduced from 5

    // Apply mouse influence using translateX/Y approach
    const translateX = mouse.current.x / (staticity / magnetism);
    const translateY = mouse.current.y / (staticity / magnetism);

    // Calculate distance from particle to mouse
    const dx = mouse.current.x - x;
    const dy = mouse.current.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Reduce influence for distant particles
    const maxDistance = canvas.width / 3;
    const influence = Math.max(0, 1 - distance / maxDistance);

    // Noise-based movement
    n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

    // Combine noise with mouse influence
    vx = lerp(particleProps[i3], Math.cos(n), 0.1);
    vy = lerp(particleProps[i4], Math.sin(n), 0.1);

    // Apply mouse influence - reduced multiplier and apply distance-based falloff
    vx += lerp(0, translateX - x, 1 / ease) * 0.01 * influence;
    vy += lerp(0, translateY - y, 1 / ease) * 0.01 * influence;

    life = particleProps[i5];
    ttl = particleProps[i6];
    speed = particleProps[i7];
    x2 = x + vx * speed;
    y2 = y + vy * speed;
    radius = particleProps[i8];
    hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;
    (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  // Draw connections between nearby particles
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // For each pair of particles
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      const x1 = particleProps[i];
      const y1 = particleProps[i + 1];
      const hue1 = particleProps[i + 8];

      for (
        let j = i + particlePropCount;
        j < particlePropsLength;
        j += particlePropCount
      ) {
        const x2 = particleProps[j];
        const y2 = particleProps[j + 1];

        // Calculate distance between particles
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If they're close enough, draw a connection
        if (distance < connectionDistance) {
          // Opacity inversely proportional to distance
          const opacity =
            (1 - distance / connectionDistance) * connectionOpacity;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue1},85%,60%,${opacity})`;
          ctx.lineWidth = 0.5; // Thin lines for connections
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    ctx.restore();
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    // Check if canvas has valid dimensions before drawing
    if (canvas.width === 0 || canvas.height === 0) return;

    ctx.save();
    ctx.filter = "blur(8px) brightness(160%)"; // Reduced brightness for better text visibility
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(160%)"; // Reduced brightness
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    // Additional smaller bloom for sharper edges
    ctx.save();
    ctx.filter = "blur(1px) brightness(130%)"; // Reduced brightness
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    // Check if canvas has valid dimensions before drawing
    if (canvas.width === 0 || canvas.height === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Check if canvas has valid dimensions before drawing
    if (canvas.width === 0 || canvas.height === 0) {
      // Request next frame and try again
      animationFrameId.current = window.requestAnimationFrame(() =>
        draw(canvas, ctx)
      );
      return;
    }

    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only fill background if not transparent
    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawParticles(ctx);
    drawConnections(ctx); // Draw connections between particles
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx)
    );
  };

  // Constants for noise - reduced for slower animation
  const noiseSteps = 2; // Reduced from 2.5
  const xOff = 0.0006; // Reduced from 0.0008
  const yOff = 0.0006; // Reduced from 0.0008
  const zOff = 0.0002; // Reduced from 0.0003

  const setup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    resize(canvas, ctx);

    // Initialize particles
    initParticles();
    isInitialized.current = true;

    // Start animation loop
    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx)
    );
  };

  useEffect(() => {
    // Update mouse position when mousePosition changes
    updateMousePosition();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    // Ensure the component is mounted before setting up
    const timeoutId = setTimeout(() => {
      setup();
    }, 100);

    const handleResize = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        resize(canvas, ctx);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={containerRef}
      className={`fixed inset-0 -z-10 h-screen w-full overflow-hidden ${props.className || ""}`} // Added h-screen and overflow-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
    </motion.div>
  );
};
