import { useState } from 'react'
import { supabase } from '../SupabaseClient'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const email = `${form.name}@gmail.com`

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password
      })

      if (error) throw error

      setMessage('Login berhasil!')
      navigate('/home')
    } catch (error) {
      setMessage('Login gagal: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#88DE7C] to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-sm text-gray-500 mb-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#164E50] font-semibold">
            daftar sekarang
          </Link>
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="mb-6 relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#88DE7C] text-white font-semibold py-3 rounded-full hover:bg-purple-600 transition"
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
