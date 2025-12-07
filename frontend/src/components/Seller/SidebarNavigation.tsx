import React from 'react';
import Link from 'next/link';
import { menuItems } from '@/constants/menuItems';

interface SidebarNavigationProps {
  isSidebarOpen: boolean;
  isActive: (href: string) => boolean;
}

export default function SidebarNavigation({
  isSidebarOpen,
  isActive,
}: SidebarNavigationProps) {
  return (
    <nav className='flex-1 overflow-y-auto py-4'>
      <ul className='space-y-2 px-3'>
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-50 hover:bg-blue-700 hover:text-white'
              }`}
              title={!isSidebarOpen ? item.title : undefined}
            >
              {item.icon}
              {isSidebarOpen && (
                <span className='font-medium text-sm'>{item.title}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
