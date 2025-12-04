import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <div className='relative'>
        <input
          className={`w-full ${
            icon ? 'pl-10' : 'px-4'
          } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          {...props}
        />
        {icon && <div className='absolute left-3 top-2.5'>{icon}</div>}
      </div>
    </div>
  );
}
