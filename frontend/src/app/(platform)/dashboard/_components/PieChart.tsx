'use client';

import React from 'react';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const slices = data.reduce((acc, item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const prevAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -90;
    const startAngle = prevAngle;
    const endAngle = prevAngle + angle;

    const color = item.color || colors[index % colors.length];

    acc.push({
      ...item,
      percentage,
      startAngle,
      endAngle,
      color,
    });

    return acc;
  }, [] as Array<{
    label: string;
    value: number;
    percentage: number;
    startAngle: number;
    endAngle: number;
    color: string;
  }>);

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      x,
      y,
      'Z',
    ].join(' ');
  };

  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48"
          style={{ transform: 'rotate(0deg)' }}
        >
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={describeArc(
                  centerX,
                  centerY,
                  radius,
                  slice.startAngle,
                  slice.endAngle
                )}
                fill={slice.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            </g>
          ))}
          <circle cx={centerX} cy={centerY} r="50" fill="white" />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dy=".3em"
            className="text-2xl font-bold fill-gray-900"
          >
            {total}
          </text>
        </svg>

        <div className="flex-1 space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-4 h-4 rounded-sm shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-700 truncate">
                  {slice.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {slice.value}
                </span>
                <span className="text-xs text-gray-500">
                  ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
