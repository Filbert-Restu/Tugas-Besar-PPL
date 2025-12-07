"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      children: [],
    },
    {
      label: "Dashboard Analytics",
      href: "#",
      icon: "📈",
      children: [
        { label: "Active Sellers", href: "/dashboard/active_sellers" },
        { label: "Location Sellers", href: "/dashboard/location_sellers" },
        { label: "Product Rating", href: "/dashboard/bintang_products" },
        { label: "Verification", href: "/dashboard/verif_sellers" },
      ],
    },
    {
      label: "Management",
      href: "#",
      icon: "⚙️",
      children: [
        { label: "Sellers", href: "/dashboard/sellers" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Categories", href: "/dashboard/categories" },
      ],
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-6 border-b border-blue-700 flex items-center justify-between">
        {isOpen && (
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-xs text-blue-200">MarketPlace</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children.length === 0 ? (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
                  isActive(item.href)
                    ? "bg-blue-600 shadow-md"
                    : "hover:bg-blue-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            ) : (
              <details className="group">
                <summary
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all hover:bg-blue-700 ${
                    item.children.some((child) => isActive(child.href))
                      ? "bg-blue-600"
                      : ""
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1">
                        {item.label}
                      </span>
                      <span className="group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </>
                  )}
                </summary>
                {isOpen && (
                  <div className="bg-blue-800 bg-opacity-50 mt-1 mx-2 rounded-lg overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-6 py-2 text-sm transition-all ${
                          isActive(child.href)
                            ? "bg-yellow-500 text-blue-900 font-semibold"
                            : "text-blue-100 hover:text-white hover:bg-blue-700"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </details>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-blue-700 bg-blue-900">
          <div className="flex items-center gap-2 p-2 bg-blue-800 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-xs font-semibold">Admin</p>
              <p className="text-xs text-blue-200">admin@market.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
