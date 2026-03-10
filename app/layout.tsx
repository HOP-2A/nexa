"use client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // Import the dark theme
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

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
    <ClerkProvider
      signInForceRedirectUrl="/student/dashboard"
      signUpForceRedirectUrl="/student/dashboard"
      appearance={{
        baseTheme: dark, // This makes all Clerk modals/buttons dark by default
      }}
    >
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020202] text-white`}>
          {/* The Header: 
            - Changed bg to match your dashboard (#020202)
            - Added border-b with low opacity for that 'Top Company' look
            - Added backdrop-blur for glassmorphism
          */}
          <header className="fixed top-0 right-0 left-0 md:left-64 flex justify-end items-center px-8 h-16 bg-[#020202]/50 backdrop-blur-xl border-b border-white/5 z-[40]">
            <SignedOut>
              {/* Optional: Add a login button here if needed */}
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">
                  Authorized Access
                </p>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 border border-white/10"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </header>

          <Toaster richColors position="top-right" />
          
          {/* Margin-top ensures content doesn't hide behind the fixed header */}
          <div className="pt-16">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}