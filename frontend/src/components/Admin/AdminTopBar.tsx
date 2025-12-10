'use client';

interface AdminTopBarProps {
  currentTitle: string;
  userName?: string;
}

export default function AdminTopBar({
  currentTitle,
  userName = 'Admin',
}: AdminTopBarProps) {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='flex items-center justify-between px-6 py-4'>
        <h2 className='text-2xl font-semibold text-gray-800'>{currentTitle}</h2>
        <div className='flex items-center gap-4'>
          {/* User Avatar */}
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold'>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
