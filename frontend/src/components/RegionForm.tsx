'use client';

import { useRegionalData } from '@/hooks/useRegionalData';

export default function RegionForm() {
  const {
    provinces,
    cities,
    districts,
    villages,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    setSelectedVillage,
  } = useRegionalData();

  return (
    <div className='space-y-4 p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto border'>
      <h2 className='text-xl font-bold mb-4'>Pilih Wilayah</h2>

      {/* Dropdown Provinsi */}
      <select
        className='w-full p-2 border rounded'
        value={selectedProvince}
        onChange={(e) => handleProvinceChange(e.target.value)}
      >
        <option value=''>Pilih Provinsi</option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Dropdown Kota/Kabupaten */}
      <select
        className='w-full p-2 border rounded'
        value={selectedCity}
        onChange={(e) => handleCityChange(e.target.value)}
        disabled={!selectedProvince}
      >
        <option value=''>Pilih Kota/Kabupaten</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Dropdown Kecamatan */}
      <select
        className='w-full p-2 border rounded'
        value={selectedDistrict}
        onChange={(e) => handleDistrictChange(e.target.value)}
        disabled={!selectedCity}
      >
        <option value=''>Pilih Kecamatan</option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Dropdown Desa/Kelurahan */}
      <select
        className='w-full p-2 border rounded'
        value={selectedVillage}
        onChange={(e) => setSelectedVillage(e.target.value)}
        disabled={!selectedDistrict}
      >
        <option value=''>Pilih Desa/Kelurahan</option>
        {villages.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      {/* Hasil Pilihan (Opsional) */}
      <div className='mt-4 p-3 bg-gray-50 text-sm rounded'>
        <p>
          Desa ID Terpilih: <b>{selectedVillage || '-'}</b>
        </p>
      </div>
    </div>
  );
}
