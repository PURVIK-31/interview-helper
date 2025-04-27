import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";

// Primary heading font
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit", 
  display: "swap",
});

// Body font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Voice Agent Interview Platform",
  description: "Practice interviews with AI voice agents",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${jakarta.variable}`}>
      <body className={jakarta.className}>
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
