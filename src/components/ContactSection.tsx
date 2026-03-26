"use client";

import { useState } from "react";
import { client } from "@/config/client";
import { Phone, EnvelopeSimple, MapPin } from "@phosphor-icons/react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section
      id="contact"
      className="section-dark"
      style={{ padding: "120px 24px" }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "60px",
        }}
      >
        <div>
          <span className="pill-badge pill-badge-accent">Get In Touch</span>
          <h2
            style={{
              color: "white",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: "24px",
            }}
          >
            Ready to transform your outdoor space?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            Get in touch today for a free, no-obligation consultation. We&apos;ll
            visit your property, discuss your vision, and provide a detailed
            quote.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <a
              href={`tel:${client.phone.replace(/\s/g, "")}`}
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.5rem",
                fontWeight: 300,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "var(--ease-smooth)",
              }}
            >
              <Phone size={24} weight="duotone" style={{ color: "var(--color-accent)" }} /> {client.phone}
            </a>
            <a
              href={`mailto:${client.email}`}
              style={{
                color: "var(--color-accent)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "var(--ease-smooth)",
              }}
            >
              <EnvelopeSimple size={24} weight="duotone" style={{ color: "var(--color-accent)" }} /> {client.email}
            </a>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <MapPin size={24} weight="duotone" style={{ color: "var(--color-accent)" }} /> {client.address}, {client.city}, {client.postcode}
            </p>
          </div>
        </div>

        <form
          aria-label="Contact form"
          className="glass-card"
          style={{ padding: "40px" }}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (form.checkValidity()) {
              setSubmitted(true);
            } else {
              form.reportValidity();
            }
          }}
        >
          {submitted ? (
            <p
              style={{
                color: "#4ade80",
                fontSize: "1.1rem",
                textAlign: "center",
                padding: "40px 0",
                fontWeight: 500,
              }}
            >
              Thank you! We&apos;ll be in touch within 24 hours.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your Name"
                  required
                  minLength={2}
                  className="form-input"
                />
                <div className="form-error"></div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Email Address"
                  required
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  className="form-input"
                />
                <div className="form-error"></div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-phone" className="form-label">Phone Number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="form-input"
                />
                <div className="form-error"></div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">Project Details</label>
                <textarea
                  id="contact-message"
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                  className="form-input"
                  style={{ resize: "vertical" }}
                />
                <div className="form-error"></div>
              </div>
              <button
                type="submit"
                className="cta-button"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Request Free Quote
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
