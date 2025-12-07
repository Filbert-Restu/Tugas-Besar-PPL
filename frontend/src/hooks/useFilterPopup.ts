import { useState } from 'react';
import { ProductFilters } from '@/types/filters';
import {
  handleResetFilters,
  handleApplyFilters,
} from '@/components/Filter/filterHandlers';

interface UseFilterPopupProps {
  filters: ProductFilters;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleSearch: () => void;
  handleFilterChange: (
    key: keyof ProductFilters,
    value: string | number
  ) => void;
  onClose: () => void;
}

export const useFilterPopup = ({
  filters,
  setCurrentPage,
  handleSearch,
  handleFilterChange,
  onClose,
}: UseFilterPopupProps) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleTempFilterChange = (
    key: keyof typeof tempFilters,
    value: string | number
  ) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    handleResetFilters(setTempFilters, setCurrentPage);
  };

  const handleApply = () => {
    // Apply temporary filters to actual filters
    Object.keys(tempFilters).forEach((key) => {
      const filterKey = key as keyof typeof tempFilters;
      handleFilterChange(filterKey, tempFilters[filterKey]);
    });
    handleApplyFilters(handleSearch, onClose);
  };

  return {
    tempFilters,
    setTempFilters,
    handleTempFilterChange,
    handleReset,
    handleApply,
  };
};
