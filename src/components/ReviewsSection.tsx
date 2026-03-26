"use client";

import { Star } from "@phosphor-icons/react";
import { client } from "@/config/client";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  badge?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          weight="fill"
          color={i < rating ? "#fbbc04" : "#ddd"}
        />
      ))}
    </span>
  );
}

const avatarPatterns: React.ReactNode[] = [
  // Pattern 0: Concentric circles
  <svg key="p0" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.8)" />
  </svg>,
  // Pattern 1: Diagonal lines
  <svg key="p1" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <line x1="4" y1="20" x2="20" y2="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    <line x1="4" y1="14" x2="14" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="10" y1="20" x2="20" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
  </svg>,
  // Pattern 2: Dot grid
  <svg key="p2" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.5)" />
    <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.7)" />
    <circle cx="6" cy="18" r="2" fill="rgba(255,255,255,0.7)" />
    <circle cx="18" cy="18" r="2" fill="rgba(255,255,255,0.5)" />
    <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.8)" />
  </svg>,
  // Pattern 3: Waves
  <svg key="p3" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M2 8 Q6 4 12 8 Q18 12 22 8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
    <path d="M2 14 Q6 10 12 14 Q18 18 22 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
  </svg>,
  // Pattern 4: Cross / plus
  <svg key="p4" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="4" x2="12" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
  </svg>,
  // Pattern 5: Triangle mesh
  <svg key="p5" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <polygon points="12,3 21,20 3,20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    <polygon points="12,9 17,18 7,18" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none" />
  </svg>,
];

const avatarGradients = [
  "linear-gradient(135deg, #2d5016, #4a7c28)",
  "linear-gradient(135deg, #1a5c3a, #2d8a5e)",
  "linear-gradient(135deg, #3d6b1e, #6b9a3d)",
  "linear-gradient(135deg, #1e5a1e, #3d8a3d)",
  "linear-gradient(135deg, #2a6a3a, #4a9a5a)",
  "linear-gradient(135deg, #3a5a1a, #5a8a3a)",
];

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <div className="bezel-card" style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(45, 80, 22, 0.06)" }}>
      <div
        className="bezel-card-inner"
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: avatarGradients[index % avatarGradients.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              position: "relative",
              zIndex: 1,
            }}>
              {review.name.charAt(0)}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a1a1a" }}>
              {review.name}
            </p>
            {review.badge && (
              <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.75rem)", color: "#999", marginTop: "2px" }}>
                {review.badge}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StarRating rating={review.rating} />
          <span style={{ fontSize: "clamp(0.75rem, 2vw, 0.8rem)", color: "#999" }}>{review.date}</span>
        </div>

        <p
          style={{
            color: "#444",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const reviews: Review[] = client.reviews || [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Absolutely transformed our garden. Professional from start to finish. Couldn't be happier with the results.",
      date: "2 weeks ago",
      badge: "Local Guide",
    },
    {
      name: "James T.",
      rating: 5,
      text: "Brilliant work on our patio and fencing. The team were tidy, punctual, and the quality is outstanding.",
      date: "1 month ago",
    },
    {
      name: "Karen D.",
      rating: 5,
      text: "Best landscapers we've ever used. They turned our tired old garden into something we're genuinely proud of.",
      date: "3 weeks ago",
      badge: "Local Guide",
    },
    {
      name: "David R.",
      rating: 5,
      text: "From the initial consultation to the final clean-up, everything was handled professionally. Highly recommend.",
      date: "2 months ago",
    },
    {
      name: "Emma W.",
      rating: 5,
      text: "We wanted a low-maintenance garden with year-round interest. They delivered exactly that. Beautiful planting scheme.",
      date: "1 month ago",
    },
    {
      name: "Paul H.",
      rating: 5,
      text: "Had our driveway and front garden done. Neighbours keep stopping to compliment it. Worth every penny.",
      date: "3 weeks ago",
      badge: "Local Guide",
    },
  ];

  return (
    <section id="reviews" className="section-light" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header with pill badge */}
        <div
          style={{
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span className="pill-badge pill-badge-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Reviews
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "3rem",
                fontWeight: 300,
                color: "#1a1a1a",
                lineHeight: 1,
              }}
            >
              {client.googleRating}
            </span>
            <div>
              <StarRating rating={Math.round(parseFloat(client.googleRating))} />
              <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                Based on {client.reviewCount} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Review cards — bento grid */}
        <div
          className="stagger-grid reviews-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          {reviews.map((review, i) => {
            // Bento layout: row 1 = 2 cards (span), row 2 = 3 cards, row 3 = 1 wide
            // Items 0-1: first row, each spans 1.5 cols (approximate with col span)
            // Items 2-4: second row, 1 col each
            // Item 5: third row, spans full width
            let gridColumn: string | undefined;
            if (i === 0) gridColumn = "1 / 2";
            else if (i === 1) gridColumn = "2 / 4";
            else if (i === 5) gridColumn = "1 / -1";

            return (
              <div key={i} className={gridColumn ? "bento-span" : undefined} style={{ gridColumn }}>
                <ReviewCard review={review} index={i} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
