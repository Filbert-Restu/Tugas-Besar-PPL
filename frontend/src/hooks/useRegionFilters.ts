import { useState, useEffect } from 'react';
import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
  Region,
} from '@/services/regionService';
import { ProductFilters } from '@/types/filters';

interface UseRegionFiltersProps {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  setCurrentPage: (page: number) => void;
}

export function useRegionFilters({
  filters,
  setFilters,
  setCurrentPage,
}: UseRegionFiltersProps) {
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
      kota_id: '',
      kota: '',
      kecamatan_id: '',
      kecamatan: '',
      kelurahan_id: '',
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
      kecamatan_id: '',
      kecamatan: '',
      kelurahan_id: '',
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
      kelurahan_id: '',
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

  return {
    // Data
    provinces,
    cities,
    districts,
    villages,

    // Loading states
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingVillages,

    // Handlers
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange,

    // Options
    provinceOptions,
    cityOptions,
    districtOptions,
    villageOptions,
  };
}
