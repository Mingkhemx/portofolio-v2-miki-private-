import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

export default function Hero() {
  const { hero } = usePortfolioStore();
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Daftar kata motivasi dari store
  const motivasi = hero.quotes.split('\n').filter(q => q.trim() !== '');

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % motivasi.length;
      const fullText = motivasi[i];

      setDisplayText(
        isDeleting 
          ? fullText.substring(0, displayText.length - 1) 
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Jeda saat teks selesai diketik
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <>
      {/* Definisi Animasi Ayunan (Swing) */}
      <style>{`
        @keyframes swing {
          0% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
          100% { transform: rotate(-2deg); }
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>

      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-[#FFF7C5] pt-20 overflow-hidden">
        
        {/* Kontainer Utama dengan Animasi Ayun */}
        <div className="relative z-10 text-center animate-swing">
          
          {/* Tali Penggantung */}
          <div className="absolute -top-40 left-1/4 w-[2px] h-40 bg-black"></div>
          <div className="absolute -top-40 right-1/4 w-[2px] h-40 bg-black"></div>

          <p className="text-xl font-black uppercase mb-2 tracking-widest">Halo, Saya</p>

          {/* Nama - Papan Putih */}
          <div className="relative mb-4">
            <h1 className="text-4xl md:text-7xl font-black bg-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2 inline-block uppercase">
              {hero.name}
            </h1>
          </div>

          {/* Role - Papan Pink & Biru */}
          <div className="flex justify-center items-start -mt-2">
            <h2 className="text-xl md:text-3xl font-black bg-[#FF007A] text-white px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
             {hero.role}
            </h2>
            
            <div className="w-16 h-12 bg-[#3B82F6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -ml-2 mt-4 hidden md:block"></div>
          </div>
          {/* TYPING TEXT EFFECT */}
            <div className="mt-8 h-10 flex items-center justify-center">
              <p className="text-sm md:text-lg font-bold italic bg-black text-white px-4 py-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[250px]">
                <span className="typing-cursor uppercase">{displayText}</span>
              </p>
            </div>
        </div>

        {/* Barisan Tombol (Tidak ikut berayun agar mudah diklik) */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 px-4">
          <a href="#projects" className="bg-[#3B82F6] text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">
            Lihat Proyek
          </a>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="bg-[#8B5CF6] p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-white text-xl">
               <i className="fab fa-github"></i>
            </a>
            <a href="#" className="bg-[#FF007A] p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-white text-xl">
               <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Panah Scroll Ke Bawah */}
        <button 
          onClick={scrollToNextSection}
          className="absolute bottom-10 animate-bounce bg-yellow-400 p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      </section>
    </>
  );
}