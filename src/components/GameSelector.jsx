import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GameSelector({ onSelectGame }) {
  const [hoveredGame, setHoveredGame] = useState(null);

  const getValorantClip = () => {
    if (hoveredGame === 'valorant') return 'polygon(0 0, 68% 0, 58% 100%, 0 100%)';
    if (hoveredGame === 'aov')      return 'polygon(0 0, 42% 0, 32% 100%, 0 100%)';
    return 'polygon(0 0, 56% 0, 46% 100%, 0 100%)';
  };

  const getAovClip = () => {
    if (hoveredGame === 'valorant') return 'polygon(68% 0, 100% 0, 100% 100%, 58% 100%)';
    if (hoveredGame === 'aov')      return 'polygon(42% 0, 100% 0, 100% 100%, 32% 100%)';
    return 'polygon(56% 0, 100% 0, 100% 100%, 46% 100%)';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none bg-black font-sans">
      
      {/* Top Header Cyber Badge */}
     

      {/* ===== VALORANT PANEL ===== */}
      <div
        className="absolute inset-0 cursor-pointer overflow-hidden group touch-manipulation"
        style={{
          clipPath: getValorantClip(),
          transition: 'clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => onSelectGame('valorant')}
        onMouseEnter={() => setHoveredGame('valorant')}
        onMouseLeave={() => setHoveredGame(null)}
        onTouchStart={() => setHoveredGame('valorant')}
      >
        <img
          src="/char-valorant.jpg"
          alt="Valorant"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            objectPosition: 'center 35%',
            transform: hoveredGame === 'valorant' ? 'scale(0.8)' : 'scale(1)',
          }}
          draggable={false}
        />
        
        {/* Dark Gradients & Neon Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 md:from-black/75 md:via-transparent md:to-transparent" />
        <div 
          className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 25% 75%, rgba(255, 70, 85, 0.35), transparent 60%)' }}
        />

        {/* Content Box */}
        <div className="absolute bottom-5 left-2.5 xs:left-4 sm:bottom-12 sm:left-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {/* Ambient Backlight Glow behind Text */}
            <div className="absolute -inset-2 bg-[#ff4655]/30 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <h2
              className="relative font-black text-lg xs:text-xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight sm:tracking-wider leading-none bg-gradient-to-r from-[#ff6b78] via-[#ff4655] to-[#ff172c] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,70,85,0.85)]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                transform: hoveredGame === 'valorant' ? 'scale(1.05) translateX(4px)' : 'scale(1)',
                transformOrigin: 'bottom left',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              VALORANT
            </h2>

            {/* Cyber Badge Button with Animated Arrow */}
            <div className="mt-2 sm:mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-[9px] xs:text-[11px] sm:text-xs tracking-widest text-white font-bold bg-gradient-to-r from-[#ff4655]/40 to-[#ff4655]/15 border border-[#ff4655]/60 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md backdrop-blur-md shadow-[0_0_15px_rgba(255,70,85,0.4)] group-hover:from-[#ff4655] group-hover:to-[#ff2a3d] group-hover:shadow-[0_0_25px_rgba(255,70,85,0.8)] transition-all duration-300">
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  ▸
                </motion.span>
                <span>CHỌN VALORANT</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== AOV PANEL ===== */}
      <div
        className="absolute inset-0 cursor-pointer overflow-hidden group touch-manipulation"
        style={{
          clipPath: getAovClip(),
          transition: 'clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => onSelectGame('aov')}
        onMouseEnter={() => setHoveredGame('aov')}
        onMouseLeave={() => setHoveredGame(null)}
        onTouchStart={() => setHoveredGame('aov')}
      >
        <img
          src="/char-aov.jpg"
          alt="AOV"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            objectPosition: 'center 20%',
            transform: hoveredGame === 'aov' ? 'scale(0.8)' : 'scale(1)',
          }}
          draggable={false}
        />

        {/* Dark Gradients & Neon Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 md:from-black/75 md:via-transparent md:to-transparent" />
        <div 
          className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 75% 75%, rgba(243, 156, 18, 0.35), transparent 60%)' }}
        />

        {/* Content Box */}
        <div className="absolute bottom-5 right-2.5 xs:right-4 sm:bottom-12 sm:right-12 z-10 text-right flex flex-col items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col items-end"
          >
            {/* Ambient Backlight Glow behind Text */}
            <div className="absolute -inset-2 bg-[#f39c12]/30 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <h2
              className="relative font-black text-lg xs:text-xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight sm:tracking-wider leading-none bg-gradient-to-r from-[#ffc847] via-[#f39c12] to-[#e67e22] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(243,156,18,0.85)]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                transform: hoveredGame === 'aov' ? 'scale(1.05) translateX(-4px)' : 'scale(1)',
                transformOrigin: 'bottom right',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              AOV
            </h2>

            {/* Cyber Badge Button with Animated Arrow */}
            <div className="mt-2 sm:mt-3 flex items-center justify-end gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-[9px] xs:text-[11px] sm:text-xs tracking-widest text-white font-bold bg-gradient-to-r from-[#f39c12]/15 to-[#f39c12]/40 border border-[#f39c12]/60 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md backdrop-blur-md shadow-[0_0_15px_rgba(243,156,18,0.4)] group-hover:from-[#f39c12] group-hover:to-[#d35400] group-hover:text-black group-hover:shadow-[0_0_25px_rgba(243,156,18,0.8)] transition-all duration-300">
                <span>CHỌN AOV</span>
                <motion.span
                  animate={{ x: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  ◂
                </motion.span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cyber scanline background overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
      </div>

    </div>
  );
}
