import React, { useEffect, useState } from 'react';
import { FiltersBarProps } from '@/types/filters';
import Input from './Input';
import Select from './Select';
import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
  Region,
} from '@/services/regionService';

export default function FiltersBar({
  filters,
  categories,
  setFilters,
  setCurrentPage,
  handleSearch,
  handleFilterChange,
}: FiltersBarProps) {
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!filters.provinsi_id) {
        setCities([]);
        return;
      }
      try {
        setLoadingCities(true);
        const data = await getCities(filters.provinsi_id);
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [filters.provinsi_id]);

  // Load districts when city changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!filters.kota_id) {
        setDistricts([]);
        return;
      }
      try {
        setLoadingDistricts(true);
        const data = await getDistricts(filters.kota_id);
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [filters.kota_id]);

  // Load villages when district changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (!filters.kecamatan_id) {
        setVillages([]);
        return;
      }
      try {
        setLoadingVillages(true);
        const data = await getVillages(filters.kecamatan_id);
        setVillages(data);
      } catch (error) {
        console.error('Error fetching villages:', error);
        setVillages([]);
      } finally {
        setLoadingVillages(false);
      }
    };
    fetchVillages();
  }, [filters.kecamatan_id]);

  const handleProvinceChange = (provinceId: string) => {
    const province = provinces.find((p) => p.id === provinceId);
    setFilters((prev) => ({
      ...prev,
      provinsi_id: provinceId,
      provinsi: province?.name || '',
      kota_id: '', // Reset city when province changes
      kota: '',
      kecamatan_id: '', // Reset district
      kecamatan: '',
      kelurahan_id: '', // Reset village
      kelurahan: '',
    }));
    setCurrentPage(1);
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    setFilters((prev) => ({
      ...prev,
      kota_id: cityId,
      kota: city?.name || '',
      kecamatan_id: '', // Reset district when city changes
      kecamatan: '',
      kelurahan_id: '', // Reset village
      kelurahan: '',
    }));
    setCurrentPage(1);
  };

  const handleDistrictChange = (districtId: string) => {
    const district = districts.find((d) => d.id === districtId);
    setFilters((prev) => ({
      ...prev,
      kecamatan_id: districtId,
      kecamatan: district?.name || '',
      kelurahan_id: '', // Reset village when district changes
      kelurahan: '',
    }));
    setCurrentPage(1);
  };

  const handleVillageChange = (villageId: string) => {
    const village = villages.find((v) => v.id === villageId);
    setFilters((prev) => ({
      ...prev,
      kelurahan_id: villageId,
      kelurahan: village?.name || '',
    }));
    setCurrentPage(1);
  };

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: `${cat.nama_kategori} (${cat.produk_count})`,
    })),
  ];

  const provinceOptions = [
    { value: '', label: loadingProvinces ? 'Memuat...' : 'Semua Provinsi' },
    ...provinces.map((prov) => ({
      value: prov.id,
      label: prov.name,
    })),
  ];

  const cityOptions = [
    {
      value: '',
      label: loadingCities
        ? 'Memuat...'
        : filters.provinsi_id
        ? 'Semua Kota'
        : 'Pilih Provinsi Dulu',
    },
    ...cities.map((city) => ({
      value: city.id,
      label: city.name,
    })),
  ];

  const districtOptions = [
    {
      value: '',
      label: loadingDistricts
        ? 'Memuat...'
        : filters.kota_id
        ? 'Semua Kecamatan'
        : 'Pilih Kota Dulu',
    },
    ...districts.map((district) => ({
      value: district.id,
      label: district.name,
    })),
  ];

  const villageOptions = [
    {
      value: '',
      label: loadingVillages
        ? 'Memuat...'
        : filters.kecamatan_id
        ? 'Semua Kelurahan'
        : 'Pilih Kecamatan Dulu',
    },
    ...villages.map((village) => ({
      value: village.id,
      label: village.name,
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
    <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <Input
          label='Cari Produk'
          type='text'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='Cari nama produk...'
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

        <Input
          label='Nama Toko'
          type='text'
          value={filters.toko}
          onChange={(e) => handleFilterChange('toko', e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='Cari nama toko...'
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
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
          }
        />

        <Select
          label='Kategori'
          value={filters.kategori_id}
          onChange={(e) => handleFilterChange('kategori_id', e.target.value)}
          options={categoryOptions}
        />
        <Select
          label='Urutkan'
          value={`${filters.sort_by}-${filters.sort_order}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters((prev) => ({
              ...prev,
              sort_by: sortBy,
              sort_order: sortOrder,
            }));
            setCurrentPage(1);
          }}
          options={sortOptions}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <Select
          label='Provinsi'
          value={filters.provinsi_id}
          onChange={(e) => handleProvinceChange(e.target.value)}
          options={provinceOptions}
          disabled={loadingProvinces}
        />

        <Select
          label='Kabupaten/Kota'
          value={filters.kota_id}
          onChange={(e) => handleCityChange(e.target.value)}
          options={cityOptions}
          disabled={!filters.provinsi_id || loadingCities}
        />

        <Select
          label='Kecamatan'
          value={filters.kecamatan_id}
          onChange={(e) => handleDistrictChange(e.target.value)}
          options={districtOptions}
          disabled={!filters.kota_id || loadingDistricts}
        />

        <Select
          label='Kelurahan'
          value={filters.kelurahan_id}
          onChange={(e) => handleVillageChange(e.target.value)}
          options={villageOptions}
          disabled={!filters.kecamatan_id || loadingVillages}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Input
          label='Harga Minimal'
          type='number'
          value={filters.harga_min}
          onChange={(e) => handleFilterChange('harga_min', e.target.value)}
          placeholder='Harga minimal'
        />

        <Input
          label='Harga Maksimal'
          type='number'
          value={filters.harga_max}
          onChange={(e) => handleFilterChange('harga_max', e.target.value)}
          placeholder='Harga maksimal'
        />
      </div>
    </div>
  );
}
