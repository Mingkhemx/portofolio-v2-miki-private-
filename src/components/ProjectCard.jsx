import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../store/portfolioStore';
import { 
  FaLaravel, 
  FaReact, 
  FaNodeJs, 
  FaVuejs, 
  FaJava, 
  FaDatabase 
} from "react-icons/fa";
import { 
  SiTailwindcss, 
  SiTypescript,
  SiVite, 
  SiSupabase, 
  SiMysql, 
  SiPostgresql, 
  SiOpenai,
  SiSpringboot 
} from "react-icons/si";

const techIcons = {
  "Laravel": <FaLaravel className="text-red-600" title="Laravel" />,
  "React": <FaReact className="text-blue-400" title="React" />,
  "TypeScript": <SiTypescript className="text-blue-500" title="TypeScript" />,
  "Tailwind": <SiTailwindcss className="text-cyan-400" title="Tailwind CSS" />,
  "Node.js": <FaNodeJs className="text-green-500" title="Node.js" />,
  "OpenAI": <SiOpenai className="text-green-500" title="OpenAI" />,
  "Supabase": <SiSupabase className="text-emerald-500" title="Supabase" />,
  "Mysql": <SiMysql className="text-blue-600" title="MySQL" />,
  "Vue": <FaVuejs className="text-emerald-400" title="Vue.js" />,
  "Vite": <SiVite className="text-purple-500" title="Vite" />,
  "Java": <FaJava className="text-red-500" title="Java" />,
  "Spring Boot": <SiSpringboot className="text-green-600" title="Spring Boot" />,
  "PostgreSQL": <SiPostgresql className="text-blue-400" title="PostgreSQL" />,
};
export default function ProjectCard({ project, compact = false }) {
  const { skills } = usePortfolioStore();
  
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
      {/* Gambar Proyek dengan efek browser top bar */}
      <div className="border-b-4 border-black relative">
        <div className="bg-gray-200 py-2 px-4 border-b-2 border-black flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 border border-black"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500 border border-black"></div>
          <div className="w-2 h-2 rounded-full bg-green-500 border border-black"></div>
        </div>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-48 object-cover "
        />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-black uppercase mb-2 text-center">{project.title}</h3>
        {!compact && (
          <>
            <p className="font-bold text-sm text-gray-700 mb-4 flex-1">
              {project.description}
            </p>
            
            {/* Tech Stack Icons (Placeholder) */}
            <div className="flex flex-wrap gap-3 mb-6 transition-all">
              {project.tech.map((item, index) => {
                const matchedSkill = skills.find(s => s.name.toLowerCase() === item.toLowerCase());
                return (
                  <span key={index} className="text-3xl flex items-center justify-center w-8 h-8" title={item}>
                    {matchedSkill ? (
                      <img src={matchedSkill.image} alt={item} className="w-full h-full object-contain" />
                    ) : (
                      techIcons[item] || <FaDatabase className="text-gray-400" />
                    )}
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link 
                to={`/project/${project.id}`} 
                className="bg-yellow-400 text-center py-2 border-4 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all block"
              >
                Detail
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}