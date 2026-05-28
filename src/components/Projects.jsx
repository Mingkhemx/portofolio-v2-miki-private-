import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import ProjectCard from "./ProjectCard";
import { usePortfolioStore } from "../store/portfolioStore";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default function Projects() {
  const { highlights, projects } = usePortfolioStore();
  const highlightedProjects = projects.filter(p => highlights.includes(p.title));

  return (
    <section id="projects" className="py-20 bg-[#F4AE52] border-b-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex justify-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl md:text-5xl font-black bg-yellow-400 px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
            Highlight Proyek
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          effect={'coverflow'} // Menambahkan efek kedalaman
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          speed={600} // Kecepatan animasi dalam milidetik
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          className="!pb-20"
          data-aos="fade-up"
        >
          {highlightedProjects.map((item, index) => (
            <SwiperSlide key={index} className="transition-transform duration-300">
              {({ isActive }) => (
                <div className={`${isActive ? 'scale-105' : 'scale-90 opacity-60'} transition-all duration-500 h-full`}>
                   <ProjectCard project={item} compact={true} />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}