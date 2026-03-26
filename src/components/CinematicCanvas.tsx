"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { client } from "@/config/client";

interface CinematicCanvasProps {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const MOBILE_BREAKPOINT = 768;

export default function CinematicCanvas({
  onLoadProgress,
  onLoaded,
}: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scrollTriggerRef = useRef<{ kill: () => void } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    frameCount: desktopFrameCount,
    mobileFrameCount,
    frameDir,
    mobileFrameDir,
    framePrefix,
    frameExtension,
    framePadding,
    scrubSpeed,
  } = client.cinematic;

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get frame count based on device
  const getFrameCount = useCallback(() => {
    if (typeof window === "undefined") return desktopFrameCount;
    return window.innerWidth <= MOBILE_BREAKPOINT ? mobileFrameCount : desktopFrameCount;
  }, [desktopFrameCount, mobileFrameCount]);

  // Get frame URL — mobile uses separate 9:16 frames (skipping every other for perf)
  const getFrameUrl = useCallback(
    (index: number) => {
      const isMobileView = typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;
      const dir = isMobileView && mobileFrameDir ? mobileFrameDir : frameDir;
      // Mobile has its own dedicated 9:16 frames — use directly
      // Desktop frames are 16:9, mobile frames are 9:16
      const actualIndex = index + 1;
      const padded = String(actualIndex).padStart(framePadding, "0");
      return `${dir}${framePrefix}${padded}${frameExtension}`;
    },
    [frameDir, mobileFrameDir, framePrefix, frameExtension, framePadding, mobileFrameCount, desktopFrameCount]
  );

  // Draw frame — contain on mobile (full frame visible), cover on desktop
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) return;

    const isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover scaling — fills entire viewport on both desktop and mobile
    // Mobile 9:16 frames fill portrait screens perfectly
    // Desktop 16:9 frames fill landscape screens perfectly
    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  }, []);

  // Resize canvas to match viewport (retina-aware, capped at 2x)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload frames — mobile loads fewer (mobileFrameCount), desktop loads all
  useEffect(() => {
    const frameCount = getFrameCount();
    let loaded = 0;
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    let failed = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (cancelled) return;
        loaded++;
        onLoadProgress?.(loaded / frameCount);
        if (loaded + failed === frameCount) {
          imagesRef.current = images;
          setIsReady(true);
          onLoaded?.();
          drawFrame(0);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        failed++;
        console.warn(`Frame ${i} failed to load: ${img.src}`);
        if (loaded + failed === frameCount) {
          // Still mark as ready with whatever loaded successfully
          imagesRef.current = images;
          setIsReady(true);
          onLoaded?.();
          if (loaded > 0) drawFrame(0);
        }
      };
      images.push(img);
    }

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [getFrameCount, getFrameUrl, drawFrame, onLoadProgress, onLoaded]);

  // GSAP ScrollTrigger setup — works on both desktop and mobile
  // Lerp-based smooth frame playback — constant speed regardless of scroll speed
  useEffect(() => {
    if (!isReady) return;

    let tween: { scrollTrigger?: { kill: () => void }; kill: () => void } | null = null;
    let lerpRaf = 0;
    let smoothFrame = 0;
    let targetFrame = 0;
    let isRunning = true;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const frameCount = getFrameCount();
      const imageSeq = { frame: 0 };
      const isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;

      // Lerp speed — lower = smoother/slower catch-up
      // Mobile gets slightly faster lerp so it doesn't feel laggy
      // Same lerp speed on both — mobile proved 0.08 is the sweet spot
      const lerpFactor = 0.08;

      // Progress bar element
      const progressBar = document.querySelector(".scroll-progress") as HTMLElement | null;

      // Lerp animation loop — runs every frame at constant speed
      const lerpLoop = () => {
        if (!isRunning) return;

        // Smoothly interpolate toward target
        smoothFrame += (targetFrame - smoothFrame) * lerpFactor;

        const roundedFrame = Math.round(smoothFrame);
        if (roundedFrame !== currentFrameRef.current && roundedFrame >= 0 && roundedFrame < frameCount) {
          currentFrameRef.current = roundedFrame;
          drawFrame(roundedFrame);
        }

        lerpRaf = requestAnimationFrame(lerpLoop);
      };

      // Start the lerp loop
      lerpRaf = requestAnimationFrame(lerpLoop);

      tween = gsap.to(imageSeq, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "12% top",
          end: "bottom bottom",
          scrub: 0.3,  // Same responsive scrub on both desktop and mobile
          anticipatePin: 1,
          onRefresh: () => resizeCanvas(),
          onUpdate: (self) => {
            if (progressBar) {
              const progress = self.progress;
              progressBar.style.transform = `scaleX(${progress})`;
              progressBar.classList.toggle("visible", progress > 0.01 && progress < 0.99);
            }
          },
        },
        onUpdate: () => {
          // Just set the target — the lerp loop handles smooth playback
          targetFrame = imageSeq.frame;
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    };

    initGSAP();

    return () => {
      isRunning = false;
      cancelAnimationFrame(lerpRaf);
      cancelAnimationFrame(rafRef.current);
      if (tween) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, [isReady, getFrameCount, drawFrame, scrubSpeed, resizeCanvas]);

  // Handle resize — refresh ScrollTrigger instead of killing it
  useEffect(() => {
    const handleResize = async () => {
      resizeCanvas();
      // Refresh all ScrollTriggers so they recalculate positions
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      ScrollTrigger.refresh();
    };

    resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  return (
    <div
      ref={containerRef}
      data-cinematic-container
      style={{
        height: isMobile ? "300vh" : client.cinematic.scrollLength,
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} className="cinematic-canvas" />

      {/* Inward masking gradient — blends canvas edges into the site background */}
      <div
        className="cinematic-mask"
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100dvh",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
