"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";

interface ProvinceData {
  province: string;
  count: number;
  activeCount: number;
  inactiveCount: number;
}

export default function LocationSellerPage() {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<"total" | "active">("total");

  useEffect(() => {
    fetchSellersByProvince();
  }, []);

  const fetchSellersByProvince = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(
        "/api/admin/dashboard/sellers-by-province"
      );
      setProvinces(response.data.data || []);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching sellers by province:", err);

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
          error.response?.data?.message ||
            "Gagal memuat data penjual per provinsi"
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
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Title
      pdf.setFontSize(16);
      pdf.text("Laporan Sebaran Penjual per Provinsi", 15, yPosition);
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
      pdf.text(`Total Provinsi: ${sortedProvinces.length}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Total Penjual: ${totalSellers}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Total Aktif: ${totalActive}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Total Tidak Aktif: ${totalInactive}`, 15, yPosition);
      yPosition += 10;

      // Table header
      pdf.setFont("helvetica", "bold");
      const columns = ["No", "Provinsi", "Total", "Aktif", "Tidak Aktif", "%"];
      const columnWidths = [10, 70, 25, 25, 30, 20];
      let xPosition = 10;

      columns.forEach((col, idx) => {
        pdf.text(col, xPosition, yPosition);
        xPosition += columnWidths[idx];
      });

      yPosition += 7;

      // Table rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      sortedProvinces.forEach((province, index) => {
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

        const activePercentage =
          province.count > 0
            ? ((province.activeCount / province.count) * 100).toFixed(1)
            : "0.0";

        const rowData = [
          (index + 1).toString(),
          province.province.substring(0, 35),
          province.count.toString(),
          province.activeCount.toString(),
          province.inactiveCount.toString(),
          `${activePercentage}%`,
        ];

        rowData.forEach((data, idx) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += columnWidths[idx];
        });

        yPosition += 6;
      });

      pdf.save(
        `Laporan-Sebaran-Penjual-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Gagal mengekspor PDF. Silakan coba lagi.");
    }
  };

  const sortedProvinces = [...provinces].sort((a, b) => {
    if (sortBy === "total") {
      return b.count - a.count;
    } else {
      return b.activeCount - a.activeCount;
    }
  });

  const totalSellers = provinces.reduce((sum, p) => sum + p.count, 0);
  const totalActive = provinces.reduce((sum, p) => sum + p.activeCount, 0);
  const totalInactive = provinces.reduce((sum, p) => sum + p.inactiveCount, 0);
  const maxCount = Math.max(...provinces.map((p) => p.count), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Memuat data penjual per provinsi...
          </p>
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
                Sebaran Penjual per Provinsi
              </h1>
              <p className="text-gray-600 mt-2">
                Visualisasi distribusi toko di seluruh Indonesia
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

          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Total Penjual</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {totalSellers}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {provinces.length} provinsi
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Penjual Aktif</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {totalActive}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {totalSellers > 0
                  ? ((totalActive / totalSellers) * 100).toFixed(1)
                  : 0}
                % dari total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">
                Penjual Tidak Aktif
              </p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {totalInactive}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {totalSellers > 0
                  ? ((totalInactive / totalSellers) * 100).toFixed(1)
                  : 0}
                % dari total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">
                Rata-rata per Provinsi
              </p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {provinces.length > 0
                  ? (totalSellers / provinces.length).toFixed(1)
                  : 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">penjual</p>
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

        {/* Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Urutkan berdasarkan:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("total")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "total"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Total Penjual
              </button>
              <button
                onClick={() => setSortBy("active")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Penjual Aktif
              </button>
            </div>
          </div>
        </div>

        {/* Provinces List with Bar Charts */}
        <div className="space-y-4">
          {sortedProvinces.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-600 font-medium">
                Tidak ada data penjual
              </p>
            </div>
          ) : (
            sortedProvinces.map((province, index) => {
              const percentage = (province.count / maxCount) * 100;
              const activePercentage =
                province.count > 0
                  ? (province.activeCount / province.count) * 100
                  : 0;

              return (
                <div
                  key={province.province}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Province Name and Total */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {index + 1}. {province.province}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {province.count}
                      </p>
                      <p className="text-sm text-gray-500">penjual</p>
                    </div>
                  </div>

                  {/* Status breakdown */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Aktif:{" "}
                        <span className="font-semibold">
                          {province.activeCount}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Tidak Aktif:{" "}
                        <span className="font-semibold">
                          {province.inactiveCount}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden flex">
                      <div
                        className="bg-green-500 h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
                        style={{ width: `${activePercentage}%` }}
                      >
                        {activePercentage > 10 &&
                          `${activePercentage.toFixed(0)}%`}
                      </div>
                      <div
                        className="bg-yellow-500 h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
                        style={{ width: `${100 - activePercentage}%` }}
                      >
                        {100 - activePercentage > 10 &&
                          `${(100 - activePercentage).toFixed(0)}%`}
                      </div>
                    </div>
                  </div>

                  {/* Scale indicator */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {((province.count / maxCount) * 100).toFixed(0)}% dari
                    jumlah maksimal per provinsi
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <div className="flex gap-4">
            <svg
              className="w-6 h-6 text-blue-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Informasi Sebaran Penjual
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Peta menunjukkan distribusi penjual di setiap provinsi. Semakin
                panjang bar, semakin banyak penjual di provinsi tersebut. Warna
                hijau menunjukkan penjual aktif (terverifikasi), sedangkan warna
                kuning menunjukkan penjual yang belum aktif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}