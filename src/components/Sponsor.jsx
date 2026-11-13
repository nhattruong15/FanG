import React from 'react';
import { motion } from 'framer-motion';

import logoTheDucTheThao from '../assets/sponsor/logo cục thể dục thể thao option 2.png';
import logoAnNinhMang from '../assets/sponsor/Cục an ninh mạng.png';
import logoFanG from '../assets/sponsor/_0000_FanG.png';
import logoFptPlay from '../assets/sponsor/Cam-doc.png';
import logoSamsung from '../assets/sponsor/_0004_Samsung-Odyssey.png';
import logoGarena from '../assets/sponsor/garena-logo.png';
import logoVngGames from '../assets/sponsor/_0003_VMGGames.png';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const SPONSOR_GROUPS = [
  {
    id: 'bao-tro',
    index: '1',
    title: 'Đơn Vị Bảo Trợ',
    logos: [
      {
        id: 'the-duc-the-thao',
        name: 'Cục Thể Dục Thể Thao',
        src: logoTheDucTheThao,
        alt: 'Logo Cục Thể Dục Thể Thao Việt Nam',
      },
    ],
  },
  {
    id: 'dao-tao',
    index: '2',
    title: 'Đơn Vị Đào Tạo Hội Thảo Chuyên Đề',
    logos: [
      {
        id: 'an-ninh-mang',
        name: 'Cục An Ninh Mạng',
        src: logoAnNinhMang,
        alt: 'Logo Cục An Ninh Mạng A05',
      },
    ],
  },
  {
    id: 'to-chuc',
    index: '3',
    title: 'Đơn Vị Tổ Chức',
    logos: [
      {
        id: 'fpt-play',
        name: 'FPT Play',
        src: logoFptPlay,
        alt: 'Logo FPT Play',
      },
      {
        id: 'fang',
        name: 'FanG',
        src: logoFanG,
        alt: 'Logo FanG Esports',
      },
    ],
  },
  {
    id: 'dong-hanh',
    index: '4',
    title: 'Đối Tác Đồng Hành Chính Thức',
    logos: [
      {
        id: 'samsung-odyssey',
        name: 'Samsung Odyssey',
        src: logoSamsung,
        alt: 'Logo Samsung Odyssey',
      },
      {
        id: 'garena',
        name: 'Garena',
        src: logoGarena,
        alt: 'Logo Garena',
      },
      {
        id: 'vng-games',
        name: 'VNG Games',
        src: logoVngGames,
        alt: 'Logo VNG Games',
      },
    ],
  },
];

function GroupHeader({ index, title }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
      <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
      <div className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#F37022]/70" />
      <h3 className="font-heading font-black text-sm sm:text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-300 uppercase tracking-widest text-center px-1">
        {index}. {title}
      </h3>
      <div className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#F37022]/70" />
      <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
    </div>
  );
}

function LogoItem({ logo }) {
  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 group/logo"
      title={logo.name}
    >
      <div className="h-16 sm:h-20 md:h-24 w-auto flex items-center justify-center">
        <img
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          className="max-h-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] object-contain opacity-90 group-hover/logo:opacity-100 filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] group-hover/logo:drop-shadow-[0_0_24px_rgba(243,112,34,0.7)] transition-all duration-300"
        />
      </div>
      <span className="mt-3 text-xs sm:text-sm font-semibold text-slate-300 group-hover/logo:text-[#F37022] transition-colors text-center tracking-wide">
        {logo.name}
      </span>
    </div>
  );
}

export default function Sponsor() {
  const [group1, group2, group3, group4] = SPONSOR_GROUPS;

  return (
    <section id="sponsors" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-transparent via-[#120b07]/50 to-transparent">
      {/* Decorative ambient background glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-64 bg-[#F37022]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <motion.div {...fadeInUp} className="text-center relative mb-12 sm:mb-16">
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

        </motion.div>

        {/* 4 Hierarchical Groups without borders */}
        <motion.div {...fadeInUp} className="space-y-12 sm:space-y-16">
          {/* Row 1: Nhóm 1 (Đơn vị bảo trợ) & Nhóm 2 (Đơn vị đào tạo hội thảo chuyên đề) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
            {/* Nhóm 1 */}
            <div className="flex flex-col items-center">
              <GroupHeader index={group1.index} title={group1.title} />
              <div className="flex items-center justify-center">
                {group1.logos.map((logo) => (
                  <LogoItem key={logo.id} logo={logo} />
                ))}
              </div>
            </div>

            {/* Nhóm 2 */}
            <div className="flex flex-col items-center">
              <GroupHeader index={group2.index} title={group2.title} />
              <div className="flex items-center justify-center">
                {group2.logos.map((logo) => (
                  <LogoItem key={logo.id} logo={logo} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Nhóm 3 (Đơn vị tổ chức: FPT Play, FanG) */}
          <div className="flex flex-col items-center">
            <GroupHeader index={group3.index} title={group3.title} />
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-24 w-full">
              {group3.logos.map((logo) => (
                <LogoItem key={logo.id} logo={logo} />
              ))}
            </div>
          </div>

          {/* Row 3: Nhóm 4 (Đối tác đồng hành chính thức: Samsung Odyssey, Garena, VNG Games) */}
          <div className="flex flex-col items-center">
            <GroupHeader index={group4.index} title={group4.title} />
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 w-full">
              {group4.logos.map((logo) => (
                <LogoItem key={logo.id} logo={logo} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
