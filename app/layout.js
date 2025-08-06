import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { AuthProvider } from "./context/AuthContext";
import PerformanceMonitor from "./_components/PerformanceMonitor";
import SimplePageTransition from "./_components/SimplePageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IndiaDrive - Premium Car Rental Services",
  description: "Experience luxury car rentals with IndiaDrive. Book premium vehicles including sedans, SUVs, and convertibles for your travel needs. 100% trusted car rental platform.",
  keywords: "car rental, luxury cars, vehicle hire, premium cars, IndiaDrive",
  authors: [{ name: "IndiaDrive" }],
  creator: "IndiaDrive",
  publisher: "IndiaDrive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://indiadrive.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "IndiaDrive - Premium Car Rental Services",
    description: "Experience luxury car rentals with IndiaDrive. Book premium vehicles for your travel needs.",
    url: 'https://indiadrive.com',
    siteName: 'IndiaDrive',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IndiaDrive Car Rental',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IndiaDrive - Premium Car Rental Services",
    description: "Experience luxury car rentals with IndiaDrive. Book premium vehicles for your travel needs.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PerformanceMonitor />
          <Header />
          <SimplePageTransition>
            {children}
          </SimplePageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
