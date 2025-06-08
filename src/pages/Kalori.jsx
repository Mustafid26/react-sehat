import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function KalkulatorKalori() {
  const navigate = useNavigate();

  const [tinggi, setTinggi] = useState("");
  const [berat, setBerat] = useState("");
  const [usia, setUsia] = useState("");
  const [gender, setGender] = useState("");
  const [faktorAktivitas, setFaktorAktivitas] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasilKalori, setHasilKalori] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError.message);
        return;
      }

      if (user && user.user) {
        const { data: profile, error: profileError } = await supabase
          .from("Profile")
          .select("age, gender, name")
          .eq("id", user.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          return;
        }

        if (profile) {
          setUsia(profile.age || "");
          setGender(profile.gender || "");
          setUserName(profile.name || "Pengguna");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleBack = () => {
    navigate("/home");
  };

  const hitungKalori = () => {
    if (!tinggi || !berat || !usia || !gender || faktorAktivitas === null) {
      alert("Mohon lengkapi semua inputan dan pilih faktor aktivitas.");
      return;
    }

    const bb = parseFloat(berat);
    const tb = parseFloat(tinggi);
    const u = parseFloat(usia);

    let bmr = 0;

    if (gender === "male") {
      bmr = 66.473 + 13.752 * bb + 5.003 * tb - 6.755 * u;
    } else if (gender === "female") {
      bmr = 655.096 + 9.56 * bb + 1.85 * tb - 4.67 * u;
    }

    const totalKalori = bmr * faktorAktivitas;
    setHasilKalori(totalKalori.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#88DE7C] to-white flex flex-col items-center justify-center p-4 relative mb-10">
      {/* Tombol Kembali */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center font-bold text-[#164E50] z-10"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Kembali
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6 mt-12 mb-8">
        {" "}
        {/* mt-12 untuk memberi ruang tombol back */}
        <h1 className="text-2xl font-bold text-center text-[#164E50]">
          Kalkulator Kebutuhan Kalori
        </h1>
        {/* Input Tinggi Badan */}
        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
            placeholder="Contoh: 160"
          />
        </div>
        {/* Input Berat Badan */}
        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Berat Badan (kg)
          </label>
          <input
            type="number"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
            placeholder="Contoh: 50"
          />
        </div>
        {/* Input Usia */}
        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Usia
          </label>
          <input
            type="number"
            value={usia}
            onChange={(e) => setUsia(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
            placeholder="Contoh: 30"
          />
        </div>
        {/* Pilihan Gender */}
        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-[#164E50] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#164E50]"
          >
            <option value="" disabled>
              Pilih Gender
            </option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>
        {/* Tombol Faktor Aktivitas */}
        <div>
          <label className="block text-[#164E50] font-semibold mb-1">
            Faktor Aktivitas
          </label>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-[#88de7c] text-white font-semibold py-2 rounded-xl hover:bg-[#48aa7c] transition"
          >
            Pilih Faktor Aktivitas{" "}
            {faktorAktivitas
              ? `(${faktorAktivitas === 1.2 ? "Bed Rest" : "Beraktivitas"})`
              : ""}
          </button>
        </div>
        {/* Tombol Hitung */}
        <button
          onClick={hitungKalori}
          className="w-full bg-[#88de7c] text-white font-semibold py-2 rounded-xl hover:bg-[#48aa7c] transition"
        >
          Hitung Kebutuhan Kalori
        </button>
      </div>

      {/* Modal Pilihan Faktor Aktivitas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Pilih Faktor Aktivitas
            </h2>
            <button
              onClick={() => {
                setFaktorAktivitas(1.2);
                setShowModal(false);
              }}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Bed Rest <br></br>(Tidak dapat melakukan aktivitas, dan hanya
              berbaring di tempat tidur)
            </button>
            <button
              onClick={() => {
                setFaktorAktivitas(1.3);
                setShowModal(false);
              }}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Beraktivitas (Berinteraksi dan aktivitas secara normal)
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 bg-[#164E50] text-white font-semibold py-2 rounded-xl hover:bg-[#133e3f] transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Card Hasil Perhitungan */}
      <AnimatePresence>
        {hasilKalori && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Mulai dari tidak terlihat dan 50px di bawah
            animate={{ opacity: 1, y: 0 }} // Berakhir di posisi normal
            exit={{ opacity: 0, y: 50 }} // Kembali ke posisi awal saat hilang
            transition={{ duration: 0.5, ease: "easeOut" }} // Durasi dan jenis transisi
            className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center text-[#164E50] font-semibold mt-6 mb-32"
          >
            <p className="text-xl">Halo {userName}</p>
            <p className="text-lg mt-2">
              Kebutuhan kalori kamu dalam sehari sebanyak {hasilKalori} KKAL
            </p>
            {/* Card Referensi Resep Baru */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-base text-gray-700 font-normal">
                Referensi resep yang dapat
                <br />
                kamu coba
              </p>
              <a
                href="https://bit.ly/MenuSehatSehari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block font-bold"
              >
                https://bit.ly/MenuSehatSehari
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
