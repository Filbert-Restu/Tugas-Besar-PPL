<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Stock Menipis</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            color: #dc2626;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .warning-box {
            background-color: #fef2f2;
            border: 2px solid #dc2626;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .warning-box p {
            margin: 5px 0;
            color: #dc2626;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #dc2626;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #fef2f2;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .stock-critical {
            color: #dc2626;
            font-weight: bold;
            background-color: #fee2e2;
            padding: 2px 8px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ LAPORAN STOCK PRODUK MENIPIS</h1>
        <p>Produk dengan Stock < 2 (Harus Segera Dipesan)</p>
        <p>Tanggal Generate: {{ $generated_at }}</p>
    </div>

    <div class="warning-box">
        <p>⚠️ PERINGATAN: Produk-produk berikut memiliki stock menipis dan harus segera dipesan!</p>
        <p>Total Produk yang Harus Dipesan: {{ count($products) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 35%;">Nama Produk</th>
                <th style="width: 15%;">Kategori</th>
                <th style="width: 10%;" class="text-center">Stock</th>
                <th style="width: 10%;" class="text-center">Rating</th>
                <th style="width: 25%;" class="text-right">Harga</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $index => $product)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $product['nama_produk'] }}</td>
                <td>{{ $product['kategori'] }}</td>
                <td class="text-center">
                    <span class="stock-critical">{{ $product['stock'] }}</span>
                </td>
                <td class="text-center">{{ number_format($product['rating'], 1) }}</td>
                <td class="text-right">Rp {{ number_format($product['harga'], 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center" style="color: #059669; font-weight: bold;">
                    ✓ Tidak ada produk dengan stock menipis. Semua stock dalam kondisi baik.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Laporan ini dihasilkan secara otomatis oleh sistem MartPlace</p>
        <p>Segera lakukan pemesanan untuk produk-produk dengan stock menipis</p>
    </div>
</body>
</html>
