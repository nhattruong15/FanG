import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2 } from 'lucide-react';
import logoImg from '../assets/logo/logo.png';

const NAV_ITEMS = [
  { id: 'hero', label: 'Trang chủ' },
  { id: 'introduction', label: 'Giới thiệu' },
  { id: 'rules', label: 'Thể lệ' },
  { id: 'registration', label: 'Đăng ký' },
  { id: 'teams', label: 'Đội thi' },
  { id: 'bracket', label: 'Bảng đấu' },
  { id: 'sponsors', label: 'Nhà tài trợ' },
  { id: 'news', label: 'Tin tức' },
  { id: 'workshop', label: 'Workshop' },
];

export default function Navbar({ selectedGame, onChangeGame, onOpenAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Use refs to avoid unnecessary re-renders — only setState when value actually changes
  const scrolledRef = useRef(false);
  const activeSectionRef = useRef('hero');
  const rafRef = useRef(null);

  // IntersectionObserver for tracking active section without causing layout reflows during scroll
  useEffect(() => {
    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          if (isScrolled !== scrolledRef.current) {
            scrolledRef.current = isScrolled;
            setScrolled(isScrolled);
          }
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Native IntersectionObserver to highlight active nav link asynchronously
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`w-full transition-colors duration-200 ${
          scrolled ? 'bg-[#090503] border-b border-[#F37022]/30 shadow-xl shadow-black/80' : 'bg-[#0e0906]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group text-left">
              <img
                src={logoImg}
                alt="FanG Exports Logo"
                className="h-8 sm:h-11 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(243,112,34,0.4)]"
              />
            </button>

            {selectedGame && (
              <button
                onClick={onChangeGame}
                title="Đổi bộ môn thi đấu"
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all transform hover:scale-105 ${
                  selectedGame === 'valorant'
                    ? 'border-[#ff4655]/60 bg-[#ff4655]/15 text-[#ff4655] shadow-[0_0_12px_rgba(255,70,85,0.3)]'
                    : 'border-[#f39c12]/60 bg-[#f39c12]/15 text-[#f39c12] shadow-[0_0_12px_rgba(243,156,18,0.3)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedGame === 'valorant' ? '#ff4655' : '#f39c12' }} />
                <span>{selectedGame === 'valorant' ? 'VALORANT' : 'AOV'}</span>
                <span className="text-[10px] text-slate-300 font-normal underline ml-0.5">(Đổi)</span>
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-[#F37021] text-white shadow-[0_0_15px_rgba(243,112,33,0.5)] font-bold'
                    : 'text-white hover:text-[#F37021] hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-slate-700/80"
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#F37021]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#090503]/95 backdrop-blur-lg rounded-t-3xl p-6 pb-8 border-t border-[#F37021]/30 max-h-[75vh] overflow-y-auto"
            >
              <div className="flex flex-col items-center mb-5">
                <div className="w-12 h-1.5 bg-[#F37021]/50 rounded-full mb-4" />
                {selectedGame && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onChangeGame();
                    }}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                      selectedGame === 'valorant'
                        ? 'border-[#ff4655]/60 bg-[#ff4655]/15 text-[#ff4655]'
                        : 'border-[#f39c12]/60 bg-[#f39c12]/15 text-[#f39c12]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedGame === 'valorant' ? '#ff4655' : '#f39c12' }} />
                      Bộ môn: <strong>{selectedGame === 'valorant' ? 'VALORANT' : 'AOV (LIÊN QUÂN)'}</strong>
                    </span>
                    <span className="text-[11px] underline">Đổi bộ môn</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`p-3 rounded-2xl text-center text-xs font-semibold transition-all ${
                      activeSection === item.id
                        ? 'bg-[#F37021] text-white glow-orange shadow-lg'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
