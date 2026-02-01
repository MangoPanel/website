import "./landing.css";
import Image from 'next/image'
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
        <Image className="img" 
          src="/logo.png"
          width={84}
          height={31}
          alt="logo"
        />
      </div>
      <div>
        <Link href="/login" className="white link">Login</Link>
        <Link href="/register" className="white link">Register</Link>
      </div>
    </header>
  );
}
