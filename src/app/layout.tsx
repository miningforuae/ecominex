import "@/css/style.css";
import React from "react";
import { Poppins } from 'next/font/google';
import Script from "next/script"; // ✅ Import Script

import StoreProvider from "@/lib/feature/provider/StoreProvider";
import GlobalWidget from "@/components/GlobalWidget";


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
<head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RCZ5L3GRGP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RCZ5L3GRGP');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning={true}  >
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <StoreProvider>
            {children}
            <GlobalWidget/>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
