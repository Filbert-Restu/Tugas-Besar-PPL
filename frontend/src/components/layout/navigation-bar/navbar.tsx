'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Pastikan path ini benar

// --- 1. Komponen Icon Sederhana (Pengganti Import Icon) ---
const ChevronIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-4 h-4"}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-6 h-6"}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

// --- 2. Data Menu (Disesuaikan dengan SRS MarketPlace) ---
type NavItem = {
  text: string;
  href: string;
  submenu?: { items: { title: string; href: string }[] };
};

const navItems: NavItem[] = [
  { text: "Elektronik", 
    href: "/category/elektronik",
    submenu: {
      items: [
        { title: "Elektronik", href: "/category/elektronik" },
        { title: "Fashion Pria", href: "/category/fashion-pria" },
        { title: "Fashion Wanita", href: "/category/fashion-wanita" },
        { title: "Hobi & Koleksi", href: "/category/hobi" },
      ]
    }
  },
  { text: "Fashion", 
    href: "/category/fashion",
    submenu: {
      items: [
        { title: "Elektronik", href: "/category/elektronik" },
        { title: "Fashion Pria", href: "/category/fashion-pria" },
        { title: "Fashion Wanita", href: "/category/fashion-wanita" },
        { title: "Hobi & Koleksi", href: "/category/hobi" },
      ]
    }
  },
  { text: "Sport", 
    href: "/category/fashion-wanita",
    submenu: {
      items: [
        { title: "Elektronik", href: "/category/elektronik" },
        { title: "Fashion Pria", href: "/category/fashion-pria" },
        { title: "Fashion Wanita", href: "/category/fashion-wanita" },
        { title: "Hobi & Koleksi", href: "/category/hobi" },
      ]
    }
  },
  { text: "Hobi & Koleksi", 
    href: "/category/hobi",
    submenu: {
      items: [
        { title: "Elektronik", href: "/category/elektronik" },
        { title: "Fashion Pria", href: "/category/fashion-pria" },
        { title: "Fashion Wanita", href: "/category/fashion-wanita" },
        { title: "Hobi & Koleksi", href: "/category/hobi" },
      ]
    }
  }
];

// --- 3. Komponen UI Placeholder (Search, Cart, Auth) ---
const SearchButton = ({ className }: { className?: string }) => (
  <button className={cn("flex items-center justify-center w-10 h-10 text-gray-600 hover:text-black", className)}>
    <SearchIcon />
  </button>
);

// Input Search Desktop
const Autocomplete = ({ className }: { className?: string }) => (
  <div className={cn("relative hidden lg:block w-64", className)}>
    <input 
      type="text" 
      placeholder="Cari produk..." 
      className="w-full py-2 pl-4 pr-10 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 bg-gray-50"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <SearchIcon className="w-4 h-4" />
    </div>
  </div>
);

// Tombol Login/Register (Pengganti Cart/Favorites agar sesuai SRS)
const AuthButtons = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <Link 
      href="/seller/login" 
      className="text-sm font-medium text-gray-700 hover:text-blue-600"
    >
      Masuk
    </Link>
    <Link 
      href="/seller/register"
      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition"
    >
      Daftar
    </Link>
  </div>
);

// --- 4. Komponen Utama Navbar ---

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const toggleSubmenu = (text: string) => {
    if (activeSubmenu === text) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(text);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        
        {/* KIRI: Logo & Burger Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Burger */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-black"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          {/* Logo Brand */}
          <Link href="/" className="text-xl font-extrabold tracking-tight text-black">
            Symmetry<span className="text-blue-600">.</span>
          </Link>
        </div>

        {/* TENGAH: Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.text} className="relative group h-16 flex items-center">
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-black",
                  pathname === item.href ? "text-black" : "text-gray-500"
                )}
              >
                {item.text}
                {item.submenu && (
                  <ChevronIcon className="w-3 h-3 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {/* Dropdown / Mega Menu Sederhana */}
              {item.submenu && (
                <div className="absolute top-16 left-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-gray-100 shadow-lg rounded-b-lg overflow-hidden">
                  <div className="flex flex-col py-2">
                    {item.submenu.items.map((sub) => (
                      <Link 
                        key={sub.title} 
                        href={sub.href}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-left"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* KANAN: Search & Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <SearchButton className="lg:hidden" /> {/* Icon Search Mobile */}
          <Autocomplete /> {/* Input Search Desktop */}
          
          <div className="h-6 w-px bg-gray-200 hidden lg:block" />
          
          {/* Auth Buttons (Pengganti Cart/Fav) */}
          <AuthButtons className="hidden lg:flex" />
          
          {/* Mobile Cart Placeholder (jika mau tetap ada icon keranjang di mobile) */}
          {/* <button className="lg:hidden p-2 text-gray-600"><ShoppingCartIcon /></button> */}
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={toggleMobileMenu}
      />

      {/* Sidebar Mobile */}
      <div className={cn(
        "fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={toggleMobileMenu} className="p-2">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.text} className="border-b border-gray-50 pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <Link 
                    href={item.href} 
                    className="text-lg font-medium text-gray-800 block w-full py-2"
                    onClick={() => !item.submenu && toggleMobileMenu()}
                  >
                    {item.text}
                  </Link>
                  {item.submenu && (
                    <button 
                      onClick={() => toggleSubmenu(item.text)}
                      className="p-2 bg-gray-50 rounded-full"
                    >
                      <ChevronIcon className={cn("transition-transform", activeSubmenu === item.text ? "rotate-180" : "")} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu */}
                {item.submenu && activeSubmenu === item.text && (
                  <ul className="pl-4 mt-2 space-y-2 bg-gray-50 rounded-lg p-2">
                    {item.submenu.items.map((sub) => (
                      <li key={sub.title}>
                        <Link 
                          href={sub.href} 
                          className="block py-2 text-gray-600"
                          onClick={toggleMobileMenu}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <AuthButtons className="flex justify-between w-full" />
        </div>
      </div>
    </header>
  );
}