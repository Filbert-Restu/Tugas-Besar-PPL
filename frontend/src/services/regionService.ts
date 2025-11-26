import api from '@/lib/apiRegion';

// Tipe data dasar
export interface Region {
  id: string;
  name: string;
}

export const getProvinces = async (): Promise<Region[]> => {
  const res = await api.get('/provinces');
  return res.data.data;
};

export const getCities = async (provinceId: string): Promise<Region[]> => {
  const res = await api.get(`/cities/${provinceId}`);
  return res.data.data;
};

export const getDistricts = async (cityId: string): Promise<Region[]> => {
  const res = await api.get(`/districts/${cityId}`);
  return res.data.data;
};

export const getVillages = async (districtId: string): Promise<Region[]> => {
  const res = await api.get(`/villages/${districtId}`);
  return res.data.data;
};
