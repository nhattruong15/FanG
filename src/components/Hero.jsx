import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Swords } from 'lucide-react';
import kvImage from '../assets/KV/kv_new.jpg';

export default function Hero() {
  return (
    <section id="hero" className="relative w-full bg-[#0e0906] pt-14 sm:pt-16 lg:pt-0 overflow-hidden">
      <div className="relative w-full aspect-video lg:aspect-auto lg:h-screen overflow-hidden bg-[#0e0906]">
        <img
          src={kvImage}
          alt="FanG Exports FPT Tournament Key Visual"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block w-full"
          >
            {/* Replaced infinite framer-motion glow with CSS animation for GPU acceleration */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-[#F37022] to-amber-300 blur-md pointer-events-none opacity-60 animate-pulse" />

            <a
              href="#registration"
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-3.5 md:py-4 rounded-2xl bg-black/55 backdrop-blur-sm text-white font-black text-xs sm:text-base md:text-lg border-2 border-[#F37022]/80 hover:bg-black/70 hover:scale-105 active:scale-96 transition-all whitespace-nowrap"
            >
              <span className="tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] uppercase font-black">
                Đăng ký thi đấu ngay
              </span>

              {/* CSS-only shimmer instead of framer-motion infinite loop */}
              <div className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none animate-shimmer" />
            </a>
          </motion.div>
        </div>

        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 hidden sm:flex justify-center cursor-pointer pointer-events-auto"
        >
          <a href="#introduction" aria-label="Scroll to introduction">
            <ChevronDown className="w-5 h-5 text-[#F37022]/80 hover:text-[#F37022] hover:translate-y-0.5 transition-all" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        .animate-shimmer {
          animation: shimmer 3.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
