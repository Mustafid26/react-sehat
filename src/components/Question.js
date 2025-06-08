// src/components/Question.js

const allQuestions = [
  // ===== IMT =====
  {
    category: "IMT",
    type: "Pilihan Ganda",
    question: "Apa itu IMT (Indeks Massa Tubuh)?",
    options: [
      "Alat untuk mengukur tinggi badan",
      "Alat untuk menimbang otot",
      "Cara menghitung apakah berat badan kita ideal atau tidak",
      "Jumlah kalori harian",
    ],
    answer: "Cara menghitung apakah berat badan kita ideal atau tidak",
  },
  {
    category: "IMT",
    type: "Benar/Salah",
    question: "IMT bisa menunjukkan apakah kita terlalu kurus atau kelebihan berat badan.",
    options: ["Benar", "Salah"],
    answer: "Benar",
  },
  {
    category: "IMT",
    type: "Mitos atau Fakta",
    question: "Makan banyak gula dan makanan berlemak bisa bikin IMT naik.",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
  },
  {
    category: "IMT",
    type: "Pilihan Ganda",
    question: "Berat badan ideal biasanya ada di angka IMT:",
    options: [
      "Di bawah 18",
      "Antara 18,5 sampai 25",
      "Di atas 30",
      "Tidak tahu",
    ],
    answer: "Antara 18,5 sampai 25",
  },
  {
    category: "IMT",
    type: "Mitos atau Fakta",
    question: "Obesitas cuma masalah penampilan, bukan soal kesehatan.",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
  },
  {
    category: "IMT",
    type: "Benar/Salah",
    question: "Orang yang aktif bergerak dan berolahraga lebih mudah punya IMT yang sehat.",
    options: ["Benar", "Salah"],
    answer: "Benar",
  },
  {
    category: "IMT",
    type: "Pilihan Ganda",
    question: "Apa yang bisa terjadi kalau IMT kita terlalu rendah (terlalu kurus)?",
    options: [
      "Lebih mudah sakit",
      "Tulang jadi rapuh",
      "Bisa kekurangan gizi",
      "Semua benar",
    ],
    answer: "Semua benar",
  },
  {
    category: "IMT",
    type: "Mitos atau Fakta",
    question: "Berat badan seseorang tidak dipengaruhi oleh stres atau suasana hati.",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
  },
  {
    category: "IMT",
    type: "Pilihan Ganda",
    question: "IMT yang terlalu tinggi bisa menyebabkan penyakit seperti:",
    options: ["Diabetes", "Flu", "Radang tenggorokan", "Maag"],
    answer: "Diabetes",
  },
  {
    category: "IMT",
    type: "Benar/Salah",
    question: "IMT hanya penting buat orang dewasa, anak-anak tidak perlu diperhatikan.",
    options: ["Benar", "Salah"],
    answer: "Salah",
  },

  // ===== Kalender Kehamilan =====
  {
    category: "Kalender Kehamilan",
    type: "Pilihan Ganda",
    question: "Berapa lama durasi kehamilan normal pada manusia?",
    options: ["28 minggu", "32 minggu", "40 minggu", "44 minggu"],
    answer: "40 minggu",
  },
  {
    category: "Kalender Kehamilan",
    type: "Pilihan Ganda",
    question: "Pada trimester ke berapa ukuran janin mulai terlihat jelas di USG?",
    options: [
      "Trimester pertama",
      "Trimester kedua",
      "Trimester ketiga",
      "Setelah melahirkan",
    ],
    answer: "Trimester kedua",
  },
  {
    category: "Kalender Kehamilan",
    type: "Pilihan Ganda",
    question: "Apa tanda umum yang terjadi pada trimester pertama kehamilan?",
    options: [
      "Morning sickness (mual pagi hari)",
      "Perubahan warna mata",
      "Mulai menyusui",
      "Menghitung masa subur",
    ],
    answer: "Morning sickness (mual pagi hari)",
  },
  {
    category: "Kalender Kehamilan",
    type: "Pilihan Ganda",
    question: "Kapan waktu yang tepat untuk melakukan tes kehamilan pertama kali?",
    options: [
      "Saat terlambat haid selama 1 minggu",
      "Saat haid sedang berlangsung",
      "Setelah melahirkan",
      "Saat haid teratur",
    ],
    answer: "Saat terlambat haid selama 1 minggu",
  },
  {
    category: "Kalender Kehamilan",
    type: "Pilihan Ganda",
    question: "Apa fungsi dari kalender kehamilan?",
    options: [
      "Menentukan jenis kelamin janin",
      "Memantau perkembangan janin dan waktu persalinan",
      "Menghitung umur ibu",
      "Menghitung kebutuhan kalori",
    ],
    answer: "Memantau perkembangan janin dan waktu persalinan",
  },

  // ===== Kalori =====
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Apa itu kalori?",
    options: [
      "Zat makanan yang membentuk tulang",
      "Jenis vitamin dalam makanan",
      "Ukuran kadar gula dalam darah",
      "Satuan energi yang didapat dari makanan",
    ],
    answer: "Satuan energi yang didapat dari makanan",
  },
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Mana makanan yang mengandung kalori paling tinggi?",
    options: ["Salad", "Sayur sop", "Nasi putih", "Gorengan"],
    answer: "Gorengan",
  },
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Mana yang disebut aktivitas ringan?",
    options: [
      "Lari 5 km",
      "Duduk dan bekerja ringan",
      "Tiduran sepanjang hari",
      "Cuci motor dan angkat galon",
    ],
    answer: "Duduk dan bekerja ringan",
  },
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Kalori dibutuhkan tubuh untuk apa?",
    options: [
      "Menambah kadar gula darah",
      "Menjalankan fungsi organ dan aktivitas fisik",
      "Membentuk kalsium",
      "Menghasilkan air dalam tubuh",
    ],
    answer: "Menjalankan fungsi organ dan aktivitas fisik",
  },
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Jika kita melakukan bed rest, maka kebutuhan kalorinya akan:",
    options: ["Lebih rendah", "Lebih tinggi", "Sama saja", "Tidak berubah"],
    answer: "Lebih rendah",
  },
  {
    category: "Kalori",
    type: "Pilihan Ganda",
    question: "Yang akan terjadi jika makan terlalu banyak kalori setiap hari:",
    options: [
      "Kekurangan vitamin",
      "Kenaikan berat badan / obesitas",
      "Anemia",
      "Sakit gigi",
    ],
    answer: "Kenaikan berat badan / obesitas",
  },
  {
    category: "Kalori",
    type: "Mitos atau Fakta",
    question: "Makan malam bikin gemuk",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
  },
  {
    category: "Kalori",
    type: "Mitos atau Fakta",
    question: "Semakin sedikit makan, semakin cepat kurus",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
  },
  {
    category: "Kalori",
    type: "Mitos atau Fakta",
    question: "Perhitungan kalori penting dilakukan siapa saja",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
  },
  {
    category: "Kalori",
    type: "Mitos atau Fakta",
    question: "Makanan berlemak = pasti tidak sehat",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
  }
];

export default allQuestions;