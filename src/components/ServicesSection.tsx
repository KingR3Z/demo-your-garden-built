"use client";

import { client } from "@/config/client";
import { Tree, Shovel, Wall, Flower } from "@phosphor-icons/react";

const iconMap: Record<string, any> = {
  tree: Tree,
  shovel: Shovel,
  wall: Wall,
  flower: Flower,
};

export default function ServicesSection() {
  return (
    <section id="services" className="section-dark" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <span className="pill-badge pill-badge-accent">What We Do</span>
        <h2
          style={{
            color: "white",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300,
            lineHeight: 1.2,
            marginBottom: "64px",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          Services tailored to your outdoor vision
        </h2>

        <div
          className="stagger-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {client.services.map((service, i) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={i}
                className="bezel-card"
              >
                <div className="bezel-card-inner" style={{ padding: "40px 32px" }}>
                  {IconComponent && (
                    <IconComponent
                      size={40}
                      weight="duotone"
                      style={{ color: "var(--color-accent)", display: "block", marginBottom: "20px" }}
                    />
                  )}
                  <h3
                    style={{
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
