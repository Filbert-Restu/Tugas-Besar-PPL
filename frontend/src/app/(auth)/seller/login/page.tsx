import LoginForm from '@/components/features/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Ganti Link Home sesuai keinginan, bisa ke Landing Page */}
          <Link href="/" className="text-2xl font-extrabold text-black tracking-tight">
            Symmetry<span className="text-blue-600">.</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk untuk mengelola toko atau profil Anda
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}