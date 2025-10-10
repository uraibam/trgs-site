// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "TRGS — For the 3% defying gravity",
  description: "Clarity for founders. Systems for teams. Fire for CEOs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
