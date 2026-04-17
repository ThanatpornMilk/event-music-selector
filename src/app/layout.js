import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata = { title: "Event Music Selector", description: "Create your perfect event playlist" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
