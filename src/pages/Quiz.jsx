import React, { useState, useEffect } from "react";
import allQuestions from "../components/Question"; // Your question data source

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
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
);
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
);

// --- Helper to shuffle questions ---
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Quiz() {
  const [step, setStep] = useState("kategori"); // kategori | quiz | hasil
  const [category, setCategory] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Load questions by category
  useEffect(() => {
    if (category) {
      const filtered = allQuestions.filter((q) => q.category === category);
      setQuiz(shuffleArray(filtered));
      setCurrent(0);
      setSelected(null);
      setScore(0);
    }
  }, [category]);

  // Reset timer on quiz start
  useEffect(() => {
    if (step === "quiz") {
      setTimeLeft(300);
    }
  }, [step]);

  // Timer countdown
  useEffect(() => {
    if (step !== "quiz") return;

    if (timeLeft === 0) {
      setStep("hasil");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, step]);

  // Handle answer click
  const handleAnswer = (option) => {
    if (selected) return; // prevent multiple clicks
    setSelected(option);
    if (option === quiz[current].answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (current + 1 < quiz.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setStep("hasil");
      }
    }, 800);
  };

  // Restart quiz
  const restart = () => {
    setCategory("");
    setQuiz([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStep("kategori");
    setTimeLeft(300);
  };

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // Progress % for progress bar
  const progressPercentage = quiz.length
    ? ((current + (selected ? 1 : 0)) / quiz.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#E5F7E4] flex items-center justify-center p-4 font-sans relative overflow-hidden">
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

      {/* Main quiz card */}
      <div className="w-full max-w-sm rounded-[30px] p-6 pt-5 relative z-10 bg-white shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-center mb-4">
          <h1 className="font-bold text-xl text-[#6B4F35]">
            {step === "kategori" && "Pilih Kategori"}
            {step === "quiz" && category + " Quiz"}
            {step === "hasil" && "Hasil Quiz"}
          </h1>
          <div className="absolute right-4">
            {step === "quiz" && (
              <button
                className="font-semibold text-lg text-[#88de7c]"
                onClick={() => {
                  if (current + 1 < quiz.length) {
                    setCurrent((c) => c + 1);
                    setSelected(null);
                  } else {
                    setStep("hasil");
                  }
                }}
              >
                Skip
              </button>
            )}
          </div>
        </header>

        {/* Content */}

        {/* Kategori Selection */}
        {step === "kategori" && (
          <div className="space-y-4">
            {["IMT", "Kalender Kehamilan", "Kalori"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setStep("quiz");
                }}
                className="w-full py-4 bg-[#88de7c] text-white rounded-xl font-bold hover:bg-[#48aa7c] transition"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Quiz Questions */}
        {step === "quiz" && quiz.length > 0 && (
          <>
            {/* Progress Section */}
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

            {/* Question Text */}
            <p className="text-[#6B4F35] font-bold text-xl mb-4">
              {quiz[current].question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {quiz[current].options.map((option, idx) => {
                const isCorrect = option === quiz[current].answer;
                const isSelected = option === selected;

                let optionClass =
                  "border-2 border-[#88de7c] rounded-xl p-3 flex items-center cursor-pointer select-none";

                if (selected) {
                  if (isSelected && isCorrect) {
                    optionClass += " bg-green-100 border-green-400";
                  } else if (isSelected && !isCorrect) {
                    optionClass +=
                      " bg-red-100 border-red-400 line-through text-red-600";
                  } else if (isCorrect) {
                    optionClass += " bg-green-100 border-green-400";
                  } else {
                    optionClass += " opacity-50";
                  }
                } else {
                  optionClass += " hover:bg-orange-50";
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
                );
              })}
            </div>
          </>
        )}

        {/* Results */}
        {step === "hasil" && (
          <div className="text-center">
            <h2 className="text-[#6B4F35] font-extrabold text-4xl mb-4">
              Hasil Quiz
            </h2>
            <p className="text-[#6B4F35] text-2xl mb-2">
              Skor kamu: <span className="font-bold">{score}</span> dari{" "}
              {quiz.length} soal
            </p>
            <p className="text-[#6B4F35] text-lg mb-6">
              {score >= quiz.length / 2
                ? "Selamat! Kamu lulus quiz."
                : "Coba lagi, jangan menyerah!"}
            </p>
            <button
              onClick={restart}
              className="mt-4 py-3 px-6 rounded-xl bg-[#88de7c] text-white font-bold hover:bg-orange-500 transition"
            >
              Mulai Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
