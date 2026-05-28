import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { usePortfolioStore } from '../store/portfolioStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaLaravel, FaReact, FaNodeJs, FaVuejs, FaJava, FaDatabase, FaArrowLeft, FaExternalLinkAlt
} from 'react-icons/fa';
import {
  SiTailwindcss, SiTypescript, SiVite, SiSupabase, SiMysql,
  SiPostgresql, SiOpenai, SiSpringboot
} from 'react-icons/si';

const techIcons = {
  "Laravel": <FaLaravel className="text-red-600" />,
  "React": <FaReact className="text-blue-400" />,
  "TypeScript": <SiTypescript className="text-blue-500" />,
  "Tailwind": <SiTailwindcss className="text-cyan-400" />,
  "Node.js": <FaNodeJs className="text-green-500" />,
  "OpenAI": <SiOpenai className="text-green-500" />,
  "Supabase": <SiSupabase className="text-emerald-500" />,
  "Mysql": <SiMysql className="text-blue-600" />,
  "Vue": <FaVuejs className="text-emerald-400" />,
  "Vite": <SiVite className="text-purple-500" />,
  "Java": <FaJava className="text-red-500" />,
  "Spring Boot": <SiSpringboot className="text-green-600" />,
  "PostgreSQL": <SiPostgresql className="text-blue-400" />,
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, skills } = usePortfolioStore();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const project = projects.find(p => p.id === id);

  // Pastikan halaman selalu dimulai dari paling atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center font-sans">
        <h1 className="text-4xl font-black uppercase mb-4">Proyek Tidak Ditemukan</h1>
        <button
          onClick={() => navigate('/#projects')}
          className="bg-black text-white font-black uppercase px-6 py-3 border-4 border-black hover:bg-white hover:text-black transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col font-sans">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-[#F4AE52] border-b-4 border-black pt-24 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/#full-projects')}
            className="flex items-center gap-2 font-black uppercase bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mb-6"
          >
            <FaArrowLeft /> Kembali
          </button>

          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="bg-black text-white px-3 py-1 text-sm font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              {project.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-2">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Kolom Kiri: Media */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Browser top bar */}
            <div className="bg-gray-200 py-2 px-4 border-b-4 border-black flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
            </div>
            {project.video ? (
              <video
                src={project.video}
                controls
                autoPlay
                loop
                muted
                className="w-full object-cover"
              />
            ) : project.images && project.images.length > 0 ? (
              <div className="w-full detail-swiper-container">
                <style>{`
                  .detail-swiper-container .swiper-button-next,
                  .detail-swiper-container .swiper-button-prev {
                    color: black;
                    background-color: #00FF75;
                    border: 2px solid black;
                    width: 40px;
                    height: 40px;
                    box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
                  }
                  .detail-swiper-container .swiper-button-next::after,
                  .detail-swiper-container .swiper-button-prev::after {
                    font-size: 16px;
                    font-weight: 900;
                  }
                  .detail-swiper-container .swiper-pagination-bullet-active {
                    background-color: #00FF75;
                    border: 2px solid black;
                    width: 12px;
                    height: 12px;
                  }
                `}</style>
                <Swiper
                  modules={[Pagination, Navigation, Autoplay, Thumbs]}
                  pagination={{ clickable: true }}
                  navigation
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  className="w-full mb-0 border-b-4 border-black"
                >
                  {project.images.map((imgUrl, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="w-full object-cover cursor-zoom-in"
                        onClick={() => setFullScreenImage(imgUrl)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full bg-[#E5E7EB] p-2"
                >
                  {project.images.map((imgUrl, idx) => (
                    <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:border-[#00FF75]">
                      <img
                        src={imgUrl}
                        alt={`thumbnail ${idx + 1}`}
                        className="w-full h-20 object-cover border-2 border-black"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full object-cover cursor-zoom-in"
                onClick={() => setFullScreenImage(project.image)}
              />
            )}
          </div>

          {/* Live Preview button jika ada demo */}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00FF75] text-center py-4 border-4 border-black font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <FaExternalLinkAlt /> Live Preview
            </a>
          )}
        </div>

        {/* Kolom Kanan: Info Detail */}
        <div className="flex flex-col gap-6">

          {/* Deskripsi */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-4">
              Deskripsi Proyek
            </h2>
            <p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-4 border-black pb-3 mb-4">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((item, index) => {
                const matchedSkill = skills.find(s => s.name.toLowerCase() === item.toLowerCase());
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F4F4F5] px-4 py-3 border-4 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase hover:bg-[#00FF75] transition-colors"
                  >
                    {matchedSkill ? (
                      <img src={matchedSkill.image} alt={item} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-2xl">{techIcons[item] || <FaDatabase className="text-gray-400" />}</span>
                    )}
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      
      <div className="mt-20">
        <Footer />
      </div>

      {/* Fullscreen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullScreenImage(null)}
        >
          <img 
            src={fullScreenImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-full object-contain border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]" 
          />
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-[#FF007A] text-white w-12 h-12 flex items-center justify-center font-black border-4 border-black hover:scale-110 transition-transform z-[210] text-xl"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
