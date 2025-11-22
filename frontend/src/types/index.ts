// Ini adalah "Cerminan" dari data JSON yang dikirim Laravel.
// Wajib sama persis dengan nama kolom di database/response controller Anda.

// 1. Tipe Data Penjual (Seller)
export interface Seller {
  id: number;
  nama_toko: string;       // Harus sama dengan column database
  kabupaten_kota: string;  // Harus sama dengan column database
  propinsi?: string;       // Tanda ? artinya opsional (boleh null)
}

// 2. Tipe Data Produk
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_url: string;
  
  // Relasi (karena di Controller kita pakai ->with('seller'))
  seller_id: number;
  seller?: Seller;         // Object seller yang nempel di produk
  
  // Atribut tambahan (Accessor dari Laravel)
  rating_avg?: number;     
  
  created_at?: string;
}

// 3. Tipe Data User (Untuk Login)
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'seller' | 'admin' | 'user';
}