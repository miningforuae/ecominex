import "@/css/style.css";
import React from "react";
import { Poppins } from 'next/font/google';
// import Script from "next/script"; 
// import StoreProvider from "@/lib/feature/provider/StoreProvider";
// import GlobalWidget from "@/components/GlobalWidget";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body suppressHydrationWarning={true} style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background:
              "radial-gradient(circle at 70% 50%, rgba(0, 200, 100, 0.25) 0%, rgba(0,0,0,1) 60%), #000000",
            color: "#ffffff",
            textAlign: "center",
            padding: "20px",
            fontFamily: "Poppins, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              Ecomine
            </h2>
            <div
              style={{
                backgroundColor: "#22c55e",
                color: "#000",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              X
            </div>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              margin: "0 0 20px 0",
              lineHeight: 1.2,
            }}
          >
            Website Under <span style={{ color: "#22c55e" }}>Maintenance</span>
          </h1>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "50px",
                height: "2px",
                backgroundColor: "#ffffff",
              }}
            ></span>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "1.5rem",
                margin: 0,
                fontWeight: 500,
              }}
            >
              We'll be back soon
            </p>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.1rem",
              maxWidth: "600px",
              color: "#cccccc",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Our website is currently undergoing scheduled maintenance to improve
            your experience. Thank you for your patience.
          </p>

          {/* Contact Button */}
          <a
            href="mailto:support@ecominex.com"
            style={{
              backgroundColor: "#22c55e",
              color: "#000000",
              padding: "14px 40px",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
          >
            Contact Support
          </a>

          {/* Footer */}
          <p
            style={{
              position: "absolute",
              bottom: "20px",
              fontSize: "0.85rem",
              color: "#888888",
            }}
          >
            © {new Date().getFullYear()} Ecomine X. All rights reserved.
          </p>
        </div>

        {/* 
        --- ORIGINAL CODE COMMENTED OUT ---
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <StoreProvider>
            {children}
            <GlobalWidget/>
          </StoreProvider>
        </div>
        */}
      </body>
    </html>
  );
}