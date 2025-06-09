import React, { useState, useEffect, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../SupabaseClient'
import { useNavigate } from 'react-router-dom'
import { IMTContext } from '../context/IMTContext'
import { ArrowLeft } from 'lucide-react'

const BackgroundWaveSVG = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
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

export default function IMTModern() {
  const navigate = useNavigate()
  const { setImtData } = useContext(IMTContext)
  const [nama, setNama] = useState('Pengguna')
  const [tinggi, setTinggi] = useState('')
  const [berat, setBerat] = useState('')
  const [hasil, setHasil] = useState('')

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) return

        const userId = user.id

        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('name')
          .eq('id', userId)
          .single()

        if (profileError) throw profileError

        setNama(profileData?.name || 'Pengguna')
      } catch (error) {
        console.error('Error fetching profile:', error.message)
      }
    }

    fetchUserProfile()
  }, [])

  const hitungIMT = () => {
    if (!tinggi || !berat) return
    const tinggiMeter = tinggi / 100
    const imt = berat / (tinggiMeter * tinggiMeter)
    let kategori = ''
    let beratSehat = (22 * tinggiMeter * tinggiMeter).toFixed(1)

    if (imt < 18.5) kategori = 'Underweight'
    else if (imt < 24.9) kategori = 'Normal'
    else if (imt < 29.9) kategori = 'Overweight'
    else kategori = 'Obesity'
    setHasil(`Halo ${nama}!\nIMT kamu: ${imt.toFixed(2)} kg/m² (${kategori})`)
    setImtData({ nama, imt, kategori, beratSehat })
  }

  const goToAfterIMT = () => {
    navigate('/after-imt')
  }
  const handleBack = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#88DE7C] to-[#a3ebb1] flex items-center justify-center px-4 py-8 relative">
      <BackgroundWaveSVG />
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center font-bold text-[#26484a] mt-4 z-10 hover:bg-white/20 transition-all duration-200"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Kembali
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6 z-10 relative">
        <h1 className="text-2xl font-bold text-center text-[#164E50]">
          Kalkulator IMT
        </h1>

        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
            placeholder="Contoh: 160"
          />
        </div>

        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Berat Badan (kg)
          </label>
          <input
            type="number"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
            placeholder="Contoh: 50"
          />
        </div>

        <button
          onClick={hitungIMT}
          className="w-full bg-[#88de7c] text-white font-semibold py-2 rounded-xl hover:bg-[#48aa7c] transition"
        >
          Hitung IMT
        </button>

        <AnimatePresence>
          {hasil && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="bg-[#E5F7E4] border border-[#164E50] text-[#164E50] p-4 rounded-xl text-center whitespace-pre-line font-medium"
            >
              {hasil}
              <button
                onClick={goToAfterIMT}
                className="w-full bg-[#164E50] text-white font-semibold py-2 rounded-xl hover:bg-[#133e3f] transition mt-4"
              >
                Selengkapnya
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
