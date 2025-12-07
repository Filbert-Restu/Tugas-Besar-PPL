// app/(public)/layout.tsx
import Navbar from '@/components/Main/Navbar';
import Footer from '@/components/Main/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-gray-50'>{children}</main>
      <Footer />
    </>
  );
}
