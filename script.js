/**
 * =================================================================
 * APLIKASI CATAT KEUANGAN KELAS: XI DKV 2
 * Logika Interaksi DOM, LocalStorage, dan Kalkulasi Finansial
 * =================================================================
 */

// 1. Inisialisasi Data dari LocalStorage atau Array Kosong
let dataKeuangan = JSON.parse(localStorage.getItem('kas_xidkv2')) || [];

// 2. Set Default Tanggal Input ke Hari Ini
const inputTanggal = document.getElementById('tanggal');
if (inputTanggal) {
    inputTanggal.valueAsDate = new Date();
}

/**
 * Fungsi untuk memformat angka menjadi format mata uang Rupiah (IDR)
 * @param {number} angka 
 * @returns {string} Format string contoh: "Rp 5.000"
 */
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(angka);
}

/**
 * Fungsi Utama: Merender Data ke Tabel HTML & Menghitung Saldo Total
 */
function renderAplikasi() {
    const tabelBody = document.getElementById('tabelMutasi');
    if (!tabelBody) return;

    tabelBody.innerHTML = '';

    let totalMasuk = 0;
    let totalKeluar = 0;

    // Kondisi jika data kosong
    if (dataKeuangan.length === 0) {
        tabelBody.innerHTML = `<tr><td colspan="5" class="empty-state">Belum ada data transaksi tercatat.</td></tr>`;
    } else {
        // Looping data transaksi untuk dimasukkan ke tabel
        dataKeuangan.forEach((item, index) => {
            if (item.tipe === 'pemasukan') {
                totalMasuk += Number(item.jumlah);
            } else {
                totalKeluar += Number(item.jumlah);
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-date">${item.tanggal}</td>
                <td><span class="text-category">${item.kategori}</span></td>
                <td class="text-name">${item.nama}</td>
                <td class="text-right font-semibold ${item.tipe === 'pemasukan' ? 'text-emerald' : 'text-rose'}">
                    ${item.tipe === 'pemasukan' ? '+' : '-'} ${formatRupiah(item.jumlah)}
                </td>
                <td class="text-center">
                    <button onclick="hapusTransaksi(${index})" class="btn-delete" title="Hapus Transaksi">✕</button>
                </td>
            `;
            tabelBody.appendChild(row);
        });
    }

    // Kalkulasi Saldo Akhir
    let saldoAkhir = totalMasuk - totalKeluar;

    // Perbarui Tampilan Ringkasan di UI
    document.getElementById('saldoTotal').innerText = formatRupiah(saldoAkhir);
    document.getElementById('totalPemasukan').innerText = formatRupiah(totalMasuk);
    document.getElementById('totalPengeluaran').innerText = formatRupiah(totalKeluar);

    // Simpan Perubahan ke LocalStorage Browser
    localStorage.setItem('kas_xidkv2', JSON.stringify(dataKeuangan));
}

// 3. Event Listener: Form Tambah Transaksi Disubmit
const formTransaksi = document.getElementById('formTransaksi');
if (formTransaksi) {
    formTransaksi.addEventListener('submit', function(e) {
        e.preventDefault();

        // Ambil nilai dari elemen form
        const transaksiBaru = {
            tanggal: document.getElementById('tanggal').value,
            tipe: document.getElementById('tipe').value,
            kategori: document.getElementById('kategori').value,
            nama: document.getElementById('nama').value,
            jumlah: Number(document.getElementById('jumlah').value)
        };

        // Masukkan data baru ke urutan paling atas array
        dataKeuangan.unshift(transaksiBaru);

        // Perbarui tampilan
        renderAplikasi();

        // Reset input form teks dan nominal saja (biar tanggal tetap)
        document.getElementById('kategori').value = '';
        document.getElementById('nama').value = '';
        document.getElementById('jumlah').value = '';
    });
}

/**
 * Fungsi untuk Menghapus Transaksi Berdasarkan Index Array
 * @param {number} index 
 */
function hapusTransaksi(index) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan transaksi ini?")) {
        dataKeuangan.splice(index, 1);
        renderAplikasi();
    }
}

/**
 * Fungsi untuk Menghapus Seluruh Data Kas Kelas
 */
function resetData() {
    if (confirm("PERINGATAN: Semua data keuangan kelas XI DKV 2 akan dihapus permanen! Lanjutkan?")) {
        dataKeuangan = [];
        localStorage.removeItem('kas_xidkv2');
        renderAplikasi();
    }
}

// 4. Jalankan Render Pertama Kali Saat Website Dibuka
renderAplikasi();
