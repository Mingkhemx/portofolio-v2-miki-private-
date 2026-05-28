import { usePortfolioStore } from "../store/portfolioStore";
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaInstagram, 
  FaTiktok, 
  FaPhoneAlt, 
  FaLink, 
  FaYoutube, 
  FaFacebookF, 
  FaTwitter 
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { socials } = usePortfolioStore();

  // Helper untuk menentukan icon secara dinamis berdasarkan nama platform
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return <FaGithub size={20} />;
      case 'linkedin': return <FaLinkedinIn size={20} />;
      case 'instagram': return <FaInstagram size={20} />;
      case 'tiktok': return <FaTiktok size={20} />;
      case 'whatsapp':
      case 'phone':
      case 'telepon':
        return <FaPhoneAlt size={20} />;
      case 'youtube': return <FaYoutube size={20} />;
      case 'facebook': return <FaFacebookF size={20} />;
      case 'twitter':
      case 'x':
        return <FaTwitter size={20} />;
      default: return <FaLink size={20} />;
    }
  };

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
          {(socials || []).map((social, index) => (
            <a
              key={social.id || index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${social.color || 'bg-black'} p-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] 
hover:scale-110 hover:rotate-6 hover:translate-x-1 hover:translate-y-1 
hover:shadow-none transition-all duration-200 text-white`}
              title={social.platform}
            >
              {getSocialIcon(social.platform)}
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