'use client';

export const TermsOfUse = () => {
  return (
    <div className="max-w-[700px] mx-4 sm:mx-8 md:mx-auto mt-6 md:mt-10">
      <div className="text-[28px] sm:text-[32px] md:text-[40px] font-bold font-manrope mb-5 leading-12">
        Platform Edukasi Finex – Syarat & Ketentuan
      </div>
      <div className="font-semibold mb-3">1. Pendahuluan</div>
      <div className="mb-5">
        Selamat datang di Platform Edukasi Finex (“Platform”), lingkungan pendidikan tempat para
        kreator trader menerbitkan materi pembelajaran, dan pengguna dapat membaca, menilai, dan
        memberikan umpan balik. Dengan mengakses atau menggunakan Platform, Anda setuju untuk
        mematuhi Syarat & Ketentuan ini (“Ketentuan”). Platform ini beroperasi secara terpisah dari
        sistem perdagangan Finex. Akun yang dibuat di Platform Edukasi Finex ada secara independen
        dan tidak memberikan akses ke layanan perdagangan atau akun perdagangan.
      </div>
      <div className="font-semibold mb-3">2. Tujuan Platform</div>
      <div className="mb-3">
        Platform ini dirancang untuk mendukung perjalanan pembelajaran para trader dengan
        menyediakan:
      </div>
      <ul className="list-disc list-inside mb-3">
        <li>Materi pendidikan berbasis teks</li>
        <li>Konten video (fase mendatang)</li>
        <li>Sesi langsung (fase mendatang)</li>
        <li>Alat untuk refleksi diri, manajemen risiko, dan analisis kinerja (fase mendatang)</li>
        <li>
          Model berbasis komunitas di mana para kreator berbagi pengetahuan dan pengguna memberikan
          umpan balik
        </li>
      </ul>
      <div className="mb-5">
        Platform ini tidak memberikan rekomendasi investasi, sinyal perdagangan, atau nasihat
        keuangan.
      </div>
      <div className="font-semibold mb-3">3. Peran Pengguna dan Tingkat Akses</div>
      <div className="mb-3">
        Platform ini menggunakan model Kontrol Akses Berbasis Peran (RBAC):
      </div>
      <div className="mb-3">3.1 Pengguna Tidak Resmi</div>
      <ul className="list-disc list-inside mb-3">
        <li>Akses: hanya membaca konten</li>
        <li>Tidak dapat berkomentar atau memberi peringkat pada konten</li>
      </ul>
      <div className="mb-3">3.2 Pengguna Terdaftar</div>
      <ul className="list-disc list-inside mb-3">
        <li>Membaca materi</li>
        <li>Memberikan komentar</li>
        <li>Memberi peringkat pada konten</li>
      </ul>
      <div className="mb-3">3.3 Pembuat Konten</div>
      <ul className="list-disc list-inside mb-3">
        <li>Semua hak Pengguna</li>
        <li>Mengunggah konten teks dan file</li>
        <li>Memilih topik dan subtopik untuk konten yang dipublikasikan</li>
        <li>Mengedit konten yang telah dipublikasikan atau draf</li>
      </ul>
      <div className="mb-3">3.4 Administrator</div>
      <ul className="list-disc list-inside mb-3">
        <li>Semua hak Moderator</li>
        <li>Kemampuan untuk menyembunyikan atau menghapus konten</li>
        <li>Kemampuan untuk menghapus akun pengguna</li>
      </ul>
      <div className="font-semibold mb-3">2. Standar Konten</div>
      <div className="mb-3">
        Untuk memastikan materi pembelajaran yang berkualitas tinggi, etis, dan aman, semua konten
        yang dipublikasikan harus mematuhi aturan berikut:
      </div>
      <div className="mb-3">4.1 Konten Terlarang</div>
      <div className="mb-3">Berikut ini tidak diperbolehkan:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Saran keuangan, sinyal perdagangan, perkiraan, atau janji keuntungan</li>
        <li>Informasi yang salah, klaim yang tidak berdasar, atau manipulasi pasar</li>
        <li>Konten yang menyinggung, berbahaya, diskriminatif, atau tidak pantas</li>
        <li>Plagiarisme atau pelanggaran hak cipta</li>
        <li>Tangkapan layar atau konten yang mengungkap informasi identitas pribadi</li>
      </ul>
      <div className="mb-3">4.2 Akurasi dan Kualitas Konten</div>
      <div className="mb-3">Para pembuat konten harus:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Memberikan informasi edukatif yang jelas, faktual, dan terstruktur dengan baik</li>
        <li>Menghindari klaim spekulatif tentang perilaku pasar</li>
        <li>Menyatakan semua contoh sebagai hipotetis, edukatif, atau ilustratif</li>
        <li>Memperbarui konten seperlunya ketika ditemukan ketidaksesuaian atau kesalahan</li>
      </ul>
      <div className="mb-3">4.3 Persetujuan Regulator</div>
      <div className="mb-3">
        Jenis konten tertentu mungkin memerlukan persetujuan dari regulator keuangan nasional atau
        regional.
      </div>
      <div className="mb-5">
        Jika persyaratan tersebut berlaku, konten akan diajukan untuk ditinjau sebelum
        dipublikasikan atau didistribusikan lebih lanjut. Para pembuat konten harus mematuhi umpan
        balik regulator dan memperbarui konten sesuai dengan itu.
      </div>
      <div className="font-semibold mb-3">5. Proses Moderasi</div>
      <div className="mb-3">Moderasi meliputi:</div>
      <ul className="list-disc list-inside mb-3">
        <li>
          Peninjauan otomatis menggunakan penyaringan berbasis LLM (untuk pola terlarang, klaim
          berisiko, konten berbahaya)
        </li>
        <li>Peninjauan manual oleh Moderator Platform</li>
        <li>
          Alur kerja status konten: Draf → Sedang Ditinjau → Peninjauan Regulator → Diterbitkan /
          Ditolak / Dikembalikan untuk Revisi
        </li>
        <li>Kemampuan untuk meminta revisi dari creator</li>
        <li>Eskalasi ke Administrator untuk kasus-kasus kompleks</li>
      </ul>
      <div className="mb-5">
        Platform berhak untuk menghapus konten apa pun yang melanggar Ketentuan ini.
      </div>
      <div className="font-semibold mb-3">6. Perilaku Pengguna</div>
      <div className="mb-3">Semua pengguna setuju untuk:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Berkomunikasi dengan hormat</li>
        <li>Menghindari pelecehan, ancaman, spam, atau penyalahgunaan</li>
        <li>Memberikan umpan balik yang konstruktif dan relevan</li>
        <li>Menahan diri dari promosi atau ajakan komersial</li>
      </ul>
      <div className="mb-5">
        Pelanggaran dapat mengakibatkan penghapusan komentar, penangguhan sementara, atau
        pemblokiran akun permanen.
      </div>
      <div className="font-semibold mb-3">7. Sistem Penilaian dan Umpan Balik</div>
      <div className="mb-3">Platform ini menggunakan sistem Upvote/Downvote ala Reddit:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Skor = upvote – downvote</li>
        <li>Rasio = % upvote dari total suara</li>
        <li>Beberapa penyesuaian mungkin diterapkan untuk melindungi integritas suara</li>
      </ul>
      <div className="mb-5">
        Penilaian memengaruhi visibilitas konten, tetapi bukan satu-satunya faktor dalam moderasi
        atau penyorotan.
      </div>
      <div className="font-semibold mb-3">8. Hak Kekayaan Intelektual</div>
      <div className="mb-3">
        Para kreator mempertahankan hak atas konten asli mereka, tetapi memberikan lisensi kepada
        Platform untuk:
      </div>
      <ul className="list-disc list-inside mb-3">
        <li>Menghosting, menampilkan, dan mendistribusikan konten</li>
        <li>Menggunakan data agregat anonim untuk analisis dan peningkatan produk</li>
      </ul>
      <div className="mb-5">
        Platform dapat menghapus konten karena klaim hak cipta atau persyaratan hukum.
      </div>
      <div className="font-semibold mb-3">9. Manajemen Akun</div>
      <ul className="list-disc list-inside mb-3">
        <li>Akun di Platform Pendidikan Finex terpisah dari akun perdagangan Finex.</li>
        <li>Pengguna bertanggung jawab untuk menjaga keamanan kredensial login.</li>
        <li>Platform dapat menangguhkan atau menghentikan akun yang melanggar Ketentuan.</li>
      </ul>
      <div className="font-semibold mb-3">10. Penyimpanan dan Pemrosesan Data</div>
      <div className="mb-3">Platform ini menggunakan:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Backend NodeJS, basis data Postgres, penyimpanan S3</li>
        <li>Otentikasi dan tokenisasi yang aman</li>
        <li>Pencadangan rutin dan mekanisme redundansi</li>
        <li>Penanganan data yang selaras dengan peraturan privasi dan keamanan</li>
      </ul>
      <div className="font-semibold mb-3">11. Peta Jalan Platform dan Siklus Hidup Fitur</div>
      <div className="mb-3">Fungsionalitas disampaikan secara iteratif:</div>
      <ul className="list-inside mb-3">
        <li>1. Penerbitan, pembacaan, dan moderasi konten teks</li>
        <li>2. Onboarding kreator dan perluasan konten</li>
        <li>3. Umpan balik dan sistem penilaian</li>
        <li>4. Dukungan konten video</li>
        <li>5. Dukungan siaran langsung</li>
        <li>6. Konsultasi Berbayar</li>
        <li>7. Alat pedagang: manajemen risiko, pencatatan jurnal, analitik</li>
        <li>8. Asisten AI, kalender ekonomi</li>
      </ul>
      <div className="mb-5">Platform berhak untuk menyesuaikan cakupan sesuai kebutuhan.</div>
      <div className="font-semibold mb-3">12. Penafian</div>
      <ul className="list-disc list-inside mb-3">
        <li>Platform ini tidak menawarkan saran perdagangan.</li>
        <li>
          Konten edukatif disediakan "sebagaimana adanya" dan mungkin tidak selalu mencerminkan
          kondisi pasar.
        </li>
        <li>
          Pengguna sepenuhnya bertanggung jawab atas setiap keputusan yang dibuat berdasarkan
          pengalaman belajar mereka.
        </li>
      </ul>
      <div className="font-semibold mb-3">13. Batasan Tanggung Jawab</div>
      <div className="mb-3">Platform tidak bertanggung jawab atas:</div>
      <ul className="list-disc list-inside mb-3">
        <li>Kerugian perdagangan</li>
        <li>Ketidakakuratan konten kreator</li>
        <li>Gangguan layanan, pemadaman, atau keterlambatan data</li>
        <li>Tindakan yang dilakukan pengguna berdasarkan konten</li>
      </ul>
      <div className="font-semibold mb-3">14. Perubahan pada Syarat dan Ketentuan Ini</div>
      <div className="mb-5">
        Platform dapat memperbarui Syarat dan Ketentuan ini secara berkala. Penggunaan berkelanjutan
        merupakan penerimaan terhadap Syarat dan Ketentuan yang telah diperbarui.
      </div>
      <div className="font-semibold mb-3">15. Informasi Kontak</div>
      <div className="mb-3">Dukungan: education@finex.co.id</div>
      <div className="mb-3">Untuk masalah moderasi: melalui alat pelaporan dalam platform</div>
      <div className="mb-20">
        Untuk pertanyaan hukum: hubungi melalui situs web resmi Finex Education
      </div>
    </div>
  );
};
