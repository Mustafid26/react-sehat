import { useState } from 'react'
import { supabase } from '../SupabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

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

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: '',
    display_name: '',
    age: '',
    gender: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      if (
        !form.name ||
        !form.display_name ||
        !form.age ||
        !form.gender ||
        !form.password
      ) {
        throw new Error('Mohon lengkapi semua data pendaftaran.')
      }

      const emailUsername = form.display_name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
      const email = `${emailUsername}@gmail.com`
      const password = form.password

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              display_name: form.display_name
            }
          }
        }
      )

      if (signUpError) throw signUpError
      if (!authData?.user)
        throw new Error(
          'Registrasi berhasil, tetapi data user tidak ditemukan. Silakan login ulang.'
        )

      const userId = authData.user.id
      if (userId) {
        const { error: profileError } = await supabase.from('Profile').insert({
          id: userId,
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender,
          created_at: new Date().toISOString()
        })

        if (profileError) {
          console.error('Error saving profile data:', profileError)
          setMessage(
            'Registrasi berhasil, tetapi gagal menyimpan data profil. Silakan coba login atau hubungi dukungan.'
          )
          return
        }

        navigate('/home')
      }
    } catch (error) {
      setMessage('Error registrasi: ' + error.message)
      console.error('Registration Error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#88DE7C] to-white p-4 z-10">
      <BackgroundWaveSVG />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 z-10">
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sudah punya akun?{' '}
          <Link to="/" className="text-[#164E50] font-semibold">
            Login
          </Link>
        </p>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="display_name"
              placeholder="Username"
              value={form.display_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              name="age"
              placeholder="Umur"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div className="mb-4 relative">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="appearance-none w-full bg-white border border-gray-300 rounded-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
              required
            >
              <option value="" disabled>
                Pilih Gender
              </option>
              <option value="female">Perempuan</option>
              <option value="male">Laki-Laki</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#88DE7C] text-white font-semibold py-3 rounded-full hover:bg-green-600 transition"
          >
            Register
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  )
}
