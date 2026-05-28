import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  useEffect(() => {
    const savedUsername = localStorage.getItem('admin_username');
    const savedPassword = localStorage.getItem('admin_password');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      if (rememberMe) {
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_password', password);
      } else {
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_password');
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7C5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        
        <div className="flex justify-center mb-8">
          <div className="bg-[#C1EBE9] px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <img src="/logo-admin.png" alt="Logo Panel Admin" className="h-24 scale-110 w-auto object-contain" />
          </div>
        </div>

        {error && (
          <div className="bg-[#FECACA] border-4 border-black p-3 mb-6 font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-black uppercase mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#F4F4F5] border-4 border-black p-3 font-bold focus:outline-none focus:bg-[#E9D5FF] transition-colors"
              placeholder="Masukkan username..."
              required
            />
          </div>

          <div>
            <label className="block font-black uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F4F4F5] border-4 border-black p-3 font-bold focus:outline-none focus:bg-[#E9D5FF] transition-colors"
              placeholder="Masukkan password..."
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 border-2 border-black accent-[#FF007A] cursor-pointer"
            />
            <label htmlFor="remember" className="font-bold text-sm cursor-pointer select-none">
              Ingat Saya
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FF75] font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sedang Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-8 text-center">
           <button 
             onClick={() => navigate('/')} 
             className="text-sm font-bold underline hover:text-[#FF007A] transition-colors uppercase"
           >
             &larr; Kembali ke Beranda
           </button>
        </div>
      </div>
    </div>
  );
}
