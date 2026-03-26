"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use lower threshold and rootMargin to trigger earlier
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);

    // Fallback: if element is already in viewport on mount, make it visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className || ""}`}
    >
      {children}
    </div>
  );
}
