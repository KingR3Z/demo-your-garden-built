"use client";

import { useState, useRef, useCallback } from "react";
import { client } from "@/config/client";

interface TransformationPair {
  before: string;
  after: string;
  label: string;
}

function MiniSlider({ before, after, label }: TransformationPair) {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSplit((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {/* After image (full background) */}
        <img
          src={after}
          alt="After transformation"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Before image (clipped by slider) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            clipPath: `inset(0 ${100 - split}% 0 0)`,
          }}
        >
          <img
            src={before}
            alt="Before transformation"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Labels */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "clamp(0.7rem, 2vw, 0.75rem)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Before
        </span>
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(45,80,22,0.85)",
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "clamp(0.7rem, 2vw, 0.75rem)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          After
        </span>

        {/* Slider line + handle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${split}%`,
            width: "2px",
            background: "white",
            transform: "translateX(-1px)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${split}%`,
            transform: "translate(-50%, -50%)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 3,
            fontSize: "14px",
            color: "#333",
            fontWeight: 700,
          }}
        >
          ◂▸
        </div>
      </div>
    </div>
  );
}

export default function TransformationGrid() {
  const transformations: TransformationPair[] =
    client.transformations || [
      {
        before: "/images/before.jpg",
        after: "/images/after.jpg",
        label: "Complete Garden Renovation",
      },
    ];

  if (transformations.length < 2) return null;

  return (
    <section id="transformations" className="section-dark" style={{ padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "16px" }}>
          <span className="pill-badge pill-badge-accent">Our Transformations</span>
        </div>
        <h2
          style={{
            color: "white",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 300,
            lineHeight: 1.2,
            marginBottom: "48px",
          }}
        >
          Real results from real gardens
        </h2>

        <div
          className="transformation-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {transformations.map((t, i) => {
            // Bento/asymmetric layout for 9 items across 4 rows:
            // Row 1: item 0 spans 2 cols, item 1 spans 1 col
            // Row 2: items 2,3,4 each 1 col
            // Row 3: item 5 spans 1 col, item 6 spans 2 cols
            // Row 4: items 7,8 split remaining (use 1 col each is fine, but let's do equal)
            let gridColumn: string | undefined;
            if (i === 0) gridColumn = "1 / 3";
            else if (i === 1) gridColumn = "3 / 4";
            else if (i === 5) gridColumn = "1 / 2";
            else if (i === 6) gridColumn = "2 / 4";

            return (
              <div key={i} className={gridColumn ? "bento-span" : undefined} style={{ gridColumn }}>
                <MiniSlider {...t} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
