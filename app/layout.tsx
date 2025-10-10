// app/layout.tsx
import "./globals.css";
import { Hubot_Sans, Work_Sans } from "next/font/google";

export const metadata = {
  title: "TRGS — For the 3% defying gravity",
  description: "Clarity for founders. Systems for teams. Fire for CEOs.",
};

// Hubot Sans for UI/headings, Work Sans for body
const hubot = Hubot_Sans({
  subsets: ["latin"],
  variable: "--font-hubot",
  display: "swap",
});
const work = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hubot.variable} ${work.variable} bg-black text-white`}>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
}
