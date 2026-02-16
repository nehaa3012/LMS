import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from "@clerk/nextjs";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexusLMS - AI-Powered Learning Management System",
  description: "Experience the future of learning with our AI-powered LMS featuring intelligent course creation, personalized paths, and gamified progress tracking.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider> 
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
