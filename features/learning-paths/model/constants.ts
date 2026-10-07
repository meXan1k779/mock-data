export interface LearningPathDefinition {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  /** Matches Card's `complexity`/LevelBadge scale: 1 = beginner, 2 = advanced, 3 = expert */
  complexity: number;
  whatYouLearn: string[];
  whoItsFor: {
    positive: string[];
    negative: string;
  };
  /**
   * Real published article IDs (edu-api.finex.co.id), curated to match the
   * Figma "Course structure" list for this path, in display order. Not every
   * article named in the Figma mock has been published yet — see the "missing
   * from backend" note next to the paths below that are short a few IDs.
   */
  articleIds: string[];
}

export const learningPaths: LearningPathDefinition[] = [
  {
    id: 'trading-from-zero',
    title: 'Mulai Trading Dari Nol',
    description:
      'Everything you need before your first trade — set up and secure your account, connect it to MT5, fund it, and understand the market mechanics that shape every order you place. No jargon, just the steps that actually matter.',
    heroImage: '/learning-paths/trading-from-zero.png',
    complexity: 1,
    whatYouLearn: [
      'Create and verify your trading account without the guesswork',
      'Secure your account properly before you touch any strategy',
      'Find your way around the Finex app and connect it to MT5',
      'Deposit and withdraw funds with confidence',
      'Understand slippage, spread, and volatility — and why they matter',
      'See how trading hours affect your order execution',
    ],
    whoItsFor: {
      positive: [
        "You just signed up and haven't placed a trade yet",
        'You have an account but skipped verification or security setup',
        "You're unsure how deposits, withdrawals, or the MT5 connection work",
      ],
      negative: "you're already trading live and comfortable with the basics",
    },
    articleIds: [
      'e60b4d31-14f4-4b53-807b-1bc4276117cd', // Mulai Perjalanan Trading Kamu, Kita Bahas Bersama
      'daba70b0-2a5f-4eba-9123-83fe8e2f7732', // Langkah Pertama ke Dunia Trading: Membuat dan Mengakses Akun
      'c3a59de5-8e4f-4308-a9b4-b9253208ebd5', // Verifikasi Akun: Apa yang Akan Kamu Lalui
      '89b2efe0-6c02-4885-a228-3b05f5620a69', // Sebelum Fokus ke Strategi, Amankan Akun Trading Kamu Dulu
      '93148277-ab6d-4ddc-a8ff-08d654f2743f', // Kenalan Sama Aplikasi Trading Finex
      '4ad6352f-d046-4f02-8c03-0bec9b9e2da9', // Cara Gampang Sambungkan Akun Kamu ke MT5
      '40bc7f42-24e4-44ef-8cea-09a31d84bcea', // Siap Menambah Dana? Begini Cara Kerja Deposit
      'a46100f7-d50a-4d34-94c1-82a29b8ad60e', // Withdrawl Gampang dan Cepat
      '167a8636-a5e3-4ef5-94e9-89ff2a651ad1', // Slippage, Volatility, dan Spread
      'cacf6752-9579-48fd-8818-5028eaa744e8', // Trading Hours dan Dampaknya terhadap Eksekusi Order
    ],
  },
  {
    id: 'read-the-market',
    title: 'Baca Pergerakan Market',
    description:
      'Learn to read candlesticks and charts the way traders actually use them — not to predict the future, but to understand what the market is telling you right now.',
    heroImage: '/learning-paths/read-the-market.png',
    complexity: 1,
    whatYouLearn: [
      'Read candlesticks without feeling overwhelmed by patterns',
      'Understand what candlesticks really show: market behavior, not predictions',
      'Read a chart with confidence, even as a complete beginner',
      'Spot potential opportunities and price movement on a chart',
      'Apply a simple one-candle trading strategy',
      'Build the habit of having one clear reason behind every trade',
    ],
    whoItsFor: {
      positive: [
        "You can open a chart but aren't sure what you're looking at",
        "You've heard of candlesticks but never learned to read them properly",
        'You want to move from guessing to reasoning through a trade',
      ],
      negative: 'you already read price action fluently and trade off it daily',
    },
    // Figma also lists "Trend vs Range", "Trading Supply & Demand Dengan Mudah",
    // "Trading Harga Diskon Dengan Fibonacci", "Rahasia Trading Divergence" —
    // not yet published in the backend, so the path is 6 articles instead of 10.
    articleIds: [
      'c2cf1170-9c90-4992-ab5b-8e15f04f1e5a', // Candlestick Itu Nggak Serumit Kelihatannya
      '609bdaf2-73fe-4feb-b9a9-e855282bd98b', // Candlestick Itu Membaca Perilaku Market, Bukan Meramal Masa Depan
      '4a98c4e8-02ad-4e12-ae26-4ce0ac08f442', // Baru Mulai Trading? Ini Cara Membaca Chart Tanpa Ribet
      '6172ceea-f6e3-4c98-8811-1a64f73b0294', // Melihat Peluang di Chart & Potensi Pergerakan Harga
      '99524161-db45-4112-a505-3d9651f6f5b4', // Strategi Rahasia Trading 1 Candle
      'b1d3178c-cbc1-4d9c-96ce-2deb0cdcae43', // Satu Trade, Satu Alasan
    ],
  },
  {
    id: 'build-your-trading-process',
    title: 'Bangun Cara Tradingmu',
    description:
      "Trading isn't about being right on every chart — it's about having a process that keeps you in the game. Learn the risk, planning, and mindset habits that separate traders who last from those who don't.",
    heroImage: '/learning-paths/build-trading-process.png',
    complexity: 2,
    whatYouLearn: [
      'Build the foundation that keeps you from an early knockout',
      'Create a trade plan — and understand why every trader needs one',
      'Use stop loss and take profit at the right time, for the right reason',
      "Manage risk so one bad trade doesn't become a blown account",
      'Scale your lot size gradually instead of going all-in too soon',
      'Handle losses as part of the process, not a personal failure',
    ],
    whoItsFor: {
      positive: [
        'You understand basic chart reading but keep losing money anyway',
        'You trade without a plan, or abandon it under pressure',
        'You want to build habits that protect your account long-term',
      ],
      negative: "you haven't set up your account yet or are still learning to read a chart",
    },
    // Figma also lists "Trading Journal" — not yet published in the backend,
    // so the path is 8 articles instead of 9.
    articleIds: [
      'e61d0822-3cf1-4461-81d3-fdee8dad3e48', // Jangan Cepat KO di Trading: Ini Fondasi yang Harus Kamu Punya
      '19219679-7b07-40a4-9069-5445a180d144', // Kenapa Trader Selalu Punya Trade Plan?
      'ff2cb313-2856-47f7-9c70-670cab2ff634', // Kapan dan Kenapa Kamu Perlu Pakai Stop Loss dan Take Profit
      '289c5936-28e0-4362-9977-021ea256d078', // Kenapa Banyak Trader Habis Bukan Karena Salah Analisis, Tapi Karena Salah Atur Risiko
      '7eeb649e-b15d-405c-8493-2017045bdea5', // Kenapa Ukuran Lot Sebaiknya Naik Bertahap, Bukan Langsung Besar
      '750f47e7-e94f-484d-92dc-fd8834e787ad', // Kenapa Trader Full-Time Punya Lebih dari Satu Akun?
      'a485a226-c8de-42c7-a57c-0978ca626115', // Loss Itu Nggak Enak Tapi Itu Bagian dari Trading
      '96f2b5b4-4c97-4e45-bad2-4550554f980b', // Kenapa Banyak Trader Sebenarnya Gagal Bukan Karena Chart, Tapi Karena Emosi
    ],
  },
];

export const getLearningPathById = (id: string) => learningPaths.find((path) => path.id === id);
