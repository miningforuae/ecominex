import "@/css/style.css";
import React from "react";
import { Poppins } from 'next/font/google';

import StoreProvider from "@/lib/feature/provider/StoreProvider";


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

      <body suppressHydrationWarning={true}  >
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <StoreProvider>
            {children}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
