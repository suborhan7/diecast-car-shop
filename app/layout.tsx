import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { ChatButtons } from "@/components/ChatButtons";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Header } from "@/components/Header";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: "Hot Wheels, die-cast cars, collectibles and RC toys in Bangladesh. Real photos of every car, condition graded, cash on delivery, bKash and Nagad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
          <ChatButtons />
        </CartProvider>
      </body>
    </html>
  );
}
