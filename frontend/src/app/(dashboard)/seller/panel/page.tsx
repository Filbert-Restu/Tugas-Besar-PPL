'use client';

import SellerLogoutButton from "@/components/layout/SellerLogoutButton";
import Link from "next/link";

export default function DashboardPageSeller() {

  return (
    <div className="min-h-screen bg-gray-50">
      Welcome Back Bitch
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-600">Seller Center</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/seller" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            <span>🏠</span> Dashboard
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            <span>📦</span> Produk Saya
          </Link>
          {/* ... menu seller lainnya ... */}
        </nav>

        {/* AREA LOGOUT DI BAWAH */}
        <div className="p-4 border-t border-gray-200">
          <SellerLogoutButton />
        </div>
      </aside>
    </div>
  );
}