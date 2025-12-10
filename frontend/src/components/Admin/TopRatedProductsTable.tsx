import React from 'react';

interface TopRatedProductsTableProps {
  data: {
    nama_produk: string;
    nama_toko: string;
    kategori: string;
    rating: number;
    jumlah_review: number;
  }[];
}

export default function TopRatedProductsTable({
  data,
}: TopRatedProductsTableProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        Top 10 Produk dengan Rating Tertinggi
      </h3>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                #
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                Produk
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                Toko
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                Kategori
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                Rating
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                Review
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr
                key={index}
                className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
              >
                <td className='py-3 px-4'>
                  <span className='text-sm font-bold text-gray-400'>
                    #{index + 1}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm font-medium text-gray-900'>
                    {product.nama_produk}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-gray-600'>
                    {product.nama_toko}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {product.kategori}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <div className='flex items-center gap-1'>
                    <svg
                      className='w-4 h-4 text-yellow-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='text-sm font-semibold text-gray-900'>
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-gray-600'>
                    {product.jumlah_review}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
