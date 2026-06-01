import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { useEffect, useState } from 'react';
import { FaHome, FaProjectDiagram, FaTools, FaEnvelope, FaSignOutAlt, FaUserEdit, FaInfoCircle, FaAward, FaPhoneAlt, FaTrash, FaMusic, FaShareAlt } from 'react-icons/fa';
import { projects } from '../data/projects';
import { supabase } from '../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';

const SkillItem = ({ skill, idx, skills, updateSkills }) => {
  const [name, setName] = useState(skill.name);
  
  useEffect(() => {
    setName(skill.name);
  }, [skill.name]);

  return (
    <div className="border-4 border-black p-4 flex flex-col items-center justify-center bg-[#F4F4F5] relative group">
      <div className="h-16 w-16 flex items-center justify-center mb-3">
        <img src={skill.image} alt={skill.name} className="max-h-full max-w-full object-contain drop-shadow-md" />
      </div>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        onBlur={() => {
          if (name !== skill.name) {
            const newSkills = skills.map((s, i) => i === idx ? { ...s, name } : s);
            updateSkills(newSkills);
            toast.success('Nama keahlian berhasil diperbarui!');
          }
        }}
        className="w-full text-center font-black text-sm border-2 border-black px-1 py-1 focus:outline-none focus:bg-white"
      />
      <button 
        onClick={() => {
          const newSkills = skills.filter((_, i) => i !== idx);
          updateSkills(newSkills);
          toast.success('Keahlian berhasil dihapus!');
        }}
        className="absolute -top-3 -right-3 bg-[#FF007A] text-white w-8 h-8 font-black border-4 border-black md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:scale-110 flex items-center justify-center"
        title="Hapus Keahlian"
      >
        X
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { 
    hero, updateHero, 
    about, updateAbout, 
    highlights, toggleHighlight, 
    skills, updateSkills, 
    projects, updateProjects, 
    certificates, updateCertificates, 
    contacts, updateContacts,
    songs, updateSongs,
    socials, updateSocials
  } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isLoading: false,
  });

  const handleUploadSongFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `songs/${fileName}`;

    toast.info('Sedang mengunggah audio...');
    const { data, error } = await supabase.storage
      .from('songs')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('songs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleUploadImageFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    toast.info('Sedang mengunggah gambar...');
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const audio = new Audio(objectUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration));
        URL.revokeObjectURL(objectUrl);
      });
    });
  };

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Gagal mengambil pesan pengunjung.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Pesan Pengunjung',
      message: 'Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('messages').delete().eq('id', id);
          if (error) throw error;
          setMessages(prev => prev.filter(m => m.id !== id));
          toast.success('Pesan berhasil dihapus!');
        } catch (err) {
          console.error('Error deleting message:', err);
          toast.error('Gagal menghapus pesan.');
        }
      }
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (activeTab === 'Pesan Masuk') {
      fetchMessages();
    }
  }, [isAuthenticated, navigate, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-[#BEE3F8] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Profil Utama</h3>
                <p className="text-sm font-bold">Nama, Role, dan Kutipan di halaman depan.</p>
              </div>
              <button onClick={() => setActiveTab('Kelola Profil')} className="mt-4 bg-black text-white font-black uppercase py-2 border-2 border-black hover:bg-white hover:text-black transition-colors">Lihat Detail</button>
            </div>
            <div className="bg-[#FEF08A] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Tentang Saya</h3>
                <p className="text-sm font-bold">Deskripsi, lokasi, dan email.</p>
              </div>
              <button onClick={() => setActiveTab('Tentang Saya')} className="mt-4 bg-black text-white font-black uppercase py-2 border-2 border-black hover:bg-white hover:text-black transition-colors">Lihat Detail</button>
            </div>
            <div className="bg-[#FFD6E8] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Keahlian</h3>
                <p className="text-4xl font-black">8</p>
              </div>
              <button onClick={() => setActiveTab('Kelola Keahlian')} className="mt-4 bg-black text-white font-black uppercase py-2 border-2 border-black hover:bg-white hover:text-black transition-colors">Lihat Detail</button>
            </div>
            <div className="bg-[#D9F99D] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Pesan Baru</h3>
                <p className="text-4xl font-black">3</p>
              </div>
              <button onClick={() => setActiveTab('Pesan Masuk')} className="mt-4 bg-black text-white font-black uppercase py-2 border-2 border-black hover:bg-white hover:text-black transition-colors">Lihat Detail</button>
            </div>
          </div>
        );
      case 'Kelola Proyek':
        if (editingProject || isAddingProject) {
          const projectData = editingProject || {
            id: `proj-${Date.now()}`,
            title: '',
            description: '',
            image: '',
            images: [],
            video: '',
            sourceCode: '#',
            demo: '#',
            tech: [],
            category: 'Website'
          };
          return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6">{isAddingProject ? 'Tambah Proyek Baru' : 'Edit Proyek'}</h2>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="block mb-2">Judul Proyek</label>
                  <input type="text" value={projectData.title} onChange={e => setEditingProject({...projectData, title: e.target.value})} className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-2">Kategori</label>
                  <select value={projectData.category} onChange={e => setEditingProject({...projectData, category: e.target.value})} className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none cursor-pointer">
                    <option value="Website">Website</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="3D Model">3D Model</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Deskripsi</label>
                  <textarea value={projectData.description} onChange={e => setEditingProject({...projectData, description: e.target.value})} className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none h-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Thumbnail Utama (Upload)</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const url = await handleUploadImageFile(file);
                          setEditingProject({...projectData, image: url});
                          toast.success('Thumbnail berhasil diunggah!');
                        } catch (err) {
                          console.error(err);
                          toast.error('Gagal mengunggah thumbnail.');
                        }
                      }
                    }} className="w-full border-4 border-black p-2 file:bg-black file:text-white file:border-none file:px-4 file:py-2 file:mr-4 cursor-pointer" />
                    {projectData.image && <img src={projectData.image} alt="Preview" className="h-20 mt-2 border-2 border-black" />}
                  </div>
                  <div>
                    <label className="block mb-2">Tambah Multiple Foto (Upload)</label>
                    <input type="file" accept="image/*" multiple onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          const newImages = [...(projectData.images || [])];
                          for (const file of files) {
                            const url = await handleUploadImageFile(file);
                            newImages.push(url);
                          }
                          setEditingProject({...projectData, images: newImages});
                          toast.success('Gambar berhasil diunggah!');
                        } catch (err) {
                          console.error(err);
                          toast.error('Gagal mengunggah gambar.');
                        }
                      }
                    }} className="w-full border-4 border-black p-2 file:bg-black file:text-white file:border-none file:px-4 file:py-2 file:mr-4 cursor-pointer" />
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {(projectData.images || []).map((img, i) => (
                        <div key={i} className="relative group min-w-max">
                          <img src={img} className="h-20 border-2 border-black" alt="Multi Preview" />
                          <button onClick={() => {
                            const newArr = [...projectData.images];
                            newArr.splice(i, 1);
                            setEditingProject({...projectData, images: newArr});
                          }} className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs font-black">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Video URL (Opsional / Kosongkan)</label>
                  <input type="text" value={projectData.video || ''} onChange={e => setEditingProject({...projectData, video: e.target.value})} className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-2">Demo URL / Live Preview</label>
                  <input type="text" value={projectData.demo} onChange={e => setEditingProject({...projectData, demo: e.target.value})} className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-2">Tech Stack (Pilih dari Keahlian)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map(skill => {
                      const isSelected = projectData.tech.some(t => t.toLowerCase() === skill.name.toLowerCase());
                      return (
                        <button
                          key={skill.id || skill.name}
                          onClick={() => {
                            if (isSelected) {
                              setEditingProject({...projectData, tech: projectData.tech.filter(t => t.toLowerCase() !== skill.name.toLowerCase())});
                            } else {
                              setEditingProject({...projectData, tech: [...projectData.tech, skill.name]});
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-1 border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${isSelected ? 'bg-[#00FF75]' : 'bg-white'}`}
                        >
                          <img src={skill.image} alt={skill.name} className="w-5 h-5 object-contain" />
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => {
                    if (isAddingProject) {
                      updateProjects([projectData, ...projects]);
                    } else {
                      updateProjects(projects.map(p => p.id === projectData.id ? projectData : p));
                    }
                    setEditingProject(null);
                    setIsAddingProject(false);
                  }} className="flex-1 bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Simpan Proyek</button>
                  <button onClick={() => { setEditingProject(null); setIsAddingProject(false); }} className="flex-1 bg-gray-300 font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Batal</button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">Kelola Proyek</h2>
              <button onClick={() => setIsAddingProject(true)} className="bg-yellow-400 font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">+ Tambah Proyek</button>
            </div>
            <p className="font-bold mb-6">Pilih proyek mana saja yang ingin ditampilkan di *slider* "Highlight Proyek" halaman utama, atau edit detail proyek.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj, idx) => {
                const isSelected = highlights.includes(proj.title);
                return (
                  <div key={proj.id || idx} className={`p-4 border-4 border-black flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isSelected ? 'bg-[#D9F99D]' : 'bg-white'}`}>
                    <div className="flex items-center gap-4 flex-1">
                      <img src={proj.image} alt={proj.title} className="w-24 h-16 object-cover border-2 border-black bg-white" />
                      <div>
                        <span className="font-black text-lg block">{proj.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold bg-black text-white px-2 py-1">{proj.category}</span>
                          <span className="text-sm font-bold bg-gray-200 border-2 border-black px-2 py-1">{proj.tech.length} Tech</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button 
                        onClick={() => toggleHighlight(proj.title)}
                        className={`px-4 py-2 font-black uppercase border-4 border-black transition-colors ${isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                      >
                        {isSelected ? '★ Highlight Aktif' : '☆ Jadikan Highlight'}
                      </button>
                      <button onClick={() => setEditingProject(proj)} className="px-4 py-2 font-black uppercase border-4 border-black bg-[#00FF75] hover:bg-green-300 transition-colors">Edit</button>
                      <button onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Proyek',
                          message: `Apakah Anda yakin ingin menghapus proyek "${proj.title}"?`,
                          onConfirm: async () => {
                            await updateProjects(projects.filter(p => p.id !== proj.id));
                            if (isSelected) await toggleHighlight(proj.title);
                            toast.success('Proyek berhasil dihapus!');
                          }
                        });
                      }} className="px-4 py-2 font-black uppercase border-4 border-black bg-[#FF007A] text-white hover:bg-red-600 transition-colors">Hapus</button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 bg-black text-white border-4 border-black p-4 flex justify-between items-center">
              <p className="font-black">Total Proyek: {projects.length}</p>
              <p className="font-black">Highlight Aktif: {highlights.length}</p>
            </div>
          </div>
        );
      case 'Kelola Keahlian':
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-6">Kelola Keahlian (Tech Stack)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {skills.map((skill, idx) => (
                <SkillItem key={skill.id || idx} skill={skill} idx={idx} skills={skills} updateSkills={updateSkills} />
              ))}
            </div>
            
            <div className="bg-[#D9F99D] border-4 border-black p-6">
              <h3 className="font-black uppercase mb-4 text-lg">+ Tambah Keahlian Baru</h3>
              <div className="flex flex-col w-full">
                <label className="block font-bold mb-2">Upload Gambar Icon (PNG/SVG/JPG)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const url = await handleUploadImageFile(file);
                        const newSkills = [...skills, { id: Date.now(), name: "SKILL BARU", image: url }];
                        updateSkills(newSkills);
                        toast.success('Keahlian baru berhasil ditambahkan!');
                      } catch (err) {
                        console.error(err);
                        toast.error('Gagal mengunggah gambar keahlian.');
                      }
                    }
                    e.target.value = null;
                  }}
                  className="w-full bg-white border-4 border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:text-sm file:font-black file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>
            </div>
          </div>
        );
      case 'Pesan Masuk':
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">Pesan dari Pengunjung</h2>
              <button 
                onClick={fetchMessages}
                className="bg-[#C1EBE9] hover:bg-opacity-80 text-black font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-xs"
              >
                Refresh
              </button>
            </div>
            
            {loadingMessages ? (
              <div className="text-center py-8 font-black uppercase">Mengambil Pesan...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 border-4 border-dashed border-black font-bold text-gray-500 uppercase">
                Tidak ada pesan pengunjung.
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative bg-[#FFF7C5]">
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b-2 border-black pb-3 mb-3 gap-2">
                      <div>
                        <h4 className="font-black text-lg uppercase">{msg.subject}</h4>
                        <p className="text-sm font-bold text-gray-700">Dari: <span className="underline">{msg.name}</span> ({msg.email})</p>
                      </div>
                      <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase self-start md:self-auto border-2 border-black">
                        {new Date(msg.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="font-bold text-base whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-4 right-4 bg-[#FF007A] text-white p-2 border-2 border-black hover:bg-red-600 transition-colors flex items-center justify-center"
                      title="Hapus Pesan"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'Kelola Profil':
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-6">Kelola Profil (Hero)</h2>
            <div className="space-y-4 font-bold">
              <div>
                <label className="block mb-2">Nama Utama</label>
                <input 
                  type="text" 
                  value={hero.name} 
                  onChange={(e) => updateHero({ name: e.target.value })}
                  className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]"
                />
              </div>
              <div>
                <label className="block mb-2">Role Pekerjaan</label>
                <input 
                  type="text" 
                  value={hero.role} 
                  onChange={(e) => updateHero({ role: e.target.value })}
                  className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#BEE3F8]"
                />
              </div>
              <div>
                <label className="block mb-2">Kata Motivasi (Animasi Teks)</label>
                {hero.quotes.split('\n').map((quote, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={quote} 
                      onChange={(e) => {
                        const newQuotes = hero.quotes.split('\n');
                        newQuotes[index] = e.target.value;
                        updateHero({ quotes: newQuotes.join('\n') });
                      }}
                      className="flex-1 bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#D9F99D]"
                    />
                    <button 
                      onClick={() => {
                        const newQuotes = hero.quotes.split('\n');
                        newQuotes.splice(index, 1);
                        updateHero({ quotes: newQuotes.join('\n') });
                      }}
                      className="bg-[#FF007A] text-white px-4 border-4 border-black font-black hover:bg-black transition-colors"
                      title="Hapus baris ini"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => updateHero({ quotes: hero.quotes ? hero.quotes + '\nBaris Baru' : 'Baris Baru' })}
                  className="mt-2 bg-yellow-400 text-black font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  + Tambah Kata
                </button>
              </div>
              <button onClick={() => toast.success("Perubahan profil berhasil disimpan ke database!")} className="w-full bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Simpan Perubahan
              </button>
            </div>
          </div>
        );
      case 'Tentang Saya':
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-6">Kelola Tentang Saya</h2>
            <div className="space-y-4 font-bold">
              <div>
                <label className="block mb-2">Nama Lengkap (Tebal)</label>
                <input 
                  type="text" 
                  value={about.name} 
                  onChange={(e) => updateAbout({ name: e.target.value })}
                  className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]"
                />
              </div>
              <div>
                <label className="block mb-2">Sub-judul / Gelar</label>
                <input 
                  type="text" 
                  value={about.subtitle} 
                  onChange={(e) => updateAbout({ subtitle: e.target.value })}
                  className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#BEE3F8]"
                />
              </div>
              <div>
                <label className="block mb-2">Deskripsi Diri</label>
                <textarea 
                  value={about.description} 
                  onChange={(e) => updateAbout({ description: e.target.value })}
                  className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#D9F99D] h-40"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Lokasi</label>
                  <input 
                    type="text" 
                    value={about.location} 
                    onChange={(e) => updateAbout({ location: e.target.value })}
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#FFD6E8]"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input 
                    type="text" 
                    value={about.email} 
                    onChange={(e) => updateAbout({ email: e.target.value })}
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#FEF08A]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Foto Profil (Tentang Saya)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const url = await handleUploadImageFile(file);
                          updateAbout({ image: url });
                          toast.success('Foto profil berhasil diunggah!');
                        } catch (err) {
                          console.error(err);
                          toast.error('Gagal mengunggah foto profil.');
                        }
                      }
                    }}
                    className="w-full bg-white border-4 border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:text-sm file:font-black file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  {about.image && (
                    <img 
                      src={about.image} 
                      alt="Profile Preview" 
                      className="w-20 h-20 object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                  )}
                </div>
              </div>
              <button onClick={() => toast.success("Perubahan tentang saya berhasil disimpan ke database!")} className="w-full bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Simpan Perubahan
              </button>
            </div>
          </div>
        );
      case 'Kelola Sertifikat':
        if (editingCert || isAddingCert) {
          const certData = editingCert || {
            id: Date.now(),
            title: '',
            image: '',
            color: 'bg-blue-500'
          };
          const colors = [
            { name: 'Biru', value: 'bg-blue-500' },
            { name: 'Ungu', value: 'bg-purple-600' },
            { name: 'Hijau', value: 'bg-green-500' },
            { name: 'Oranye', value: 'bg-orange-500' },
            { name: 'Merah', value: 'bg-red-500' },
            { name: 'Kuning', value: 'bg-yellow-500' }
          ];
          return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6">{isAddingCert ? 'Tambah Sertifikat Baru' : 'Edit Sertifikat'}</h2>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="block mb-2">Nama / Judul Sertifikat</label>
                  <input 
                    type="text" 
                    value={certData.title} 
                    onChange={e => setEditingCert({...certData, title: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]" 
                  />
                </div>
                <div>
                  <label className="block mb-2">Pilih Warna Aksen Button</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setEditingCert({...certData, color: c.value})}
                        className={`px-4 py-2 border-2 border-black font-black uppercase transition-all ${c.value} text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ${certData.color === c.value ? 'ring-4 ring-black' : ''}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Upload File Sertifikat (PNG/JPG)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const url = await handleUploadImageFile(file);
                          setEditingCert({...certData, image: url});
                          toast.success('Sertifikat berhasil diunggah!');
                        } catch (err) {
                          console.error(err);
                          toast.error('Gagal mengunggah sertifikat.');
                        }
                      }
                    }} 
                    className="w-full border-4 border-black p-2 file:bg-black file:text-white file:border-none file:px-4 file:py-2 file:mr-4 cursor-pointer" 
                  />
                  {certData.image && (
                    <div className="mt-4">
                      <p className="mb-2">Preview Gambar:</p>
                      <img src={certData.image} alt="Preview" className="max-w-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      if (!certData.title || !certData.image) {
                        toast.warn('Mohon isi Judul dan unggah Gambar Sertifikat!');
                        return;
                      }
                      if (isAddingCert) {
                        updateCertificates([...certificates, certData]);
                      } else {
                        updateCertificates(certificates.map(c => c.id === certData.id ? certData : c));
                      }
                      setEditingCert(null);
                      setIsAddingCert(false);
                    }} 
                    className="flex-1 bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Simpan Sertifikat
                  </button>
                  <button 
                    onClick={() => { setEditingCert(null); setIsAddingCert(false); }} 
                    className="flex-1 bg-gray-300 font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">Kelola Sertifikat</h2>
              <button 
                onClick={() => setIsAddingCert(true)} 
                className="bg-yellow-400 font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                + Tambah Sertifikat
              </button>
            </div>
            <p className="font-bold mb-6 text-gray-700">Daftar seluruh sertifikat penghargaan atau pencapaian akademis/profesional Anda:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certificates.map((cert, idx) => (
                <div key={cert.id || idx} className="border-4 border-black p-4 bg-[#F4F4F5] flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <img src={cert.image} alt={cert.title} className="w-full h-40 object-cover border-2 border-black mb-4 bg-white" />
                    <h3 className="font-black text-lg mb-2">{cert.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-gray-500">Warna Aksen:</span>
                      <span className={`w-4 h-4 rounded-full border border-black ${cert.color}`}></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingCert(cert)} 
                      className="flex-1 px-3 py-2 font-black uppercase border-4 border-black bg-[#00FF75] hover:bg-green-300 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Sertifikat',
                          message: `Apakah Anda yakin ingin menghapus sertifikat "${cert.title}"?`,
                          onConfirm: async () => {
                            await updateCertificates(certificates.filter(c => c.id !== cert.id));
                            toast.success('Sertifikat berhasil dihapus!');
                          }
                        });
                      }} 
                      className="flex-1 px-3 py-2 font-black uppercase border-4 border-black bg-[#FF007A] text-white hover:bg-red-600 transition-colors text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Kelola Kontak':
        if (editingContact || isAddingContact) {
          const contactData = editingContact || {
            id: Date.now(),
            type: 'Instagram',
            value: '',
            link: ''
          };
          const contactTypes = ['Lokasi', 'Email', 'Telepon', 'Instagram', 'Facebook', 'Telegram', 'WhatsApp', 'Lainnya'];
          return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6">{isAddingContact ? 'Tambah Kontak Baru' : 'Edit Kontak'}</h2>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="block mb-2">Tipe Kontak</label>
                  <select 
                    value={contactData.type}
                    onChange={e => setEditingContact({...contactData, type: e.target.value})}
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 font-black focus:outline-none"
                  >
                    {contactTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Teks Nilai Kontak (misal: @username, Kopo Bandung, dll.)</label>
                  <input 
                    type="text" 
                    value={contactData.value} 
                    onChange={e => setEditingContact({...contactData, value: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]" 
                    placeholder="Masukkan nilai kontak..."
                  />
                </div>
                <div>
                  <label className="block mb-2">Tautan URL Opsional (misal: https://instagram.com/user, tel:+62...)</label>
                  <input 
                    type="text" 
                    value={contactData.link} 
                    onChange={e => setEditingContact({...contactData, link: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]" 
                    placeholder="Masukkan link lengkap (jika ada)..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      if (!contactData.value) {
                        toast.warn('Mohon masukkan Nilai Kontak!');
                        return;
                      }
                      if (isAddingContact) {
                        updateContacts([...contacts, contactData]);
                      } else {
                        updateContacts(contacts.map(c => c.id === contactData.id ? contactData : c));
                      }
                      setEditingContact(null);
                      setIsAddingContact(false);
                    }} 
                    className="flex-1 bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Simpan Kontak
                  </button>
                  <button 
                    onClick={() => { setEditingContact(null); setIsAddingContact(false); }} 
                    className="flex-1 bg-gray-300 font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">Kelola Kontak</h2>
              <button 
                onClick={() => setIsAddingContact(true)} 
                className="bg-yellow-400 font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                + Tambah Kontak
              </button>
            </div>
            <p className="font-bold mb-6 text-gray-700">Atur seluruh saluran komunikasi Anda seperti alamat, email, no handphone, Instagram, Telegram, Facebook, dll.:</p>
            
            <div className="space-y-4">
              {contacts.map((contact, idx) => (
                <div key={contact.id || idx} className="border-4 border-black p-4 bg-[#F4F4F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="font-bold">
                    <span className="inline-block bg-black text-white px-2 py-1 text-xs uppercase mb-2">
                      {contact.type}
                    </span>
                    <h3 className="font-black text-lg">{contact.value}</h3>
                    {contact.link && (
                      <p className="text-xs text-blue-600 underline font-semibold mt-1 break-all">
                        {contact.link}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingContact(contact)} 
                      className="px-4 py-2 font-black uppercase border-4 border-black bg-[#00FF75] hover:bg-green-300 transition-colors text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Kontak',
                          message: `Apakah Anda yakin ingin menghapus kontak "${contact.type}: ${contact.value}"?`,
                          onConfirm: async () => {
                            await updateContacts(contacts.filter(c => c.id !== contact.id));
                            toast.success('Kontak berhasil dihapus!');
                          }
                        });
                      }} 
                      className="px-4 py-2 font-black uppercase border-4 border-black bg-[#FF007A] text-white hover:bg-red-600 transition-colors text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Kelola Musik':
        if (editingSong || isAddingSong) {
          const songData = editingSong || {
            id: Date.now(),
            title: '',
            artist: '',
            url: '',
            duration: 180,
            color: 'bg-[#FF007A]',
            tempo_speed: 220
          };
          const colors = [
            { name: 'Pink', value: 'bg-[#FF007A]' },
            { name: 'Hijau', value: 'bg-[#00FF75]' },
            { name: 'Kuning', value: 'bg-yellow-400' },
            { name: 'Ungu', value: 'bg-purple-600' },
            { name: 'Biru', value: 'bg-blue-500' },
            { name: 'Oranye', value: 'bg-orange-500' }
          ];
          const tempos = [
            { name: 'Lambat / Lofi Coding (350ms)', value: 350 },
            { name: 'Sedang / Coffee & Code (220ms)', value: 220 },
            { name: 'Cepat / Retro Synthwave (120ms)', value: 120 }
          ];

          return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6">{isAddingSong ? 'Tambah Lagu Baru' : 'Edit Lagu'}</h2>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="block mb-2">Judul Lagu</label>
                  <input 
                    type="text" 
                    value={songData.title} 
                    onChange={e => setEditingSong({...songData, title: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" 
                    placeholder="Masukkan judul lagu..."
                  />
                </div>
                <div>
                  <label className="block mb-2">Artis / Pembuat</label>
                  <input 
                    type="text" 
                    value={songData.artist} 
                    onChange={e => setEditingSong({...songData, artist: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" 
                    placeholder="Masukkan nama artis..."
                  />
                </div>
                <div>
                  <label className="block mb-2">Sumber Lagu (.mp3)</label>
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      accept="audio/mp3, audio/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const publicUrl = await handleUploadSongFile(file);
                            const seconds = await getAudioDuration(file);
                            setEditingSong({
                              ...songData,
                              url: publicUrl,
                              duration: seconds,
                              title: songData.title || file.name.replace(/\.[^/.]+$/, "") 
                            });
                            toast.success('Audio berhasil diunggah!');
                          } catch (err) {
                            console.error(err);
                            toast.error('Gagal mengunggah file audio.');
                          }
                        }
                      }}
                      className="w-full bg-white border-4 border-black p-2 font-bold cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:text-sm file:font-black file:bg-black file:text-white hover:file:bg-gray-800"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase font-black">ATAU INPUT URL MANUAL:</span>
                    </div>
                    <input 
                      type="text" 
                      value={songData.url} 
                      onChange={e => setEditingSong({...songData, url: e.target.value})} 
                      className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none" 
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Durasi (Detik)</label>
                    <input 
                      type="number" 
                      value={songData.duration} 
                      onChange={e => setEditingSong({...songData, duration: parseInt(e.target.value) || 0})} 
                      className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Warna Cover Piringan</label>
                    <select 
                      value={songData.color} 
                      onChange={e => setEditingSong({...songData, color: e.target.value})} 
                      className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none cursor-pointer"
                    >
                      {colors.map(c => (
                        <option key={c.value} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Tempo Goyangan Partikel</label>
                  <select 
                    value={songData.tempo_speed} 
                    onChange={e => setEditingSong({...songData, tempo_speed: parseInt(e.target.value)})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none cursor-pointer"
                  >
                    {tempos.map(t => (
                      <option key={t.value} value={t.value}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      if (!songData.title || !songData.url) {
                        toast.error('Judul dan URL lagu wajib diisi!');
                        return;
                      }
                      if (isAddingSong) {
                        updateSongs([...songs, songData]);
                        setIsAddingSong(false);
                      } else {
                        updateSongs(songs.map(s => s.id === songData.id ? songData : s));
                        setEditingSong(null);
                      }
                      toast.success('Musik berhasil disimpan!');
                    }} 
                    className="bg-[#00FF75] text-black font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Simpan Musik
                  </button>
                  <button 
                    onClick={() => {
                      setEditingSong(null);
                      setIsAddingSong(false);
                    }} 
                    className="bg-gray-300 text-black font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-black uppercase">Daftar Musik Radio</h2>
              <button 
                onClick={() => setIsAddingSong(true)}
                className="bg-yellow-400 text-black font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm self-start sm:self-auto"
              >
                + Tambah Lagu Baru
              </button>
            </div>

            <div className="space-y-4">
              {songs.map((song) => (
                <div key={song.id} className="border-4 border-black p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F4F4F5] gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full border-2 border-black ${song.color} flex items-center justify-center`}>
                      <FaMusic size={16} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase leading-tight">{song.title}</h4>
                      <p className="text-sm font-bold text-gray-500 uppercase">{song.artist} • {Math.floor(song.duration / 60)}m {song.duration % 60}s</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingSong(song)}
                      className="px-4 py-2 font-black uppercase border-4 border-black bg-[#00FF75] hover:bg-green-300 transition-colors text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Musik',
                          message: `Apakah Anda yakin ingin menghapus lagu "${song.title}"?`,
                          onConfirm: async () => {
                            await updateSongs(songs.filter(s => s.id !== song.id));
                            toast.success('Lagu berhasil dihapus!');
                          }
                        });
                      }}
                      className="px-4 py-2 font-black uppercase border-4 border-black bg-[#FF007A] text-white hover:bg-red-600 transition-colors text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Kelola Medsos':
        if (editingSocial || isAddingSocial) {
          const socialData = editingSocial || {
            id: Date.now(),
            platform: 'GitHub',
            username: '',
            link: '',
            color: 'bg-[#3B82F6]'
          };
          const platforms = ['GitHub', 'LinkedIn', 'Instagram', 'TikTok', 'WhatsApp', 'YouTube', 'Facebook', 'Twitter', 'Lainnya'];
          const defaultColors = [
            { name: 'Blue (GitHub/FB)', value: 'bg-[#3B82F6]' },
            { name: 'Purple (LinkedIn)', value: 'bg-[#8B5CF6]' },
            { name: 'Pink (Instagram)', value: 'bg-[#FF007A]' },
            { name: 'Black (TikTok)', value: 'bg-black' },
            { name: 'Green (WhatsApp)', value: 'bg-[#00FF75]' },
            { name: 'Red (YouTube)', value: 'bg-[#FF0000]' },
            { name: 'Cyan (Twitter/X)', value: 'bg-[#1DA1F2]' },
            { name: 'Orange', value: 'bg-orange-500' },
            { name: 'Yellow', value: 'bg-yellow-400' }
          ];

          return (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6">{isAddingSocial ? 'Tambah Medsos Baru' : 'Edit Medsos'}</h2>
              <div className="space-y-4 font-bold">
                <div>
                  <label className="block mb-2">Platform Sosial Media</label>
                  <select 
                    value={socialData.platform}
                    onChange={e => setEditingSocial({...socialData, platform: e.target.value})}
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 font-black focus:outline-none"
                  >
                    {platforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2">Username / Nomor Kontak</label>
                  <input 
                    type="text" 
                    value={socialData.username} 
                    onChange={e => setEditingSocial({...socialData, username: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]" 
                    placeholder="Masukkan username atau nomor..."
                  />
                </div>

                <div>
                  <label className="block mb-2">Tautan URL Medsos (Lengkap dengan https://)</label>
                  <input 
                    type="text" 
                    value={socialData.link} 
                    onChange={e => setEditingSocial({...socialData, link: e.target.value})} 
                    className="w-full bg-[#F4F4F5] border-4 border-black p-3 focus:outline-none focus:bg-[#E9D5FF]" 
                    placeholder="https://github.com/username..."
                  />
                </div>

                <div>
                  <label className="block mb-2">Warna Background Kartu Medsos</label>
                  <div className="grid grid-cols-3 gap-2">
                    {defaultColors.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setEditingSocial({...socialData, color: c.value})}
                        className={`flex items-center gap-2 p-2 border-2 border-black font-bold text-xs capitalize transition-all ${c.value === socialData.color ? 'ring-4 ring-black scale-95' : ''}`}
                      >
                        <span className={`w-4 h-4 rounded-full border border-black inline-block ${c.value}`}></span>
                        <span className={c.value === 'bg-black' ? 'text-black' : ''}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      if (!socialData.username || !socialData.link) {
                        toast.warn('Mohon masukkan Username dan Tautan!');
                        return;
                      }
                      if (isAddingSocial) {
                        updateSocials([...(socials || []), socialData]);
                        toast.success('Medsos baru berhasil ditambahkan!');
                      } else {
                        updateSocials((socials || []).map(s => s.id === socialData.id ? socialData : s));
                        toast.success('Data Medsos berhasil diperbarui!');
                      }
                      setEditingSocial(null);
                      setIsAddingSocial(false);
                    }} 
                    className="flex-1 bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Simpan Medsos
                  </button>
                  <button 
                    onClick={() => { setEditingSocial(null); setIsAddingSocial(false); }} 
                    className="flex-1 bg-gray-300 font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">Kelola Medsos</h2>
              <button 
                onClick={() => setIsAddingSocial(true)} 
                className="bg-yellow-400 font-black border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                + Tambah Medsos
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(socials || []).map((item) => (
                <div key={item.id} className="border-4 border-black p-4 bg-[#F4F4F5] flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-full border-2 border-black inline-flex items-center justify-center text-white ${item.color || 'bg-black'} font-black uppercase text-xs`}>
                      {item.platform.slice(0,2)}
                    </span>
                    <div>
                      <h4 className="font-black text-lg">{item.platform}</h4>
                      <p className="text-sm font-bold text-gray-500">@{item.username}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs font-bold text-blue-600 truncate mb-4">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.link}</a>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingSocial(item)} 
                      className="px-3 py-1.5 font-black uppercase border-2 border-black bg-yellow-300 hover:bg-yellow-400 transition-colors text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Medsos',
                          message: `Apakah Anda yakin ingin menghapus media sosial ${item.platform} (${item.username})?`,
                          onConfirm: async () => {
                            const newSocials = socials.filter(s => s.id !== item.id);
                            await updateSocials(newSocials);
                            toast.success('Medsos berhasil dihapus!');
                          }
                        });
                      }}
                      className="px-3 py-1.5 font-black uppercase border-2 border-black bg-[#FF007A] text-white hover:bg-red-600 transition-colors text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <FaHome size={20} /> },
    { name: 'Kelola Profil', icon: <FaUserEdit size={20} /> },
    { name: 'Tentang Saya', icon: <FaInfoCircle size={20} /> },
    { name: 'Kelola Proyek', icon: <FaProjectDiagram size={20} /> },
    { name: 'Kelola Keahlian', icon: <FaTools size={20} /> },
    { name: 'Kelola Sertifikat', icon: <FaAward size={20} /> },
    { name: 'Kelola Kontak', icon: <FaPhoneAlt size={20} /> },
    { name: 'Kelola Medsos', icon: <FaShareAlt size={20} /> },
    { name: 'Kelola Musik', icon: <FaMusic size={20} /> },
    { name: 'Pesan Masuk', icon: <FaEnvelope size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F4F5] font-sans">
      
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white border-r-4 border-black flex flex-col hidden md:flex">
        {/* Logo Admin */}
        <div className="p-2 border-b-4 border-black bg-[#C1EBE9] flex justify-center items-center h-24">
          <img src="/logo-admin.png" alt="Logo Panel Admin" className="h-20 scale-110 w-auto object-contain" />
        </div>
        
        {/* Menu Navigasi */}
        <nav className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 font-black uppercase p-3 border-4 border-black transition-all text-left
                ${activeTab === item.name 
                  ? 'bg-[#00FF75] translate-x-[4px] translate-y-[4px] shadow-none' 
                  : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF7C5]'
                }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Tombol Logout di Sidebar */}
        <div className="p-4 border-t-4 border-black bg-[#F4F4F5]">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-[#FF007A] text-white font-black uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <FaSignOutAlt size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama Kanan */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Atas */}
        <header className="bg-white border-b-4 border-black p-4 md:p-6 flex justify-between items-center h-24">
          <div className="flex items-center gap-4">
             {/* Tombol menu untuk mobile (opsional) */}
             <div className="md:hidden bg-black text-white p-2 border-2 border-black font-black uppercase">Menu</div>
             <h1 className="text-2xl md:text-3xl font-black uppercase hidden md:block">{activeTab}</h1>
          </div>
          
          {/* Info Profil Singkat */}
          <div className="flex items-center gap-3">
            <span className="font-black uppercase hidden sm:block">Halo, Migwara</span>
            <div className="w-10 h-10 bg-[#FF007A] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white font-black">
              MR
            </div>
          </div>
        </header>

        {/* Area Konten Dinamis */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
           <div className="max-w-5xl mx-auto">
             {/* Judul Mobile */}
             <h1 className="text-2xl font-black uppercase mb-6 md:hidden">{activeTab}</h1>
             {renderContent()}
           </div>
        </div>
      </main>

      {/* Custom Neobrutalist Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-[popup_0.2s_ease-out]">
            
            {/* Modal Title */}
            <h3 className="text-xl font-black uppercase mb-3 text-black">
              {confirmModal.title || 'Konfirmasi'}
            </h3>
            
            {/* Modal Message */}
            <p className="text-sm font-bold text-gray-800 mb-6 leading-relaxed">
              {confirmModal.message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                disabled={confirmModal.isLoading}
                onClick={async () => {
                  setConfirmModal(prev => ({ ...prev, isLoading: true }));
                  try {
                    if (confirmModal.onConfirm) {
                      await new Promise(resolve => setTimeout(resolve, 800));
                      await confirmModal.onConfirm();
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setConfirmModal({
                      isOpen: false,
                      title: '',
                      message: '',
                      onConfirm: null,
                      isLoading: false,
                    });
                  }
                }}
                className={`flex-1 font-black uppercase py-3 border-4 border-black bg-[#FF007A] text-white hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 ${
                  confirmModal.isLoading ? 'cursor-not-allowed opacity-80' : ''
                }`}
              >
                {confirmModal.isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
              
              <button 
                disabled={confirmModal.isLoading}
                onClick={() => {
                  setConfirmModal({
                    isOpen: false,
                    title: '',
                    message: '',
                    onConfirm: null,
                    isLoading: false,
                  });
                }}
                className="flex-1 font-black uppercase py-3 border-4 border-black bg-gray-300 hover:bg-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <style>{`
        @keyframes popup {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Custom Neobrutalist Toast Styles */
        .Toastify__toast-container {
          z-index: 99999 !important;
        }
        .Toastify__toast {
          border: 4px solid #000000 !important;
          border-radius: 0px !important;
          box-shadow: 4px 4px 0px 0px #000000 !important;
          font-family: 'sans-serif' !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          color: #000000 !important;
        }
        .Toastify__toast--success {
          background-color: #00FF75 !important;
        }
        .Toastify__toast--error {
          background-color: #FF007A !important;
          color: #ffffff !important;
        }
        .Toastify__toast--warning {
          background-color: #FEF08A !important;
        }
        .Toastify__toast--info {
          background-color: #C1EBE9 !important;
        }
        .Toastify__close-button {
          color: #000000 !important;
          opacity: 1 !important;
        }
        .Toastify__close-button svg {
          stroke-width: 3px !important;
        }
        .Toastify__progress-bar {
          background-color: #000000 !important;
          height: 6px !important;
          opacity: 1 !important;
        }
      `}</style>

    </div>
  );
}
