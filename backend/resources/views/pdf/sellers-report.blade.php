<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 3px solid #3b82f6;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24pt;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .header .subtitle {
            font-size: 12pt;
            color: #6b7280;
        }
        .header .date {
            font-size: 9pt;
            color: #9ca3af;
            margin-top: 5px;
        }
        .stats {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .stat-box {
            display: table-cell;
            width: 33.33%;
            padding: 15px;
            text-align: center;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .stat-box .label {
            font-size: 9pt;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-box .value {
            font-size: 24pt;
            font-weight: bold;
            color: #1f2937;
            margin-top: 5px;
        }
        .stat-box.active .value {
            color: #10b981;
        }
        .stat-box.suspended .value {
            color: #dc2626;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        table thead {
            background-color: #3b82f6;
            color: white;
        }
        table th {
            padding: 12px 8px;
            text-align: left;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9pt;
        }
        table tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }
        table tbody tr:hover {
            background-color: #f3f4f6;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-active {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-suspended {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 0;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 8pt;
            color: #9ca3af;
            background-color: white;
        }
        .page-number:after {
            content: "Halaman " counter(page);
        }
        @page {
            margin: 100px 50px 80px 50px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="subtitle">Platform Martplace</div>
        <div class="date">Tanggal Cetak: {{ $date }}</div>
    </div>

    <!-- Statistics -->
    <div class="stats">
        <div class="stat-box">
            <div class="label">Total Penjual</div>
            <div class="value">{{ $total_sellers }}</div>
        </div>
        <div class="stat-box active">
            <div class="label">Penjual Aktif</div>
            <div class="value">{{ $active_sellers }}</div>
        </div>
        <div class="stat-box suspended">
            <div class="label">Penjual Suspended</div>
            <div class="value">{{ $suspended_sellers }}</div>
        </div>
    </div>

    <!-- Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 20%;">Nama Toko</th>
                <th style="width: 18%;">Pemilik</th>
                <th style="width: 22%;">Email</th>
                <th style="width: 13%;">Telepon</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 12%;">Tgl. Verifikasi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sellers as $index => $seller)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td><strong>{{ $seller['nama_toko'] }}</strong></td>
                <td>{{ $seller['nama_pemilik'] }}</td>
                <td style="font-size: 8pt;">{{ $seller['email'] }}</td>
                <td>{{ $seller['nomor_telepon'] }}</td>
                <td>
                    <span class="status-badge {{ $seller['status'] === 'Aktif' ? 'status-active' : 'status-suspended' }}">
                        {{ $seller['status'] }}
                    </span>
                </td>
                <td style="text-align: center;">{{ $seller['tanggal_verifikasi'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($sellers->isEmpty())
    <div style="text-align: center; padding: 40px; color: #9ca3af;">
        <p style="font-size: 12pt;">Tidak ada data penjual</p>
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <div class="page-number"></div>
        <div style="margin-top: 5px;">© {{ date('Y') }} Martplace. All rights reserved.</div>
        <div style="margin-top: 5px; font-size: 7pt; color: #d1d5db;">
            Dokumen ini digenerate secara otomatis oleh sistem
        </div>
    </div>
</body>
</html>
