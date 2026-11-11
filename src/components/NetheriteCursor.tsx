import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  color: string;
};

const colors = ["#d444ff", "#aa91c3", "#e0d5ea"];
const maxParticles = 80;

export default function NetheriteCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const applyPointer = (mouse = true) => {
      const active = pointer.matches && mouse;
      document.documentElement.classList.toggle("netherite-cursor-enabled", active);
      setEnabled(active);
    };
    const syncPointer = () => applyPointer();
    const handlePointer = (event: PointerEvent) => applyPointer(event.pointerType === "mouse");
    syncPointer();
    pointer.addEventListener("change", syncPointer);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    return () => {
      pointer.removeEventListener("change", syncPointer);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      document.documentElement.classList.remove("netherite-cursor-enabled");
    };
  }, []);

  useEffect(() => {
    // Native dialogs live above ordinary overlays. Put the particles in the open
    // dialog when present, without adding anything to its keyboard focus order.
    const syncTarget = () => {
      setPortalTarget(document.querySelector<HTMLElement>("dialog[open]") ?? document.body);
    };
    syncTarget();
    const observer = new MutationObserver(syncTarget);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let frame: number | undefined;
    let previousTime = 0;
    let lastEmission = 0;
    let lastPoint: { x: number; y: number } | null = null;

    const clear = () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = undefined;
      particles = [];
      lastPoint = null;
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      clear();
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(bounds.width * scale);
      canvas.height = Math.ceil(bounds.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const draw = (time: number) => {
      frame = undefined;
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((particle) => {
        particle.age += elapsed;
        if (particle.age >= particle.life) return false;
        particle.x += particle.vx * elapsed;
        particle.y += particle.vy * elapsed;
        particle.vy += 35 * elapsed;
        context.globalAlpha = (1 - particle.age / particle.life) ** 2;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = 5;
        context.fillRect(
          Math.round(particle.x),
          Math.round(particle.y),
          particle.size,
          particle.size,
        );
        return true;
      });
      context.globalAlpha = 1;
      if (particles.length) frame = window.requestAnimationFrame(draw);
    };

    const emit = (x: number, y: number, amount: number, burst = false) => {
      if (motion.matches || document.hidden) return;
      for (let index = 0; index < amount; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 30 + Math.random() * 60 : 8 + Math.random() * 18;
        particles.push({
          x: x + (Math.random() - 0.5) * 5,
          y: y + (Math.random() - 0.5) * 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 12,
          age: 0,
          life: 0.35 + Math.random() * 0.3,
          size: Math.random() > 0.65 ? 3 : 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      particles = particles.slice(-maxParticles);
      if (frame === undefined) {
        previousTime = performance.now();
        frame = window.requestAnimationFrame(draw);
      }
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motion.matches) return;
      const point = { x: event.clientX, y: event.clientY };
      if (!lastPoint) {
        lastPoint = point;
        return;
      }
      const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
      const time = performance.now();
      if (distance > 3 && time - lastEmission > 18) {
        const bounds = canvas.getBoundingClientRect();
        emit(point.x - bounds.left - 18, point.y - bounds.top + 17, 2);
        lastEmission = time;
        lastPoint = point;
      }
    };

    const click = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const bounds = canvas.getBoundingClientRect();
      emit(event.clientX - bounds.left, event.clientY - bounds.top, 14, true);
    };

    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) clear();
    };
    const visibility = () => {
      if (document.hidden) clear();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", clear);
    };
  }, [enabled, portalTarget]);

  return enabled && portalTarget
    ? createPortal(
        <canvas ref={canvasRef} className="cursor-particles" aria-hidden="true" />,
        portalTarget,
      )
    : null;
}
