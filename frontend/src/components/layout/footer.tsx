'use client';

import React from "react";
import Link from "next/link";

// --- Ikon Sosial Media (SVG Inline) ---
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5S.2 6.2 5.5 2c2.1-.5 5.1 2.5 5.1 2.5S15 1 19 2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const V0Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L2 19h20L12 2zm0 3.8L18.2 17H5.8L12 5.8z" />
  </svg>
);

// --- Komponen Footer Utama ---
export default function Footer() {
  return (
    <footer className="border-t bg-white text-gray-600">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          
          {/* Kolom Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Symmetry</h3>
            <p className="text-sm text-gray-500">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="space-y-2 sm:max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                aria-label="Email for newsletter" 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Kolom Links */}
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-end sm:gap-24">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/search" className="transition-colors hover:text-gray-900">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/category/electronics" className="transition-colors hover:text-gray-900">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="/category/fashion" className="transition-colors hover:text-gray-900">
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link href="/category/sports-and-outdoors" className="transition-colors hover:text-gray-900">
                    Sports & Outdoors
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:contact@marketplace.com" className="transition-colors hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-gray-900">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bagian Bawah (Social Media & Copyright) */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900" aria-label="Twitter">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900" aria-label="YouTube">
                <YoutubeIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-gray-900" aria-label="LinkedIn">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} Symmetry. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}