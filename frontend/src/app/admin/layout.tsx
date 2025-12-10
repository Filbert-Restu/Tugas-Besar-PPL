'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/Auth/useAdminAuth';
import { adminMenuItems, AdminMenuItem } from '@/constants/adminMenuItems';
import AdminSidebarHeader from '@/components/Admin/AdminSidebarHeader';
import AdminSidebarNavigation from '@/components/Admin/AdminSidebarNavigation';
import AdminSidebarFooter from '@/components/Admin/AdminSidebarFooter';
import AdminTopBar from '@/components/Admin/AdminTopBar';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isActive, handleLogout, isLoading, isAuthenticated, adminName } =
    useAdminAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <LoadingSpinner fullScreen size='xl' text='Memverifikasi akses...' />
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo / Header */}
        <AdminSidebarHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Navigation Menu */}
        <AdminSidebarNavigation
          isSidebarOpen={isSidebarOpen}
          isActive={isActive}
        />

        {/* User Profile / Logout */}
        <AdminSidebarFooter
          isSidebarOpen={isSidebarOpen}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <AdminTopBar
          currentTitle={
            adminMenuItems.find((item: AdminMenuItem) => isActive(item.href))
              ?.title || 'Dashboard'
          }
          userName={adminName}
        />

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6 bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
}
