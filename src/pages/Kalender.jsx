import { useState } from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Doktor from '/img/docter-min.png'

export default function Kalender() {
  const navigate = useNavigate()
  const tipsKehamilan = [
    {
      minggu: 1,
      tips: [
        'Konsumsi asam folat setiap hari',
        'Istirahat cukup dan hindari stres'
      ]
    },
    {
      minggu: 2,
      tips: ['Hindari makanan mentah dan alkohol', 'Minum air putih yang cukup']
    },
    {
      minggu: 3,
      tips: [
        'Konsultasi ke dokter kandungan',
        'Mulai olahraga ringan seperti jalan kaki'
      ]
    },
    {
      minggu: 4,
      tips: ['Perhatikan pola makan bergizi', 'Hindari mengangkat benda berat']
    },
    {
      minggu: 5,
      tips: [
        'Mulai mencatat perkembangan gejala',
        'Diskusi dengan pasangan tentang rencana kehamilan'
      ]
    },
    {
      minggu: 6,
      tips: ['Penuhi kebutuhan zat besi', 'Jaga kebersihan makanan']
    },
    {
      minggu: 7,
      tips: [
        'Cek tekanan darah secara berkala',
        'Perbanyak konsumsi buah dan sayur'
      ]
    },
    {
      minggu: 8,
      tips: [
        'Pertimbangkan multivitamin prenatal',
        'Lakukan senam hamil ringan'
      ]
    },
    {
      minggu: 9,
      tips: [
        'Mulai gunakan pakaian yang nyaman',
        'Lakukan pengecekan USG awal jika belum dilakukan'
      ]
    },
    {
      minggu: 10,
      tips: [
        'Konsumsi makanan kaya protein',
        'Awasi perubahan mood dan berbicara dengan pasangan'
      ]
    },
    {
      minggu: 11,
      tips: [
        'Penuhi asupan kalsium untuk perkembangan tulang janin',
        'Hindari makanan tinggi merkuri seperti ikan tertentu'
      ]
    },
    {
      minggu: 12,
      tips: [
        'Mulai gunakan lotion untuk mencegah stretch marks',
        'Lakukan senam hamil ringan'
      ]
    },
    {
      minggu: 13,
      tips: [
        'Perhatikan posisi tidur agar nyaman',
        'Tetap aktif bergerak untuk memperlancar peredaran darah'
      ]
    },
    {
      minggu: 14,
      tips: [
        'Cek tekanan darah secara rutin',
        'Konsultasi untuk mengetahui jenis kelamin janin (jika ingin)'
      ]
    },
    {
      minggu: 15,
      tips: [
        'Penuhi kebutuhan zat besi',
        'Perhatikan postur tubuh agar tidak sakit punggung'
      ]
    },
    {
      minggu: 16,
      tips: [
        'Nikmati masa kehamilan trimester kedua',
        'Gunakan bantal tambahan untuk tidur yang nyaman'
      ]
    },
    {
      minggu: 17,
      tips: [
        'Mulai merasakan gerakan janin',
        'Konsumsi makanan berserat tinggi untuk menghindari sembelit'
      ]
    },
    {
      minggu: 18,
      tips: [
        'Lakukan skrining kelainan bawaan',
        'Tetap jaga pola makan seimbang'
      ]
    },
    {
      minggu: 19,
      tips: ['Sediakan waktu untuk relaksasi', 'Minum cukup air setiap hari']
    },
    {
      minggu: 20,
      tips: [
        'Pantau perkembangan berat badan',
        'Jangan ragu bertanya ke dokter soal keluhan ringan'
      ]
    },
    {
      minggu: 21,
      tips: [
        'Siapkan perlengkapan kehamilan seperti sabuk penyangga',
        'Lakukan latihan pernapasan sederhana'
      ]
    },
    {
      minggu: 22,
      tips: [
        'Rencanakan cuti melahirkan',
        'Bicarakan tentang persiapan persalinan dengan pasangan'
      ]
    },
    {
      minggu: 23,
      tips: [
        'Jaga pola tidur yang teratur',
        'Gunakan sepatu nyaman untuk menopang tubuh'
      ]
    },
    {
      minggu: 24,
      tips: [
        'Periksa kadar gula darah (jika disarankan dokter)',
        'Perbanyak sayur dan buah'
      ]
    },
    {
      minggu: 25,
      tips: [
        'Gunakan minyak atau lotion untuk perawatan kulit',
        'Jaga hubungan sosial agar tetap positif'
      ]
    },
    {
      minggu: 26,
      tips: [
        'Latihan kegel untuk memperkuat otot panggul',
        'Cek kembali jadwal imunisasi'
      ]
    },
    {
      minggu: 27,
      tips: [
        'Persiapkan daftar rumah sakit bersalin',
        'Rutin ukur tekanan darah'
      ]
    },
    {
      minggu: 28,
      tips: [
        'Mulai pantau frekuensi gerakan janin',
        'Konsultasikan bila muncul pembengkakan berlebih'
      ]
    },
    {
      minggu: 29,
      tips: [
        'Siapkan rencana menyusui',
        'Hindari duduk atau berdiri terlalu lama'
      ]
    },
    {
      minggu: 30,
      tips: [
        'Latih teknik relaksasi seperti meditasi',
        'Cek perkembangan posisi janin'
      ]
    },
    {
      minggu: 31,
      tips: [
        'Coba posisi tidur miring ke kiri',
        'Siapkan koper persalinan mulai dari sekarang'
      ]
    },
    {
      minggu: 32,
      tips: ['Cek kadar hemoglobin bila perlu', 'Buat daftar barang bayi']
    },
    {
      minggu: 33,
      tips: [
        'Kurangi konsumsi garam untuk hindari hipertensi',
        'Rutin olahraga ringan'
      ]
    },
    {
      minggu: 34,
      tips: [
        'Rencanakan metode persalinan yang diinginkan',
        'Diskusi dengan tenaga medis tentang opsi melahirkan'
      ]
    },
    {
      minggu: 35,
      tips: [
        'Jangan lewatkan jadwal kontrol',
        'Siapkan kontak darurat dan rute ke rumah sakit'
      ]
    },
    {
      minggu: 36,
      tips: [
        'Cek posisi kepala janin',
        'Simulasikan perjalanan ke fasilitas kesehatan'
      ]
    },
    {
      minggu: 37,
      tips: [
        'Persiapkan mental untuk proses persalinan',
        'Kenali tanda-tanda awal kontraksi'
      ]
    },
    {
      minggu: 38,
      tips: ['Hindari bepergian jauh', 'Perbanyak istirahat']
    },
    {
      minggu: 39,
      tips: [
        'Periksa kembali semua kebutuhan ibu dan bayi',
        'Siapkan mental dan logistik untuk hari H'
      ]
    },
    {
      minggu: 40,
      tips: [
        'Kenali tanda-tanda persalinan sesungguhnya',
        'Tetap tenang dan siaga kapan pun waktunya datang'
      ]
    }
  ]
  const [hpht, setHpht] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = () => {
    if (!hpht) return
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      const hphtDate = dayjs(hpht)
      const hpl = hphtDate.add(280, 'day')
      const weeks = dayjs().diff(hphtDate, 'week')

      setResult({
        hpl: hpl.format('dddd, DD MMMM YYYY'),
        weeks
      })
      setLoading(false)
    }, 1000)
  }

  const handleBack = () => {
    navigate('/home')
  }

  const currentTips =
    result && tipsKehamilan.find((item) => item.minggu === result.weeks)

  return (
    <>
      <div className="min-h-screen mx-auto p-4 bg-gradient-to-b from-[#88DE7C] to-white">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-[#164E50] font-bold text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali
        </button>
        <div className="max-w-md mx-auto p-6 shadow-xl rounded-xl mt-10 bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Kalkulator Kehamilan
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Masukkan Tanggal HPHT
          </label>
          <div className="relative mb-4">
            <input
              type="date"
              value={hpht}
              onChange={(e) => setHpht(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <CalendarDaysIcon className="w-5 h-5 absolute top-2.5 left-3 text-gray-400" />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-300"
          >
            {loading ? 'Menghitung...' : 'Hitung Kehamilan'}
          </button>

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-800">📅 HPL:</p>
                <p className="text-gray-700">{result.hpl}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  🧸 Usia Kehamilan:
                </p>
                <p className="text-gray-700">Minggu ke-{result.weeks}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  🌱 Tips Minggu Ini:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {currentTips ? (
                    currentTips.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))
                  ) : (
                    <li>Belum ada tips untuk minggu ini</li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
        <div className="gambar">
          <img src={Doktor} alt="" />
        </div>
      </div>
    </>
  )
}
