<h1>Halo, {{ $seller->nama_pic }}!</h1>
<p>Selamat, toko <strong>{{ $seller->nama_toko }}</strong> telah diverifikasi.</p>
<p>Sekarang Anda dapat login dan mulai mengunggah produk.</p>
<a href="{{ env('FRONTEND_URL') }}/auth/login">Login Sekarang</a>