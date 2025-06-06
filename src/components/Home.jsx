import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import doktor from '/img/docter-min.png'
import { supabase } from '../SupabaseClient'
import './Home.css'

const cache = {
  userProfile: null,
  berita: {
    data: null,
    timestamp: null,
    page: 1
  }
}

const CACHE_DURATION = {
  userProfile: 5 * 60 * 1000, // 5 menit
  berita: 10 * 60 * 1000 // 10 menit
}

export default function CourseDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [loadingDots, setLoadingDots] = useState('.')
  const [userName, setUserName] = useState('')

  const apiKey = import.meta.env.VITE_NEWS_API_KEY

  const categories = [
    { title: 'IMT', icon: '📘', link: '/IMT' },
    { title: 'Kalkulator Kalori', icon: '📊' },
    { title: 'Kalender Kehamilan', icon: '📝' },
    { title: 'Quiz', icon: '📚' }
  ]

  const potongJudul = (judul, maxLength = 80) => {
    return judul.length > maxLength ? judul.slice(0, maxLength) + '...' : judul
  }

  const isCacheValid = (cacheType) => {
    if (cacheType === 'userProfile') {
      return (
        cache.userProfile &&
        Date.now() - cache.userProfile.timestamp < CACHE_DURATION.userProfile
      )
    }
    if (cacheType === 'berita') {
      return (
        cache.berita.data &&
        Date.now() - cache.berita.timestamp < CACHE_DURATION.berita
      )
    }
    return false
  }

  const fetchUserProfile = async () => {
    if (isCacheValid('userProfile')) {
      setUserName(cache.userProfile.name)
      return
    }

    try {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id

      if (userId) {
        const { data, error } = await supabase
          .from('Profile')
          .select('name')
          .eq('id', userId)
          .single()

        if (!error && data?.name) {
          // Update cache
          cache.userProfile = {
            name: data.name,
            timestamp: Date.now()
          }
          setUserName(data.name)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchBerita = async (pageNumber = 1, forceRefresh = false) => {
    if (pageNumber === 1 && !forceRefresh && isCacheValid('berita')) {
      setArticles(cache.berita.data)
      setPage(cache.berita.page)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=kesehatan&language=id&pageSize=3&page=${pageNumber}&apiKey=${apiKey}`
      )
      const data = await response.json()

      if (pageNumber === 1) {
        setArticles(data.articles)
        // Update cache hanya untuk halaman pertama
        cache.berita = {
          data: data.articles,
          timestamp: Date.now(),
          page: 1
        }
      } else {
        setArticles((prev) => [...prev, ...data.articles])
      }
    } catch (error) {
      console.error('Gagal memuat berita:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? '.' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchUserProfile()
    fetchBerita()
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchBerita(nextPage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F7E4] to-white rounded-xl mb-[5rem]">
      {/* Header */}
      <div className="relative bg-[#91ea85] p-4 rounded-b-3xl text-white mb-[5rem] h-[8rem]">
        {/* Selamat Datang Card */}
        <div className="absolute top-12 left-4 right-4 bg-white text-black rounded-xl shadow-md p-4 h-[10rem] items-center flex">
          <div className="content">
            <p className="text-md font-semibold mb-1">
              Halo, {userName || 'Pengguna'} 💚
            </p>
            <p className="text-sm text-gray-500">
              Investasi terbaik adalah kesehatan atas dirimu. Ambil waktu
              sejenak, bersyukurlah atas nikmat yang diberikan untukmu.
            </p>
          </div>

          <div className="content">
            <img src={doktor} alt="Doktor" className="w-80 rounded-full ml-4" />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Kategori</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link || '#'}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300 button-ctg min-w-[140px]"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <p className="text-sm font-medium text-center break-words">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div className="mt-8 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Berita Kesehatan Terbaru</h2>
        </div>

        {loading && page === 1 ? (
          <p className="text-center text-[#164E50] font-semibold">
            Loading{loadingDots}
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt="thumbnail"
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#164E50]">
                      {potongJudul(article.title)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.source.name}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 bg-[#164E50] text-white rounded-xl hover:bg-[#133e3f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? `Memuat${loadingDots}` : 'Muat Lebih Banyak'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
