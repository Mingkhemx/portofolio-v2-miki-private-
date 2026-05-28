import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

export default function WelcomeScreen({ onFinished }) {
  const { skills } = usePortfolioStore();
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Jalankan progres pengisian loading bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Mulai animasi keluar setelah bar penuh
          setTimeout(() => {
            setIsExiting(true);
            // Selesaikan unmount setelah transisi CSS selesai
            setTimeout(() => {
              onFinished();
            }, 800);
          }, 300);
          return 100;
        }
        // Tambahkan progres secara berkala
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#FFF7C5] flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${
        isExiting ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Box Utama Neo-Brutalism */}
      <div className="w-full max-w-xl bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 text-center relative overflow-hidden">
        
        {/* Welcome Tag */}
        <div className="inline-block bg-[#FF007A] text-white px-4 py-2 border-4 border-black font-black uppercase text-xs tracking-wider mb-6 -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Welcome to my portfolio
        </div>

        {/* Nama Besar */}
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-black select-none">
          MIGWARA
        </h1>

        {/* Domain Tag */}
        <div className="inline-block bg-[#C1EBE9] px-6 py-2 border-4 border-black font-black text-sm uppercase mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Migwara.my.id
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-[#F4F4F5] border-4 border-black h-8 mb-8 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div 
            className="bg-[#00FF75] h-full border-r-4 border-black transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-black select-none">
            {progress}%
          </span>
        </div>

        {/* Tech Stack List */}
        <div>
          <p className="font-black text-xs uppercase tracking-widest text-gray-500 mb-4">Powered By</p>
          <div className="flex justify-center items-center gap-3 flex-wrap">
            {skills.slice(0, 6).map((skill, idx) => (
              <div 
                key={skill.id || idx} 
                className="w-12 h-12 bg-white border-4 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all flex items-center justify-center"
                title={skill.name}
              >
                <img src={skill.image} alt={skill.name} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
