import { IKategori } from './product';

export interface ProductFilters {
  search: string;
  kategori_id: string;
  toko: string;
  provinsi_id: string;
  kota_id: string;
  kecamatan_id: string;
  kelurahan_id: string;
  provinsi: string; // for display/search
  kota: string; // for display/search
  kecamatan: string; // for display/search
  kelurahan: string; // for display/search
  harga_min: string;
  harga_max: string;
  sort_by: string;
  sort_order: string;
  per_page: number;
}

export interface FiltersBarProps {
  filters: ProductFilters;
  categories: IKategori[];
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleSearch: () => void;
  handleFilterChange: (
    key: keyof ProductFilters,
    value: string | number
  ) => void;
}
