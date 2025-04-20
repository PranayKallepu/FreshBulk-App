import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshBulk App",
  description: "Bulk order products(vegetables,fruits) system",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressContentEditableWarning>
        <head>
          <link rel="icon" href="/logo.ico" />
        </head>
        <body className={inter.className}>
          <div className="min-h-svh flex flex-col">
            <Navbar />
            <Toaster position="top-right" reverseOrder={false} />
            <ReduxProvider>{children}</ReduxProvider>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
