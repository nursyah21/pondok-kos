# progress

[back](/README.md)

**3 jul** :
- verifikasi manual payment (x)
- auto check validasi payment (x)
- mengirim request reset password {number_phone} (/api/protect/reset-password/add) post (x)
- fontee {target, message} (/api/protect/fontee) post (x)
- generate reset password {number_phone} (/api/protect/reset-password/generate) post (x)
- update password {secret, password} (/api/protect/reset-password/update) post (x)
- /reset-password  (x)
- /reset-password?secret= (x)
- list semua user, grup sesuai role (/api/protect/messages/list) {token}
- mengirim pesan user (/api/protect/messages/send) {token, user_id, message}
- mengirim pesan group (/api/protect/messages/send-group) {token, group_id, message}
- update pesan (/api/protect/messages/update) {token, message_id, message}
- hapus pesan (/api/protect/messages/delete) {token, message_id}
- menampilkan pesan user (/api/protect/messages/user) {token, user_id}
- menampilkan pesan group (/api/protect/messages/group) {token, group_id}

**4 jul**:
new table: (x)
- penghuni_kos:
	- id_user: str
	- id_kamar_kos: str
- penjaga_kos:
	- id_user: str
	- id_kos: str
- saat menambahkan penjaga terdapat pilihan menambahkan kos dan menambahkan user ke penjaga kos
- saat memverifikasi pembayaran booking memasukkan user ke penghuni kos
- terdapat durasi hari pada booking
- semua upload file menggunakan nama attachment (x)
- hapus data pada upload file jika memiliki link (x)
- protect upload file (x)

**5 jul**:
- perbarui arsitektur (menggunakan resuable code)
- uji semua bug
- tambahkan ubah role(untuk mengganti dari penghuni jadi ke penjaga atau penjaga jadi penghuni), bagi pemilik
- settings
	- verifikasi untuk penghuni
	- status role bagi pemilik / penjaga

**6 jul**:
- perbarui infrastruktur
- update settings (x)
- pada list penghuni (penjaga), tombol verifikasi
- pada list penghuni (admin), tombol verifikasi, ubah role, 

**8 jul**:
- perbaiki middleware (x)
- perbarui api (x)

**9 jul**:

**10 jul**:
pemilik(role=0):

- [/dashboard]():
	- jumlah penjaga
	- jumlah user 
	- jumlah penghuni
	- jumlah kamar kos
	- jumlah pendapatan/bulan (dari transaksi)
	- jumlah pengeluaran/bulan (dari pengeluaran)
- [/dashboard/penghuni]():
	- verifikasi
	- generate reset password dan kirim ke wa
	- list penghuni setiap kamar kos
- [/dashboard/user]():
	- ganti role
	- generate reset password dan kirim ke wa
	- hapus user
- [/dashboard/penjaga]():
	- menambahkan penjaga ke kos
	- menghapus penjaga kos
	- mengganti penjaga kos
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/kos]():
	- membuat kos
	- menghapus kos
	- mengedit kos
	- membuat kamar kos
	- menghapus kamar kos
	- mengedit kamar kos
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/pengeluaran]():
	- membuat laporan pengeluaran berdasarkan kos
	- mengedit laporan pengeluaran
	- menghapus laporan pengeluaran
- [/dashboard/laporan]():
	- melihat laporan berdasarkan kos
	- mengedit laporan status (terkirim, diproses, sudah diperbaiki)
- [/dashboard/messages]():
	- membuat pesan berdasarkan grup dan user
	- mengedit pesan
	- menghapus pesan

pemilik(role=1):

- [/dashboard]():
	- jumlah penghuni kos
	- jumlah kamar kos yang dihuni
	- jumlah pendapatan/bulan (dari transaksi)
	- jumlah pengeluaran/bulan (dari pengeluaran)
- [/dashboard/penghuni]():
	- verifikasi
	- generate reset password dan kirim ke wa
	- list penghuni setiap kamar kos
- [/dashboard/user]():
	- ganti role
	- generate reset password dan kirim ke wa
	- hapus user
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/pengeluaran]():
	- membuat laporan pengeluaran berdasarkan kos
	- mengedit laporan pengeluaran
	- menghapus laporan pengeluaran
- [/dashboard/laporan]():
	- melihat laporan berdasarkan kos
	- mengedit laporan status (terkirim, diproses, sudah diperbaiki)
- [/dashboard/messages]():
	- membuat pesan berdasarkan grup dan user
	- mengedit pesan
	- menghapus pesan

pemilik(role=2):

pemilik(role=0):

- [/dashboard]():
	- jumlah pengeluaran/bulan (dari transaksi)
	- kos yang dihuni sekarang
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/transaksi]():
	- membatalkan transaksi
	- memvalidasi transaksi
- [/dashboard/pengeluaran]():
	- membuat laporan pengeluaran berdasarkan kos
	- mengedit laporan pengeluaran
	- menghapus laporan pengeluaran
- [/dashboard/laporan]():
	- melihat laporan berdasarkan kos
	- mengedit laporan status (terkirim, diproses, sudah diperbaiki)
- [/dashboard/messages]():
	- membuat pesan berdasarkan grup dan user
	- mengedit pesan
	- menghapus pesan

**12 jul**:
	- manajemen user:
	user: (melihat semua user, ganti role, reset password)
	penghuni: (melihat semua penghuni, verif, reset password, melihat penghuni berdasarkan kos)
	penjaga: (reset password, menambahkan penjaga)