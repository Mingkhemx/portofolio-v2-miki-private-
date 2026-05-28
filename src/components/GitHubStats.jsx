import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// React Icons
import { FaCodeBranch, FaStar, FaUsers } from "react-icons/fa";
import { GoGitCommit } from "react-icons/go";

export default function GitHubStats() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const stats = [
    { 
      label: "REPOSITORI", 
      value: "29", 
      desc: "REPOSITORI PUBLIK", 
      color: "bg-white", 
      icon: <FaCodeBranch size={24} className="text-green-600" />
    },
    { 
      label: "BINTANG", 
      value: "5", 
      desc: "DITERIMA DI PROYEK", 
      color: "bg-yellow-400", 
      icon: <FaStar size={24} className="text-yellow-600" />
    },
    { 
      label: "KONTRIBUSI", 
      value: "15", 
      desc: "SATU TAHUN TERAKHIR", 
      color: "bg-[#00FF75]", 
      icon: <GoGitCommit size={24} className="text-blue-500" />
    },
    { 
      label: "PENGIKUT", 
      value: "10", 
      desc: "PENGIKUT GITHUB", 
      color: "bg-[#8B5CF6]", 
     icon: <FaUsers size={24} className="text-white" />
    },
  ];

  return (
    <section id="github" className="py-20 bg-[#E9D5FF] border-b-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex justify-center mb-12" data-aos="zoom-in">
          <h2 className="text-2xl md:text-4xl font-black bg-[#3B82F6] text-white px-10 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase">
            Statistik GitHub
          </h2>
        </div>

        <div 
          className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 mb-12 overflow-hidden"
          data-aos="fade-up"
        >
          <div className="w-full flex justify-center">
            <img 
                src="https://ghchart.rshah.org/00FF75/adansyah125" 
                alt="GitHub Contribution Graph"
                className="w-full h-auto max-w-4xl"
              />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div 
              key={index}
              data-aos="flip-left"
              data-aos-delay={index * 150}
              className={`${item.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col relative group hover:-translate-y-2 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-black text-sm md:text-base uppercase tracking-tighter">
                  {item.label}
                </h4>
                <div className="text-black group-hover:rotate-12 transition-transform">
                  {item.icon}
                </div>
              </div>
              
              <div className="mt-auto">
                <span className="text-4xl md:text-5xl font-black block mb-1">
                  {item.value}
                </span>
                <p className="text-[10px] font-black text-gray-700 uppercase leading-none">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}