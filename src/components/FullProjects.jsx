import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { usePortfolioStore } from "../store/portfolioStore";

const categories = ["Semua", "Website", "UI/UX", "Mobile App", "3D Model"];

export default function FullProjects() {
  const { projects } = usePortfolioStore();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredProjects = projects.filter(project => 
    activeCategory === "Semua" ? true : project.category === activeCategory
  );

  const showMoreProjects = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(3); // Reset jumlah visibilitas saat mengganti kategori
  };

  return (
    <section id="full-projects" className="py-20 bg-[#BEE3F8] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center mb-8" data-aos="fade-down">
          <h2 className="text-3xl md:text-5xl font-black bg-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase text-center">
            Semua Proyek
          </h2>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`font-black text-sm md:text-base px-6 py-2 border-4 border-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                activeCategory === category ? "bg-[#00FF75]" : "bg-white hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
            {filteredProjects.slice(0, visibleCount).map((item, index) => (
              <ProjectCard key={index} project={item} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" data-aos="fade-up">
            <p className="font-black text-xl uppercase text-center">Belum ada proyek di kategori ini.</p>
          </div>
        )}

        {visibleCount < filteredProjects.length && (
          <div className="flex justify-center mt-12" data-aos="fade-up">
            <button 
              onClick={showMoreProjects}
              className="bg-yellow-400 font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:bg-white transition-all uppercase"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
