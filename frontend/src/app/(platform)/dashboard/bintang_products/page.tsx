"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";

interface TopProduct {
  id: number;
  name: string;
  category: string;
  seller_name: string;
  province: string;
  rating: number;
  review_count: number;
  price: number;
  image?: string;
}

export default function RekomendasiProdukPage() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "price">(
    "rating"
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    fetchTopRatedProducts();
  }, []);

  const fetchTopRatedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(
        "/api/admin/dashboard/top-rated-products"
      );
      setProducts(response.data.data || []);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching top rated products:", err);

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
          error.response?.data?.message || "Gagal memuat data produk bintang"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  let filteredProducts = [...products];

  if (filterRating !== "all") {
    filteredProducts = filteredProducts.filter((p) => {
      return Math.floor(p.rating) === filterRating;
    });
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.review_count - a.review_count;
      case "price":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const avgRating =
    products.length > 0
      ? (
          products.reduce((sum, p) => sum + p.rating, 0) / products.length
        ).toFixed(2)
      : 0;

  const avgReviews =
    products.length > 0
      ? (
          products.reduce((sum, p) => sum + p.review_count, 0) / products.length
        ).toFixed(0)
      : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const exportToPDF = async () => {
    if (typeof window === "undefined") return;

    try {
      const { jsPDF } = await import("jspdf");

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Add title
      pdf.setFontSize(16);
      pdf.text("Laporan Produk & Rating", 15, yPosition);
      yPosition += 10;

      // Add date
      pdf.setFontSize(10);
      pdf.text(
        `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
        15,
        yPosition
      );
      yPosition += 8;

      // Add summary
      pdf.setFontSize(10);
      pdf.text(`Total Produk: ${filteredProducts.length}`, 15, yPosition);
      yPosition += 5;
      pdf.text(
        `Rating Rata-rata: ${(
          filteredProducts.reduce((sum, p) => sum + p.rating, 0) /
          filteredProducts.length
        ).toFixed(2)}`,
        15,
        yPosition
      );
      yPosition += 10;

      // Add table header
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const columns = [
        "No",
        "Produk",
        "Kategori",
        "Toko",
        "Provinsi",
        "Rating",
        "Harga",
        "Review",
      ];
      const columnWidths = [8, 35, 20, 25, 25, 15, 25, 15];
      let xPosition = 10;

      columns.forEach((col, idx) => {
        pdf.text(col, xPosition, yPosition);
        xPosition += columnWidths[idx];
      });

      yPosition += 7;

      // Add table rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      filteredProducts.forEach((product, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 15;

          // Re-add header on new page
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
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

        // Add row data
        const rowData = [
          (index + 1).toString(),
          product.name.substring(0, 25),
          product.category,
          product.seller_name.substring(0, 20),
          product.province,
          product.rating.toFixed(2),
          formatPrice(product.price),
          product.review_count.toString(),
        ];

        rowData.forEach((data, idx) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += columnWidths[idx];
        });

        yPosition += 6;
      });

      // Save PDF
      pdf.save(
        `Laporan-Produk-Rating-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Gagal mengekspor PDF. Silakan coba lagi.");
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array(fullStars)
            .fill(0)
            .map((_, i) => (
              <svg
                key={`full-${i}`}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          {hasHalfStar && (
            <svg
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="half" x1="0%" x2="100%">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="lightgray" />
                </linearGradient>
              </defs>
              <path
                fill="url(#half)"
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
          )}
          {Array(emptyStars)
            .fill(0)
            .map((_, i) => (
              <svg
                key={`empty-${i}`}
                className="w-4 h-4 text-gray-300 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {rating.toFixed(2)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk bintang...</p>
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
                Laporan Produk & Rating ⭐
              </h1>
              <p className="text-gray-600 mt-2">
                Produk dengan rating tertinggi dari pembeli
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
                    d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8H3m6-8h6m0 0V5m0 0h6"
                  />
                </svg>
                Export PDF
              </button>
              <Link href="/dashboard">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-600 font-medium">
                Total Produk Bintang
              </p>
              <p className="text-2xl font-bold text-amber-900 mt-2">
                {products.length}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">
                Rating Rata-rata
              </p>
              <p className="text-2xl font-bold text-yellow-900 mt-2">
                {avgRating}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">
                Review Rata-rata
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {avgReviews}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">
                Tertinggi Rated
              </p>
              <p className="text-2xl font-bold text-red-900 mt-2">
                {products.length > 0 ? products[0].rating.toFixed(2) : "N/A"}
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

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filter by Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Berdasarkan Rating
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterRating("all")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterRating === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Semua
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(star)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      filterRating === star
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <span>⭐</span>
                    {star}+
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan Berdasarkan
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("rating")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "rating"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => setSortBy("reviews")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "reviews"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Review
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "price"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Harga
                </button>
              </div>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tampilan
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                    viewMode === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                  </svg>
                  Tabel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div id="report-table">
          {filteredProducts.length === 0 ? (
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
                  d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5M13 6.5h.01"
                />
              </svg>
              <p className="mt-4 text-gray-600 font-medium">
                Tidak ada produk dengan filter yang dipilih
              </p>
              <button
                onClick={() => setFilterRating("all")}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                Hapus filter
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Product Image */}
                  {product.image && (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {!product.image && (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Seller & Province */}
                    <p className="text-sm text-gray-600 mb-1">
                      {product.seller_name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      📍 {product.province}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      {renderStars(product.rating)}
                      <p className="text-xs text-gray-500 mt-1">
                        {product.review_count} ulasan
                      </p>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      No
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Nama Produk
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Nama Toko
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">
                      Provinsi
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-900">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">
                      Review
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium max-w-xs truncate">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.seller_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.province}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <span>⭐</span>
                          <span className="font-semibold">
                            {product.rating.toFixed(2)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {product.review_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
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
                Tentang Produk Bintang
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Produk bintang adalah produk dengan rating tertinggi dari
                pembeli di platform kami. Menampilkan produk yang paling
                dipercaya dan diminati oleh komunitas kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
