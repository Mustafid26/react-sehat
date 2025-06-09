import React, { useState, useEffect, useRef } from 'react'
import allQuestions from '../components/Question'
import { supabase } from '../SupabaseClient'
import Confetti from 'react-confetti' 

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const InformationCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
)

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5)

export default function Quiz() {
  const [step, setStep] = useState('kategori')
  const [category, setCategory] = useState('')
  const [quiz, setQuiz] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(900)
  const [startTime, setStartTime] = useState(null)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false) // State untuk mengontrol konfeti

  const correctAudio = useRef(null)
  const wrongAudio = useRef(null)
  const themeAudio = useRef(null)
  // Anda tidak perlu ref untuk container quiz jika Anda menggunakan window.innerWidth/Height

  const TOTAL_TIME = 900
  const MAX_SCORE = 100
  const PENALTY_PER_SECOND = 0.1
  const MAX_PENALTY_AMOUNT = 30

  // State untuk dimensi jendela
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Effect untuk mendeteksi perubahan ukuran jendela
  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, []) // Hanya dijalankan sekali saat mount

  // Inisialisasi audio setelah komponen mount
  useEffect(() => {
    correctAudio.current = new Audio('/sounds/true.mp3')
    wrongAudio.current = new Audio('/sounds/wrong.mp3')
    themeAudio.current = new Audio('/sounds/themesong.mp3')
    if (themeAudio.current) {
      themeAudio.current.loop = true
      themeAudio.current.volume = 0.5
    }

    return () => {
      if (themeAudio.current) {
        themeAudio.current.pause()
        themeAudio.current.currentTime = 0
      }
    }
  }, [])

  useEffect(() => {
    const fetchAndSetUser = async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const { data: profile, error: profileError } = await supabase
          .from('Profile')
          .select('name')
          .eq('id', currentUser.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError.message)
        }

        if (profile?.name) {
          setUserName(profile.name)
        } else {
          const displayName =
            currentUser.user_metadata?.display_name ||
            currentUser.user_metadata?.name ||
            currentUser.user_metadata?.full_name ||
            currentUser.email?.split('@')[0] ||
            'Pengguna'
          setUserName(displayName)
        }
      } else {
        setUserName('')
      }
    }

    const getInitialUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      fetchAndSetUser(user)
    }
    getInitialUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      fetchAndSetUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (category) {
      const filtered = allQuestions.filter((q) => q.category === category)
      setQuiz(shuffleArray(filtered))
      setCurrent(0)
      setSelected(null)
      setCorrectAnswers(0)
      setFinalScore(0)
      setTimeLeft(TOTAL_TIME)
      setStartTime(null)
      setShowConfetti(false) // Pastikan konfeti mati saat kuis baru dimulai

      if (themeAudio.current) {
        // Play audio hanya setelah ada interaksi pengguna
        // Ini mungkin tidak langsung autoplay di browser/mobile,
        // tapi akan dicoba saat setCategory
        themeAudio.current
          .play()
          .catch((e) => console.error('Autoplay prevented:', e))
      }
    }
  }, [category])

  useEffect(() => {
    if (step !== 'quiz' || timeLeft === 0) {
      if (timeLeft === 0 && step === 'quiz') {
        finishQuiz()
      }
      return
    }

    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft, step])

  const calculateFinalScore = (correctCount, timeUsed, totalQuestions) => {
    if (totalQuestions === 0) {
      return 0
    }

    const scorePerQuestion = MAX_SCORE / totalQuestions
    let initialScore = correctCount * scorePerQuestion

    let timePenalty = timeUsed * PENALTY_PER_SECOND
    timePenalty = Math.min(timePenalty, MAX_PENALTY_AMOUNT)

    let finalCalculatedScore = initialScore - timePenalty

    const finalScoreResult = Math.max(
      0,
      parseFloat(finalCalculatedScore.toFixed(1))
    )
    return finalScoreResult
  }

  const finishQuiz = async () => {
    const timeUsed = TOTAL_TIME - timeLeft
    const calculatedScore = calculateFinalScore(
      correctAnswers,
      timeUsed,
      quiz.length
    )
    setFinalScore(calculatedScore)

    setStep('hasil')
    setShowConfetti(true) // Tampilkan konfeti saat masuk ke hasil

    if (themeAudio.current) {
      themeAudio.current.pause()
      themeAudio.current.currentTime = 0
    }

    const result = await saveScoreToDatabase(calculatedScore)

    if (!result.success) {
      console.error('Failed to save score:', result.error)
    }
  }

  const saveScoreToDatabase = async (calculatedScore) => {
    if (!user) {
      console.error('No user logged in, score not saved.')
      return { success: false, error: 'No user logged in' }
    }

    setIsSaving(true)
    try {
      const finishedTime = new Date()

      const { data, error } = await supabase
        .from('User_scores')
        .insert([
          {
            user_id: user.id,
            name: userName || user.email?.split('@')[0] || 'Anonymous',
            category: category,
            score: calculatedScore,
            finished_time: finishedTime.toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error saving score:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error saving score:', error)
      return { success: false, error: error.message }
    } finally {
      setIsSaving(false)
    }
  }

  // Efek untuk memicu finishQuiz saat semua soal terjawab
  useEffect(() => {
    if (step === 'quiz' && quiz.length > 0) {
      // current == quiz.length berarti sudah menjawab semua soal (indeks 0 sampai quiz.length-1)
      if (current === quiz.length && selected !== null) {
        // Memberikan sedikit waktu agar state correctAnswers benar-benar terupdate
        const finalCheckTimer = setTimeout(() => {
          finishQuiz()
        }, 50)

        return () => clearTimeout(finalCheckTimer)
      }
    }
  }, [current, quiz.length, selected, step]) // Pantau perubahan pada current, quiz.length, selected, dan step

  const handleAnswer = (option) => {
    if (selected) return

    setSelected(option)

    if (option === quiz[current].answer) {
      setCorrectAnswers((prevCount) => prevCount + 1)
      if (correctAudio.current) {
        correctAudio.current.currentTime = 0
        correctAudio.current.play()
      }
    } else {
      if (wrongAudio.current) {
        wrongAudio.current.currentTime = 0
        wrongAudio.current.play()
      }
    }

    setTimeout(() => {
      // Jika ini BUKAN soal terakhir, lanjutkan ke soal berikutnya
      if (current + 1 < quiz.length) {
        setCurrent((c) => c + 1)
        setSelected(null)
      } else {
        // Jika ini soal terakhir, set current ke quiz.length untuk memicu useEffect di atas
        // yang akan memanggil finishQuiz setelah correctAnswers benar-benar terupdate.
        setCurrent(quiz.length)
        // Penting: Jangan panggil finishQuiz() langsung di sini
      }
    }, 800)
  }

  const restart = () => {
    setCategory('')
    setQuiz([])
    setCurrent(0)
    setSelected(null)
    setCorrectAnswers(0)
    setFinalScore(0)
    setStep('kategori')
    setTimeLeft(TOTAL_TIME)
    setStartTime(null)
    setIsSaving(false)
    setShowConfetti(false) // Matikan konfeti saat restart

    if (themeAudio.current) {
      themeAudio.current.pause()
      themeAudio.current.currentTime = 0
    }
  }

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  const progressPercentage = quiz.length
    ? ((current + (selected ? 1 : 0)) / quiz.length) * 100
    : 0

  return (
    <div className="min-h-screen bg-[#E5F7E4] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Konfeti hanya muncul jika showConfetti true */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false} // Konfeti hanya jatuh sekali
          numberOfPieces={500} // Jumlah piece konfeti
          run={showConfetti} // Agar confetti muncul saat showConfetti true
          zIndex={9999}
        />
      )}

      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -z-0">
        <svg
          width="300"
          height="220"
          viewBox="0 0 400 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 0C302.5 6.5 240.5 35 168.5 130.5C96.5 226 15 242.5 0 250H400V0Z"
            fill="#88de7c"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -z-0">
        <svg
          width="150"
          height="150"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-10 200 C40 150, 65 125, 100 0 L-10 -10 V200 Z"
            fill="#88de7c"
          />
        </svg>
      </div>

      <div className="w-full max-w-sm rounded-[30px] p-6 pt-5 relative z-10 bg-white shadow-lg mb-20">
        <header className="flex items-center justify-center mb-4">
          <h1 className="font-bold text-xl text-[#6B4F35]">
            {step === 'kategori' && 'Pilih Kategori'}
            {step === 'quiz' && category + ' Quiz'}
            {step === 'hasil' && 'Hasil Quiz'}
          </h1>
          <div className="absolute right-3 top-[5.5rem]">
            {step === 'quiz' && (
              <button
                className="font-semibold text-lg text-[#88de7c]"
                onClick={() => {
                  if (current + 1 < quiz.length) {
                    setCurrent((c) => c + 1)
                    setSelected(null)
                  } else {
                    finishQuiz()
                  }
                }}
              >
                Skip
              </button>
            )}
          </div>
        </header>

        {user && userName && (
          <div className="mb-4 text-center">
            <p className="text-sm text-[#6B4F35]">
              Halo, <span className="font-semibold">{userName}</span>!
            </p>
          </div>
        )}

        {!user && step === 'kategori' && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-700">
              ⚠️ Silakan login terlebih dahulu untuk menyimpan skor quiz Anda.
            </p>
          </div>
        )}

        {step === 'kategori' && (
          <div className="space-y-4">
            {['IMT', 'Kalender Kehamilan', 'Kalori'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setStep('quiz')
                }}
                className="w-full py-4 bg-[#88de7c] text-white rounded-xl font-bold hover:bg-[#48aa7c] transition"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Hanya render pertanyaan jika step adalah 'quiz' dan current valid */}
        {step === 'quiz' && quiz.length > 0 && current < quiz.length && (
          <>
            <div className="mb-4">
              <p className="text-[#6B4F35] font-bold text-sm mb-1">
                Soal {current + 1} / {quiz.length}
              </p>
              <div className="w-full bg-[#E5F7E4] rounded-full h-2">
                <div
                  className="bg-[#4CAF50] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[#6B4F35] mt-2 font-bold">
                Waktu tersisa: {minutes}:{seconds}
              </p>
            </div>

            <p className="text-[#6B4F35] font-bold text-xl mb-4">
              {quiz[current].question}
            </p>

            <div className="space-y-3">
              {quiz[current].options.map((option, idx) => {
                const isCorrect = option === quiz[current].answer
                const isSelected = option === selected

                let optionClass =
                  'border-2 border-[#88de7c] rounded-xl p-3 flex items-center cursor-pointer select-none'

                if (selected) {
                  if (isSelected && isCorrect) {
                    optionClass += ' bg-green-100 border-green-400'
                  } else if (isSelected && !isCorrect) {
                    optionClass +=
                      ' bg-red-100 border-red-400 line-through text-red-600'
                  } else if (isCorrect) {
                    optionClass += ' bg-green-100 border-green-400'
                  } else {
                    optionClass += ' opacity-50'
                  }
                } else {
                  optionClass += ' hover:bg-orange-50'
                }

                return (
                  <div
                    key={idx}
                    className={optionClass}
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="flex-grow">{option}</span>
                    {selected &&
                      isSelected &&
                      (isCorrect ? (
                        <CheckIcon className="text-green-500" />
                      ) : (
                        <InformationCircleIcon className="text-red-500" />
                      ))}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {step === 'hasil' && (
          <div className="text-center">
            <h2 className="text-[#6B4F35] font-extrabold text-4xl mb-4">
              Hasil Quiz
            </h2>

            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
              <div className="text-6xl font-bold text-[#4CAF50] mb-2">
                {finalScore.toFixed(1)}
              </div>
              <div className="text-lg text-[#6B4F35] font-semibold">
                Skor Total (dari {MAX_SCORE})
              </div>
            </div>

            <div className="mb-6 space-y-3 text-left bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-center mb-3 text-[#6B4F35]">
                Detail Penilaian:
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-[#6B4F35]">Jawaban Benar:</span>
                <span className="font-bold text-[#4CAF50]">
                  {correctAnswers} / {quiz.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6B4F35]">Skor Dasar Benar:</span>
                <span className="font-bold text-blue-600">
                  {((correctAnswers / quiz.length) * MAX_SCORE).toFixed(1)} poin
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6B4F35]">Penalti Waktu:</span>
                <span className="font-bold text-red-600">
                  -
                  {Math.min(
                    (TOTAL_TIME - timeLeft) * PENALTY_PER_SECOND,
                    MAX_PENALTY_AMOUNT
                  ).toFixed(1)}{' '}
                  poin
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6B4F35]">Waktu Tersisa:</span>
                <span className="font-bold text-orange-600">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6B4F35]">Waktu Digunakan:</span>
                <span className="font-bold text-gray-600">
                  {Math.floor((TOTAL_TIME - timeLeft) / 60)}:
                  {((TOTAL_TIME - timeLeft) % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="mb-4">
              {finalScore >= 90 && (
                <p className="text-green-600 font-bold text-lg">
                  🎉 Luar biasa! Performa sempurna!
                </p>
              )}
              {finalScore >= 75 && finalScore < 90 && (
                <p className="text-blue-600 font-bold text-lg">
                  👏 Bagus sekali! Terus tingkatkan!
                </p>
              )}
              {finalScore >= 50 && finalScore < 75 && (
                <p className="text-orange-600 font-bold text-lg">
                  👍 Cukup baik! Masih bisa lebih baik lagi!
                </p>
              )}
              {finalScore < 50 && (
                <p className="text-red-600 font-bold text-lg">
                  💪 Jangan menyerah! Coba lagi untuk hasil lebih baik!
                </p>
              )}
            </div>

            {user && (
              <div className="mb-4">
                {isSaving ? (
                  <p className="text-blue-600 text-sm">💾 Menyimpan skor...</p>
                ) : (
                  <p className="text-green-600 text-sm">
                    ✅ Skor berhasil disimpan!
                  </p>
                )}
              </div>
            )}

            {!user && (
              <div className="mb-4 p-3 bg-orange-100 border-l-4 border-orange-500 rounded">
                <p className="text-sm text-orange-700">
                  ℹ️ Skor tidak disimpan karena Anda belum login.
                </p>
              </div>
            )}

            <button
              onClick={restart}
              className="mt-4 py-3 px-6 rounded-xl bg-[#88de7c] text-white font-bold hover:bg-[#48aa7c] transition"
            >
              Mulai Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
