export default function Hero() {
  return (
    <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-12 mb-8 text-white overflow-hidden shadow-2xl'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32'></div>
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24'></div>

      <div className='relative z-10'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium'>
            ✨ Platform Terpercaya
          </div>
        </div>

        <h1 className='text-4xl md:text-5xl font-extrabold mb-4 leading-tight'>
          Selamat Datang di{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400'>
            I-RICH
          </span>
        </h1>

        <p className='text-blue-50 text-lg md:text-xl mb-6 max-w-2xl leading-relaxed'>
          Temukan ribuan produk berkualitas dengan harga terbaik. Baca review
          dari pembeli asli dan belanja dengan aman.
        </p>

        <div className='flex flex-wrap gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
              </svg>
            </div>
            <div>
              <div className='font-semibold'>10,000+</div>
              <div className='text-blue-100 text-xs'>Pengguna Aktif</div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
            </div>
            <div>
              <div className='font-semibold'>50,000+</div>
              <div className='text-blue-100 text-xs'>Produk Tersedia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
