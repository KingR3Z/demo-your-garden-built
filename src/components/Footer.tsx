import { client } from "@/config/client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        color: "rgba(255,255,255,0.4)",
        padding: "48px 24px",
        textAlign: "center",
        fontSize: "0.875rem",
      }}
    >
      <p style={{ marginBottom: "8px" }}>
        &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
      </p>
      <p>
        {client.address}, {client.city}, {client.county} {client.postcode}
      </p>
      {(client.facebook || client.instagram || client.linkedin) && (
        <div
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          {client.facebook && (
            <a href={client.facebook} style={{ color: "rgba(255,255,255,0.5)", padding: "12px 16px" }}>
              Facebook
            </a>
          )}
          {client.instagram && (
            <a href={client.instagram} style={{ color: "rgba(255,255,255,0.5)", padding: "12px 16px" }}>
              Instagram
            </a>
          )}
          {client.linkedin && (
            <a href={client.linkedin} style={{ color: "rgba(255,255,255,0.5)", padding: "12px 16px" }}>
              LinkedIn
            </a>
          )}
        </div>
      )}
    </footer>
  );
}
