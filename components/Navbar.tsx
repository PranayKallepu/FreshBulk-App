"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // links for navigation
  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/track-orders", label: "Track Orders" },
    { href: "/admin", label: "Admin" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto flex items-center justify-between h-full px-6">
          {/* Logo  */}
          <Link href="/" className="flex flex-col items-center">
            <Image src="/logo.png" alt="logo" width={28} height={28} />
            <span className="font-bold text-xl">FreshBulk</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-cyan-500 border-b-cyan-500 border-b-2"
                      : "text-gray-500  "
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          <div className="hidden md:flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <div className="px-4 py-1 bg-cyan-400 text-white rounded-md flex items-center gap-1 cursor-pointer">
                <SignInButton />
              </div>
              <div className="px-4 py-1 border border-cyan-400 text-cyan-500 rounded-md flex items-center gap-1 cursor-pointer">
                <SignUpButton />
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-40 p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Image src="/logo.png" alt="logo" width={28} height={28} />
            <span className="font-bold text-xl">FreshBulk</span>
          </Link>
          <button onClick={toggleMenu}>
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium ${
                pathname === link.href ? "text-cyan-500" : "text-gray-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-5 border-2">
          <SignedOut>
            <div className="md:px-4 md:py-3 px-1 py-1 bg-cyan-400 text-white rounded-lg text-center">
              <SignInButton>
                <span>Sign In</span>
              </SignInButton>
            </div>
            <div className="md:px-4 md:py-3 px-1 py-1 border border-cyan-400 text-cyan-500 rounded-lg text-center">
              <SignUpButton>
                <span>Sign Up</span>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="px-4 py-3 rounded-lg text-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </>
  );
}
