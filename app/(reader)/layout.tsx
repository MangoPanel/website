import "./main.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MangoPanel",
  description: "Minimal two-page manga reader"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <div>MANGOPANEL</div>
        </header>
        {children}
      </body>
    </html>
  );
}
