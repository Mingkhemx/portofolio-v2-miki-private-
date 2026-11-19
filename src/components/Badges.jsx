import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoClose } from 'react-icons/io5';
import { usePortfolioStore } from '../store/portfolioStore';
import SkeletonImage from './SkeletonImage';

export default function Badges() {
  const { badges, isLoading } = usePortfolioStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const showMoreBadges = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section id="badges" className="py-20 bg-[#FED7AA] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        <div className="flex justify-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black bg-white text-black px-10 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
            Badge
          </h2>
        </div>

        {/* Grid Badge */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
              >
                <div className="p-4 bg-gray-50">
                  <div className="w-full aspect-[4/3] border-2 border-black skeleton-shimmer flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-black/20 border-t-black animate-spin" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : badges.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {badges.slice(0, visibleCount).map((badge, index) => (
                <div
                  key={badge.id || index}
                  data-aos="fade-up"
                  data-aos-delay={(index % 6) * 100}
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col group transition-all"
                >
                  <div className="p-4 overflow-hidden bg-gray-50 flex-1 flex items-center justify-center">
                    <SkeletonImage
                      src={badge.image}
                      alt={badge.title || `Badge ${index + 1}`}
                      onClick={() => setSelectedImg(badge.image)}
                      wrapperClassName="w-full aspect-[4/3] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                    />
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < badges.length && (
              <div className="flex justify-center mt-12" data-aos="fade-up">
                <button
                  onClick={showMoreBadges}
                  className="bg-yellow-400 font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:bg-white transition-all uppercase"
                >
                  Lihat Lebih Banyak
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" data-aos="fade-up">
            <p className="font-black text-xl uppercase text-center">Belum ada badge yang ditambahkan.</p>
          </div>
        )}
      </div>

      {/* MODAL PREVIEW (Muncul jika gambar badge diklik) */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-fit bg-white border-8 border-black p-2 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute -top-6 -right-6 bg-[#FF007A] text-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-20"
            >
              <IoClose size={32} strokeWidth={3} />
            </button>

            <SkeletonImage
              src={selectedImg}
              alt="Preview Badge"
              wrapperClassName="border-4 border-black bg-white flex items-center justify-center min-w-[260px] min-h-[200px]"
              className="max-h-[82vh] max-w-[85vw] w-auto h-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
