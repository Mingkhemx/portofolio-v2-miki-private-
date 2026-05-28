import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Testimonials() {
  useEffect(() => {
    AOS.init();
  }, []);

  const reviews = [
    {
      name: "Anonymus",
      text: "Saya senang dengan website portofolio yang diberikan Muhammad Rifki—terlihat bagus, berjalan lancar, dan mudah dinavigasi serta digunakan di berbagai perangkat.",
      color: "border-yellow-400"
    },
    {
      name: "Anonymus",
      text: "Sistem inventaris yang dikembangkan Muhammad Rifki untuk kami telah merevolusi operasional kami. Pemahamannya tentang teknologi frontend dan backend sangat mengesankan.",
      color: "border-blue-500"
    },
    {
      name: "Anonymus",
      text: "Pekerjaan Muhammad Rifki pada aplikasi penagihan kami sangat luar biasa. Visualisasi data dan pembaruan real-time bekerja dengan sempurna. Pengembang yang profesional dan andal.",
      color: "border-green-500"
    }
  ];

  const stats = [
    { label: "KLIEN PUAS", value: "3", color: "bg-yellow-400" },
    { label: "TINGKAT KEBERHASILAN %", value: "100", color: "bg-[#00FF75]" },
    { label: "PROYEK SELESAI", value: "5", color: "bg-blue-500" },
    { label: "RATING RATA-RATA", value: "5.0", color: "bg-white" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#FECACA] border-b-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        {/* <div className="flex justify-center mb-16" data-aos="zoom-in">
          <h2 className="text-3xl md:text-5xl font-black bg-white text-black px-10 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
            Apa Kata Klien
          </h2>
        </div> */}

        {/* Grid Testimonial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((item, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col hover:-translate-y-2 transition-all duration-300"
            >
              {/* Rating Star */}
              <div className="flex items-center gap-1 mb-4">
                <span className="font-black text-sm ml-2">{item.rating}</span>
              </div>

              {/* Teks Testi */}
              <div className={`border-l-4 ${item.color} pl-4 mb-6`}>
                <p className="font-bold italic text-sm md:text-base leading-relaxed text-gray-800">
                  "{item.text}"
                </p>
              </div>

              {/* Profil Klien */}
              <div className="flex items-center gap-3 mt-auto pt-6 border-t-2 border-black/10">
                <div className="w-12 h-12 bg-gray-200 border-2 border-black rounded-sm overflow-hidden">
                  <div className="w-full h-full bg-slate-400 flex items-center justify-center font-bold text-white uppercase">
                    {item.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase">{item.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistik / Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i}
              data-aos="flip-up"
              data-aos-delay={i * 100}
              className={`${stat.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 text-center group hover:translate-y-[-2px] transition-all`}
            >
              <h3 className="text-5xl md:text-5xl font-black mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-tighter">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}