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
            border-bottom: 3px solid #059669;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #047857;
            font-size: 22px;
            margin: 0 0 5px 0;
        }
        .header .subtitle {
            color: #64748b;
            font-size: 12px;
        }
        .summary-box {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 25px;
            text-align: center;
            border: 2px solid #059669;
        }
        .summary-box .label {
            color: #047857;
            font-size: 11px;
            font-weight: bold;
        }
        .summary-box .value {
            color: #065f46;
            font-size: 24px;
            font-weight: bold;
            margin-top: 5px;
        }
        .province-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .province-header {
            background: #059669;
            color: white;
            padding: 10px 15px;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 12px;
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
        }
        .province-count {
            background: rgba(255,255,255,0.3);
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th {
            background: #d1fae5;
            color: #047857;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
            border: 1px solid #a7f3d0;
        }
        td {
            padding: 7px 6px;
            border: 1px solid #e2e8f0;
            font-size: 9px;
        }
        tr:nth-child(even) {
            background: #f0fdf4;
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
            padding: 20px;
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

    <div class="summary-box">
        <div class="label">Total Penjual Aktif (Semua Provinsi)</div>
        <div class="value">{{ $grandTotal }}</div>
    </div>

    @if(count($provinces) > 0)
        @foreach($provinces as $provinceData)
            <div class="province-section">
                <div class="province-header">
                    <span>{{ strtoupper($provinceData['provinsi']) }}</span>
                    <span class="province-count">{{ $provinceData['total'] }} Toko</span>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th width="4%">No</th>
                            <th width="22%">Nama Toko</th>
                            <th width="18%">Nama Pemilik</th>
                            <th width="20%">Email</th>
                            <th width="11%">Telepon</th>
                            <th width="15%">Kabupaten/Kota</th>
                            <th width="10%">Kecamatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($provinceData['sellers'] as $index => $seller)
                            <tr>
                                <td style="text-align: center;">{{ $index + 1 }}</td>
                                <td><strong>{{ $seller->nama_toko }}</strong></td>
                                <td>{{ $seller->nama_pemilik }}</td>
                                <td style="font-size: 8px;">{{ $seller->email }}</td>
                                <td>{{ $seller->nomor_telepon }}</td>
                                <td>{{ $seller->nama_kabupaten_kota }}</td>
                                <td>{{ $seller->nama_kecamatan }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endforeach
    @else
        <div class="no-data">Tidak ada data penjual untuk ditampilkan</div>
    @endif

    <div class="footer">
        Total {{ count($provinces) }} Provinsi dengan {{ $grandTotal }} Toko Aktif<br>
        Dokumen ini dibuat secara otomatis oleh sistem MartPlace<br>
        © {{ date('Y') }} MartPlace - All Rights Reserved
    </div>
</body>
</html>
