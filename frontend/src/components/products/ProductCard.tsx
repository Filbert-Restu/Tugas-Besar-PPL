'use client';

import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className = '' }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className={`group block h-full ${className}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image_url || 'https://placehold.co/400x600/png'}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Label Stok */}
        {product.stock < 5 && product.stock > 0 && (
           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
             Stok Menipis
           </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.seller?.nama_toko}</p>
        </div>
        <p className="text-sm font-bold text-gray-900">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  );
}