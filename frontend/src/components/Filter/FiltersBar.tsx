import { FiltersBarProps } from '@/types/filters';
import { useState } from 'react';
import Input from '../Input';
import FilterPopup from './FilterPopup';

export default function FiltersBar({
  filters,
  categories,
  setFilters,
  setCurrentPage,
  handleSearch,
  handleFilterChange,
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
      <div className='flex gap-3'>
        {/* Search Bar - Dominan */}
        <div className='flex-1'>
          <Input
            label=''
            type='text'
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Cari produk atau toko...'
            icon={
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            }
          />
        </div>

        {/* Filter Button */}
        <div className='relative'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='h-full px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
              />
            </svg>
            <span className='font-medium'>Filter</span>
          </button>

          {/* Filter Popup */}
          {showFilters && (
            <FilterPopup
              filters={filters}
              categories={categories}
              setFilters={setFilters}
              setCurrentPage={setCurrentPage}
              handleSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
