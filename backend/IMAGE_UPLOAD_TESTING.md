# Testing Upload Gambar Produk

## Perubahan yang Dilakukan

### 1. Model Produk

- ✅ Menambahkan `foto_produk_url` ke `$appends` agar URL gambar otomatis disertakan dalam response JSON
- ✅ Accessor `getFotoProdukUrlAttribute()` sudah ada untuk generate full URL gambar

### 2. Storage Link

- ✅ Menjalankan `php artisan storage:link` untuk membuat symbolic link dari `public/storage` ke `storage/app/public`
- ✅ Gambar yang diupload ke `storage/app/public/produk` sekarang bisa diakses via `http://localhost:8000/storage/produk/[filename]`

### 3. Controller Edit

- ✅ Menambahkan logic upload foto pada method `edit()`
- ✅ Menghapus foto lama sebelum upload foto baru
- ✅ Update path foto baru ke database

## Cara Testing dengan Postman/Thunder Client

### Test Add Product dengan Gambar

**Endpoint:** `POST /api/seller/products/add`

**Headers:**

```
Authorization: Bearer {your_token}
Content-Type: multipart/form-data
```

**Body (form-data):**

```
nama_produk: Produk Test
kategori_produk_id: 1
deskripsi_produk: Deskripsi produk test
harga_produk: 100000
berat_produk: 500
stok_produk: 10
foto_produk: [pilih file gambar .jpg/.png]
```

**Expected Response:**

```json
{
  "message": "Produk berhasil ditambahkan",
  "data": {
    "id": 1,
    "user_id": 1,
    "nama_produk": "Produk Test",
    "kategori_produk_id": 1,
    "deskripsi_produk": "Deskripsi produk test",
    "harga_produk": "100000.00",
    "berat_produk": "500.00",
    "stok_produk": 10,
    "foto_produk": "produk/xyz123.jpg",
    "foto_produk_url": "http://localhost:8000/storage/produk/xyz123.jpg",
    "rating": 0,
    "kategori": {
      // data kategori
    }
  }
}
```

### Test Edit Product dengan Gambar

**Endpoint:** `POST /api/seller/products/edit`

**Headers:**

```
Authorization: Bearer {your_token}
Content-Type: multipart/form-data
```

**Body (form-data):**

```
product_id: 1
nama_produk: Produk Test Updated (optional)
foto_produk: [pilih file gambar baru .jpg/.png] (optional)
```

**Expected Response:**

```json
{
  "message": "Produk berhasil diupdate",
  "data": {
    "id": 1,
    "foto_produk": "produk/new_xyz456.jpg",
    "foto_produk_url": "http://localhost:8000/storage/produk/new_xyz456.jpg"
    // ... data lainnya
  }
}
```

## Testing dari Frontend

Sekarang frontend bisa mengakses URL gambar dari field `foto_produk_url`:

```typescript
// Contoh response dari API
{
    "data": {
        "id": 1,
        "nama_produk": "Produk Test",
        "foto_produk_url": "http://localhost:8000/storage/produk/xyz123.jpg"
    }
}

// Cara pakai di frontend (React/Next.js)
<img src={product.foto_produk_url} alt={product.nama_produk} />
```

## Troubleshooting

### Gambar 404 Not Found

1. Pastikan `php artisan storage:link` sudah dijalankan
2. Cek file ada di `backend/storage/app/public/produk/`
3. Cek symbolic link ada di `backend/public/storage`
4. Pastikan `APP_URL` di `.env` sesuai dengan URL backend Anda

### CORS Error dari Frontend

Pastikan CORS sudah dikonfigurasi dengan benar di `config/cors.php`:

```php
'paths' => ['api/*', 'storage/*'],
```

### Permission Denied

Jika di Linux/Mac, jalankan:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## Notes

- Gambar disimpan di `storage/app/public/produk/`
- Gambar dapat diakses via `http://localhost:8000/storage/produk/{filename}`
- Format yang diterima: jpeg, png, jpg
- Ukuran maksimal: 2MB (2048 KB)
- Path relatif disimpan di database, full URL digenerate otomatis via accessor
