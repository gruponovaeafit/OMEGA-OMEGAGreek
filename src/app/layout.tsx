import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

// Header
export const Header = () => {
  return (
    <header className="relative w-full flex justify-center items-center">
      <img 
        src="/LOGO-OMEGA.svg" 
        alt="Logo Omega"
        width={60} 
        height={60} 
        className="object-contain z-10 relative top-2" // Baja el logo 2 píxeles
      />
    </header>
  );
};

// Footer
export const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center py-4 mt-auto">
      <img
        src="/Footer.svg" 
        alt="Footer Logo"
        width={200} 
        height={40} 
        className="object-contain"
      />
    </footer>
  );
};
