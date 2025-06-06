import Home from './components/Home'
import IMT from './components/IMT'
import Login from './pages/Login'
import AfterIMT from './pages/AfterIMT'
import Profile from './pages/Profile'
import DetailIMT from './pages/DetailMateri'
import Register from './pages/Register'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

function BottomBar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      <Link
        to="/home"
        className={`flex flex-col items-center mb-1 ${
          isActive('/home')
            ? 'text-green-600'
            : 'text-gray-700 hover:text-green-600'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0h4m-4 0H5a2 2 0 01-2-2v-6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3"
          />
        </svg>
        Home
      </Link>

      <Link
        to="/Profile"
        className={`flex flex-col items-center mb-1 ${
          isActive('/Profile')
            ? 'text-green-600'
            : 'text-gray-700 hover:text-green-600'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.341A8 8 0 1112 4v4"
          />
        </svg>
        Profile
      </Link>
    </nav>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [hideLoader, setHideLoader] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setHideLoader(true), 500)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])
  const hideBottomBar =
    location.pathname === '/' || location.pathname === '/register'

  return (
    <>
      {!hideLoader && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity loading duration-500 ${
            loading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <DotLottieReact
            src="https://lottie.host/c343d8b3-510a-4ab4-8d1e-f510f13acd8b/YHoS7WaZFg.lottie"
            autoplay
            loop
            style={{ width: '200px', height: '200px' }}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/IMT" element={<IMT />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/after-imt" element={<AfterIMT />} />
        <Route path="/details/:judul" element={<DetailIMT />} />
      </Routes>

      {!hideBottomBar && <BottomBar />}
    </>
  )
}

export default App
