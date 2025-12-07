'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SidebarHeader from '@/components/Seller/SidebarHeader';
import SidebarNavigation from '@/components/Seller/SidebarNavigation';
import SidebarFooter from '@/components/Seller/SidebarFooter';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  isSidebarOpen,
  onToggleSidebar,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-linear-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      <SidebarHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
      />

      <SidebarNavigation isSidebarOpen={isSidebarOpen} isActive={isActive} />

      <SidebarFooter isSidebarOpen={isSidebarOpen} onLogout={onLogout} />
    </aside>
  );
}
