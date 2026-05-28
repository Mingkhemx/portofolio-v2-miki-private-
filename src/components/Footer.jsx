import { FaGithub, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaGithub size={20} />, color: "bg-[#3B82F6]", href: "https://github.com/Mingkhemx" },
    { icon: <FaLinkedinIn size={20} />, color: "bg-[#8B5CF6]", href: "https://linkedin.com/in/adansyah" },
    { icon: <FaInstagram size={20} />, color: "bg-[#FF007A]", href: "https://instagram.com/adansyah__" },
    { icon: <FaTiktok size={20} />, color: "bg-black", href: "https://tiktok.com/@developerbiasa_" }, 
    { icon: <FaPhoneAlt size={20} />, color: "bg-[#00FF75]", href: "https://wa.me/6289677121092" },
  ];

  return (
    <footer className="bg-[#4F252C] text-white py-12 border-t-4 border-black relative">
      
      <div className="absolute top-0 left-0 w-full h-3 bg-[#00FF75]"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
        
        <div className="flex items-center">
          <img 
            src="/logo/logo_converted.gif" 
            alt="Logo Branding" 
            className="h-16 md:h-20 w-48 md:w-64 border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] object-cover object-center"
          />
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${social.color} p-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] 
hover:scale-110 hover:rotate-6 hover:translate-x-1 hover:translate-y-1 
hover:shadow-none transition-all duration-200 text-white`}
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="text-xs md:text-sm font-black uppercase tracking-widest text-center md:text-right">
          © {currentYear} Muhammad Rifki Apreliant.
        </div>

      </div>
    </footer>
  );
}