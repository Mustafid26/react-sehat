import { useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Doktor from "/img/docter-min.png";
import tipsKehamilan from "../components/TipsKehamilan";

export default function Kalender() {
  const navigate = useNavigate();
  const [hpht, setHpht] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!hpht) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const hphtDate = dayjs(hpht);
      const hpl = hphtDate.add(280, "day");
      const weeks = dayjs().diff(hphtDate, "week");

      setResult({
        hpl: hpl.format("dddd, DD MMMM YYYY"),
        weeks,
      });
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate("/home");
  };

  const currentTips =
    result && tipsKehamilan.find((item) => item.minggu === result.weeks);

  return (
    <>
      <div className="min-h-screen mx-auto p-4 bg-gradient-to-b from-[#88DE7C] to-white">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center font-bold text-[#164E50] mt-4"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali
        </button>
        <div className="max-w-md mx-auto p-6 shadow-xl rounded-xl mt-10 bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Kalkulator Kehamilan
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Masukkan Tanggal HPHT
          </label>
          <div className="relative mb-4">
            <input
              type="date"
              value={hpht}
              onChange={(e) => setHpht(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <CalendarDaysIcon className="w-5 h-5 absolute top-2.5 left-3 text-gray-400" />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#88DE7C] hover:bg-[#48aa7c] text-white py-2 rounded-lg transition duration-300"
          >
            {loading ? "Menghitung..." : "Hitung Kehamilan"}
          </button>

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-800">📅 HPL:</p>
                <p className="text-gray-700">{result.hpl}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  🧸 Usia Kehamilan:
                </p>
                <p className="text-gray-700">Minggu ke-{result.weeks}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  🌱 Tips Minggu Ini:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {currentTips ? (
                    currentTips.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))
                  ) : (
                    <li>Belum ada tips untuk minggu ini</li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
        <div className="gambar">
          <img src={Doktor} alt="" />
        </div>
      </div>
    </>
  );
}
