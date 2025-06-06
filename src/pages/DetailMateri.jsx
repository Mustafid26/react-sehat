import React from "react";
import { useParams } from "react-router-dom";

const detailData = {
  "komponen-berpengaruh": (
    <>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Komponen Berpengaruh terhadap IMT
      </h2>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-xl font-semibold mb-2">1. Hubungan IMT dengan Lemak Tubuh</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>IMT berkorelasi positif dengan persentase lemak tubuh – makin tinggi IMT, makin tinggi kemungkinan kadar lemak tubuh.</li>
            <li>IMT bisa digunakan sebagai indikator tak langsung untuk mengukur kadar lemak tubuh.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">2. Jenis Kelamin dan Usia</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pria dan wanita memiliki komposisi tubuh berbeda, sehingga IMT bisa dipengaruhi.</li>
            <li>Usia juga berpengaruh, karena massa otot dan lemak tubuh berubah seiring bertambahnya umur.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">3. Proporsi Berat terhadap Tinggi Badan</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>IMT dihitung dari berat badan (kg) dibagi tinggi badan kuadrat (m²).</li>
            <li>Namun, rumus ini tidak membedakan apakah berat itu berasal dari otot, lemak, tulang, atau cairan.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">4. Aktivitas Fisik</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Aktivitas fisik membantu menjaga massa otot dan membakar lemak, sehingga dapat menurunkan atau menjaga IMT.</li>
            <li>Orang yang aktif secara fisik biasanya memiliki IMT lebih sehat.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">5. Pola Makan</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pola makan tinggi kalori, lemak jenuh, dan gula bisa menyebabkan penumpukan lemak.</li>
            <li>Pola makan sehat membantu menjaga berat badan ideal dan IMT stabil.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">6. Faktor Psikologis</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Stres, kecemasan, dan depresi bisa menyebabkan pola makan tidak teratur dan memengaruhi IMT.</li>
            <li>Hal ini lebih banyak ditemukan pada remaja perempuan.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">7. Citra Tubuh dan Perilaku Makan</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Distorsi citra tubuh bisa memengaruhi cara makan seseorang.</li>
            <li>Perilaku makan yang tidak sehat bisa memengaruhi IMT.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">8. Pengaruh Keluarga dan Lingkungan</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Komentar negatif tentang berat badan dapat memengaruhi psikologis dan pola makan.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">9. Kebijakan dan Gaya Hidup</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Gaya hidup aktif yang didukung lingkungan sekitar memengaruhi kebiasaan olahraga dan status IMT.</li>
          </ul>
        </div>
      </div>
    </>
  ),
  "status-gizi": (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Status Gizi</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Status gizi adalah salah satu unsur penting dalam membentuk status kesehatan. Status gizi (nutritional status) adalah keadaan yang diakibatkan oleh keseimbangan antara asupan zat gizi dari makanan dan kebutuhan zat gizi oleh tubuh. Status gizi sangat dipengaruhi oleh asupan gizi.
      </p>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-xl font-semibold mb-1">1. Underweight (Gizi Kurang)</h3>
          <p>
            Kondisi ini terjadi ketika nilai IMT yang didapatkan &lt;18,5. Status gizi kurang merupakan keadaan dimana tidak terpenuhi satu atau lebih zat-zat gizi penting yang didapatkan dari makanan untuk diserap oleh tubuh. Seseorang dengan keadaan gizi kurang kebanyakan dari mereka tidak terpenuhi asupan nutrisi dengan berat badan dibawah normal.
          </p>
          <p className="mt-2">
            <strong>Solusi:</strong> Menambah porsi makan, mengonsumsi makanan dan minuman yang mengandung kalori dan protein tinggi seperti susu, telur, daging, dan kacang-kacangan.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">2. Normal (Gizi Baik)</h3>
          <p>
            Kondisi ini terjadi ketika nilai IMT yang didapatkan antara 18,5 - 25. Status gizi baik merupakan kondisi dimana tubuh memperoleh cukup zat-zat gizi dan terjadi keseimbangan antara jumlah energi yang masuk dengan energi yang keluar.
          </p>
          <p className="mt-2">
            <strong>Tips:</strong> Mempertahankan kebiasaan hidup sehat, olahraga rutin, dan mengonsumsi makanan bergizi dengan memperhatikan pedoman gizi seimbang.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">3. Overweight / Pre-Obesitas (Gizi Lebih)</h3>
          <p>
            Terjadi ketika IMT antara 25 - 30. Berat badan melebihi batas normal, tetapi belum mencapai tingkat obesitas.
          </p>
          <p className="mt-2">
            <strong>Solusi:</strong> Mengatur pola makan dengan mengurangi asupan kalori, meningkatkan aktivitas fisik secara teratur, dan konsultasi ke ahli gizi jika perlu.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">4. Obesitas</h3>
          <p>
            IMT &gt; 30. Obesitas adalah kondisi gangguan akibat asupan energi yang berlebihan. Energi tersebut disimpan dalam bentuk lemak sehingga berat badan bertambah.
          </p>
          <p className="mt-2">
            <strong>Penanganan:</strong> Perubahan gaya hidup signifikan, diet sehat yang ketat, olahraga intensif, dan konsultasi medis untuk terapi atau pengobatan tambahan.
          </p>
        </div>
      </div>
    </>
  ),
  "faktor-risiko-penyakit": (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Faktor Risiko Penyakit Berdasarkan IMT</h2>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-xl font-semibold mb-2">A. IMT Kurang (&lt; 18,5)</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>TBC (Tuberkulosis):</strong> IMT rendah memudahkan masuknya infeksi seperti TBC karena sistem imun melemah akibat kurang gizi.
            </li>
            <li>
              <strong>Osteoporosis:</strong> IMT rendah menyebabkan rendahnya pencapaian massa tulang puncak dan peningkatan kehilangan massa tulang.
            </li>
            <li>
              <strong>Malnutrisi:</strong> Disebabkan oleh asupan nutrisi yang buruk, gangguan penyerapan, atau penyakit kronis, yang menurunkan cadangan lemak dan otot.
            </li>
            <li>
              <strong>Anemia:</strong> IMT rendah, terutama pada ibu hamil, dapat meningkatkan risiko anemia dan berdampak pada bayi seperti berat lahir rendah dan stunting.
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">B. IMT Lebih (&gt; 25)</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Hipertensi:</strong> Obesitas meningkatkan tekanan darah melalui peningkatan volume darah, resistensi pembuluh, dan perubahan struktur jantung.
            </li>
            <li>
              <strong>Diabetes:</strong> IMT ≥ 25 kg/m² meningkatkan risiko diabetes hingga 2,6 kali dibandingkan dengan IMT normal.
            </li>
            <li>
              <strong>Penyakit Kardiovaskular:</strong> IMT tinggi menambah beban kerja jantung dan meningkatkan risiko kondisi seperti obesitas dan hipertensi.
            </li>
            <li>
              <strong>Stroke:</strong> Obesitas dapat memicu dislipidemia dan aterosklerosis yang menyempitkan pembuluh darah, memicu stroke iskemik.
            </li>
          </ol>
        </div>
      </div>
    </>
  ),
};

const DetailMateri = () => {
  const { judul } = useParams();
  const content = detailData[judul];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-6 mb-12">
      <div className="bg-white shadow-lg rounded-xl max-w-4xl mx-auto p-8">
        {content ? (
          content
        ) : (
          <p className="text-gray-500 text-center">Materi tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default DetailMateri;
