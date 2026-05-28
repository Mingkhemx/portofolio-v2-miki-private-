import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import FullProjects from './components/FullProjects.jsx';
import Certificates from './components/Certificates.jsx';
import GitHubStats from './components/GitHubStats.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import { useAuthStore } from './store/authStore';
import { usePortfolioStore } from './store/portfolioStore';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Komponen pembungkus untuk halaman portofolio utama
const MainPortfolio = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onFinished={() => setShowWelcome(false)} />
      )}
      <div className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <FullProjects />
        <Certificates />
        <GitHubStats />
        <Contact />
        <Footer />
      </div>
      <MusicPlayer />
    </>
  );
};

function App() {
  const checkSession = useAuthStore(state => state.checkSession);
  const fetchPortfolioData = usePortfolioStore(state => state.fetchPortfolioData);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, // Biarkan animasi berulang saat di-scroll naik/turun jika di-false, atau biarkan true agar sekali saja
      offset: 50,
    });
    checkSession();
    fetchPortfolioData();
  }, [checkSession, fetchPortfolioData]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}

export default App;
