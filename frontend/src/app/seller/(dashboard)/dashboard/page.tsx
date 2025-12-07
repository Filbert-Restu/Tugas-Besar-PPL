'use client';
import StatsGrid from '@/components/Seller/Dashboard/StatsGrid';
import StockDistributionChart from '@/components/Seller/Dashboard/StockDistributionChart';
import RatingDistributionChart from '@/components/Seller/Dashboard/RatingDistributionChart';
import ReviewersByProvinceChart from '@/components/Seller/Dashboard/ReviewersByProvinceChart';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useDashboardData } from '@/hooks/Admin/useDashboardData';

export default function SellerDashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingState message='Memuat data...' />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'Terjadi kesalahan'} />;
  }

  const {
    summary,
    stock_distribution,
    rating_distribution,
    reviewers_by_province,
  } = data;

  // Get max values for scaling
  const maxStock = Math.max(...stock_distribution.map((p) => p.stock), 1);
  const maxReviews = Math.max(
    ...reviewers_by_province.map((r) => r.total_reviews),
    1
  );

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <StatsGrid summary={summary} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Stock Distribution Chart */}
        <StockDistributionChart data={stock_distribution} maxStock={maxStock} />

        {/* Rating Distribution Chart */}
        <RatingDistributionChart data={rating_distribution} />
      </div>

      {/* Reviewers by Province */}
      <ReviewersByProvinceChart
        data={reviewers_by_province}
        maxReviews={maxReviews}
      />
    </div>
  );
}
