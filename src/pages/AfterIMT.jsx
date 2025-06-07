import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useContext } from 'react'
import { IMTContext } from '../context/IMTContext'

const Card = ({ title, children, onClick }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="text-gray-600">{children}</div>
    {onClick && (
      <button
        onClick={onClick}
        className="w-full bg-[#164E50] text-white font-semibold py-2 rounded-xl hover:bg-[#133e3f] transition mt-4"
      >
        Selengkapnya
      </button>
    )}
  </div>
)

const getCategoryColor = (kategori) => {
  switch (kategori.toLowerCase()) {
    case 'kurus':
      return '#3B82F6' // Blue
    case 'normal':
      return '#10B981' // Green
    case 'gemuk':
      return '#F59E0B' // Yellow
    case 'obesitas':
      return '#EF4444' // Red
    default:
      return '#6B7280' // Gray
  }
}

// Fungsi untuk menghitung posisi indicator pada skala
const getIndicatorPosition = (imt) => {
  // Skala: 0-18.5 (18.5%), 18.5-25 (24.9%), 25-30 (29.9%), 30-40 (100%)
  if (imt <= 0) return 0
  if (imt >= 40) return 100

  if (imt <= 18.5) {
    // Range 0-18.5 = 18.5% dari total bar
    return (imt / 18.5) * 18.5
  } else if (imt <= 25) {
    // Range 18.5-25 = dari 18.5% sampai 43.4% (24.9% width)
    const progress = (imt - 18.5) / (25 - 18.5)
    return 18.5 + progress * 24.9
  } else if (imt <= 30) {
    // Range 25-30 = dari 43.4% sampai 73.3% (29.9% width)
    const progress = (imt - 25) / (30 - 25)
    return 43.4 + progress * 29.9
  } else {
    // Range 30-40 = dari 73.3% sampai 100% (26.7% width)
    const progress = (imt - 30) / (40 - 30)
    return 73.3 + progress * 26.7
  }
}

const DashboardCards = () => {
  const { imtData } = useContext(IMTContext)
  const navigate = useNavigate()

  const handleNavigate = (slug) => {
    navigate(`/details/${slug}`)
  }

  const handleBack = () => {
    navigate('/IMT')
  }

  const categoryColor = getCategoryColor(imtData.kategori)
  const indicatorPosition = getIndicatorPosition(imtData.imt)

  return (
    <div className="min-h-screen bg-gray-50 p-8 mb-24">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center text-[#164E50] font-semibold "
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Kembali ke Perhitungan
      </button>
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        <Card title="Hasil IMT Kamu">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">
              {imtData.imt.toFixed(1)} <span className="text-lg">kg/m²</span>
            </p>
            <p
              className="font-medium text-lg mt-2"
              style={{ color: categoryColor }}
            >
              {imtData.kategori}
            </p>
            <p className="mt-2 text-gray-600">
              Berat sehat kamu:{' '}
              <strong className="text-gray-800">{imtData.beratSehat} kg</strong>
            </p>
          </div>

          {/* Skala IMT yang Diperbaiki */}
          <div className="mt-6 relative">
            {/* Background skala warna */}
            <div className="h-6 rounded-full flex overflow-hidden shadow-inner">
              {/* Kurus: 0-18.5 (18.5%) */}
              <div
                className="bg-blue-500 transition-all duration-300"
                style={{ width: '18.5%' }}
                title="Kurus (< 18.5)"
              />
              {/* Normal: 18.5-25 (24.9%) */}
              <div
                className="bg-green-500 transition-all duration-300"
                style={{ width: '24.9%' }}
                title="Normal (18.5 - 24.9)"
              />
              {/* Gemuk: 25-30 (29.9%) */}
              <div
                className="bg-yellow-500 transition-all duration-300"
                style={{ width: '29.9%' }}
                title="Gemuk (25 - 29.9)"
              />
              {/* Obesitas: 30+ (26.7%) */}
              <div
                className="bg-red-500 transition-all duration-300"
                style={{ width: '26.7%' }}
                title="Obesitas (≥ 30)"
              />
            </div>

            {/* Penanda posisi IMT user */}
            <div
              className="absolute top-[-8px] transition-all duration-500"
              style={{
                left: `${indicatorPosition}%`,
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
              }}
            >
              {/* Triangle indicator */}
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-transparent border-b-gray-800 drop-shadow-md" />
              {/* Garis vertikal */}
              <div
                className="w-0.5 h-6 bg-gray-800 mx-auto"
                style={{ marginTop: '-1px' }}
              />
            </div>

            {/* Label Bawah */}
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
              <span className="text-center">
                <div className="font-medium">0</div>
                <div className="text-[10px]">Kurus</div>
              </span>
              <span className="text-center">
                <div className="font-medium">18.5</div>
                <div className="text-[10px]">Normal</div>
              </span>
              <span className="text-center">
                <div className="font-medium">25</div>
                <div className="text-[10px]">Gemuk</div>
              </span>
              <span className="text-center">
                <div className="font-medium">30</div>
                <div className="text-[10px]">Obesitas</div>
              </span>
              <span className="text-center">
                <div className="font-medium">40+</div>
              </span>
            </div>

            {/* Kategori saat ini dengan highlight */}
            <div className="mt-4 text-center">
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-sm"
                style={{ backgroundColor: categoryColor }}
              >
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Kategori Anda: {imtData.kategori}
              </div>
            </div>
          </div>

          {/* Tips berdasarkan kategori */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 leading-relaxed">
              {imtData.imt < 18.5 && (
                <>
                  <strong>Saran:</strong> Tingkatkan asupan kalori dengan
                  makanan bergizi untuk mencapai berat badan ideal.
                </>
              )}
              {imtData.imt >= 18.5 && imtData.imt < 25 && (
                <>
                  <strong>Bagus!</strong> Berat badan Anda sudah ideal.
                  Pertahankan pola makan sehat dan olahraga teratur.
                </>
              )}
              {imtData.imt >= 25 && imtData.imt < 30 && (
                <>
                  <strong>Perhatian:</strong> Kurangi asupan kalori dan
                  tingkatkan aktivitas fisik untuk mencegah obesitas.
                </>
              )}
              {imtData.imt >= 30 && (
                <>
                  <strong>Penting:</strong> Konsultasikan dengan dokter untuk
                  program penurunan berat badan yang aman.
                </>
              )}
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            💡 Dengan menjaga berat ideal, kamu menurunkan risiko gangguan
            kesehatan.
          </p>
        </Card>

        <Card
          title="Komponen Berpengaruh"
          onClick={() => handleNavigate('komponen-berpengaruh')}
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Asupan nutrisi</li>
            <li>Aktivitas fisik</li>
            <li>Faktor genetik</li>
            <li>Kebiasaan hidup</li>
          </ul>
        </Card>

        <Card title="Status Gizi" onClick={() => handleNavigate('status-gizi')}>
          <p>
            Indeks massa tubuh (IMT), keseimbangan vitamin dan mineral, serta
            berat badan ideal merupakan indikator utama status gizi yang baik.
          </p>
        </Card>

        <Card
          title="Faktor Risiko Penyakit"
          onClick={() => handleNavigate('faktor-risiko-penyakit')}
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Merokok</li>
            <li>Hipertensi</li>
            <li>Kolesterol tinggi</li>
            <li>Kurang olahraga</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default DashboardCards
