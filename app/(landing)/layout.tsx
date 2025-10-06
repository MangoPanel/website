import "./landing.css";
import Link from 'next/link'

export const metadata = {
  title: "MangoPanel",
  description: "Original PDF in, translated PDF out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header>
      <div>
        <a className="white">MangoPanel</a>
      </div>
      <div>
        <Link href="/login" className="white link">Login</Link>
        <Link href="/register" className="white link">Register</Link>
      </div>
    </header>
  );
}
