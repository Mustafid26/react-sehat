import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import doktor from '/img/docter-min.png';
import { supabase } from '../SupabaseClient';
import '../assets/style/Home.css'; // Anda mungkin perlu menyesuaikan style dari file ini

// Komponen SVG Latar Belakang - TIDAK BERUBAH
const HeaderBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
    <svg
      className="absolute bottom-0 w-full"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        fill="#7EDD71"
        fillOpacity="1"
        d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,208C672,235,768,245,864,218.7C960,192,1056,128,1152,117.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
    <svg
      className="absolute bottom-0 w-full"
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        fill="#91ea85"
        fillOpacity="0.8"
        d="M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,112C840,96,960,96,1080,117.3C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const cache = {
  userProfile: null,
  berita: { data: null, timestamp: null, page: 1 },
};
const CACHE_DURATION = {
  userProfile: 5 * 60 * 1000,
  berita: 10 * 60 * 1000,
};

export default function CourseDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingDots, setLoadingDots] = useState('.');
  const [userName, setUserName] = useState('');

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  const categories = [
    { title: 'IMT', icon: '📘', link: '/IMT' },
    { title: 'Kalkulator Kalori', icon: '📊', link: '/kalori' },
    { title: 'Kalender Kehamilan', icon: '📝', link: '/kalender' },
    { title: 'Quiz', icon: '📚', link: '/quiz' },
  ];

  const potongJudul = (judul, maxLength = 80) => {
    return judul.length > maxLength ? judul.slice(0, maxLength) + '...' : judul;
  };

  const isCacheValid = (cacheType) => {
    if (cacheType === 'userProfile') {
      return (
        cache.userProfile && Date.now() - cache.userProfile.timestamp < CACHE_DURATION.userProfile
      );
    }
    if (cacheType === 'berita') {
      return (
        cache.berita.data && Date.now() - cache.berita.timestamp < CACHE_DURATION.berita
      );
    }
    return false;
  };

  const fetchUserProfile = async () => {
    if (isCacheValid('userProfile')) {
      setUserName(cache.userProfile.name);
      return;
    }
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (userId) {
        const { data, error } = await supabase.from('Profile').select('name').eq('id', userId).single();
        if (!error && data?.name) {
          cache.userProfile = { name: data.name, timestamp: Date.now() };
          setUserName(data.name);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchBerita = async (pageNumber = 1, forceRefresh = false) => {
    if (pageNumber === 1 && !forceRefresh && isCacheValid('berita')) {
      setArticles(cache.berita.data);
      setPage(cache.berita.page);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=kesehatan&language=id&pageSize=4&page=${pageNumber}&apiKey=${apiKey}`);
      const data = await response.json();
      if (pageNumber === 1) {
        setArticles(data.articles);
        cache.berita = { data: data.articles, timestamp: Date.now(), page: 1 };
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    } catch (error) {
      console.error('Gagal memuat berita:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchBerita();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBerita(nextPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 bg-gradient-to-b from-[#88DE7C] to-white relative">
      
      {/* --- HEADER DIPERBAIKI --- */}
      {/* Menggunakan Flexbox untuk memisahkan teks dan gambar agar tidak bertabrakan */}
      <header className="relative bg-[#a3ebb1] h-[200px] text-white p-6 rounded-b-3xl overflow-hidden mb-8">
        <HeaderBackground />
        <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto">
          
          {/* 1. Kontainer Teks dengan lebar terbatas */}
          <div className="w-full md:w-2/3 lg:w-1/2">
            <h1 className="text-2xl font-bold text-[#164E50]">
              Halo, {userName || 'Pengguna'}!
            </h1>
            <p className="text-lg text-[#133e3f] mt-1 max-w-md mb-5">
              Selamat datang kembali. Mari jaga kesehatan bersama hari ini.
            </p>
          </div>
      
          {/* 2. Kontainer Gambar yang responsif (disembunyikan di layar kecil) */}
          <div className="h-full">
            <img
              src={doktor}
              alt="Doktor"
              className="hidden md:block absolute bottom-0 right-0 h-[90%] w-auto object-contain z-10"
            />
          </div>
      
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- KATEGORI --- */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link || '#'}
                className="group bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{category.icon}</div>
                <p className="text-sm font-semibold text-gray-700 break-words">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* --- BERITA --- */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Berita Kesehatan Terkini</h2>
          </div>

          {loading && page === 1 ? (
            <p className="text-center text-[#164E50] font-semibold py-10">
              Memuat berita{loadingDots}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300"
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="h-40 w-full md:w-40 object-cover flex-shrink-0"
                      />
                    )}
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base text-gray-800 group-hover:text-[#164E50] transition-colors">
                          {potongJudul(article.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2">
                          {article.source.name}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-[#164E50] text-white font-semibold rounded-full hover:bg-[#133e3f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-none"
                >
                  {loading ? `Memuat${loadingDots}` : 'Tampilkan Lebih Banyak'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}