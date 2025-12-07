'use client';

interface TopBarProps {
  currentTitle: string;
  userName?: string;
  userRole?: string;
}

export default function TopBar({
  currentTitle,
  userName = 'Penjual',
}: TopBarProps) {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-800'>
            {currentTitle}
          </h2>
          <p className='text-sm text-gray-500 mt-1'>
            Kelola toko dan produk Anda
          </p>
        </div>
        <div className='flex items-center gap-4'>
          {/* User Info */}
          <div className='flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg'>
            <div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow'>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className='text-left'>
              <p className='text-sm font-semibold text-gray-800'>{userName}</p>
              <p className='text-xs text-gray-500'>Penjual</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
