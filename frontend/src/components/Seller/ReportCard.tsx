import React from 'react';
import { Button } from '@/components/Button';

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onDownload: (id: string) => void;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return {
        iconClass: 'report-icon-blue',
        buttonClass: 'report-btn-blue',
      };
    case 'yellow':
      return {
        iconClass: 'report-icon-yellow',
        buttonClass: 'report-btn-yellow',
      };
    case 'red':
      return {
        iconClass: 'report-icon-red',
        buttonClass: 'report-btn-red',
      };
    default:
      return {
        iconClass: 'bg-gray-100 text-gray-600',
        buttonClass: 'bg-gray-600 hover:bg-gray-700',
      };
  }
};

export default function ReportCard({
  id,
  title,
  description,
  icon,
  color,
  onDownload,
}: ReportCardProps) {
  const colors = getColorClasses(color);

  return (
    <div className='report-card group'>
      <div className='relative overflow-hidden h-full'>
        {/* Decorative Background Pattern */}
        <div className='absolute top-0 right-0 w-32 h-32 opacity-5'>
          <div
            className={`${colors.iconClass} w-full h-full rounded-full blur-2xl`}
          ></div>
        </div>

        <div className='relative p-6 h-full flex flex-col'>
          {/* Icon and Title Row - Fixed Height */}
          <div className='flex items-start gap-4 mb-4 h-[72px]'>
            <div
              className={`${colors.iconClass} w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
            >
              {icon}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2'>
                {title}
              </h3>
              <div
                className={`h-1 w-12 rounded-full ${colors.iconClass} opacity-60`}
              ></div>
            </div>
          </div>

          {/* Description - Fixed Height */}
          <p className='text-sm text-gray-600 leading-relaxed mb-6 h-[80px] overflow-hidden'>
            {description}
          </p>

          {/* Download Button - Push to bottom */}
          <div className='mt-auto'>
            <Button
              onClick={() => onDownload(id)}
              className={`w-full ${colors.buttonClass} text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3`}
            >
              <span>Download PDF</span>
              <svg
                className='w-5 h-5 group-hover:translate-y-0.5 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
