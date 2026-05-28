import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoClose } from 'react-icons/io5';
import { usePortfolioStore } from '../store/portfolioStore';

export default function Certificates() {
  const { certificates } = usePortfolioStore();
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section id="certificates" className="py-20 bg-[#D9F99D] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        <div className="flex justify-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black bg-white text-black px-10 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
            Sertifikat
          </h2>
        </div>

        {/* Grid Sertifikat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {certificates.map((cert, index) => (
            <div 
              key={cert.id || index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col group transition-all"
            >
              <div className="p-4 border-b-4 border-black overflow-hidden bg-gray-50">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-auto border-2 border-black group-hover:scale-105 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="p-4 mt-auto">
                <button 
                  onClick={() => setSelectedImg(cert.image)} // Set gambar ke state saat diklik
                  className={`w-full py-3 ${cert.color} text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PREVIEW (Muncul jika selectedImg tidak null) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)} // Klik di luar gambar untuk tutup
        >
          <div 
            className="relative max-w-5xl w-full bg-white border-8 border-black p-2 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat gambar diklik
          >
            {/* Tombol Close gaya Neobrutalism */}
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute -top-6 -right-6 bg-[#FF007A] text-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <IoClose size={32} strokeWidth={3} />
            </button>

            <img 
              src={selectedImg} 
              alt="Preview Sertifikat" 
              className="w-full h-auto border-4 border-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}