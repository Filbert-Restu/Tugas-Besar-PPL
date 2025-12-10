import React from 'react';
import Link from 'next/link';
import { adminMenuItems } from '@/constants/adminMenuItems';

interface AdminSidebarNavigationProps {
  isSidebarOpen: boolean;
  isActive: (href: string) => boolean;
}

export default function AdminSidebarNavigation({
  isSidebarOpen,
  isActive,
}: AdminSidebarNavigationProps) {
  return (
    <nav className='flex-1 overflow-y-auto py-4'>
      <ul className='space-y-2 px-3'>
        {adminMenuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={!isSidebarOpen ? item.title : undefined}
            >
              {item.icon}
              {isSidebarOpen && (
                <span className='font-medium'>{item.title}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
