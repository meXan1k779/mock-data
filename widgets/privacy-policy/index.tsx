'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

export const PrivacyPolicyPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview('/privacy-policy', user);
  }, []);

  return (
    <div className="max-w-[700px] mx-4 sm:mx-8 md:mx-auto mt-6 md:mt-10">
      <div className="text-[28px] sm:text-[32px] md:text-[40px] font-bold font-manrope mb-5 leading-12">
        Platform Edukasi Finex — Kebijakan Privasi
      </div>
      <div className="text-content-secondary mb-5">Tanggal Efektif: 16.03.2026</div>
      <div className="mb-5">
        Kebijakan Privasi ini menjelaskan bagaimana Platform Edukasi Finex (“kami”, “kita”, “milik
        kami”) mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda, saat
        Anda mengakses atau menggunakan layanan web dan seluler kami. Dengan membuat akun atau
        menggunakan Platform, Anda dapat menyetujui praktik yang dijelaskan dalam Kebijakan ini.
      </div>
      <div className="font-semibold mb-3">
        1. Apa yang dicakup Kebijakan Privasi ini berlaku untuk semua layanan yang disediakan
        melalui Platform Edukasi Finex, termasuk:
      </div>
      <ul className="list-disc list-inside mb-3">
        <li>Membaca materi edukasi</li>
        <li>Menerbitkan konten (untuk Kreator)</li>
        <li>Fitur interaksi (komentar, peringkat, upvote/downvote)</li>
        <li>Alat moderasi</li>
        <li>Konten video dan fitur siaran langsung (fase mendatang)</li>
        <li>Alat bantu AI</li>
        <li>
          Layanan dari bagian aplikasi atau situs web yang bekerja dibelakang layar (edukasi API,
          edukasi antar muka)
        </li>
      </ul>
      <div className="mb-5">
        Kebijakan ini tidak berlaku untuk platform keuangan eksternal, sistem perdagangan, atau
        produk Finex lainnya. Akun Edukasi Finex Anda terpisah dari sistem terkait perdagangan apa
        pun.
      </div>
      <div className="font-semibold mb-3">
        {' '}
        2 Informasi yang Kami kumpulkan, hanya mengumpulkan data yang diperlukan untuk menyediakan
        dan meningkatkan Platform.
      </div>
      <div className="mb-3">2.1 Informasi yang Anda Berikan</div>
      <ul className="list-disc list-inside mb-3">
        <li>Data Akun: nama (opsional), alamat email, kredensial login</li>
        <li>Pengaturan Profil: pengguna, Pembuat, Moderator, Administrator</li>
        <li>
          Konten Yang Diunggah: materi teks, artikel edukasi, komentar, file, informasi yang
          terstruktur
        </li>
        <li>Tanggapan / Respon: rating, menyukai/tidak suka, laporan, komentar</li>
        <li>
          Komunikasi: laporan atau percakapan yang dikelola oleh admin/moderator untuk menjaga
          keamanan dan ketertiban platform.
        </li>
      </ul>

      <div className="mb-3">2.2 Informasi yang Dikumpulkan Secara Otomatis</div>
      <ul className="list-disc list-inside mb-3">
        <li>Data perangkat (jenis perangkat, versi OS, browser)</li>
        <li>Log teknis (alamat IP, stempel waktu, log kesalahan)</li>
        <li>
          Analisis penggunaan atau wawasan objektif tentang apa yang sebenarnya dilakukan pengguna
          (terkait halaman yang dikunjungi, konten yang dilihat, waktu yang telah berlalu)
        </li>
        <li>Metrik Kinerja (Waktu Pemuatan, Gangguan/Mogok Aplikasi)</li>
      </ul>

      <div className="mb-3">2.3 Untuk Kreator</div>
      <ul className="list-disc list-inside mb-3">
        <li>File yang diunggah dan versi draf</li>
        <li>Meta data konten</li>
        <li>Riwayat revisi atau catatan perubahan</li>
        <li>
          Status moderasi (Draf / Sedang Ditinjau / Ditinjau Regulator / Diterbitkan / Ditolak /
          Dikembalikan untuk revisi)
        </li>
      </ul>

      <div className="mb-3">2.4 File Teks Kecil & Teknologi Pelacakan Digunakan untuk:</div>
      <ul className="list-disc list-inside mb-3">
        <li>autentikasi</li>
        <li>menjaga sesi Anda agar tetap aktif (masuk/login)</li>
        <li>Analisis platform</li>
        <li>Menyesuaikan konten yang ditampilkan di feed (beranda)</li>
      </ul>
      <div className="mb-5">Kami tidak menggunakan pelacakan untuk iklan.</div>
      <div className="font-semibold mb-3"> 3. Bagaimana Kami Menggunakan Informasi Anda</div>
      <div className="mb-3">3.1 Menyediakan dan Mengoperasikan Platform</div>
      <ul className="list-disc list-inside mb-3">
        <li>Pembuatan dan login akun</li>
        <li>Menampilkan dan mengatur konten</li>
        <li>Penerbitan dan moderasi konten</li>
        <li>Mekanisme komentar dan penilaian</li>
        <li>Pemutaran video dan hosting unggahan file</li>
        <li>Alat berbasis AI (pemeriksaan konten, ringkasan, moderasi)</li>
      </ul>
      <div className="mb-3">3.2 Meningkatkan Pengalaman Pengguna</div>
      <ul className="list-disc list-inside mb-3">
        <li>Mempersonalisasi konten yang direkomendasikan</li>
        <li>Mengukur keterlibatan dan kualitas konten</li>
        <li>Menjalankan eksperimen UX dan uji A/B</li>
        <li>
          (Secara lebih mendalam, ini merujuk pada proses ilmiah dan berbasis data untuk
          membandingkan dua versi atau lebih dari sebuah desain produk digital (website, aplikasi,
          atau elemen di dalamnya)
        </li>
      </ul>
      <div className="mb-3">3.3 Menjaga Keamanan dan Integritas Platform</div>
      <ul className="list-disc list-inside mb-3">
        <li>Pencegahan spam (pesan sampah) dan penyalahgunaan</li>
        <li>Moderasi konten</li>
        <li>Penegakan aturan dan pemblokiran pengguna</li>
        <li>Pemantauan keamanan dan penipuan</li>
      </ul>
      <div className="mb-3">3.4 Kepatuhan Regulasi (kepatuhan hukum)</div>
      <ul className="list-disc list-inside mb-3">
        <li>
          Menanggapi permintaan informasi resmi yang telah terverifikasi dari lembaga pengatur
          (regulator)
        </li>
        <li>Menerapkan pembatasan konten yang ditentukan oleh hukum</li>
        <li>
          Menyerahkan/mengirimkan konten untuk mendapatkan persetujuan Regulator (jika
          diperlukan/berlaku)
        </li>
      </ul>
      <div className="font-semibold mb-3">
        4. Moderasi Konten & Persyaratan Regulasi (proses penyaringan dan pemantauan konten yang
        diunggah pengguna (User Generated Content/UGC) agar mematuhi aturan platform serta
        hukum/peraturan pemerintah yang berlaku)
      </div>
      <ul className="list-disc list-inside mb-3">
        <li>Semua konten di Platform dapat ditinjau oleh Moderator dan Administrator.</li>
        <li>
          Alat (berbasis) AI mungkin akan menyaring konten terlebih dahulu untuk mencari
          pelanggaran.
        </li>
        <li>Kreator yang menerbitkan materi edukasi menyetujui bahwa:</li>
        <li className="ml-5">
          Konten mereka dapat diedit, dibatasi, atau dihapus jika melanggar aturan.
        </li>
        <li className="ml-5">
          Jika diwajibkan oleh regulator (badan pengatur) Indonesia atau Internasional, konten
          tertentu dapat menjalani peninjauan atau persetujuan tambahan sebelum atau sesudah
          publikasi.
        </li>
      </ul>
      <div className="mb-5">
        {' '}
        Anda akan diberitahu jika konten Anda memerlukan pemeriksaan regulasi.
      </div>
      <div className="font-semibold mb-3">5. Bagaimana Kami Membagikan Data Pribadi</div>
      <div className="mb-3">
        Kami tidak menjual atau menyewakan data Anda. Kami hanya dapat membagikan data dengan:
      </div>
      <div className="mb-3">5.1 Penyedia Layanan</div>
      <ul className="list-disc list-inside mb-3">
        <li>
          Layanan penyimpanan awan yang menggunakan antarmuka (API) yang sama dengan Amazon S3,
          memungkinkan data disimpan, diakses, dan dikelola menggunakan alat-alat standar industri
          S3 tanpa perlu mengubah aplikasi
        </li>
        <li>
          Sistem pengiriman email otomatis (mailer) yang berbasis operasional (OP) atau digunakan
          untuk keperluan operasional spesifik, yang mengirimkan email menggunakan alamat
          education@finex.co.id
        </li>
        <li>
          Alat analisis data dan alat pemantauan yang digunakan untuk mengumpulkan, menganalisis,
          memantau, dan memvisualisasikan data (baik kinerja sistem, traffic situs, maupun aktivitas
          sosial media) secara real-time
        </li>
        <li>
          Layanan moderasi AI atau penggunaan teknologi kecerdasan buatan (Artificial Intelligence),
          khususnya pembelajaran mesin (machine learning), Natural Language Processing (NLP), dan
          computer vision, untuk menganalisis, menyaring, dan mengelola konten buatan pengguna (UGC)
          secara otomatis di platform digital.
        </li>
      </ul>
      <div className="mb-3">
        Penyedia ini hanya mengakses data yang diperlukan untuk fungsi mereka.
      </div>
      <div className="mb-3">5.2 Badan Pengatur/Otoritas (jika diwajibkan secara hukum)</div>
      <div className="mb-3">
        Hanya jika diwajibkan oleh hukum atau otoritas pengatur/badan regulator.
      </div>
      <ul className="list-disc list-inside mb-3">
        <li>Moderator: Melihat konten buatan pengguna dan penandaan (laporan)</li>
        <li>
          Administrator (admin): Dapat mengakses metadata tambahan untuk moderasi dan kepatuhan
        </li>
      </ul>
      <div className="mb-5">
        Kami membatasi akses secara ketat sesuai dengan RBAC (Kontrol Akses Berbasis Peran).
      </div>
      <div className="font-semibold mb-3">6. Penyimpanan dan Keamanan Data</div>
      <div className="mb-3">Semua data disimpan menggunakan:</div>
      <ul className="list-disc list-inside mb-3">
        <li>
          Data yang dikirim (misalnya dari browser pengguna ke server) dilindungi menggunakan
          enkripsi HTTPS/TLS, sehingga tidak bisa disadap selama perjalanan.
        </li>
        <li>
          Data sensitif yang tersimpan di dalam server/database diacak (dienkripsi), sehingga jika
          terjadi kebocoran fisik, data tersebut tidak dapat dibaca tanpa kunci dekripsi
        </li>
        <li>
          Kontrol akses yang ketat berdasarkan peranan (RBAC). Hanya pengguna dengan peran tertentu
          yang diberi izin untuk mengakses data tertentu, mengurangi risiko akses tidak sah
        </li>
        <li>
          Peninjauan keamanan secara berkala. Sistem diperiksa secara rutin untuk menemukan dan
          memperbaiki kerentanan.
        </li>
        <li>
          Pemantauan terhadap perilaku tidak sah. Sistem dipantau secara terus-menerus untuk
          mendeteksi aktivitas mencurigakan atau upaya peretasan
        </li>
      </ul>
      <div className="mb-3">Infrastruktur meliputi:</div>
      <div className="mb-3">NodeJS + Postgres + server S3, yang diimplementasikan pada:</div>
      <ul className="list-disc list-inside mb-3">
        <li>edu.finex.co.id</li>
      </ul>
      <div className="mb-5">
        Kata sandi disimpan menggunakan hashing (penyimpanan kata sandi yang aman) sesuai standar
        industri.
      </div>
      <div className="font-semibold mb-3">7. Hak Anda</div>
      <div className="mb-3">Anda dapat meminta:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Akses data pribadi Anda</li>
        <li>Perbarui atau koreksi profil Anda</li>
        <li>Hapus akun Anda</li>
        <li>Hapus konten Anda (Kreator)</li>
        <li>Minta informasi tentang pembaharuan atau pembatasan</li>
        <li>
          Memilih untuk menolak atau tidak mengizinkan penggunaan cookie yang tidak penting
          (non-esensial) saat mengunjungi suatu situs web
        </li>
      </ul>
      <div className="mb-3">Untuk mengajukan permintaan, hubungi: education@finex.co.id</div>
      <div className="font-semibold mb-3">8. Penyimpanan Data</div>
      <ul className="list-disc list-inside mb-3">
        <li>Data akun: disimpan selama akun Anda aktif</li>
        <li>Konten: disimpan kecuali dihapus atau diperbaharui</li>
        <li>Log dan analitik: disimpan untuk tujuan operasional dan keamanan</li>
        <li>Data yang diwajibkan oleh peraturan: disimpan sesuai dengan hukum yang berlaku</li>
      </ul>
      <div className="font-semibold mb-3">9. Privasi Anak-Anak</div>
      <div className="mb-3">
        Platform ini tidak ditujukan untuk pengguna di bawah usia 18 tahun.
      </div>
      <div className="mb-5">
        Kami tidak secara sadar mengumpulkan informasi yang diidentifikasi secara pribadi dari
        anak-anak di bawah 18 tahun.
      </div>
      <div className="font-semibold mb-3">10. Tautan Pihak Ketiga</div>
      <div className="mb-3">Beberapa materi edukasi mungkin merujuk ke situs web eksternal.</div>
      <div className="mb-5">
        Kami tidak bertanggung jawab atas praktik privasi (keleluasaan) mereka.
      </div>
      <div className="font-semibold mb-3">11. Perubahan Kebijakan</div>
      <div className="mb-3">
        Kami dapat memperbarui Kebijakan Privasi ini seiring perkembangan Platform (fitur baru:
        video, siaran langsung, konsultasi, alat (berbasis) AI, instrumen manajemen risiko).
      </div>
      <div className="mb-5">Kami akan memberi tahu pengguna tentang perubahan besar.</div>
      <div className="font-semibold mb-3">12. Informasi Kontak</div>
      <div className="mb-3">Untuk pertanyaan, permintaan, atau hal-hal yang ingin disampaikan:</div>
      <div className="mb-3">Email: education@finex.co.id</div>
      <div className="mb-20">Platform: edu.finex.co.id</div>
    </div>
  );
};
