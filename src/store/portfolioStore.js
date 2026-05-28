import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projects as initialProjects } from '../data/projects';
import { supabase } from '../supabaseClient';

const mapProjectFromDB = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  image: p.image,
  images: p.images || [],
  video: p.video,
  sourceCode: p.source_code,
  demo: p.demo,
  tech: p.tech || [],
  category: p.category
});

const mapProjectToDB = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  image: p.image,
  images: p.images || [],
  video: p.video,
  source_code: p.sourceCode,
  demo: p.demo,
  tech: p.tech || [],
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
      songs: [
        { id: 1, title: 'Lofi Coding Beats', artist: 'Migwara Records', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 372, color: 'bg-[#FF007A]', tempo_speed: 350 },
        { id: 2, title: 'Retro Synthwave', artist: '80s Cyber Vibe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 423, color: 'bg-[#00FF75]', tempo_speed: 120 },
        { id: 3, title: 'Coffee & Code Session', artist: 'Midnight Dev Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 302, color: 'bg-yellow-400', tempo_speed: 220 }
      ],

      fetchPortfolioData: async () => {
        try {
          const { data: heroData } = await supabase.from('hero').select('*').eq('id', 1).maybeSingle();
          const { data: aboutData } = await supabase.from('about').select('*').eq('id', 1).maybeSingle();
          const { data: skillsData } = await supabase.from('skills').select('*').order('id');
          const { data: certsData } = await supabase.from('certificates').select('*').order('id');
          const { data: contactsData } = await supabase.from('contacts').select('*').order('id');
          const { data: projectsData } = await supabase.from('projects').select('*');
          const { data: highlightsData } = await supabase.from('highlights').select('*');
          const { data: songsData } = await supabase.from('songs').select('*').order('id');

          if (!heroData && !aboutData) {
            console.log('Supabase data not found, seeding with initial data...');
            await get().seedSupabase();
            return;
          }

          set({
            hero: heroData || get().hero,
            about: aboutData || get().about,
            skills: skillsData && skillsData.length > 0 ? skillsData : get().skills,
            certificates: certsData && certsData.length > 0 ? certsData : get().certificates,
            contacts: contactsData && contactsData.length > 0 ? contactsData : get().contacts,
            projects: projectsData && projectsData.length > 0 ? projectsData.map(mapProjectFromDB) : get().projects,
            highlights: highlightsData ? highlightsData.map(h => h.project_title) : get().highlights,
            songs: songsData && songsData.length > 0 ? songsData : get().songs,
          });
        } catch (err) {
          console.error('Error fetching data from Supabase:', err);
        }
      },

      seedSupabase: async () => {
        const state = get();
        try {
          // Seed hero
          await supabase.from('hero').upsert({ id: 1, ...state.hero });
          // Seed about
          await supabase.from('about').upsert({ id: 1, ...state.about });
          // Seed skills
          if (state.skills.length > 0) {
            await supabase.from('skills').upsert(state.skills.map(s => ({ id: s.id, name: s.name, image: s.image })));
          }
          // Seed certificates
          if (state.certificates.length > 0) {
            await supabase.from('certificates').upsert(state.certificates.map(c => ({ id: c.id, title: c.title, image: c.image, color: c.color })));
          }
          // Seed contacts
          if (state.contacts.length > 0) {
            await supabase.from('contacts').upsert(state.contacts.map(c => ({ id: c.id, type: c.type, value: c.value, link: c.link })));
          }
          // Seed projects
          if (state.projects.length > 0) {
            await supabase.from('projects').upsert(state.projects.map(mapProjectToDB));
          }
          // Seed highlights
          if (state.highlights.length > 0) {
            await supabase.from('highlights').upsert(state.highlights.map(h => ({ project_title: h })));
          }
          // Seed songs
          if (state.songs.length > 0) {
            await supabase.from('songs').upsert(state.songs);
          }
          console.log('Seeding Supabase completed successfully!');
        } catch (err) {
          console.error('Error seeding Supabase:', err);
        }
      },

      updateHero: async (newHeroData) => {
        const updatedHero = { ...get().hero, ...newHeroData };
        set({ hero: updatedHero });
        try {
          await supabase.from('hero').upsert({ id: 1, ...updatedHero });
        } catch (err) {
          console.error('Error updating hero in Supabase:', err);
        }
      },

      updateAbout: async (newAboutData) => {
        const updatedAbout = { ...get().about, ...newAboutData };
        set({ about: updatedAbout });
        try {
          await supabase.from('about').upsert({ id: 1, ...updatedAbout });
        } catch (err) {
          console.error('Error updating about in Supabase:', err);
        }
      },

      updateSkills: async (newSkills) => {
        const currentSkills = get().skills;
        set({ skills: newSkills });
        try {
          const deleted = currentSkills.filter(cs => !newSkills.some(ns => ns.id === cs.id));
          for (const s of deleted) {
            await supabase.from('skills').delete().eq('id', s.id);
          }
          const addedOrUpdated = newSkills.filter(ns => {
            const cs = currentSkills.find(item => item.id === ns.id);
            return !cs || JSON.stringify(cs) !== JSON.stringify(ns);
          });
          for (const s of addedOrUpdated) {
            await supabase.from('skills').upsert({ id: s.id, name: s.name, image: s.image });
          }
        } catch (err) {
          console.error('Error syncing skills with Supabase:', err);
        }
      },

      updateProjects: async (newProjects) => {
        const currentProjects = get().projects;
        set({ projects: newProjects });
        try {
          const deleted = currentProjects.filter(cp => !newProjects.some(np => np.id === cp.id));
          for (const p of deleted) {
            await supabase.from('projects').delete().eq('id', p.id);
          }
          const addedOrUpdated = newProjects.filter(np => {
            const cp = currentProjects.find(item => item.id === np.id);
            return !cp || JSON.stringify(cp) !== JSON.stringify(np);
          });
          for (const p of addedOrUpdated) {
            await supabase.from('projects').upsert(mapProjectToDB(p));
          }
        } catch (err) {
          console.error('Error syncing projects with Supabase:', err);
        }
      },

      updateCertificates: async (newCertificates) => {
        const currentCerts = get().certificates;
        set({ certificates: newCertificates });
        try {
          const deleted = currentCerts.filter(cc => !newCertificates.some(nc => nc.id === cc.id));
          for (const c of deleted) {
            await supabase.from('certificates').delete().eq('id', c.id);
          }
          const addedOrUpdated = newCertificates.filter(nc => {
            const cc = currentCerts.find(item => item.id === nc.id);
            return !cc || JSON.stringify(cc) !== JSON.stringify(nc);
          });
          for (const c of addedOrUpdated) {
            await supabase.from('certificates').upsert({ id: c.id, title: c.title, image: c.image, color: c.color });
          }
        } catch (err) {
          console.error('Error syncing certificates with Supabase:', err);
        }
      },

      updateContacts: async (newContacts) => {
        const currentContacts = get().contacts;
        set({ contacts: newContacts });
        try {
          const deleted = currentContacts.filter(cc => !newContacts.some(nc => nc.id === cc.id));
          for (const c of deleted) {
            await supabase.from('contacts').delete().eq('id', c.id);
          }
          const addedOrUpdated = newContacts.filter(nc => {
            const cc = currentContacts.find(item => item.id === nc.id);
            return !cc || JSON.stringify(cc) !== JSON.stringify(nc);
          });
          for (const c of addedOrUpdated) {
            await supabase.from('contacts').upsert({ id: c.id, type: c.type, value: c.value, link: c.link });
          }
        } catch (err) {
          console.error('Error syncing contacts with Supabase:', err);
        }
      },

      updateSongs: async (newSongs) => {
        const currentSongs = get().songs;
        set({ songs: newSongs });
        try {
          // Hapus lagu yang dihapus
          const deleted = currentSongs.filter(cs => !newSongs.some(ns => ns.id === cs.id));
          for (const s of deleted) {
            await supabase.from('songs').delete().eq('id', s.id);
          }
          // Upsert lagu baru/diubah
          const addedOrUpdated = newSongs.filter(ns => {
            const cs = currentSongs.find(item => item.id === ns.id);
            return !cs || JSON.stringify(cs) !== JSON.stringify(ns);
          });
          for (const s of addedOrUpdated) {
            await supabase.from('songs').upsert(s);
          }
        } catch (err) {
          console.error('Error syncing songs with Supabase:', err);
        }
      },

      toggleHighlight: async (projectTitle) => {
        const isHighlighted = get().highlights.includes(projectTitle);
        let newHighlights;
        try {
          if (isHighlighted) {
            newHighlights = get().highlights.filter(t => t !== projectTitle);
            await supabase.from('highlights').delete().eq('project_title', projectTitle);
          } else {
            newHighlights = [...get().highlights, projectTitle];
            await supabase.from('highlights').upsert({ project_title: projectTitle });
          }
          set({ highlights: newHighlights });
        } catch (err) {
          console.error('Error toggling highlight in Supabase:', err);
        }
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
