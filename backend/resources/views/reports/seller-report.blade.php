<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 22px;
            margin: 0 0 5px 0;
        }
        .header .subtitle {
            color: #64748b;
            font-size: 12px;
        }
        .info-box {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
        .info-item {
            text-align: center;
        }
        .info-label {
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
        }
        .info-value {
            color: #1e293b;
            font-size: 18px;
            font-weight: bold;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            background: #2563eb;
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            border-radius: 3px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background: #e0e7ff;
            color: #1e40af;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #c7d2fe;
        }
        td {
            padding: 8px;
            border: 1px solid #e2e8f0;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background: #f8fafc;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            display: inline-block;
        }
        .status-active {
            background: #dcfce7;
            color: #166534;
        }
        .status-inactive {
            background: #fee2e2;
            color: #991b1b;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .footer {
            margin-top: 30px;
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

    <div class="info-box">
        <div class="info-item">
            <div class="info-label">Total Penjual</div>
            <div class="info-value">{{ $total }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Penjual Aktif</div>
            <div class="info-value" style="color: #16a34a;">{{ $totalActive }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Penjual Tidak Aktif</div>
            <div class="info-value" style="color: #dc2626;">{{ $totalInactive }}</div>
        </div>
    </div>

    <!-- Active Sellers Section -->
    <div class="section">
        <div class="section-title">Penjual Aktif ({{ $totalActive }})</div>

        @if($activeSellers->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th width="20%">Nama Toko</th>
                        <th width="18%">Nama Pemilik</th>
                        <th width="20%">Email</th>
                        <th width="12%">Telepon</th>
                        <th width="15%">Provinsi</th>
                        <th width="10%">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($activeSellers as $index => $seller)
                        <tr>
                            <td style="text-align: center;">{{ $index + 1 }}</td>
                            <td><strong>{{ $seller['nama_toko'] }}</strong></td>
                            <td>{{ $seller['nama_pemilik'] }}</td>
                            <td>{{ $seller['email'] }}</td>
                            <td>{{ $seller['nomor_telepon'] }}</td>
                            <td>{{ $seller['provinsi'] }}</td>
                            <td>
                                <span class="status-badge status-active">{{ $seller['status'] }}</span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="no-data">Tidak ada penjual aktif</div>
        @endif
    </div>

    <!-- Inactive Sellers Section -->
    <div class="section">
        <div class="section-title">Penjual Tidak Aktif ({{ $totalInactive }})</div>

        @if($inactiveSellers->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th width="20%">Nama Toko</th>
                        <th width="18%">Nama Pemilik</th>
                        <th width="20%">Email</th>
                        <th width="12%">Telepon</th>
                        <th width="15%">Provinsi</th>
                        <th width="10%">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($inactiveSellers as $index => $seller)
                        <tr>
                            <td style="text-align: center;">{{ $index + 1 }}</td>
                            <td><strong>{{ $seller['nama_toko'] }}</strong></td>
                            <td>{{ $seller['nama_pemilik'] }}</td>
                            <td>{{ $seller['email'] }}</td>
                            <td>{{ $seller['nomor_telepon'] }}</td>
                            <td>{{ $seller['provinsi'] }}</td>
                            <td>
                                <span class="status-badge {{ $seller['status'] === 'Menunggu Verifikasi' ? 'status-pending' : 'status-inactive' }}">
                                    {{ $seller['status'] }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div class="no-data">Tidak ada penjual tidak aktif</div>
        @endif
    </div>

    <div class="footer">
        Dokumen ini dibuat secara otomatis oleh sistem MartPlace<br>
        © {{ date('Y') }} MartPlace - All Rights Reserved
    </div>
</body>
</html>
