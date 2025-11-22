import React from 'react';
import type { Metadata } from "next";

// Opsional: Tambahkan Metadata Title agar tab browser berubah
export const metadata: Metadata = {
  title: "Tampilan utama",
  description: "testing",
};

// WAJIB: Export Default Function Component
export default function RegisterSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita biarkan layout ini 'polos' (passthrough) karena styling utama 
    // biasanya sudah ada di page.tsx (form registrasi).
    <>
      {children}
    </>
  );
}