import  { useRef, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaPaperPlane,
  FaInstagram,
  FaFacebook,
  FaTelegram,
  FaWhatsapp,
  FaLink 
} from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePortfolioStore } from '../store/portfolioStore';
import { supabase } from '../supabaseClient';

const getContactIcon = (type) => {
  switch (type) {
    case 'Lokasi': return <FaMapMarkerAlt size={32} />;
    case 'Email': return <FaEnvelope size={32} />;
    case 'Telepon': return <FaPhoneAlt size={32} />;
    case 'Instagram': return <FaInstagram size={32} />;
    case 'Facebook': return <FaFacebook size={32} />;
    case 'Telegram': return <FaTelegram size={32} />;
    case 'WhatsApp': return <FaWhatsapp size={32} />;
    default: return <FaLink size={32} />;
  }
};

const getContactColor = (type) => {
  switch (type) {
    case 'Lokasi': return 'bg-[#FF007A] text-white';
    case 'Email': return 'bg-[#3B82F6] text-white';
    case 'Telepon': return 'bg-yellow-400 text-black';
    case 'Instagram': return 'bg-pink-600 text-white';
    case 'Facebook': return 'bg-blue-600 text-white';
    case 'Telegram': return 'bg-sky-500 text-white';
    case 'WhatsApp': return 'bg-green-500 text-white';
    default: return 'bg-purple-500 text-white';
  }
};

export default function Contact() {
  const { contacts } = usePortfolioStore();
  const form = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    try {
      const { error } = await supabase.from('messages').insert({
        name,
        email,
        subject,
        message
      });

      if (error) throw error;

      toast.success('Pesan berhasil terkirim dan disimpan!');
      e.target.reset();
    } catch (err) {
      console.error('Gagal menyimpan pesan:', err);
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#FEF08A] border-b-4 border-black overflow-hidden">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        {/* <div className="flex justify-center mb-16" data-aos="zoom-in">
          <h2 className="text-3xl md:text-5xl font-black bg-white text-black px-12 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
            Kontak
          </h2>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Informasi Kontak */}
          <div className="space-y-8" data-aos="fade-right">
            <h3 className="text-2xl font-black uppercase italic">Informasi Kontak</h3>
            
            <div className="space-y-6">
              {contacts.map((contact) => {
                const CardContent = (
                  <>
                    <div className={`${getContactColor(contact.type)} p-4 border-4 border-black flex items-center justify-center`}>
                      {getContactIcon(contact.type)}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase">{contact.type}</p>
                      <p className="font-bold text-lg break-all">{contact.value}</p>
                    </div>
                  </>
                );

                if (contact.link) {
                  return (
                    <a 
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={contact.id}
                      className="flex items-center gap-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer block"
                    >
                      {CardContent}
                    </a>
                  );
                }

                return (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    {CardContent}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Kirim Pesan */}
          <div data-aos="fade-left">
            <h3 className="text-2xl font-black uppercase italic mb-8">Kirim Pesan</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block font-black text-[10px] uppercase mb-1">Nama Anda</label>
                <input 
                  type="text" name="user_name" required
                  className="w-full font-bold outline-none bg-transparent"
                />
              </div>
              
              <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block font-black text-[10px] uppercase mb-1">Email Anda</label>
                <input 
                  type="email" name="user_email" required
                  className="w-full font-bold outline-none bg-transparent"
                />
              </div>

              <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block font-black text-[10px] uppercase mb-1">Subjek</label>
                <input 
                  type="text" name="subject" required
                  className="w-full font-bold outline-none bg-transparent"
                />
              </div>

              <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <label className="block font-black text-[10px] uppercase mb-1">Pesan Anda</label>
                <textarea 
                  name="message" rows="4" required
                  className="w-full font-bold outline-none bg-transparent resize-none"
                ></textarea>
              </div>

              <button 
  type="submit"
  disabled={loading}
  className="w-full bg-black text-white font-black py-5 uppercase flex items-center justify-center gap-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group disabled:opacity-50"
>
  <FaPaperPlane size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  
  {loading ? "Mengirim..." : "Send Message"}
</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}