# panduan setiap page

[back](/README.md)

**route yang tersedia setiap user**:

`guest`:
- [/](), [/unit-kos](), [/login](), [/register](), [/reset-password]()

`penghuni`:
- [/dashboard](), [/dashboard/find-kos](), [/dashboard/laporan](), [/dashboard/messages](), [/dashboard/transaksi](), [/dsashbard/settings](), [/logout]()

`penjaga`:
- `...penghuni`, [/dashboard/penghuni](), [/dashboard/pengeluaran]()

`pemilik`:
- `...penjaga`, [/dashboard/user](), [/dashboard/penjaga](), [/dashboard/kos]()

**tujuan setiap page**:

`guest`:
- [/]() =>  pengenalan tentang kos pondok jaya
- [/unit-kos]() => mencari unit kos yang tersedia
    - [?page=\<number>]() => ist kos selanjutnya
- [/login]() => masuk ke sistem
- [/register]() => mendaftar akun
- [/reset-password]() => request reset password
    - [?secret=\<secret>]() => reset password

`penghuni`:
- [/dashboard]() => menampilkan ringkasan info dan menu penting
- [/dashboard/find-kos]() => mencari kos dan melakukan booking 
    - [?page=\<number>]() => menampilkan list kos selanjutnya
- [/dashboard/laporan]() => menampilkan laporan yang telah dibuat dan di proses 
    - [?page=\<number>]() => list laporan selanjutnya
- [/dashboard/messages]() => menampilkan pesan 
    - [?id=\<id>]() => menampilkan pesan antar user
    - [?group=\<id-group>]() => menampilkan pesan group
- [/dashboard/transaksi]() => menampilkan list transaksi dan booking
    - [?page=\<number>]() => list transaksi selanjutnya
- [/dashboard/settings]() => melakukan perubahan profile 
- [/logout]() => keluar dari sistem

`penjaga`:
- `...penghuni` => semua fitur yang ada di penghuni
- [/dashboard/penghuni]() => list semua penghuni 
    - [?page=\<number>]() => list penghuni selanjutnya
- [/dashboard/pengeluaran]() => mencatat pengeluaran
    - [?page=\<number>]() => list pengeluaran selanjutnya

`pemilik`:
- `...penjaga` => semua fitur yang ada di penjaga 
- [/dashboard/user]() => list semua user 
    - [?page=\<number>]() => list user selanjutnya
- [/dashboard/kos]() => menampilkan kos
    - [?id=\<id-kos>]() => menampilkan kamar kos
    - [?id=\<id-kos>&page=\<number>]() => list kamar kos selanjutnya
- [/dashboard/penjaga]() => list semua penjaga
    - [?page=\<number>]() => list penjaga selanjutnya