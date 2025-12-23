// @ts-nocheck

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {Facebook, Music2, Instagram, Twitter } from "lucide-react";
import legalContent from "../home/legalContent";

const TikTokIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
);

const LegalModal = ({ title, content }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="block text-gray-300 transition-all duration-300 hover:pl-2 hover:text-green-500">
                    {title}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">{content}</ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

const HomeFooter = () => {
    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/ecominex" },
        { icon: Twitter, href: "https://x.com/EcominexN59053" },
        { icon: Instagram, href: "https://www.instagram.com/ecominex/" },
        { icon: TikTokIcon, href: "https://www.tiktok.com/@ecominex" },
    ];

    const footerLinks = [
        {
            title: "Company",
            links: [
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Shop", href: "/shop" },
                { label: "Contact", href: "/contactUs" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "Hosting and management", href: "/" },
                { label: "Purchases of machines", href: "/" },
                { label: "Machines", href: "/" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "Privacy Policy", href: "/" },
                { label: "Terms of Service", href: "/" },
                { label: "Accessibility", href: "/" },
                { label: "Cookie Policy", href: "/" },
            ],
        },
       
    ];

return (
  <footer className="relative bg-[#191919] text-white ">
    {/* Top Section */}
    <div className="pt-10 pb-10 px-4 sm:px-8 lg:px-16 mb-10">
      <div className="
        max-w-6xl mx-auto
        flex flex-col items-center gap-10
        md:grid md:grid-cols-4 md:items-start md:gap-8
        text-center
      ">
        {/* Brand Section */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold">Ecomine</span>
            <div className="flex h-7 w-6 sm:h-8 sm:w-7 items-center justify-center rounded-full bg-green-500">
              <span className="text-lg sm:text-xl font-bold">X</span>
            </div>
          </Link>
        </div>

        
       {/* Footer Links */}
<div
  className="
    w-full
    grid grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    gap-8
    md:col-span-2
    justify-items-center
  "
>
  {footerLinks.map((section, index) => (
    <div
  key={index}
  className="w-full max-w-[220px] text-center md:text-left"
>

      <ul className="space-y-2">
        {section.links.map((link, linkIndex) => (
          <li key={linkIndex}>
            {link.isModal ? (
              <LegalModal
                title={link.label}
                content={legalContent[link.label]}
              />
            ) : (
              <Link
                href={link.href}
                className="block text-gray-300 hover:text-green-500 transition text-[14px] font-medium"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>


        {/* Social + Email */}
        <div className="flex flex-col items-center">
          <div className="flex gap-3">
            <Link
              href="https://www.facebook.com/ecominex"
              className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#00a63e] transition hover:scale-110"
            >
              <Facebook className="w-5 h-5" />
            </Link>

            <Link
              href="https://www.tiktok.com/@ecominex.net"
              className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#00a63e] transition hover:scale-110"
            >
              <Music2 className="w-5 h-5" />
            </Link>

            <Link
              href="https://www.instagram.com/ecominex/"
              className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#00a63e] transition hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </Link>

            <Link
              href="https://x.com/EcominexN59053"
              className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#00a63e] transition hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </Link>
          </div>

          <p className="mt-4 font-semibold text-[14px] sm:text-[15px]">
            info@ecominex.com
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t border-gray-800 py-4">
      <p className="text-xs sm:text-sm text-center font-semibold">
        © {new Date().getFullYear()} EcomineX Technologies. All Rights Reserved.
      </p>
    </div>
  </footer>
);

};

export default HomeFooter;
