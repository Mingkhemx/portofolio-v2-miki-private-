import { useState } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Daftar menu navigasi
  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Highlight Proyek", href: "#projects" },
    { name: "Keahlian", href: "#skills" },
    { name: "Sertifikat", href: "#certificates" },
    { name: "Github", href: "#github" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src="/logo-admin.png" 
            alt="Logo" 
            className="h-10 md:h-12 w-auto border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#C1EBE9] p-1.5 object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 font-bold text-sm uppercase items-center">
          {menuItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="hover:underline decoration-4 underline-offset-4 transition-all"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Burger Button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {/* Menggunakan h-screen agar menutupi seluruh layar saat dibuka */}
      <div className={`lg:hidden fixed inset-0 top-[76px] bg-white border-t-4 border-black transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-76px)] gap-8 font-black text-2xl uppercase">
          {menuItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)} // Tutup menu setelah klik
              className="hover:text-purple-600 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}