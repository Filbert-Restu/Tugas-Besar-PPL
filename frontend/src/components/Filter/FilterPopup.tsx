import { FiltersBarProps } from '@/types/filters';
import Input from '../Input';
import Select from '../Select';
import { useRegionFilters } from '@/hooks/useRegionFilters';
import { useFilterPopup } from '@/hooks/useFilterPopup';

interface FilterPopupProps {
  filters: FiltersBarProps['filters'];
  categories: FiltersBarProps['categories'];
  setFilters: FiltersBarProps['setFilters'];
  setCurrentPage: FiltersBarProps['setCurrentPage'];
  handleSearch: FiltersBarProps['handleSearch'];
  handleFilterChange: FiltersBarProps['handleFilterChange'];
  onClose: () => void;
}

export default function FilterPopup({
  filters,
  categories,
  setCurrentPage,
  handleSearch,
  handleFilterChange,
  onClose,
}: FilterPopupProps) {
  const {
    tempFilters,
    setTempFilters,
    handleTempFilterChange,
    handleReset,
    handleApply,
  } = useFilterPopup({
    filters,
    setCurrentPage,
    handleSearch,
    handleFilterChange,
    onClose,
  });

  const {
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingVillages,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange,
    provinceOptions,
    cityOptions,
    districtOptions,
    villageOptions,
  } = useRegionFilters({
    filters: tempFilters,
    setFilters: setTempFilters,
    setCurrentPage,
  });

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: `${cat.nama_kategori} (${cat.produk_count})`,
    })),
  ];

  const sortOptions = [
    { value: 'created_at-desc', label: 'Terbaru' },
    { value: 'harga_produk-asc', label: 'Harga Terendah' },
    { value: 'harga_produk-desc', label: 'Harga Tertinggi' },
    { value: 'nama_produk-asc', label: 'Nama (A-Z)' },
    { value: 'terjual-desc', label: 'Terlaris' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-40' onClick={onClose} />

      {/* Popup Content */}
      <div className='absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Filter Produk
            </h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='space-y-4'>
            {/* Nama Toko */}
            <Input
              label='Nama Toko'
              type='text'
              value={tempFilters.toko}
              onChange={(e) => handleTempFilterChange('toko', e.target.value)}
              placeholder='Cari nama toko...'
            />

            {/* Kategori */}
            <Select
              label='Kategori'
              value={tempFilters.kategori_id}
              onChange={(e) =>
                handleTempFilterChange('kategori_id', e.target.value)
              }
              options={categoryOptions}
            />

            {/* Urutkan */}
            <Select
              label='Urutkan'
              value={`${tempFilters.sort_by}-${tempFilters.sort_order}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setTempFilters((prev) => ({
                  ...prev,
                  sort_by: sortBy,
                  sort_order: sortOrder,
                }));
                setCurrentPage(1);
              }}
              options={sortOptions}
            />

            {/* Divider */}
            <div className='border-t border-gray-200 pt-4'>
              <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                Lokasi
              </h4>

              {/* Provinsi */}
              <div className='mb-3'>
                <Select
                  label='Provinsi'
                  value={tempFilters.provinsi_id}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  options={provinceOptions}
                  disabled={loadingProvinces}
                />
              </div>

              {/* Kabupaten/Kota */}
              <div className='mb-3'>
                <Select
                  label='Kabupaten/Kota'
                  value={tempFilters.kota_id}
                  onChange={(e) => handleCityChange(e.target.value)}
                  options={cityOptions}
                  disabled={!tempFilters.provinsi_id || loadingCities}
                />
              </div>

              {/* Kecamatan */}
              <div className='mb-3'>
                <Select
                  label='Kecamatan'
                  value={tempFilters.kecamatan_id}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  options={districtOptions}
                  disabled={!tempFilters.kota_id || loadingDistricts}
                />
              </div>

              {/* Kelurahan */}
              <div>
                <Select
                  label='Kelurahan'
                  value={tempFilters.kelurahan_id}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  options={villageOptions}
                  disabled={!tempFilters.kecamatan_id || loadingVillages}
                />
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200 pt-4'>
              <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                Rentang Harga
              </h4>

              {/* Harga Minimal */}
              <div className='mb-3'>
                <Input
                  label='Harga Minimal'
                  type='number'
                  value={tempFilters.harga_min}
                  onChange={(e) =>
                    handleTempFilterChange('harga_min', e.target.value)
                  }
                  placeholder='Harga minimal'
                />
              </div>

              {/* Harga Maksimal */}
              <div>
                <Input
                  label='Harga Maksimal'
                  type='number'
                  value={tempFilters.harga_max}
                  onChange={(e) =>
                    handleTempFilterChange('harga_max', e.target.value)
                  }
                  placeholder='Harga maksimal'
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 pt-4 border-t border-gray-200'>
              <button
                onClick={handleReset}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
