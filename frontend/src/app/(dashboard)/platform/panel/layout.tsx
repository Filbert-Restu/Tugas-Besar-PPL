import LogoutButton from '@/components/layout/LogoutButton';
import Link from 'next/link';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      
      
      {/* Konten Halaman (Dashboard, Verification, dll akan muncul di sini) */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}