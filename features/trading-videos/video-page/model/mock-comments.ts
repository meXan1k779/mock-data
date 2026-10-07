import type { CommentDto } from '@/features/article/article-page/api/types';

// Neutral, topic-relevant seed comments shown on each mock video's page —
// real comments can't exist for these since the ids don't exist on the
// backend (see comments-api.ts), and without them the page looked empty
// despite the "X komentar" heading (sourced from VIDEO_ENGAGEMENT in
// features/trading-videos/model/constants.ts) suggesting otherwise. These
// render alongside that count, not instead of it — see seedCount in
// video-page/ui/index.tsx.
interface SeedCommentInput {
  authorName: string;
  text: string;
  /** Hours ago, used to stagger createdAt so ordering looks natural. */
  hoursAgo: number;
  vote?: number;
}

const SEED_COMMENTS_BY_VIDEO: Record<string, SeedCommentInput[]> = {
  'macd-divergence': [
    {
      authorName: 'Reza Firmansyah',
      text: 'Penjelasannya cukup jelas, tapi saya masih bingung membedakan divergence bullish sama bearish di chart real-time. Ada tips lain?',
      hoursAgo: 5,
      vote: 4,
    },
    {
      authorName: 'Indah Permatasari',
      text: 'Baru ngerti kenapa MACD sering dipakai bareng indikator lain setelah nonton ini. Makasih penjelasannya.',
      hoursAgo: 20,
      vote: 2,
    },
    {
      authorName: 'Fajar Nugroho',
      text: 'Contoh chart-nya membantu banget buat pemula kayak saya. Mungkin bisa dibuatkan video lanjutan soal timeframe yang cocok?',
      hoursAgo: 70,
      vote: 1,
    },
  ],
  'fibonacci-golden-area': [
    {
      authorName: 'Wulan Oktaviani',
      text: 'Golden area-nya jadi lebih masuk akal setelah lihat contoh di video ini, biasanya saya cuma asal tarik garis fibo.',
      hoursAgo: 8,
      vote: 3,
    },
    {
      authorName: 'Teguh Santosa',
      text: 'Mau tanya, level fibo yang dipakai di sini default dari platform atau disesuaikan manual ya?',
      hoursAgo: 30,
      vote: 0,
    },
    {
      authorName: 'Yuni Kartika',
      text: 'Penjelasan soal retracement-nya pelan dan runtut, enak diikuti sambil praktik langsung di chart.',
      hoursAgo: 40,
      vote: 1,
    },
  ],
  'candlestick-engulfing': [
    {
      authorName: 'Agus Setiawan',
      text: 'Pola engulfing-nya kelihatan jelas di contoh candle-nya, jadi lebih gampang dikenali sekarang.',
      hoursAgo: 6,
      vote: 2,
    },
    {
      authorName: 'Maya Anggraini',
      text: 'Apakah pola ini lebih akurat kalau dipakai di timeframe daily dibanding timeframe kecil?',
      hoursAgo: 26,
      vote: 0,
    },
    {
      authorName: 'Rian Hidayat',
      text: 'Suka cara videonya bandingin contoh valid sama yang bukan engulfing, jadi nggak gampang salah baca chart.',
      hoursAgo: 55,
      vote: 3,
    },
  ],
  'support-resistance': [
    {
      authorName: 'Citra Dewanti',
      text: 'Bagian big movement-nya menarik, kadang saya suka salah tebak kapan harga bakal breakout beneran atau cuma false break.',
      hoursAgo: 4,
      vote: 2,
    },
    {
      authorName: 'Hendra Gunawan',
      text: 'Cara nentuin level support resistance di sini lumayan sederhana, cocok buat yang baru belajar kayak saya.',
      hoursAgo: 18,
      vote: 1,
    },
    {
      authorName: 'Putri Lestari',
      text: 'Ada rencana bikin video soal cara konfirmasi breakout biar nggak kena jebakan pasar?',
      hoursAgo: 50,
      vote: 0,
    },
  ],
  'deposit-withdrawal-guide': [
    {
      authorName: 'Doni Saputra',
      text: 'Langkah-langkahnya runtut, jadi nggak bingung lagi pas pertama kali deposit kemarin.',
      hoursAgo: 3,
      vote: 2,
    },
    {
      authorName: 'Lia Marlina',
      text: 'Tampilan di video sama persis dengan aplikasi saya, jadi gampang diikuti step by step.',
      hoursAgo: 15,
      vote: 1,
    },
    {
      authorName: 'Arief Rahman',
      text: 'Mau tanya, metode deposit yang ditunjukkan di sini semuanya tersedia untuk semua jenis akun atau tidak?',
      hoursAgo: 33,
      vote: 0,
    },
  ],
  'deposit-withdrawal-fees': [
    {
      authorName: 'Novi Andriani',
      text: 'Penjelasan soal biayanya cukup detail, saya jadi tahu kenapa waktu proses tiap metode beda-beda.',
      hoursAgo: 9,
      vote: 1,
    },
    {
      authorName: 'Bambang Wijaya',
      text: 'Baru sadar ternyata ada biaya admin tambahan untuk metode tertentu, untung lihat video ini dulu.',
      hoursAgo: 24,
      vote: 2,
    },
    {
      authorName: 'Sinta Maharani',
      text: 'Infonya membantu buat bandingin metode mana yang paling hemat biaya buat kebutuhan saya.',
      hoursAgo: 48,
      vote: 0,
    },
  ],
  'withdrawal-troubleshooting': [
    {
      authorName: 'Eko Prasetyo',
      text: 'Kemarin sempat kendala pas penarikan, untung nemu video ini, langsung ketemu penyebabnya.',
      hoursAgo: 2,
      vote: 5,
    },
    {
      authorName: 'Rina Kusuma',
      text: 'Bagian soal verifikasi data penerima dana ini sering kelewat, makasih sudah diingetin.',
      hoursAgo: 12,
      vote: 3,
    },
    {
      authorName: 'Fahmi Ardiansyah',
      text: 'Mungkin bisa ditambahin juga solusi kalau status penarikan stuck di pending lama ya?',
      hoursAgo: 60,
      vote: 1,
    },
  ],
  'risk-management-basics': [
    {
      authorName: 'Dewi Anjani',
      text: 'Penjelasan stop loss sama position sizing-nya gampang dipahami, biasanya saya suka asal-asalan nentuin itu.',
      hoursAgo: 7,
      vote: 3,
    },
    {
      authorName: 'Gilang Ramadhan',
      text: 'Baru sadar selama ini saya jarang hitung risk per trade, kayaknya perlu mulai dicatat rutin.',
      hoursAgo: 22,
      vote: 2,
    },
    {
      authorName: 'Mega Puspita',
      text: 'Contoh perhitungan position size-nya membantu banget buat yang masih awam soal manajemen risiko.',
      hoursAgo: 65,
      vote: 1,
    },
  ],
  'trading-psychology-fomo': [
    {
      authorName: 'Irfan Maulana',
      text: 'Relate banget sama bagian panic selling, saya sering kejebak situasi kayak gitu pas market lagi volatile.',
      hoursAgo: 5,
      vote: 4,
    },
    {
      authorName: 'Vina Oktaviani',
      text: 'Tips buat ngatasin FOMO di video ini sederhana tapi masuk akal, bisa langsung dipraktikkan.',
      hoursAgo: 19,
      vote: 2,
    },
    {
      authorName: 'Yusuf Pratama',
      text: 'Pembahasan psikologi trading kayak gini jarang dibahas tuntas, bagus jadi pengingat buat tetap disiplin.',
      hoursAgo: 44,
      vote: 1,
    },
  ],
  'finex-platform-tour': [
    {
      authorName: 'Tari Handayani',
      text: 'Tur fiturnya lengkap, baru tahu ternyata ada menu yang selama ini belum pernah saya buka.',
      hoursAgo: 6,
      vote: 2,
    },
    {
      authorName: 'Dedi Kurniawan',
      text: 'Penjelasan tiap bagian platformnya runtut, jadi gampang diikuti buat yang baru pindah dari aplikasi lain.',
      hoursAgo: 21,
      vote: 1,
    },
    {
      authorName: 'Nia Rachmawati',
      text: 'Semoga ada video lanjutan yang bahas lebih detail soal fitur analisis chart-nya.',
      hoursAgo: 52,
      vote: 0,
    },
  ],
  'account-verification-guide': [
    {
      authorName: 'Hadi Saputra',
      text: 'Panduannya jelas, proses verifikasi akun saya jadi lebih cepat setelah ikutin langkah di video ini.',
      hoursAgo: 4,
      vote: 3,
    },
    {
      authorName: 'Lusi Andini',
      text: 'Bagian dokumen yang perlu disiapkan dijelasin detail, jadi nggak bolak-balik upload ulang.',
      hoursAgo: 16,
      vote: 1,
    },
    {
      authorName: 'Oka Wirawan',
      text: 'Mau tanya, estimasi waktu verifikasi di video ini masih berlaku atau sudah berubah ya?',
      hoursAgo: 38,
      vote: 0,
    },
  ],
  'advanced-chart-tools': [
    {
      authorName: 'Ratna Sari',
      text: 'Penjelasan Bollinger Bands sama RSI-nya cukup dalam, baru ngeh ternyata bisa dikombinasikan kayak gitu.',
      hoursAgo: 9,
      vote: 3,
    },
    {
      authorName: 'Seno Prabowo',
      text: 'Baru tahu ada pengaturan tambahan di alat chart ini, selama ini saya cuma pakai settingan default.',
      hoursAgo: 27,
      vote: 2,
    },
    {
      authorName: 'Wiwin Suryani',
      text: 'Buat yang udah lumayan paham analisis teknis, video ini bagus buat naikin level lebih lanjut.',
      hoursAgo: 58,
      vote: 1,
    },
  ],
  'expert-portfolio-hedging': [
    {
      authorName: 'Zaki Firmansyah',
      text: 'Strategi hedging yang dibahas di sini masuk akal, meskipun masih perlu banyak latihan buat eksekusinya.',
      hoursAgo: 11,
      vote: 2,
    },
    {
      authorName: 'Aulia Rahmah',
      text: 'Penjelasan soal kapan waktu yang tepat pakai hedging ini cukup membantu buat trader yang portofolionya mulai beragam.',
      hoursAgo: 29,
      vote: 1,
    },
    {
      authorName: 'Bayu Saputra',
      text: 'Topik kayak gini jarang dibahas secara praktis, enak juga ada contoh kasusnya langsung.',
      hoursAgo: 62,
      vote: 0,
    },
  ],
};

function buildSeedComments(videoId: string, inputs: SeedCommentInput[]): CommentDto[] {
  return inputs.map((input, index) => ({
    id: `seed-${videoId}-${index}`,
    userId: `seed-user-${videoId}-${index}`,
    contentId: videoId,
    parentId: null,
    message: input.text,
    createdAt: new Date(Date.now() - input.hoursAgo * 60 * 60 * 1000).toISOString(),
    isDeleted: false,
    user: { nickname: input.authorName, avatarUrl: null },
    replies: 0,
    vote: input.vote ?? 0,
  }));
}

export function getSeedComments(videoId: string): CommentDto[] {
  const inputs = SEED_COMMENTS_BY_VIDEO[videoId];
  return inputs ? buildSeedComments(videoId, inputs) : [];
}
