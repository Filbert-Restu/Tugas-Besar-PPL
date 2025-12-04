import { useState, useEffect } from 'react';
import { IPublicProduct, IKategori } from '@/types/product';
import { ProductFilters } from '@/types/filters';
import apiClient from '@/lib/apiClient';

export function useProducts() {
  const [products, setProducts] = useState<IPublicProduct[]>([]);
  const [categories, setCategories] = useState<IKategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    kategori_id: '',
    toko: '',
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
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 20,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('api/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.kategori_id)
          params.append('kategori_id', filters.kategori_id);
        if (filters.toko) params.append('toko', filters.toko);
        if (filters.provinsi) params.append('provinsi', filters.provinsi);
        if (filters.kota) params.append('kota', filters.kota);
        if (filters.kecamatan) params.append('kecamatan', filters.kecamatan);
        if (filters.kelurahan) params.append('kelurahan', filters.kelurahan);
        if (filters.harga_min) params.append('harga_min', filters.harga_min);
        if (filters.harga_max) params.append('harga_max', filters.harga_max);
        params.append('sort_by', filters.sort_by);
        params.append('sort_order', filters.sort_order);
        params.append('per_page', filters.per_page.toString());
        params.append('page', currentPage.toString());

        const response = await apiClient.get(`api/?${params.toString()}`);
        setProducts(response.data.data || []);
        setTotalPages(response.data.meta?.last_page || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    products,
    categories,
    loading,
    loadingProducts,
    currentPage,
    totalPages,
    filters,
    setCurrentPage,
    setFilters,
    handleSearch,
    handleFilterChange,
  };
}
