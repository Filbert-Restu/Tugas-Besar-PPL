import { ProductFilters } from '@/types/filters';

export const handleResetFilters = (
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  setFilters({
    search: '',
    toko: '',
    kategori_id: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    provinsi_id: '',
    kota_id: '',
    kecamatan_id: '',
    kelurahan_id: '',
    provinsi: '',
    kota: '',
    kecamatan: '',
    kelurahan: '',
    harga_min: '',
    harga_max: '',
    per_page: 12,
  });
  setCurrentPage(1);
};

export const handleApplyFilters = (
  handleSearch: () => void,
  onClose: () => void
) => {
  handleSearch();
  onClose();
};
