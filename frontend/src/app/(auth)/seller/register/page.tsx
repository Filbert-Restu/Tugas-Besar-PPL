import RegisterForm from '@/components/features/auth/RegisterForm';
import { TextLink } from '@/components/ui/TextLink';

export default function RegisterSellerPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Registrasi Mitra Penjual</h1>
          <p className="text-gray-600">Bergabunglah dan pasarkan produk Anda</p>
        </div>
        <RegisterForm />
        <p className="text-center mt-4 text-sm text-gray-800">
          Sudah punya akun? <TextLink href="/login" className="text-blue-600 text-center">Login disini</TextLink>
        </p>
      </div>
    </div>
  );
}