'use client';

import React from 'react';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title: string;
  height?: number;
}

export function BarChart({ data, title, height = 300 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || colors[index % colors.length];

          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-32 text-sm text-gray-700 font-medium truncate">
                {item.label}
              </div>
              <div className="flex-1 relative">
                <div className="h-8 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  >
                    {percentage > 15 && (
                      <span className="text-white text-xs font-semibold">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
                {percentage <= 15 && (
                  <span className="absolute left-2 top-1 text-gray-700 text-xs font-semibold">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
