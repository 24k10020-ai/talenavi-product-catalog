# TALENAVI STORE — Product Catalog

Aplikasi web katalog produk e-commerce responsif yang dibangun menggunakan **React.js** dan **Vite** untuk **Technical Test Talenavi**. Aplikasi ini mengambil data dari DummyJSON REST API serta dilengkapi manajemen keranjang belanja dan wishlist secara persisten.

## Fitur Utama

- **Katalog Produk & Pagination:** Menampilkan 12 produk per halaman dengan navigasi nomor halaman dinamis.
- **Pencarian Real-Time (Debounced):** Pencarian produk berdasarkan kata kunci yang dioptimalkan dengan *custom hook* `useDebounce` untuk menghindari pemanggilan API berulang saat mengetik.
- **Filter Kategori:** Penyaringan daftar produk secara dinamis berdasarkan kategori dari API.
- **Detail Produk (`/products/:id`):** Menampilkan galeri gambar, merek, rating, ketersediaan stok, diskon, serta pengaturan jumlah pembelian.
- **Wishlist (`/wishlist`):** Menyimpan dan mengelola daftar produk favorit pengguna.
- **Keranjang Belanja (`/cart`):** Mengubah jumlah item (`+`/`-`), menghapus produk, menghitung total harga otomatis, dan simulasi *checkout*.
- **Penyimpanan Persisten:** Data keranjang dan wishlist tersimpan otomatis di `localStorage` sehingga tetap aman saat halaman di-*refresh*.

## Tech Stack

- **Framework:** React.js (Vite)
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **State Management:** React Context API + `localStorage`
- **API:** DummyJSON Products API
- **Styling:** Vanilla CSS (Responsive CSS Grid & Flexbox)

## Struktur Folder

text
src/
├── assets/          # Aset statis aplikasi
├── components/      # Komponen UI reusable (Navbar, SearchBar, ProductCard, Pagination)
├── context/         # Global state management untuk Cart & Wishlist (ShopContext)
├── hooks/           # Custom hooks (useDebounce)
├── pages/           # Halaman utama (Home, ProductDetail, Wishlist, Cart)
├── services/        # Layanan integrasi REST API (productService)
├── App.jsx          # Konfigurasi routing utama
├── index.css        # Styling global dan responsif
└── main.jsx         # Entry point aplikasi


## Cara Menjalankan di Lokal

1. Clone repository ini ke komputer Anda:
   bash
   git clone https://github.com/24k10020-ai/talenavi-product-catalog.git
   cd talenavi-product-catalog
   
2. Install seluruh *dependencies* yang dibutuhkan:
   bash
   npm install
   
3. Jalankan server pengembangan lokal:
   bash
   npm run dev
   
4. Buka browser dan akses alamat **`http://localhost:5173/`**.