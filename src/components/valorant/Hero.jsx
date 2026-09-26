import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Swords } from 'lucide-react';
import kvImage from '../../assets/KV/hero-kv-final.png';

export default function Hero() {
  return (
    <section id="hero" className="relative w-full bg-[#0e0906] pt-20 lg:pt-0 overflow-hidden">
      {/* Edge-to-edge Full-width KV Banner */}
      <div className="relative w-full aspect-video lg:aspect-auto lg:h-screen overflow-hidden bg-[#0e0906]">
        {/* Key Visual Image */}
        <img
          src={kvImage}
          alt="FanG Exports FPT Tournament Key Visual"
          className="w-full h-full object-cover object-center"
        />

        {/* Positioned High-Contrast Eye-Catching Registration Button over KV */}
        <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block w-full"
          >
            {/* Softened Multi-Layered Neon Energy Ring */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.85, 0.5],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-[#F37022] to-amber-300 blur-md pointer-events-none opacity-60"
            />

            {/* Vibrant FPT Orange Cyber Button Without Black Fill */}
            <motion.a
              href="#registration"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                scale: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-8 sm:py-3.5 md:py-4 rounded-2xl bg-black/55 backdrop-blur-md text-white font-black text-xs sm:text-base md:text-lg border-2 border-[#F37022]/80 hover:bg-black/70 transition-all whitespace-nowrap"
            >
              <span className="tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] uppercase font-black">
                Đăng ký thi đấu ngay
              </span>

              {/* Gentle Shimmer Light Streak Beam */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
              />
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator Overlay on bottom of KV */}
        <motion.div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 hidden sm:flex justify-center cursor-pointer pointer-events-auto"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#introduction" aria-label="Scroll to introduction">
            <ChevronDown className="w-5 h-5 text-[#F37022]/80 hover:text-[#F37022] transition-colors" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
