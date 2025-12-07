'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Seller/Sidebar';
import TopBar from '@/components/Seller/TopBar';
import LoadingState from '@/components/LoadingState';
import { useSellerAuth } from '@/hooks/Auth/useSellerAuth';
import { getUserData } from '@/utils/getUserData';
import { menuItems } from '@/constants/menuItems';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { isActive, handleLogout, isLoading, isAuthenticated } =
    useSellerAuth();
  const userData = getUserData();

  const currentMenuItem = menuItems.find((item) => isActive(item.href));
  const currentTitle = currentMenuItem?.title || 'Dashboard';

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-100'>
        <LoadingState message='Memverifikasi akses...' />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <TopBar
          currentTitle={currentTitle}
          userName={userData?.name || 'Penjual'}
          userRole={userData?.role || 'penjual'}
        />

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6 bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
}
