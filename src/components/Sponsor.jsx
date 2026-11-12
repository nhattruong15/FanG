import React from 'react';
import { motion } from 'framer-motion';

import logoTheDucTheThao from '../assets/sponsor/logo cục thể dục thể thao option 2.png';
import logoAnNinhMang from '../assets/sponsor/Cục an ninh mạng.png';
import logoFanG from '../assets/sponsor/_0000_FanG.png';
import logoCamDoc from '../assets/sponsor/Cam-doc.png';
import logoSamsung from '../assets/sponsor/_0004_Samsung-Odyssey.png';
import logoGarena from '../assets/sponsor/garena-logo.png';
import logoVMG from '../assets/sponsor/_0003_VMGGames.png';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const SPONSOR_LOGOS = [
  { id: 'the-duc-the-thao', name: 'Cục Thể Dục Thể Thao', src: logoTheDucTheThao, alt: 'Logo Cục Thể Dục Thể Thao' },
  { id: 'an-ninh-mang', name: 'Cục An Ninh Mạng A05', src: logoAnNinhMang, alt: 'Logo Cục An Ninh Mạng A05' },
  { id: 'fang', name: 'FanG Esports', src: logoFanG, alt: 'Logo FanG Esports' },
  { id: 'fpt-edu', name: 'FPT Education', src: logoCamDoc, alt: 'Logo FPT Education' },
  { id: 'samsung-odyssey', name: 'Samsung Odyssey', src: logoSamsung, alt: 'Logo Samsung Odyssey' },
  { id: 'garena', name: 'Garena', src: logoGarena, alt: 'Logo Garena' },
  { id: 'vmg-games', name: 'VMG Games', src: logoVMG, alt: 'Logo VMG Games' },
];

// Repeat 4 times so marquee flows seamlessly across any screen resolution
const MARQUEE_ITEMS = [
  ...SPONSOR_LOGOS,
  ...SPONSOR_LOGOS,
  ...SPONSOR_LOGOS,
  ...SPONSOR_LOGOS,
];

export default function Sponsor() {
  return (
    <section id="sponsors" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-transparent via-[#120b07]/50 to-transparent">
      {/* Decorative ambient background glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 bg-[#F37022]/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 mb-10 sm:mb-14">
        <motion.div {...fadeInUp} className="text-center relative">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_30px_rgba(243,112,34,0.75)] uppercase">
              ĐƠN VỊ ĐỒNG HÀNH
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            Các cơ quan, đối tác chiến lược và nhà tài trợ đồng hành cùng FanG Esports Tournament
          </p>
        </motion.div>
      </div>

      {/* Infinite Horizontal Marquee Carousel */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right gradient fade masks for smooth cinematic fade-in / fade-out */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#0e0906] via-[#0e0906]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#0e0906] via-[#0e0906]/80 to-transparent z-20 pointer-events-none" />

        <div className="animate-sponsor-slide gap-4 sm:gap-6 md:gap-8 px-4">
          {MARQUEE_ITEMS.map((sponsor, idx) => (
            <div
              key={`${sponsor.id}-${idx}`}
              className="flex-shrink-0 group relative cursor-pointer"
              title={sponsor.name}
            >
              {/* Outer Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F37021]/30 via-amber-500/25 to-[#F37021]/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

              {/* Card Container */}
              <div className="relative bg-[#140d08]/85 backdrop-blur-md border border-[#F37021]/20 group-hover:border-[#F37021]/70 px-5 py-3 sm:px-7 sm:py-4 rounded-2xl flex items-center justify-center w-[160px] sm:w-[200px] md:w-[230px] h-20 sm:h-24 md:h-28 shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_25px_rgba(243,112,34,0.35)] transition-all duration-300 transform group-hover:-translate-y-1">
                <img
                  src={sponsor.src}
                  alt={sponsor.alt}
                  loading="lazy"
                  className="max-h-12 sm:max-h-16 md:max-h-18 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] w-auto h-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_16px_rgba(243,112,34,0.5)] group-hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
