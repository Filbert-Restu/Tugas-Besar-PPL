import { useState, useEffect } from 'react';
import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
  Region,
} from '@/services/regionService';

export function useRegionalData() {
  // State untuk menyimpan data list
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  // State untuk menyimpan pilihan user
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  // 1. Load Provinsi saat pertama kali
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  // 2. Handler saat Provinsi dipilih
  const handleProvinceChange = async (id: string) => {
    setSelectedProvince(id);
    // Reset pilihan di bawahnya
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setCities([]);
    setDistricts([]);
    setVillages([]);

    if (id) {
      const data = await getCities(id);
      setCities(data);
    }
  };

  // 3. Handler saat Kota dipilih
  const handleCityChange = async (id: string) => {
    setSelectedCity(id);
    setSelectedDistrict('');
    setSelectedVillage('');
    setDistricts([]);
    setVillages([]);

    if (id) {
      const data = await getDistricts(id);
      setDistricts(data);
    }
  };

  // 4. Handler saat Kecamatan dipilih
  const handleDistrictChange = async (id: string) => {
    setSelectedDistrict(id);
    setSelectedVillage('');
    setVillages([]);

    if (id) {
      const data = await getVillages(id);
      setVillages(data);
    }
  };

  return {
    // Data List
    provinces,
    cities,
    districts,
    villages,
    // Selected Values
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    setSelectedVillage, // Desa tidak butuh handler khusus, cukup setter biasa
    // Handlers
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
  };
}
