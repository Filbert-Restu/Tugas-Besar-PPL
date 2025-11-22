'use client';

import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900 text-white overflow-hidden">
      {/* Background Image (Ganti src dengan gambar banner asli Anda nanti) */}
      <img 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop" 
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center items-start">
        <span className="text-sm md:text-base font-medium tracking-wider uppercase mb-2 text-gray-300">
          Koleksi Terbaru 2025
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight max-w-2xl">
          Elegansi & Kualitas <br/> Dalam Satu Genggaman
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
          Temukan produk terbaik dari penjual terverifikasi. Belanja aman, nyaman, dan terpercaya.
        </p>
        <Link 
          href="/search" 
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          Jelajahi Produk
        </Link>
      </div>
    </div>
  );
}