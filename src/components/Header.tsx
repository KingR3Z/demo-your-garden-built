"use client";

import { useState, useEffect } from "react";
import { client } from "@/config/client";

const CUBIC = "cubic-bezier(0.32, 0.72, 0, 1)";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#transformations" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ---- Inline styles for media queries ---- */}
      <style>{`
        .header-nav-desktop { display: flex !important; }
        .header-hamburger { display: none !important; }

        @media (max-width: 768px) {
          .header-nav-desktop { display: none !important; }
          .header-hamburger { display: flex !important; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 25,
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled
            ? "rgba(10, 10, 10, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          transition: `all 0.4s ${CUBIC}`,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Business Name */}
          <a
            href="#"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              position: "relative",
              zIndex: 52,
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {client.name}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.55rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {client.tagline}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="header-nav-desktop"
            style={{
              alignItems: "center",
              gap: "clamp(16px, 3vw, 40px)",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: `color 0.3s ${CUBIC}`,
                  padding: "10px 0",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
                }
              >
                {link.label}
              </a>
            ))}

            {/* CTA Button */}
            <a
              href="#contact"
              style={{
                padding: "10px 24px",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "50px",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: `all 0.3s ${CUBIC}`,
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent)";
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "white";
              }}
            >
              Get a Free Quote
            </a>
          </nav>

          {/* Hamburger Button (mobile only) */}
          <button
            className="header-hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              position: "relative",
              zIndex: 52,
              width: "44px",
              height: "44px",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* Top line */}
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "2px",
                transition: `all 0.4s ${CUBIC}`,
                transformOrigin: "center",
                transform: menuOpen
                  ? "translateY(1px) rotate(45deg)"
                  : "translateY(-4px) rotate(0deg)",
              }}
            />
            {/* Middle line */}
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "2px",
                transition: `all 0.4s ${CUBIC}`,
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
              }}
            />
            {/* Bottom line */}
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "2px",
                transition: `all 0.4s ${CUBIC}`,
                transformOrigin: "center",
                transform: menuOpen
                  ? "translateY(-1px) rotate(-45deg)"
                  : "translateY(4px) rotate(0deg)",
              }}
            />
          </button>
        </div>
      </header>

      {/* ---- Mobile Full-Screen Overlay Menu ---- */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(5, 5, 5, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: `opacity 0.5s ${CUBIC}`,
        }}
      >
        {/* Close (X) button — top-right */}
        <button
          onClick={closeMenu}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: "20px",
            right: "clamp(20px, 4vw, 48px)",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        {/* Mobile nav links */}
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={closeMenu}
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontSize: "1.2rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              fontFamily: "'Space Grotesk', sans-serif",
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "320px",
              transition: `opacity 0.4s ${CUBIC}, transform 0.5s ${CUBIC}`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen
                ? "translateY(0)"
                : "translateY(16px)",
              transitionDelay: menuOpen ? `${0.08 + i * 0.04}s` : "0s",
            }}
          >
            {link.label}
          </a>
        ))}

        {/* Mobile CTA */}
        <a
          href="#contact"
          onClick={closeMenu}
          style={{
            marginTop: "16px",
            padding: "16px 32px",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50px",
            color: "white",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            textAlign: "center",
            fontFamily: "'Space Grotesk', sans-serif",
            width: "100%",
            maxWidth: "320px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: `opacity 0.4s ${CUBIC}, transform 0.5s ${CUBIC}, background 0.3s ${CUBIC}, border-color 0.3s ${CUBIC}`,
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(16px)",
            transitionDelay: menuOpen
              ? `${0.08 + navLinks.length * 0.04}s`
              : "0s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent)";
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.color = "#0a0a0a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            e.currentTarget.style.color = "white";
          }}
        >
          Get a Free Quote
        </a>
      </div>
    </>
  );
}
