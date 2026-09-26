import React from 'react';
import { motion } from 'framer-motion';

import sponsor1 from '../../assets/sponsor/28y7kc7ibn071.jpg';
import sponsor2 from '../../assets/sponsor/FireIconLiked.svg';
import sponsor3 from '../../assets/sponsor/TikTok-Logo-PNG.png';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const SPONSOR_LOGOS = [
  { id: 1, src: sponsor1, alt: 'Sponsor Partner 1' },
  { id: 2, src: sponsor2, alt: 'Sponsor Partner 2' },
  { id: 3, src: sponsor3, alt: 'TikTok Sponsor Partner' },
];

export default function Sponsor() {
  return (
    <section id="sponsors" className="section-padding relative overflow-hidden py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header — Cyber HUD Style */}
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          {/* Ambient Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />

          {/* Main Title with Flanking Cyber Accents */}
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

        {/* Horizontal Sponsor Logos Row */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14"
        >
          {SPONSOR_LOGOS.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              whileHover={{ y: -6, scale: 1.05 }}
              className="relative group cursor-pointer"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#F37021]/30 to-amber-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

              {/* Cyber Frame Container */}
              <div className="relative bg-[#0d0805]/80 border border-[#F37021]/30 group-hover:border-[#F37021] p-4 sm:p-6 rounded-2xl flex items-center justify-center min-w-[140px] sm:min-w-[200px] h-24 sm:h-32 backdrop-blur-md shadow-lg transition-all duration-300">
                <img
                  src={sponsor.src}
                  alt={sponsor.alt}
                  className="max-h-16 sm:max-h-20 max-w-[140px] sm:max-w-[170px] w-auto h-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(243,112,34,0.6)] transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

