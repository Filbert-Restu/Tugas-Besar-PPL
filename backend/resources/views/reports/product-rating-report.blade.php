<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #d97706;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #b45309;
            font-size: 22px;
            margin: 0 0 5px 0;
        }
        .header .subtitle {
            color: #64748b;
            font-size: 12px;
        }
        .stats-container {
            display: flex;
            justify-content: space-around;
            margin-bottom: 25px;
        }
        .stat-box {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            padding: 12px 20px;
            border-radius: 5px;
            text-align: center;
            flex: 1;
            margin: 0 5px;
        }
        .stat-label {
            color: #92400e;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .stat-value {
            color: #b45309;
            font-size: 20px;
            font-weight: bold;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th {
            background: #fef3c7;
            color: #92400e;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
            border: 1px solid #fde68a;
        }
        td {
            padding: 7px 6px;
            border: 1px solid #e2e8f0;
            font-size: 9px;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background: #fffbeb;
        }
        .rating-stars {
            color: #fbbf24;
            font-size: 11px;
        }
        .price {
            color: #059669;
            font-weight: bold;
        }
        .category-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
            display: inline-block;
        }
        .rank {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            font-weight: bold;
            padding: 5px;
            border-radius: 3px;
            text-align: center;
        }
        .rank-top3 {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .footer {
            margin-top: 25px;
            text-align: center;
            color: #94a3b8;
            font-size: 9px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
        .no-data {
            text-align: center;
            padding: 30px;
            color: #94a3b8;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="subtitle">Tanggal Cetak: {{ $date }}</div>
    </div>

    <div class="stats-container">
        <div class="stat-box">
            <div class="stat-label">Total Produk</div>
            <div class="stat-value">{{ $totalProducts }}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Rating Rata-rata</div>
            <div class="stat-value">{{ $averageRating }} ★</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Rating Tertinggi</div>
            <div class="stat-value">{{ $highestRating }} ★</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Rating Terendah</div>
            <div class="stat-value">{{ $lowestRating }} ★</div>
        </div>
    </div>

    @if($products->count() > 0)
        <table>
            <thead>
                <tr>
                    <th width="4%">Rank</th>
                    <th width="20%">Nama Produk</th>
                    <th width="15%">Nama Toko</th>
                    <th width="10%">Kategori</th>
                    <th width="10%">Harga</th>
                    <th width="16%">Provinsi</th>
                    <th width="8%">Rating</th>
                    <th width="7%">Review</th>
                    <th width="6%">Stok</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $index => $product)
                    <tr>
                        <td>
                            <div class="rank {{ $index < 3 ? 'rank-top3' : '' }}">
                                {{ $index + 1 }}
                            </div>
                        </td>
                        <td><strong>{{ $product['nama_produk'] }}</strong></td>
                        <td>{{ $product['nama_toko'] }}</td>
                        <td>
                            <span class="category-badge">{{ $product['kategori'] }}</span>
                        </td>
                        <td class="price">Rp {{ number_format($product['harga'], 0, ',', '.') }}</td>
                        <td>{{ $product['provinsi'] }}</td>
                        <td style="text-align: center;">
                            <div class="rating-stars">{{ $product['rating'] }} ★</div>
                        </td>
                        <td style="text-align: center;">{{ $product['jumlah_review'] }}</td>
                        <td style="text-align: center;">{{ $product['stok'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-data">Tidak ada produk dengan review untuk ditampilkan</div>
    @endif

    <div class="footer">
        Menampilkan {{ $totalProducts }} produk yang diurutkan berdasarkan rating tertinggi<br>
        Dokumen ini dibuat secara otomatis oleh sistem MartPlace<br>
        © {{ date('Y') }} MartPlace - All Rights Reserved
    </div>
</body>
</html>
