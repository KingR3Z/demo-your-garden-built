"use client";

import { useEffect, useRef, useState } from "react";

export default function CinematicCaptions() {
  const captionRef = useRef<HTMLDivElement>(null);
  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const scrollContainer = document.querySelector("[data-cinematic-container]");
      if (!scrollContainer || !captionRef.current) return;

      gsap.set(captionRef.current, { opacity: 0, y: 24 });
      setGsapReady(true);

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const el = captionRef.current;
          if (!el) return;

          if (p < 0.45) {
            el.style.opacity = "0";
            el.style.transform = "translateX(-50%) translateY(24px)";
          } else if (p < 0.52) {
            const fadeIn = (p - 0.45) / 0.07;
            el.style.opacity = String(fadeIn);
            el.style.transform = `translateX(-50%) translateY(${24 * (1 - fadeIn)}px)`;
          } else if (p < 0.92) {
            el.style.opacity = "1";
            el.style.transform = "translateX(-50%) translateY(0px)";
          } else if (p < 0.97) {
            const fadeOut = 1 - (p - 0.92) / 0.05;
            el.style.opacity = String(fadeOut);
            el.style.transform = `translateX(-50%) translateY(${-16 * (1 - fadeOut)}px)`;
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateX(-50%) translateY(-16px)";
          }
        },
      });
    };

    initGSAP();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 12,
      }}
    >
      <div
        ref={captionRef}
        style={{
          position: "absolute",
          bottom: "clamp(15%, 25vw, 33%)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: 0,
          visibility: gsapReady ? "visible" : "hidden",
          width: "90%",
          maxWidth: "600px",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
            fontWeight: 400,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            lineHeight: 1.3,
            textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
            marginBottom: "12px",
            letterSpacing: "-0.01em",
          }}
        >
          Your garden could be next
        </p>
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "50px",
            border: "1px solid rgba(212, 184, 122, 0.4)",
            background: "rgba(212, 184, 122, 0.15)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "var(--color-accent)",
            fontSize: "clamp(0.75rem, 3vw, 0.9rem)",
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            transition: "all 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
            pointerEvents: "auto",
          }}
        >
          Free consultation · No obligation →
        </a>
      </div>
    </div>
  );
}
