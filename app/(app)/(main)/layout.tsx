import "./../main.css";
import { logout } from "@/app/actions/logout";

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
        <a className="white link" onClick={logout}>Logout</a>
      </div>
    </header>
  );
}