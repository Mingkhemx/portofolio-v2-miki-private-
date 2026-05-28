import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaMusic, FaTimes } from 'react-icons/fa';
import { usePortfolioStore } from '../store/portfolioStore';

export default function MusicPlayer() {
  const { songs } = usePortfolioStore();
  const playlist = songs && songs.length > 0 ? songs : [
    { id: 1, title: 'Lofi Coding Beats', artist: 'Migwara Records', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 372, color: 'bg-[#FF007A]', tempo_speed: 350 },
    { id: 2, title: 'Retro Synthwave', artist: '80s Cyber Vibe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 423, color: 'bg-[#00FF75]', tempo_speed: 120 },
    { id: 3, title: 'Coffee & Code Session', artist: 'Midnight Dev Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 302, color: 'bg-yellow-400', tempo_speed: 220 }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [visualizerHeights, setVisualizerHeights] = useState([12, 24, 18, 8, 30, 16, 20]);
  const [noteFrequencies, setNoteFrequencies] = useState(Array(16).fill(1));

  const audioRef = useRef(null);
  const track = playlist[currentTrackIndex] || playlist[0];

  // sinkronisasi audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Autoplay blocked or audio failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  // ganti track audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    setCurrentTime(0);
  }, [currentTrackIndex]);

  // handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  // handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(Math.floor(audioRef.current.duration || track.duration));
    }
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  // Efek simulasi frekuensi nada musik dinamis (tempo detak)
  useEffect(() => {
    let interval;
    if (isPlaying) {
      const speed = track.tempo_speed || 220;

      interval = setInterval(() => {
        setNoteFrequencies(
          Array.from({ length: 16 }, () => 0.4 + Math.random() * 1.6)
        );

        setVisualizerHeights([
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
          Math.floor(Math.random() * 26) + 6,
        ]);
      }, speed);
    } else {
      setNoteFrequencies(Array(16).fill(1));
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex, track]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleProgressBarClick = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickPercent = clickX / width;
      const newTime = clickPercent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Floating Action Button (FAB) - Lucu, di sebelah kanan bawah */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 bottom-6 z-50 p-4 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${
          isOpen ? 'bg-[#FF007A] text-white animate-spin-slow' : 'bg-[#00FF75] text-black hover:scale-110'
        }`}
        title="Buka Musik Player"
      >
        <FaMusic size={24} className={isPlaying ? 'animate-bounce' : ''} />
      </button>

      {/* Panel Music Player */}
      {isOpen && (
        <div className="fixed right-6 bottom-22 w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 z-50 font-bold text-black select-none">
          
          {/* Header Panel */}
          <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2 bg-[#C1EBE9] -mx-5 -mt-5 p-3">
            <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full border border-black ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-gray-400'}`}></span>
              Migwara FM Radio
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-white border-2 border-black p-1 hover:bg-red-400 transition-colors flex items-center justify-center"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Area Cover/Vinyl & Visualizer */}
          <div className="flex justify-center items-center py-4 bg-[#F4F4F5] border-4 border-black mb-4 relative overflow-hidden h-36">
            
            {/* Piringan Hitam (Vinyl) Berputar */}
            <div className={`w-24 h-24 rounded-full border-4 border-black ${track.color} flex items-center justify-center relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
            }`}>
              {/* Lubang Tengah Piringan */}
              <div className="w-8 h-8 rounded-full bg-white border-4 border-black flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              </div>
            </div>

            {/* Audio Bars Visualizer yang memantul */}
            {isPlaying && (
              <div className="absolute bottom-2 flex justify-center items-end gap-1 h-8">
                {visualizerHeights.map((height, idx) => (
                  <div 
                    key={idx} 
                    className="w-1.5 bg-black border border-black rounded-t-sm transition-all duration-300"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informasi Track */}
          <div className="text-center mb-4">
            <h4 className="font-black text-base truncate uppercase tracking-tight">{track.title}</h4>
            <p className="text-xs text-gray-500 font-semibold">{track.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              onClick={handleProgressBarClick}
              className="w-full bg-gray-200 border-2 border-black h-4 relative overflow-hidden cursor-pointer"
            >
              <div 
                className="bg-[#FF007A] h-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-semibold mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center items-center gap-5">
            <button 
              onClick={handlePrev}
              className="bg-white border-4 border-black p-3 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:bg-gray-100"
            >
              <FaStepBackward size={16} />
            </button>
            <button 
              onClick={handlePlayPause}
              className="bg-[#00FF75] border-4 border-black p-4 rounded-full hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center active:scale-95"
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="bg-white border-4 border-black p-3 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:bg-gray-100"
            >
              <FaStepForward size={16} />
            </button>
          </div>

        </div>
      )}

      {/* Partikel Note Musik Jatuh ketika musik diputar */}
      {isPlaying && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99] select-none">
          {Array.from({ length: 16 }).map((_, i) => {
            const notes = ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶'];
            const colors = [
              'text-[#FF007A]', // Pink
              'text-[#3B82F6]', // Biru
              'text-[#00FF75]', // Hijau
              'text-purple-500', // Ungu
              'text-yellow-400', // Kuning
              'text-orange-500'  // Oranye
            ];
            
            const note = notes[i % notes.length];
            const colorClass = colors[i % colors.length];
            
            const left = (i * 6.2); 
            const delay = i * 0.45; 
            const durationVal = 8 + (i % 4) * 2; 
            const size = 16 + (i % 3) * 8; 
            const opacity = 0.15 + (i % 2) * 0.15; 
            
            const intensity = noteFrequencies[i] || 1.0;

            return (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `${left}%`,
                  animation: `fall ${durationVal}s linear infinite`,
                  animationDelay: `${delay}s`,
                  top: '-10%',
                }}
              >
                <div
                  className={`${colorClass} font-black transition-transform duration-200 ease-out`}
                  style={{
                    fontSize: `${size}px`,
                    opacity: opacity,
                    transform: `scale(${0.7 + intensity * 0.45}) rotate(${(intensity - 1.0) * 25}deg)`,
                  }}
                >
                  {note}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CSS internal tambahan */}
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          10% {
            opacity: inherit;
          }
          90% {
            opacity: inherit;
          }
          100% {
            transform: translateY(115vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
