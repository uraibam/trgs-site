export const metadata = {
  title: "TRGS — For the 3% defying gravity",
  description: "Clarity for founders. Systems for teams. Fire for CEOs."
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="antialiased">{children}</body>
    </html>
  );
}
