import React, { useState, useEffect, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../SupabaseClient'
import { useNavigate } from 'react-router-dom'
import { IMTContext } from '../context/IMTContext'

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
    let beratSehat = (22 * tinggiMeter * tinggiMeter).toFixed(1);

    if (imt < 18.5) kategori = 'Berat badan kurang'
    else if (imt < 24.9) kategori = 'Normal'
    else if (imt < 29.9) kategori = 'Kelebihan berat badan'
    else kategori = 'Obesitas'
    setHasil(`Halo ${nama}!\nIMT kamu: ${imt.toFixed(2)} kg/m² (${kategori})`)
    setImtData({ nama, imt, kategori, beratSehat })
  }

  const goToAfterIMT = () => {
    navigate('/after-imt')
  }

  return (
    <div className="min-h-screen bg-[#E5F7E4] flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6">
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
          className="w-full bg-[#164E50] text-white font-semibold py-2 rounded-xl hover:bg-[#133e3f] transition"
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
