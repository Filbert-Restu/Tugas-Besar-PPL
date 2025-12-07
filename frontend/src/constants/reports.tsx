export const reports = [
  {
    id: 'stock-by-quantity',
    title: 'Laporan Stock Produk (Berdasarkan Jumlah)',
    description:
      'Daftar stock produk diurutkan berdasarkan jumlah stock (menurun). Dilengkapi dengan rating, kategori produk, dan harga.',
    icon: (
      <svg
        className='w-8 h-8'
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
    ),
    color: 'blue',
  },
  {
    id: 'stock-by-rating',
    title: 'Laporan Stock Produk (Berdasarkan Rating)',
    description:
      'Daftar stock produk diurutkan berdasarkan rating (menurun). Dilengkapi dengan stock, kategori produk, dan harga.',
    icon: (
      <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
      </svg>
    ),
    color: 'yellow',
  },
  {
    id: 'low-stock',
    title: 'Laporan Stock Menipis',
    description:
      'Daftar produk dengan stock < 2 yang harus segera dipesan. Dilengkapi dengan rating, kategori produk, dan harga.',
    icon: (
      <svg
        className='w-8 h-8'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    ),
    color: 'red',
  },
];
