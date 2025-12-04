import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/currency';
import { ProductDetailResponse } from '@/services/productService';
import { PurchaseCardProps } from '@/types/product';

export function PurchaseCard({
  product,
  onAddToCart,
  onBuyNow,
  onChatSeller,
}: PurchaseCardProps & { product: ProductDetailResponse }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < product.stok_produk) setQuantity(quantity + 1);
  };

  const subtotal = product.harga_produk * quantity;

  return (
    <div className='bg-white rounded-lg p-6 shadow-sm sticky top-4'>
      <h3 className='font-semibold text-gray-900 mb-4'>
        Atur jumlah dan catatan
      </h3>

      {/* Quantity Selector */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3 border border-gray-300 rounded-lg'>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className='px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              −
            </button>
            <span className='px-4 font-semibold text-gray-900'>{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stok_produk}
              className='px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              +
            </button>
          </div>
        </div>
        <div className='text-sm'>
          <span className='text-gray-600'>Stok Total: </span>
          <span className='font-semibold text-orange-600'>
            Sisa {product.stok_produk}
          </span>
        </div>
      </div>

      {/* Subtotal */}
      <div className='mb-4 pb-4 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>Subtotal</span>
          <span className='text-xl font-bold text-gray-900'>
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <Button
          onClick={onAddToCart}
          disabled={product.stok_produk === 0}
          className='w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold'
        >
          + Keranjang
        </Button>
        <Button
          onClick={onBuyNow}
          disabled={product.stok_produk === 0}
          variant='outline'
          className='w-full h-12 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold'
        >
          Beli Langsung
        </Button>
      </div>

      {/* Additional Actions */}
      <div className='mt-4 pt-4 border-t border-gray-200 flex items-center justify-around'>
        <button
          onClick={onChatSeller}
          className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
          Chat
        </button>
        <button className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
          </svg>
          Wishlist
        </button>
        <button className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
            />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
