"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import { ISeller } from "@/types/verification";

export default function ActiveSellerPage() {
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchActiveSellers(currentPage);
  }, [currentPage]);

  const fetchActiveSellers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/api/admin/sellers", {
        params: {
          page,
          status: "verified",
        },
      });

      const activeSellers = response.data.data.filter(
        (seller: ISeller) => seller.status === "verified"
      );
      setSellers(activeSellers);

      if (response.data.pagination) {
        setTotalPages(response.data.pagination.last_page);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching active sellers:", err);

      if (error.response?.status === 404) {
        setError(
          "Endpoint tidak ditemukan. Pastikan backend berjalan di http://localhost:8000"
        );
      } else if (error.response?.status === 401) {
        setError(
          "Tidak terautentikasi. Silakan login sebagai admin terlebih dahulu."
        );
      } else {
        setError(
          error.response?.data?.message || "Gagal memuat data penjual aktif"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (typeof window === "undefined") return;

    try {
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Title
      pdf.setFontSize(16);
      pdf.text("Laporan Penjual Aktif", 15, yPosition);
      yPosition += 10;

      // Date
      pdf.setFontSize(10);
      pdf.text(
        `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
        15,
        yPosition
      );
      yPosition += 8;

      // Summary
      pdf.text(`Total Penjual Aktif: ${filteredSellers.length}`, 15, yPosition);
      yPosition += 10;

      // Table header
      pdf.setFont("helvetica", "bold");
      const columns = ["No", "Nama Toko", "Pemilik", "Email", "Telepon", "Terdaftar"];
      const columnWidths = [10, 50, 40, 60, 35, 30];
      let xPosition = 10;

      columns.forEach((col, idx) => {
        pdf.text(col, xPosition, yPosition);
        xPosition += columnWidths[idx];
      });

      yPosition += 7;

      // Table rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      filteredSellers.forEach((seller, index) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 15;

          // Re-add header
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          xPosition = 10;
          columns.forEach((col, idx) => {
            pdf.text(col, xPosition, yPosition);
            xPosition += columnWidths[idx];
          });
          yPosition += 7;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
        }

        xPosition = 10;

        const rowData = [
          (index + 1).toString(),
          seller.nama_toko.substring(0, 30),
          seller.name.substring(0, 25),
          seller.email.substring(0, 35),
          seller.nomor_telepon,
          new Date(seller.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        ];

        rowData.forEach((data, idx) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += columnWidths[idx];
        });

        yPosition += 6;
      });

      pdf.save(
        `Laporan-Penjual-Aktif-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Gagal mengekspor PDF. Silakan coba lagi.");
    }
  };

  const handleViewDetail = (seller: ISeller) => {
    setSelectedSeller(seller);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSeller(null);
  };

  const filteredSellers = sellers.filter((seller) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      seller.nama_toko.toLowerCase().includes(searchLower) ||
      seller.email.toLowerCase().includes(searchLower) ||
      seller.name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data penjual aktif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Penjual Aktif
              </h1>
              <p className="text-gray-600 mt-2">
                Daftar toko yang telah terverifikasi dan aktif
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </button>
              <Link href="/dashboard">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari nama toko, email, atau nama pemilik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600">Total Penjual Aktif</p>
              <p className="text-2xl font-bold text-blue-900">
                {sellers.length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">Status</p>
              <p className="text-lg font-semibold text-green-900">
                Terverifikasi
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-600">Hasil Pencarian</p>
              <p className="text-2xl font-bold text-purple-900">
                {filteredSellers.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-semibold">Error:</div>
            <p>{error}</p>
          </div>
        )}

        {/* Sellers List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredSellers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-gray-600 font-medium">
                Tidak ada penjual aktif yang ditemukan
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Hapus filter pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Toko
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pemilik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terdaftar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.nama_toko}
                        </div>
                        {seller.deskripsi_singkat && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {seller.deskripsi_singkat}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{seller.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{seller.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {seller.nomor_telepon}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {new Date(seller.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(seller)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Penjual Aktif
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                  Terverifikasi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Nama Toko</p>
                  <p className="text-lg text-gray-900 font-semibold mt-1">
                    {selectedSeller.nama_toko}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Nama Pemilik
                  </p>
                  <p className="text-lg text-gray-900 font-semibold mt-1">
                    {selectedSeller.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-lg text-gray-900 mt-1">
                    {selectedSeller.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Nomor Telepon
                  </p>
                  <p className="text-lg text-gray-900 mt-1">
                    {selectedSeller.nomor_telepon}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">No. KTP</p>
                  <p className="text-lg text-gray-900 mt-1">
                    {selectedSeller.no_ktp}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Terdaftar Sejak
                  </p>
                  <p className="text-lg text-gray-900 mt-1">
                    {new Date(selectedSeller.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {selectedSeller.deskripsi_singkat && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium">
                    Deskripsi Singkat
                  </p>
                  <p className="text-gray-900 mt-2 leading-relaxed">
                    {selectedSeller.deskripsi_singkat}
                  </p>
                </div>
              )}

              {selectedSeller.detail_alamat && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium">
                    Alamat Detail
                  </p>
                  <div className="text-gray-900 mt-2 space-y-1">
                    <p>{selectedSeller.detail_alamat}</p>
                    {selectedSeller.RT && selectedSeller.RW && (
                      <p>
                        RT {selectedSeller.RT} / RW {selectedSeller.RW}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border-t px-6 py-4">
              <button
                onClick={handleCloseModal}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}