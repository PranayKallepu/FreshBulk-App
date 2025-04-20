"use client";
import Image from "next/image";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1D2128] text-white px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        <div className="w-full border-t border-gray-700 pt-6 flex flex-wrap justify-between items-start">
          {/* Left Section */}
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold">FreshBulk</span>
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-center md:text-left">
            <div>Pricing</div>
            <div>About us</div>
            <div>Features</div>
            <div>Help Center</div>
            <div>Contact us</div>
            <div>FAQs</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center text-xs mt-6 w-full">
          <p className="mt-2 text-xs">
            © 2025 FreshBulk. @PranaY Kallepu - Privacy - Terms
          </p>
          <div className="flex gap-4 mt-2">
            <span>
              <FaTwitter className="text-lg" />
            </span>
            <span>
              <FaFacebook className="text-lg text-blue-400" />
            </span>
            <span>
              <FaLinkedin className="text-lg text-blue-800" />
            </span>
            <span>
              <FaYoutube className="text-lg text-red-600" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
