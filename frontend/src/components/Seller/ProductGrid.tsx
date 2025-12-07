import React from 'react';
import Link from 'next/link';
import { IProduct } from '@/types/seller';

interface ProductGridProps {
  products: IProduct[];
  onDelete: (id: number) => void;
  formatCurrency: (value: number) => string;
}

export default function ProductGrid({
  products,
  onDelete,
  formatCurrency,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-12 text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>
          Tidak ada produk ditemukan
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Ubah filter atau tambahkan produk baru
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product) => (
        <div
          key={product.id}
          className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col'
        >
          <div className='h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0'>
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <svg
                className='w-20 h-20 text-blue-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            )}
          </div>
          <div className='p-4 flex flex-col flex-grow'>
            <div className='flex items-start justify-between mb-2'>
              <h3 className='font-semibold text-gray-900 text-base line-clamp-2 flex-grow min-h-[3rem]'>
                {product.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                  product.stock < 2
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {product.stock < 2 ? 'Low' : 'OK'}
              </span>
            </div>
            <p className='text-xs text-gray-600 mb-3 h-4'>{product.category}</p>

            <div className='flex items-center gap-1 mb-3 h-6'>
              <svg
                className='w-4 h-4 text-yellow-400 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
              <span className='text-sm font-semibold text-gray-900'>
                {product.rating}
              </span>
              <span className='text-xs text-gray-500'>
                ({product.totalRatings})
              </span>
            </div>

            <div className='flex items-center justify-between mb-4 h-10'>
              <div>
                <p className='text-xs text-gray-500'>Stok</p>
                <p className='text-sm font-semibold text-gray-900'>
                  {product.stock}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xs text-gray-500'>Harga</p>
                <p className='text-sm font-semibold text-blue-600 truncate max-w-[120px]'>
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            <div className='flex gap-2 mt-auto'>
              <Link
                href={`/seller/dashboard/products/${product.id}/edit`}
                className='flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 text-center'
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                className='px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700'
                aria-label='Hapus produk'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
