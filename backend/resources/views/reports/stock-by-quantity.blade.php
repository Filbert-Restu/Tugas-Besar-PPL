<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Stock Produk</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #4a5568;
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
            background-color: #f9fafb;
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
        .stock-high {
            color: #059669;
            font-weight: bold;
        }
        .stock-medium {
            color: #d97706;
            font-weight: bold;
        }
        .stock-low {
            color: #dc2626;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN STOCK PRODUK</h1>
        <p>Diurutkan Berdasarkan Jumlah Stock (Menurun)</p>
        <p>Tanggal Generate: {{ $generated_at }}</p>
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
                    <span class="@if($product['stock'] >= 10) stock-high @elseif($product['stock'] >= 2) stock-medium @else stock-low @endif">
                        {{ $product['stock'] }}
                    </span>
                </td>
                <td class="text-center">{{ number_format($product['rating'], 1) }}</td>
                <td class="text-right">Rp {{ number_format($product['harga'], 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center">Tidak ada data produk</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Laporan ini dihasilkan secara otomatis oleh sistem MartPlace</p>
    </div>
</body>
</html>
