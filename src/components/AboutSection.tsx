"use client";

import { Star } from "@phosphor-icons/react";
import { client } from "@/config/client";

export default function AboutSection() {
  return (
    <section id="about" className="section-light" style={{ padding: "120px 24px" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <div>
          <span className="pill-badge pill-badge-primary" style={{ marginBottom: "16px" }}>
            About {client.name}
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: "24px",
              marginTop: "16px",
              textAlign: "left",
            }}
          >
            Passionate about creating beautiful outdoor spaces since{" "}
            {client.yearEstablished}
          </h2>
          <p
            style={{
              color: "rgba(26,26,26,0.7)",
              lineHeight: 1.8,
              fontSize: "1rem",
              marginBottom: "32px",
            }}
          >
            Founded by {client.founderName} {client.founderSurname}, {client.name}{" "}
            has grown from a one-person operation into one of{" "}
            {client.county}&apos;s most trusted landscaping firms. We combine
            creative design with expert craftsmanship to deliver gardens that our
            clients love for years to come.
          </p>
          <a
            href="#contact"
            className="cta-button"
            style={{ background: "var(--color-primary)", color: "white" }}
          >
            Work With Us
          </a>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              background: "var(--color-primary)",
              borderRadius: "16px",
              padding: "48px",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "4rem", fontWeight: 300, lineHeight: 1, marginBottom: "8px" }}
            >
              {client.googleRating}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={24} weight="fill" color="#fbbc04" />
              ))}
            </div>
            <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>
              {client.reviewCount} Google Reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
