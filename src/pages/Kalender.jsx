import { useState } from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Hamil from '/img/pregnant-min.png'
import tipsKehamilan from '../components/TipsKehamilan'

const BackgroundWaveSVG = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
    {/* Wave pertama di atas */}
    <svg
      className="absolute top-0 left-0 w-full h-80"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        fill="#48aa7c"
        fillOpacity="0.5"
        d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,128C840,107,960,85,1080,96C1200,107,1320,149,1380,170.7L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      />
    </svg>

    {/* Wave ketiga di atas - layer paling dalam */}
    <svg
      className="absolute top-0 left-0 w-full h-64"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ transform: 'translateY(40px)' }}
    >
      <path
        fill="#48aa7c"
        fillOpacity="0.3"
        d="M0,32L60,48C120,64,240,96,360,101.3C480,107,600,85,720,74.7C840,64,960,64,1080,80C1200,96,1320,128,1380,144L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      />
    </svg>
  </div>
)

export default function Kalender() {
  const navigate = useNavigate()
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
      <div className="min-h-screen mx-auto p-4 bg-gradient-to-b from-[#88DE7C] to-[#a3ebb1] relative">
        <BackgroundWaveSVG />

        {/* Tombol Kembali dengan z-index 10 */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center font-bold text-[#164E50] mt-4 z-10 relative px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali
        </button>

        {/* Form kalkulator dengan z-index 10 */}
        <div className="max-w-md mx-auto p-6 shadow-xl rounded-xl mt-10 bg-white/95 backdrop-blur-sm z-10 relative">
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
            className="w-full bg-[#88DE7C] hover:bg-[#48aa7c] text-white py-2 rounded-lg transition duration-300"
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
          <img src={Hamil} alt="" />
        </div>
      </div>
    </>
  )
}
