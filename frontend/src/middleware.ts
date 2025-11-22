import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil path saat ini
  const path = request.nextUrl.pathname;

  // Ambil token dari cookies (asumsi kamu simpan token di cookie/localStorage)
  // Catatan: Middleware Next.js paling mudah baca cookies, bukan localStorage.
  // Kita cek keberadaan cookie token sederhana dulu.
  const adminToken = request.cookies.get('admin_token')?.value;
  const sellerToken = request.cookies.get('seller_token')?.value;

  // --- PROTEKSI HALAMAN PLATFORM (ADMIN) ---
  // Jika buka /platform... (tapi bukan halaman login)
  if (path.startsWith('/platform') && !path.includes('/login')) {
    if (!adminToken) {
      // Tendang ke login admin
      return NextResponse.redirect(new URL('/platform/login', request.url));
    }
  }

  // --- PROTEKSI HALAMAN SELLER ---
  // Jika buka /seller... (tapi bukan login atau register)
  if (path.startsWith('/seller') && !path.includes('/login') && !path.includes('/register')) {
    if (!sellerToken) {
      // Tendang ke login seller
      return NextResponse.redirect(new URL('/seller/login', request.url));
    }
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang kena middleware ini
export const config = {
  matcher: [
    '/platform/:path*', 
    '/seller/:path*'
  ],
};