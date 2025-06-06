import { useState } from 'react'
import { supabase } from '../SupabaseClient'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()


  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const username = form.name.trim().toLowerCase().replace(/\s+/g, '')
      const email = `${username}@gmail.com`

      const password = form.password

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password
        }
      )

      if (signUpError) throw signUpError

      const userId = authData?.user?.id
      if (userId) {
        const { error: profileError } = await supabase.from('Profile').insert({
          id: userId,
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender,
          created_at : new Date().toISOString()
        })

        if (profileError) throw profileError

        setMessage('Registrasi berhasil!')
        navigate('/home')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#88DE7C] to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sudah punya akun?{' '}
          <Link to="/" className="text-[#164E50] font-semibold">
            login
          </Link>
        </p>

        <form onSubmit={handleRegister}>
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

          <div className="mb-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="mb-4 relative">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="appearance-none w-full bg-white border border-gray-300 rounded-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
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
