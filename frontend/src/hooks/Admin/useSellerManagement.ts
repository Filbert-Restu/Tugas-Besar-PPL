import { useState, useEffect } from 'react';
import {
  sellerVerificationService,
  SellerBasicInfo,
  SellerDetailInfo,
} from '@/services/sellerVerificationService';

type FilterType = 'all' | 'pending' | 'verified' | 'rejected';

export function useSellerManagement() {
  const [sellers, setSellers] = useState<SellerBasicInfo[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<SellerBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<SellerDetailInfo | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sellerToReject, setSellerToReject] = useState<number | null>(null);
  const [sellerToUpdate, setSellerToUpdate] = useState<{
    userId: number;
    currentStatus: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState<
    'pending' | 'verified' | 'rejected'
  >('pending');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [sellers, activeFilter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sellerVerificationService.getSellers();
      setSellers(response.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            'Gagal memuat daftar penjual. Silakan coba lagi.';
      console.error('Error fetching sellers:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    if (activeFilter === 'all') {
      setFilteredSellers(sellers);
    } else {
      setFilteredSellers(
        sellers.filter((seller) => seller.status === activeFilter)
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Menunggu',
      verified: 'Disetujui',
      rejected: 'Ditolak',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return sellers.length;
    return sellers.filter((s) => s.status === filter).length;
  };

  const handleViewDetail = async (userId: number) => {
    try {
      setActionLoading(true);
      const response = await sellerVerificationService.getSellerDetail(userId);
      setSelectedSeller(response.data);
      setShowDetailModal(true);
    } catch (err: unknown) {
      console.error('Error fetching seller detail:', err);
      alert('Gagal memuat detail penjual');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (userId: number, namaToko: string) => {
    if (!confirm(`Apakah Anda yakin ingin menyetujui toko "${namaToko}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await sellerVerificationService.approveSeller(userId);
      alert('Penjual berhasil diverifikasi! Email notifikasi telah dikirim.');
      setShowDetailModal(false);
      fetchSellers();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Gagal menyetujui penjual';
      console.error('Error approving seller:', err);
      alert(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (userId: number) => {
    setSellerToReject(userId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!sellerToReject) return;

    try {
      setActionLoading(true);
      await sellerVerificationService.rejectSeller(
        sellerToReject,
        rejectReason
      );
      alert('Penjual berhasil ditolak! Email notifikasi telah dikirim.');
      setShowRejectModal(false);
      setShowDetailModal(false);
      fetchSellers();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Gagal menolak penjual';
      console.error('Error rejecting seller:', err);
      alert(errorMessage);
    } finally {
      setActionLoading(false);
      setSellerToReject(null);
    }
  };

  const handleStatusChangeClick = (userId: number, currentStatus: string) => {
    setSellerToUpdate({ userId, currentStatus });
    setNewStatus('pending');
    setShowStatusModal(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (!sellerToUpdate) return;

    try {
      setActionLoading(true);
      await sellerVerificationService.updateSellerStatus(
        sellerToUpdate.userId,
        newStatus,
        rejectReason
      );
      alert(`Status penjual berhasil diubah menjadi ${newStatus}!`);
      setShowStatusModal(false);
      setShowDetailModal(false);
      setRejectReason('');
      fetchSellers();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Gagal mengubah status penjual';
      console.error('Error updating seller status:', err);
      alert(errorMessage);
    } finally {
      setActionLoading(false);
      setSellerToUpdate(null);
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return `http://localhost:8000/storage/${path}`;
  };

  return {
    sellers,
    filteredSellers,
    loading,
    error,
    selectedSeller,
    showDetailModal,
    actionLoading,
    rejectReason,
    showRejectModal,
    showStatusModal,
    newStatus,
    activeFilter,
    setActiveFilter,
    setShowDetailModal,
    setRejectReason,
    setShowRejectModal,
    setShowStatusModal,
    setNewStatus,
    fetchSellers,
    getStatusBadge,
    getStatusLabel,
    getFilterCount,
    handleViewDetail,
    handleApprove,
    handleRejectClick,
    handleRejectConfirm,
    handleStatusChangeClick,
    handleStatusChangeConfirm,
    getImageUrl,
  };
}
