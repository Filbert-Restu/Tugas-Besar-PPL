import { useState, useEffect } from 'react';
import {
  productService,
  ProductDetailResponse,
} from '@/services/productService';

interface UseProductDetailProps {
  shopSlug: string;
  productSlug: string;
}

interface UseProductDetailReturn {
  product: ProductDetailResponse | null;
  loading: boolean;
  error: string | null;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  handleChatSeller: () => void;
}

export function useProductDetail({
  shopSlug,
  productSlug,
}: UseProductDetailProps): UseProductDetailReturn {
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductDetail(
          shopSlug,
          productSlug
        );
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, shopSlug]);

  const handleAddToCart = () => {
    // TODO: Implement actual add to cart logic
    alert(`Menambahkan ${quantity} item ke keranjang`);
  };

  const handleBuyNow = () => {
    // TODO: Implement actual buy now logic
    alert(`Membeli ${quantity} item sekarang`);
  };

  const handleChatSeller = () => {
    // TODO: Implement actual chat logic
    alert('Membuka chat dengan penjual');
  };

  return {
    product,
    loading,
    error,
    quantity,
    setQuantity,
    handleAddToCart,
    handleBuyNow,
    handleChatSeller,
  };
}
