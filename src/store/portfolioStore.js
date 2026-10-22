import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projects as initialProjects } from '../data/projects';
import {
  fetchPortfolioApi,
  saveHeroApi,
  saveAboutApi,
  saveSkillsApi,
  saveCertificatesApi,
  saveContactsApi,
  saveSocialsApi,
  saveProjectsApi,
  toggleHighlightApi,
  saveSongsApi
} from '../apiClient';

const mapProjectFromDB = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  image: p.image,
  images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []),
  video: p.video,
  sourceCode: p.source_code || p.sourceCode,
  demo: p.demo,
  tech: Array.isArray(p.tech) ? p.tech : (typeof p.tech === 'string' ? JSON.parse(p.tech || '[]') : []),
  category: p.category
});

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      projects: initialProjects,
      hero: {
        name: "Muhammad Rifki Apreliant",
        role: "Fullstack Developer & Software Engineer",
        quotes: "Jika Kamu Lelah\nBangkitlah!\nKarena Kita Akan Menjadi Figur\nBagi Jiwa Jiwa\nYang tumbuh Subur."
      },
      about: {
        name: "MUHAMMAD RIFKI APRELIANT",
        subtitle: "LULUSAN S1 TEKNIK INFORMATIKA",
        description: "Sebagai lulusan terbaru dari STMIK Mardira Indonesia (S1 Teknik Informatika), saya telah mengerjakan berbagai proyek selama studi dan melalui pekerjaan freelance—mulai dari website sederhana hingga aplikasi kompleks, dan implementasi infrastruktur jaringan. Saya menikmati menggabungkan keterampilan teknis dengan pemecahan masalah kreatif untuk memberikan solusi yang efektif dan menarik.",
        location: "Bandung, Jawa Barat",
        email: "adansyah225@gmail.com",
        image: "/syahdan-pp.jpg"
      },
      highlights: ["Simbada", "AI ChatBot", "Maintenance Mobil", "Tagihan Sekolah"],
      skills: [
        { id: 1, name: "GITHUB", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { id: 2, name: "VERCEL", image: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
        { id: 3, name: "HTML5", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { id: 4, name: "CSS3", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { id: 5, name: "JS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { id: 6, name: "TAILWIND", image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" }
      ],
      certificates: [
        { id: 1, title: "CCNA Network Fundamentals", image: "/serrtifikat/serti.png", color: "bg-blue-500" },
        { id: 2, title: "Dasar Pemrograman JavaScript", image: "/serrtifikat/serti.png", color: "bg-purple-600" },
        { id: 3, title: "Back-End Pemula dengan JavaScript", image: "/serrtifikat/serti.png", color: "bg-green-500" },
        { id: 4, title: "Proyek Akhir Web Developer", image: "/serrtifikat/serti.png", color: "bg-orange-500" }
      ],
      contacts: [
        { id: 1, type: 'Lokasi', value: 'Kopo, Bandung, Indonesia', link: '' },
        { id: 2, type: 'Email', value: 'adansyah225@gmail.com', link: 'mailto:adansyah225@gmail.com' },
        { id: 3, type: 'Telepon', value: '+62 89677121092', link: 'tel:+6289677121092' }
      ],
      socials: [
        { id: 1, platform: 'GitHub', username: 'Mingkhemx', link: 'https://github.com/Mingkhemx', color: 'bg-[#3B82F6]' },
        { id: 2, platform: 'LinkedIn', username: 'adansyah', link: 'https://linkedin.com/in/adansyah', color: 'bg-[#8B5CF6]' },
        { id: 3, platform: 'Instagram', username: 'adansyah__', link: 'https://instagram.com/adansyah__', color: 'bg-[#FF007A]' },
        { id: 4, platform: 'TikTok', username: 'developerbiasa_', link: 'https://tiktok.com/@developerbiasa_', color: 'bg-black' },
        { id: 5, platform: 'WhatsApp', username: '6289677121092', link: 'https://wa.me/6289677121092', color: 'bg-[#00FF75]' }
      ],
      songs: [
        { id: 1, title: 'Lofi Coding Beats', artist: 'Migwara Records', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 372, color: 'bg-[#FF007A]', tempo_speed: 350 },
        { id: 2, title: 'Retro Synthwave', artist: '80s Cyber Vibe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 423, color: 'bg-[#00FF75]', tempo_speed: 120 },
        { id: 3, title: 'Coffee & Code Session', artist: 'Midnight Dev Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 302, color: 'bg-yellow-400', tempo_speed: 220 }
      ],

      fetchPortfolioData: async () => {
        try {
          const data = await fetchPortfolioApi();

          set({
            hero: data.hero || get().hero,
            about: data.about || get().about,
            skills: data.skills && data.skills.length > 0 ? data.skills : get().skills,
            certificates: data.certificates && data.certificates.length > 0 ? data.certificates : get().certificates,
            contacts: data.contacts && data.contacts.length > 0 ? data.contacts : get().contacts,
            socials: data.socials && data.socials.length > 0 ? data.socials : get().socials,
            projects: data.projects && data.projects.length > 0 ? data.projects.map(mapProjectFromDB) : get().projects,
            highlights: data.highlights && data.highlights.length > 0 ? data.highlights : get().highlights,
            songs: data.songs && data.songs.length > 0 ? data.songs : get().songs,
          });
        } catch (err) {
          console.error('Error fetching data from Neon API:', err);
        }
      },

      updateHero: async (newHeroData) => {
        const updatedHero = { ...get().hero, ...newHeroData };
        set({ hero: updatedHero });
        try {
          await saveHeroApi(updatedHero);
        } catch (err) {
          console.error('Error updating hero in Neon:', err);
        }
      },

      updateAbout: async (newAboutData) => {
        const updatedAbout = { ...get().about, ...newAboutData };
        set({ about: updatedAbout });
        try {
          await saveAboutApi(updatedAbout);
        } catch (err) {
          console.error('Error updating about in Neon:', err);
        }
      },

      updateSkills: async (newSkills) => {
        set({ skills: newSkills });
        try {
          await saveSkillsApi(newSkills);
        } catch (err) {
          console.error('Error syncing skills with Neon:', err);
        }
      },

      updateProjects: async (newProjects) => {
        set({ projects: newProjects });
        try {
          await saveProjectsApi(newProjects);
        } catch (err) {
          console.error('Error syncing projects with Neon:', err);
        }
      },

      updateCertificates: async (newCertificates) => {
        set({ certificates: newCertificates });
        try {
          await saveCertificatesApi(newCertificates);
        } catch (err) {
          console.error('Error syncing certificates with Neon:', err);
        }
      },

      updateContacts: async (newContacts) => {
        set({ contacts: newContacts });
        try {
          await saveContactsApi(newContacts);
        } catch (err) {
          console.error('Error syncing contacts with Neon:', err);
        }
      },

      updateSongs: async (newSongs) => {
        set({ songs: newSongs });
        try {
          await saveSongsApi(newSongs);
        } catch (err) {
          console.error('Error syncing songs with Neon:', err);
        }
      },

      toggleHighlight: async (projectTitle) => {
        const isHighlighted = get().highlights.includes(projectTitle);
        const newHighlights = isHighlighted
          ? get().highlights.filter(t => t !== projectTitle)
          : [...get().highlights, projectTitle];
        set({ highlights: newHighlights });
        try {
          const res = await toggleHighlightApi(projectTitle);
          if (res.highlights) {
            set({ highlights: res.highlights });
          }
        } catch (err) {
          console.error('Error toggling highlight in Neon:', err);
        }
      },

      updateSocials: async (newSocials) => {
        set({ socials: newSocials });
        try {
          await saveSocialsApi(newSocials);
        } catch (err) {
          console.error('Error updating socials in Neon:', err);
        }
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
