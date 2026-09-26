import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Sword, Calendar, MapPin, Trophy, Users, GraduationCap, Zap, Flame, ShieldCheck, Crown, Shield, FileText, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';
import bgImg from '../../assets/background/background.jpg';
import bg2Img from '../../assets/background/background2.jpg';
import bgIntroImg from '../../assets/background/background_introduction.jpg';
import valCharImg from '../../assets/characters/1790303211028_2128295498179361722_6008493916717915729_b145800701edde4b0e01cc80f0b04916.jpg';
import aovCharImg from '../../assets/characters/1790303210993_2128295498179361722_6008493916717915729_18290cb5fa83465d56ac6ad131b783b6.jpg';

const GAMES = [
  {
    name: 'VALORANT',
    icon: <Crosshair className="w-8 h-8" />,
    color: 'from-rose-600 to-red-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/35',
    description: 'FPS chiến thuật 5v5 — Thể hiện kĩ năng bắn súng đỉnh cao và phối hợp đồng đội',
    format: '5v5 · Best of 3',
    bgCharacter: valCharImg,
    objectPos: '70% 35%',
  },
  {
    name: 'AOV',
    icon: <Sword className="w-8 h-8" />,
    color: 'from-[#F37021] to-amber-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-[#F37021]/35',
    description: 'MOBA 5v5 Liên Quân Mobile — Chiến thuật đỉnh cao quyết định ngôi vương',
    format: '5v5 · Best of 3',
    bgCharacter: aovCharImg,
    objectPos: '50% 20%',
  },
];

const TIMELINE = [
  {
    date: '24.09 - 01.10',
    title: 'Kết nối & Trao đổi',
    subtitle: 'Kết nối & trao đổi với BĐH CLB sinh viên',
    icon: <FileText className="w-4 h-4 text-[#F37021]" />,
    active: true,
    bullets: [
      'Gặp gỡ & làm việc cùng Ban Điều Hành các CLB sinh viên',
      'Thống nhất kế hoạch truyền thông & quy chế đăng ký',
    ],
  },
  {
    date: '05.10 - 15.10',
    title: 'Vòng Tuyển Chọn',
    subtitle: 'Vòng tuyển chọn tại trường (VLR & AOV)',
    icon: <Users className="w-4 h-4 text-amber-400" />,
    active: false,
    bullets: [
      'Thi đấu chọn lọc đội tuyển đại diện xuất sắc nhất từng trường',
      'Áp dụng cho 2 bộ môn VALORANT & Liên Quân Mobile',
    ],
  },
  {
    date: '17.10 - 25.10',
    title: 'Vòng Loại Khu Vực',
    subtitle: 'Vòng loại khu vực Nam - Bắc',
    icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
    active: false,
    bullets: [
      'Tranh tài sôi nổi giữa các đại diện trường đại học/cao đẳng',
      'Phân chia 2 cụm thi đấu miền Nam và miền Bắc',
    ],
  },
  {
    date: '01.11 - 08.11',
    title: 'Chung Kết Khu Vực',
    subtitle: 'Chung kết Khu vực miền Nam và miền Bắc',
    icon: <Trophy className="w-4 h-4 text-orange-400" />,
    active: false,
    bullets: [
      'Xác định đội vô địch & á quân từng miền',
      'Giành suất thi đấu Vòng Chung Kết Offline Toàn Quốc',
    ],
  },
  {
    date: '14.11 - 15.11',
    title: 'CK Offline Toàn Quốc',
    subtitle: 'Chung kết Offline Toàn Quốc',
    icon: <Crown className="w-4 h-4 text-amber-300" />,
    active: false,
    bullets: [
      'Đại chiến LAN hoành tráng trực tiếp tại sân khấu',
      'Vinh danh Nhà Vô Địch & trao tổng giải thưởng 80 Triệu',
    ],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function Introduction({ selectedGame, onChangeGame }) {
  return (
    <section 
      id="introduction" 
      className=" pt-5 sm:pt-4 pb-16 md:pb-24 px-4 sm:px-6 relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${bgIntroImg})` }}
    >
      {/* Light dark overlay */}
      <div className="absolute inset-0 bg-[#0e0906]/65 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* ===== TOURNAMENT BRANDING HEADER BANNER (Dynamic Motion & Ambient Effects) ===== */}
        <motion.div {...fadeInUp} className="mb-16">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className=" mt-5 relative w-full rounded-3xl overflow-hidden bg-cover bg-center bg-no-repeat shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_20px_40px_-10px_rgba(243,112,34,0.4)] border border-[#F37022]/40 group"
            style={{ backgroundImage: `url(${bgImg})` }}
          >
            {/* Ambient Animated Orange Radial Glow behind banner */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-[#F37022]/35 rounded-full blur-[90px] pointer-events-none"
            />

            {/* Subtle Overlay confined inside banner */}
            <div className="absolute inset-0 bg-[#0e0906]/55 pointer-events-none" />

            {/* Floating Energy Particles Overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -120, 0],
                    x: [0, (i % 2 === 0 ? 30 : -30), 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.4, 0.8],
                  }}
                  transition={{
                    duration: 4 + i * 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.7,
                  }}
                  style={{
                    left: `${15 + i * 16}%`,
                    top: `${60 + (i % 3) * 10}%`,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#F37022] shadow-[0_0_12px_#F37022]"
                />
              ))}
            </div>

            {/* Banner Inner Content - Compact on mobile */}
            <div className="relative z-10 p-4 sm:p-8 md:p-16 lg:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-16 items-center">
                
                {/* LEFT COLUMN: Motion-Enhanced Logo (Smaller on mobile) */}
                <div className="relative flex justify-center lg:justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, x: -40 }}
                    whileInView={{ scale: 1, opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="relative group cursor-pointer flex justify-center"
                  >
                    {/* Ambient Pulsing Aura Glow Behind Logo */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.45, 0.85, 0.45],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-[#F37022]/50 via-amber-500/50 to-[#F37022]/50 rounded-full blur-[80px] pointer-events-none"
                    />

                    {/* Floating & Breathing Motion Logo — Compact on mobile */}
                    <motion.img
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.05, 1],
                        rotate: [0, 0.5, -0.5, 0],
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      whileHover={{ scale: 1.1, rotate: [-1.5, 1.5, -1.5] }}
                      src={logoImg}
                      alt="FanG Exports Logo"
                      className="relative z-10 max-h-44 sm:max-h-72 md:max-h-[440px] lg:max-h-[500px] ml-0 lg:ml-6 w-auto h-auto object-contain filter drop-shadow-[0_0_35px_rgba(243,112,34,0.9)] group-hover:drop-shadow-[0_0_65px_rgba(243,112,34,1)] transition-all duration-300"
                    />
                  </motion.div>
                </div>

                {/* RIGHT COLUMN: Chamfered Octagon Description Card */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative w-full p-0.5"
                >
                  {/* Outer Cut-Corner Border Frame */}
                  <motion.div 
                    animate={{
                      filter: [
                        'drop-shadow(0 0 25px rgba(243,112,34,0.4))',
                        'drop-shadow(0 0 45px rgba(243,112,34,0.8))',
                        'drop-shadow(0 0 25px rgba(243,112,34,0.4))',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative p-[1.5px] bg-gradient-to-b from-[#F37022] via-[#ff8f3d] to-[#F37022]"
                    style={{
                      clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
                    }}
                  >
                    {/* Gap layer for double line frame */}
                    <div
                      className="p-0.5 bg-[#0e0906]"
                      style={{
                        clipPath: 'polygon(19px 0, calc(100% - 19px) 0, 100% 19px, 100% calc(100% - 19px), calc(100% - 19px) 100%, 19px 100%, 0 calc(100% - 19px), 0 19px)',
                      }}
                    >
                      {/* Inner Cut-Corner Filled Card */}
                      <div 
                        className="relative overflow-hidden bg-gradient-to-b from-[#e04b00] via-[#c43c00] to-[#9e2c00] text-white p-4 sm:p-7 md:p-12 text-left leading-relaxed"
                        style={{
                          clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
                        }}
                      >
                        {/* Shimmer Light Streak Motion */}
                        <motion.div
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                        />

                        <p className="text-xs sm:text-base md:text-xl mb-3 text-white/95 font-medium leading-relaxed">
                          <strong className="text-white font-extrabold">Giải đấu Thể Thao Điện Tử Thế Hệ Số Toàn Quốc 2026</strong> là giải đấu eSports quy mô <strong className="text-white font-black">toàn quốc</strong>, được tổ chức nhằm tạo sân chơi <strong className="text-white font-black">chuyên nghiệp</strong> cho cộng đồng trẻ yêu thích Thể thao điện tử.
                        </p>

                        <p className="text-xs sm:text-base md:text-xl text-white/95 font-medium leading-relaxed">
                          Giải đấu không chỉ là nơi tranh tài để chinh phục ngôi vô địch và những phần thưởng giá trị, mà còn góp phần <strong className="text-white font-black">kết nối cộng đồng</strong>, phát triển <strong className="text-white font-black">phong trào esports</strong> và xây dựng <strong className="text-white font-black">thế hệ tài năng trẻ</strong> cho tương lai của Thể thao điện tử Việt Nam.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Game Cards — Esports Gamer Tech Style */}
        <div className="relative overflow-hidden mb-16 left-1/2 -translate-x-1/2 w-screen px-4 sm:px-8 lg:px-16 pt-4 sm:pt-6 pb-8 sm:pb-10">
          {/* Section Header — Overlaid on Game Cards Background */}
          <motion.div {...fadeInUp} className="relative z-20 text-center mb-6 sm:mb-8 flex flex-col items-center">
            <div className="relative inline-flex items-center gap-3 sm:gap-6 px-6 sm:px-12 py-3 sm:py-4 bg-[#0c0805]/85 backdrop-blur-lg rounded-2xl border border-[#F37022]/50 shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_30px_rgba(243,112,34,0.3)]">
              {/* Left Cyber Accent Line */}
              <div className="hidden sm:flex items-center gap-1.5 opacity-90">
                <div className="w-2 h-2 bg-[#F37022] rotate-45 shadow-[0_0_10px_#F37022]" />
                <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-wider py-1 flex items-center justify-center gap-3 flex-wrap">
                <span className="text-white drop-shadow-[0_3px_12px_rgba(0,0,0,1)]">
                  2 BỘ MÔN
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F37022] via-amber-400 to-orange-400 filter drop-shadow-[0_0_25px_rgba(243,112,34,0.9)]">
                  ESPORTS
                </span>
              </h2>

              {/* Right Cyber Accent Line */}
              <div className="hidden sm:flex items-center gap-1.5 opacity-90">
                <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
                <div className="w-2 h-2 bg-[#F37022] rotate-45 shadow-[0_0_10px_#F37022]" />
              </div>
            </div>
          </motion.div>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={bg2Img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0a0705]/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 grid grid-cols-2 gap-3 sm:gap-7">
          {GAMES.map((game, idx) => (
            <motion.div
              key={game.name}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="relative group cursor-pointer"
            >
              {/* Dynamic Outer Aura Glow on Hover */}
              <div
                className={`absolute -inset-1.5 rounded-3xl bg-gradient-to-r ${game.color} opacity-30 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none`}
              />

              {/* Outer Glowing Border Frame */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 15px ${idx === 0 ? 'rgba(255,70,85,0.35)' : 'rgba(243,112,33,0.35)'}`,
                    `0 0 35px ${idx === 0 ? 'rgba(255,70,85,0.65)' : 'rgba(243,112,33,0.65)'}`,
                    `0 0 15px ${idx === 0 ? 'rgba(255,70,85,0.35)' : 'rgba(243,112,33,0.35)'}`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
                }}
              >
                {/* Gradient Border Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Inner Card — Square on mobile */}
                <div
                  className="relative m-[1.5px] overflow-hidden bg-[#0a0705] flex flex-col aspect-square sm:aspect-auto sm:min-h-[420px] md:min-h-[480px] h-full"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px))',
                  }}
                >
                  {/* Shimmer Light Sweep Effect on Hover */}
                  <motion.div
                    animate={{ x: ['-150%', '250%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none z-20"
                  />

                  {/* Character Image — Full card background */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={game.bgCharacter}
                      alt={game.name}
                      style={{ objectPosition: game.objectPos || 'center center' }}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-115 group-hover:brightness-110"
                    />

                    {/* Floating Energy Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -60, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.8, 1.3, 0.8],
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.8,
                          }}
                          style={{ left: `${25 + i * 30}%`, top: `${40 + i * 15}%` }}
                          className={`absolute w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-rose-400 shadow-[0_0_8px_#ff4655]' : 'bg-[#F37022] shadow-[0_0_8px_#F37022]'}`}
                        />
                      ))}
                    </div>

                    {/* Gradient overlays — stronger at bottom to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-[#0a0705]/60 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-30 transition-opacity duration-500`} />

                    {/* Top-right corner accent */}
                    <div
                      className={`absolute top-0 right-0 w-8 h-8 sm:w-16 sm:h-16 flex items-end justify-start p-1 sm:p-2.5 bg-gradient-to-bl ${game.color} text-white shadow-xl`}
                      style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                    />

                    {/* Animated scan line */}
                    <motion.div
                      animate={{ top: ['-10%', '110%'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10"
                    />
                  </div>

                  {/* Bottom Info Section — overlaid at bottom */}
                  <div className="relative z-10 mt-auto p-2 sm:px-8 sm:pb-8 sm:pt-4 flex flex-col justify-end overflow-hidden">
                    <div>
                      {/* Decorative accent line */}
                      <div className={`w-6 sm:w-12 h-0.5 sm:h-1 rounded-full bg-gradient-to-r ${game.color} mb-1 sm:mb-4 group-hover:w-20 transition-all duration-500 shadow-[0_0_10px_rgba(243,112,34,0.5)]`} />

                      <h3 className="font-heading font-black text-xs sm:text-2xl md:text-3xl text-white mb-0.5 sm:mb-2 tracking-wide uppercase leading-tight truncate group-hover:text-[#F37022] transition-colors duration-300" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {game.name}
                      </h3>
                    </div>

                    {/* Stats badges row */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2.5 mt-auto">
                      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-4 sm:py-2 bg-gradient-to-r ${game.color} text-white text-[9px] sm:text-xs font-black tracking-wider uppercase shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 50%, calc(100% - 5px) 100%, 0 100%, 5px 50%)' }}
                      >
                        {game.format}
                      </div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[9px] sm:text-xs font-bold group-hover:border-[#F37022]/40 transition-colors">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="hidden sm:inline">Đang mở đăng ký</span>
                        <span className="sm:hidden">Đăng ký</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${game.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_rgba(243,112,34,0.8)]`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
          </div>

          {/* Stats Row — Now Positioned Directly on the Background Image */}
          <motion.div
            {...fadeInUp}
            className="relative z-10 max-w-4xl mx-auto mt-6 sm:mt-10 p-1 sm:p-1.5 rounded-2xl bg-gradient-to-r from-orange-500/30 via-amber-500/50 to-orange-500/30 shadow-[0_0_50px_rgba(243,112,34,0.35)]"
          >
            <div
              className="relative bg-[#0d0805]/90 backdrop-blur-md px-2 sm:px-10 py-4 sm:py-8 rounded-[14px] overflow-hidden flex flex-row items-center justify-between gap-1 sm:gap-4 border border-orange-500/40"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              }}
            >
              {/* Background Cyber HUD Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3702110_1px,transparent_1px),linear-gradient(to_bottom,#f3702110_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              {/* Stat 1: Trường ĐH-CĐ */}
              <div className="relative z-10 text-center group flex-1 flex flex-col items-center">
                <div className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-[#F37022] tracking-tight group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 0 20px rgba(243,112,34,0.6)' }}>
                  32
                </div>
                <div className="text-slate-400 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-tighter sm:tracking-widest mt-0.5 sm:mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#F37021]" />
                  Trường ĐH - CĐ
                </div>
              </div>

              {/* Cyber Vertical Divider */}
              <div className="flex flex-col items-center h-10 sm:h-16 justify-between opacity-40">
                <div className="w-1 h-1 bg-[#F37021] rounded-full shadow-[0_0_6px_#F37021]" />
                <div className="w-px h-6 sm:h-10 bg-gradient-to-b from-transparent via-[#F37021] to-transparent" />
                <div className="w-1 h-1 bg-[#F37021] rounded-full shadow-[0_0_6px_#F37021]" />
              </div>

              {/* Stat 2: Đội tuyển */}
              <div className="relative z-10 text-center group flex-1 flex flex-col items-center">
                <div className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-white tracking-tight group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                  64
                </div>
                <div className="text-slate-400 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-tighter sm:tracking-widest mt-0.5 sm:mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white" />
                  Đội tuyển thi đấu
                </div>
              </div>

              {/* Cyber Vertical Divider */}
              <div className="flex flex-col items-center h-10 sm:h-16 justify-between opacity-40">
                <div className="w-1 h-1 bg-[#F37021] rounded-full shadow-[0_0_6px_#F37021]" />
                <div className="w-px h-6 sm:h-10 bg-gradient-to-b from-transparent via-[#F37021] to-transparent" />
                <div className="w-1 h-1 bg-[#F37021] rounded-full shadow-[0_0_6px_#F37021]" />
              </div>

              {/* Stat 3: Giải thưởng */}
              <div className="relative z-10 text-center group flex-1 flex flex-col items-center">
                <div className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 tracking-tight group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                  40 Triệu
                </div>
                <div className="text-slate-400 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-tighter sm:tracking-widest mt-0.5 sm:mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                  Tổng giải thưởng
                </div>
              </div>

              {/* Corner Tech Badges */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#F37021] opacity-70 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#F37021] opacity-70 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Timeline / Roadmap — Gamer Cyber HUD Style (Mobile: Image 2 layout structure + Image 1 colors & cards) */}
        <motion.div {...fadeInUp} className="relative max-w-7xl mx-auto">
          {/* Section Header — Cinematic Cyber HUD Style */}
          <div className="text-center mb-10 sm:mb-14 relative">
            {/* Ambient Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-20 bg-[#F37021]/20 blur-[50px] pointer-events-none rounded-full" />

            {/* Main Big Title with Flanking Lines */}
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-1.5 opacity-70">
                <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
                <div className="w-12 sm:w-20 md:w-28 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_35px_rgba(243,112,34,0.8)]">
                LỘ TRÌNH CHÍNH THỨC
              </h2>

              <div className="hidden sm:flex items-center gap-1.5 opacity-70">
                <div className="w-12 sm:w-20 md:w-28 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
                <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              </div>
            </div>
          </div>

          {/* ===== MOBILE TIMELINE LAYOUT (lg:hidden) — IMAGE 2 STRUCTURE WITH IMAGE 1 STYLING ===== */}
          <div className="block lg:hidden relative px-2 sm:px-4 mb-8">
            {/* Vertical Glowing Rail Line */}
            <div className="absolute top-4 bottom-4 left-[96px] xs:left-[112px] sm:left-[132px] w-0.5 bg-gradient-to-b from-[#F37021] via-amber-400 to-[#F37021] shadow-[0_0_12px_#F37021] z-0" />

            <div className="space-y-6 sm:space-y-8 relative z-10">
              {TIMELINE.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 relative group"
                >
                  {/* Left: Date Badge */}
                  <div className="w-[88px] xs:w-[104px] sm:w-[120px] flex-shrink-0 flex justify-end items-center">
                    <div
                      className="px-2 py-1 xs:px-2.5 xs:py-1.5 text-[9px] xs:text-[10px] sm:text-xs font-black tracking-wider uppercase bg-gradient-to-r from-[#F37021] via-amber-500 to-[#F37021] text-white shadow-[0_0_15px_rgba(243,112,34,0.7)] border border-amber-300 text-center whitespace-nowrap"
                      style={{
                        clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0 50%)',
                      }}
                    >
                      {item.date}
                    </div>
                  </div>

                  {/* Center: Icon Node on Vertical Line */}
                  <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
                    <div
                      className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        item.active
                          ? 'bg-gradient-to-br from-[#F37021] via-amber-500 to-orange-600 text-white shadow-[0_0_25px_rgba(243,112,34,1)] ring-4 ring-[#F37021]/40'
                          : 'bg-[#1f140c] text-amber-400 border-2 border-[#F37021] shadow-[0_0_15px_rgba(243,112,34,0.4)] group-hover:bg-[#F37021] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(243,112,34,0.8)]'
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Right: Card */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="relative p-[1.5px] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(243,112,34,0.6)]"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                      }}
                    >
                      {/* Outer Frame Border */}
                      <div 
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          item.active
                            ? 'bg-gradient-to-b from-[#F37021] via-amber-400 to-[#F37021] opacity-100'
                            : 'bg-gradient-to-b from-[#F37021] via-amber-500/50 to-[#F37021]/60 opacity-80 group-hover:opacity-100 group-hover:from-amber-400'
                        }`}
                      />

                      {/* Inner Card Frame */}
                      <div
                        className="relative p-3 xs:p-3.5 sm:p-4 bg-[#180f09]/95 backdrop-blur-md h-full flex flex-col justify-between text-left"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))',
                        }}
                      >
                        <div>
                          <div className="text-[10px] xs:text-xs uppercase font-black text-amber-400 tracking-wider mb-0.5 flex items-center gap-1">
                            <span className="text-[#F37021] font-bold">❖</span>
                            {item.title}
                          </div>
                          <h4 className="font-heading font-extrabold text-xs xs:text-sm sm:text-base text-white leading-snug group-hover:text-amber-300 transition-colors drop-shadow-sm">
                            {item.subtitle}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== DESKTOP TIMELINE LAYOUT (hidden lg:block) ===== */}
          <div className="hidden lg:block relative pb-8">
            {/* Horizontal Connecting Rail Line spanning full width (desktop) */}
            <div className="absolute top-[52px] left-[8%] right-[8%] h-[3px] bg-gradient-to-r from-orange-500/20 via-[#F37021] to-orange-500/20 z-0">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#F37021]"
              />
            </div>

            {/* Grid layout for 5 timeline nodes */}
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {TIMELINE.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative flex flex-col items-center group cursor-pointer"
                >
                  {/* 1. TOP DATE BADGE (Image 1 style Hexagon / Cut-Corner) */}
                  <div
                    className="relative z-10 px-4 py-1.5 mb-3 transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-[#F37021] via-amber-500 to-[#F37021] text-white font-black shadow-[0_0_20px_rgba(243,112,34,0.8)] border border-amber-300"
                    style={{
                      clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
                    }}
                  >
                    <span className="text-xs sm:text-sm tracking-wider uppercase filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {item.date}
                    </span>
                  </div>

                  {/* 2. NODE ICON BADGE (Sitting directly on the horizontal line) */}
                  <div className="relative mb-4 flex items-center justify-center">
                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        item.active
                          ? 'bg-gradient-to-br from-[#F37021] via-amber-500 to-orange-600 text-white shadow-[0_0_25px_rgba(243,112,34,1)] ring-4 ring-[#F37021]/40'
                          : 'bg-[#1f140c] text-amber-400 border-2 border-[#F37021] shadow-[0_0_15px_rgba(243,112,34,0.4)] group-hover:bg-[#F37021] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(243,112,34,0.8)]'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Small vertical connector line from icon to card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-[#F37021] to-transparent opacity-80" />
                  </div>

                  {/* 3. VERTICAL HUD CARD (Image 1 double-line cut-corner framed card) */}
                  <div 
                    className="relative w-full p-[1.5px] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(243,112,34,0.6)]"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                    }}
                  >
                    {/* Outer Frame Border */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        item.active
                          ? 'bg-gradient-to-b from-[#F37021] via-amber-400 to-[#F37021] opacity-100'
                          : 'bg-gradient-to-b from-[#F37021] via-amber-500/50 to-[#F37021]/60 opacity-80 group-hover:opacity-100 group-hover:from-amber-400'
                      }`}
                    />

                    {/* Inner Card Frame */}
                    <div
                      className="relative p-4 bg-[#180f09]/95 backdrop-blur-md h-full flex flex-col justify-between text-left"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
                      }}
                    >
                      <div>
                        <div className="text-xs uppercase font-black text-amber-400 tracking-wider mb-1 flex items-center gap-1">
                          <span className="text-[#F37021] font-bold">❖</span>
                          {item.title}
                        </div>
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-white leading-snug group-hover:text-amber-300 transition-colors drop-shadow-sm">
                          {item.subtitle}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
