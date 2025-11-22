'use client';

import Link from 'next/link';

// Data Dummy Kategori (Bisa diganti dengan API jika sudah ada endpoint kategori + gambar)
const categories = [
  {
    id: 1,
    name: 'Elektronik & Gadget',
    href: '/category/elektronik',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    count: '120+ Produk',
    colSpan: 'md:col-span-2', // Kategori utama lebih besar
  },
  {
    id: 2,
    name: 'Fashion Pria',
    href: '/category/fashion-pria',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    count: '85 Produk',
    colSpan: 'md:col-span-1',
  },
  {
    id: 3,
    name: 'Fashion Wanita',
    href: '/category/fashion-wanita',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    count: '200+ Produk',
    colSpan: 'md:col-span-1',
  },
  {
    id: 4,
    name: 'Hobi & Koleksi',
    href: '/category/hobi',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    count: '45 Produk',
    colSpan: 'md:col-span-2',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Kategori Pilihan</h2>
            <p className="mt-2 text-gray-500 text-lg">Jelajahi koleksi terpopuler minggu ini.</p>
          </div>
          <Link 
            href="/search" 
            className="group flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Lihat Semua Kategori
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${category.colSpan}`}
            >
              {/* Background Image dengan Zoom Effect */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content Text */}
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <p className="text-xs font-medium text-gray-300 mb-1 tracking-wider uppercase">
                  {category.count}
                </p>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {category.name}
                </h3>
                
                {/* Arrow Icon on Hover */}
                <div className="mt-4 flex items-center gap-2 text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-medium">Belanja Sekarang</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}