"use client";

import { useEffect, useRef } from "react";
import { client } from "@/config/client";

export default function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tween: { scrollTrigger?: { kill: () => void }; kill: () => void } | null = null;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return;

      tween = gsap.to(ref.current, {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "8% top",
          scrub: true,
        },
      });
    };

    initGSAP();

    return () => {
      if (tween) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: "100dvh",
        pointerEvents: "none",
      }}
    >
      {/* Dark gradient overlay — heavier on left for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
        }}
      />

      {/* Content — left-aligned, bottom third */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 clamp(32px, 6vw, 100px) clamp(60px, 15vh, 140px)",
          maxWidth: "750px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "clamp(1.6rem, 5.5vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontStyle: "italic",
            textShadow: "0 4px 20px rgba(0,0,0,0.4)",
            marginBottom: "16px",
          }}
        >
          Professional Garden
          <br />
          Maintenance &
          <br />
          Landscaping
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(0.55rem, 1.8vw, 0.85rem)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            marginBottom: "28px",
          }}
        >
          {client.tagline} in {client.county}
        </p>

        {/* No CTA button — let the scroll animation do the selling */}
      </div>

      {/* Scroll indicator — bottom centre (hidden on mobile via CSS) */}
      <div
        className="scroll-indicator-mobile"
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          zIndex: 1,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          Scroll to explore
        </span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: "bounceDown 2s ease-in-out infinite",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
