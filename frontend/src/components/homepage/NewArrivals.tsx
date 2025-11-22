'use client';

import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import apiClient from '@/lib/axios';

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Fetch Data dari Laravel
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Asumsi backend mengurutkan berdasarkan latest()
        const res = await apiClient.get('/products'); 
        setProducts(res.data.data.slice(0, 8)); // Ambil 8 produk teratas
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatest();
  }, []);

  // 2. Logic Intersection Observer (Efek Scroll)
  useEffect(() => {
    if (products.length === 0) return;

    // Default tampilkan 4 pertama
    setVisibleProducts(new Set([0, 1, 2, 3]));

    const observers: IntersectionObserver[] = [];

    productRefs.current.forEach((ref, index) => {
      if (ref && index >= 4) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleProducts((prev) => new Set(prev).add(index));
                observer.disconnect();
              }
            });
          },
          { rootMargin: '100px', threshold: 0.1 }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pendatang Baru
          </h2>
          <p className="mt-2 text-gray-500">Produk segar yang baru saja diupload penjual.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                 // Assign ref tanpa return value (void)
                 if (el) productRefs.current[index] = el;
              }}
              className={`transition-all duration-700 ease-out ${
                visibleProducts.has(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}