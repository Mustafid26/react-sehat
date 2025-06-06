import React from "react";
import { useNavigate } from 'react-router-dom';

const Card = ({ title, children, onClick }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="text-gray-600">{children}</div>
    {onClick && (
      <button
        onClick={onClick}
        className="w-full bg-[#164E50] text-white font-semibold py-2 rounded-xl hover:bg-[#133e3f] transition mt-4"
      >
        Selengkapnya
      </button>
    )}
  </div>
);

const DashboardCards = () => {
  const navigate = useNavigate();

  const handleNavigate = (slug) => {
    navigate(`/details/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mb-24">
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        <Card
          title="Komponen Berpengaruh"
          onClick={() => handleNavigate("komponen-berpengaruh")}
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Asupan nutrisi</li>
            <li>Aktivitas fisik</li>
            <li>Faktor genetik</li>
            <li>Kebiasaan hidup</li>
          </ul>
        </Card>

        <Card
          title="Status Gizi"
          onClick={() => handleNavigate("status-gizi")}
        >
          <p>
            Indeks massa tubuh (IMT), keseimbangan vitamin dan mineral, serta berat badan ideal merupakan indikator utama status gizi yang baik.
          </p>
        </Card>

        <Card
          title="Faktor Risiko Penyakit"
          onClick={() => handleNavigate("faktor-risiko-penyakit")}
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Merokok</li>
            <li>Hipertensi</li>
            <li>Kolesterol tinggi</li>
            <li>Kurang olahraga</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCards;
