import Link from 'next/link';
import SellerLogoutButton from '@/components/layout/SellerLogoutButton'; // Import komponen baru

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR SELLER (Biasanya warna putih/terang beda sama admin) */}
      

      {/* KONTEN UTAMA */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}