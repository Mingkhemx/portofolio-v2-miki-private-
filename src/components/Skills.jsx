import { usePortfolioStore } from "../store/portfolioStore";

export default function Skills() {
  const { skills } = usePortfolioStore();

  const doubleSkills = [...skills, ...skills];

  return (
    <section id="skills" className="py-20 bg-[#FFD6E8] border-b-4 border-black">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-4 mb-12 flex justify-center" data-aos="fade-down">
        <h2 className="text-2xl md:text-4xl font-black bg-[#00FF75] px-8 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase">
          Keahlian
        </h2>
      </div>

      {/* Menambahkan px-10 sampai px-32 agar konten tidak menempel ke tepi layar */}
      <div className="relative w-full px-10 md:px-32 overflow-hidden" data-aos="zoom-in">
        <div className="animate-marquee py-4">
          {doubleSkills.map((skill, i) => (
            <div 
              key={i} 
              // Ukuran card diperkecil (w-28 h-28 / md:w-36 md:h-36)
              className="mx-6 w-28 h-28 md:w-36 md:h-36 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12">
                <img src={skill.image} alt={skill.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="font-black text-[10px] md:text-xs uppercase tracking-tighter">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}