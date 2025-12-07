import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  valueColor = 'text-gray-900',
}: StatCardProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-600'>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
          {subtitle && <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
