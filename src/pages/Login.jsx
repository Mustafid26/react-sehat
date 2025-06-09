import { useState } from 'react'
import { supabase } from '../SupabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

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

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ display_name: '', password: '' })
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      if (!form.display_name || !form.password) {
        throw new Error('Mohon masukkan Username dan password Anda.')
      }

      const emailUsername = form.display_name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
      const email = `${emailUsername}@gmail.com`

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password
      })

      if (error) {
        throw new Error('Username atau password salah. Silakan cek kembali.')
      }

      navigate('/home')
    } catch (error) {
      setMessage('Login gagal: ' + error.message)
      console.error('Login Error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#88DE7C] to-white p-4">
      <BackgroundWaveSVG />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-sm text-gray-500 mb-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#164E50] font-semibold">
            Daftar sekarang
          </Link>
        </p>

        <form onSubmit={handleLogin}>
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
            className="w-full flex items-center justify-center gap-2 bg-[#88DE7C] text-white font-semibold py-3 rounded-full hover:bg-[#71c566] transition"
          >
            Login
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
