import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, ArrowRight, Users, Zap, Swords, Trophy, Crown, MapPin, Sparkles } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const FLOW_STEPS = [
  {
    step: '1',
    label: 'Vòng Loại Trường',
    tag: null,
    icon: <Users className="w-5 h-5" />,
    details: [
      '32 trường tự tổ chức vòng loại',
      '1 Team AOV / trường',
      'Tổng cộng: 32 đội',
    ],
  },
  {
    step: '2',
    label: 'Vòng Loại Miền',
    tag: 'ONLINE',
    icon: <Swords className="w-5 h-5" />,
    details: [
      '16 Team(Bắc) — 16 Team (Nam)',
      'Tuần 1: 16 → 8 đội (AOV BO3)',
      'Tuần 2: 8 → 4 đội (AOV BO5)',
    ],
  },
  {
    step: '3',
    label: 'Chung Kết Miền',
    tag: 'OFFLINE',
    icon: <Shield className="w-5 h-5" />,
    details: [
      'Mỗi miền: 4 Team AOV',
      'Chọn 1 đại diện / Team',
      'Vào Chung kết Toàn quốc',
    ],
  },
  {
    step: '4',
    label: 'CK Toàn Quốc',
    tag: 'OFFLINE',
    icon: <Crown className="w-5 h-5" />,
    details: [
      '1 Team Miền Bắc VS 1 Team Miền Nam',
      'Tìm ra Nhà Vô Địch Toàn Quốc',
    ],
  },
];

const PRIZES = [
  {
    place: 'QUÁN QUÂN',
    rankBadge: '👑 CHAMPION',
    amount: '30.000.000đ',
    icon: <Crown className="w-8 h-8 text-amber-300" />,
    badgeBg: 'bg-gradient-to-r from-amber-500 via-[#F37022] to-amber-500 text-white font-black shadow-[0_0_15px_rgba(243,112,34,0.8)]',
    cardBorder: 'border-2 border-[#F37022] shadow-[0_0_35px_rgba(243,112,34,0.45)] bg-[#1a0f08]/90',
    amountColor: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_15px_rgba(243,112,34,0.8)]',
    subText: 'Cúp vô địch + Huy chương Vàng',
    isFeatured: true,
  },
  {
    place: 'Á QUÂN',
    rankBadge: ' 2ND PLACE',
    amount: '15.000.000đ',
    icon: <Trophy className="w-7 h-7 text-slate-200" />,
    badgeBg: 'bg-slate-700/90 border border-slate-400/60 text-slate-200 font-bold',
    cardBorder: 'border border-slate-500/50 shadow-[0_0_20px_rgba(226,232,240,0.2)] bg-[#121318]/90',
    amountColor: 'text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]',
    subText: 'Huy chương Bạc + Chứng nhận',
    isFeatured: false,
  },
  {
    place: 'HẠNG 3–4',
    rankBadge: '🥉 3RD & 4TH',
    amount: '8.000.000đ',
    icon: <Award className="w-7 h-7 text-amber-500" />,
    badgeBg: 'bg-amber-950/90 border border-amber-600/60 text-amber-400 font-bold',
    cardBorder: 'border border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.2)] bg-[#16110a]/90',
    amountColor: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    subText: '4.000.000đ / mỗi đội tuyển',
    isFeatured: false,
  },
  {
    place: 'GIẢI PHỤ',
    rankBadge: '⭐ SPECIAL',
    amount: '19.000.000đ',
    icon: <Sparkles className="w-7 h-7 text-orange-400" />,
    badgeBg: 'bg-orange-950/90 border border-orange-500/60 text-orange-400 font-bold',
    cardBorder: 'border border-orange-500/50 shadow-[0_0_20px_rgba(243,112,34,0.25)] bg-[#180e08]/90',
    amountColor: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 drop-shadow-[0_0_10px_rgba(243,112,34,0.5)]',
    subText: 'MVP & Giải khuyến khích',
    isFeatured: false,
  },
];

export default function Rules() {
  return (
    <section id="rules" className="section-padding relative bg-gradient-to-b from-transparent via-[#1e130d]/70 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Cyber HUD Style */}
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          {/* Ambient Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />

          {/* Main Title with Flanking Cyber Accents */}
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_30px_rgba(243,112,34,0.75)]">
              THỂ THỨC GIẢI ĐẤU
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
        </motion.div>

        {/* Tournament Flow — Connected Cyber Roadmap Timeline */}
        <motion.div {...fadeInUp} className="mb-14 relative">
          {/* Connected Laser Conduit Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#F37022]/20 via-[#F37022] to-[#F37022]/20 z-0 pointer-events-none">
            <motion.div
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-full bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#F37022]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch relative z-10">
            {FLOW_STEPS.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.12 }}
                  whileHover={{ y: -8 }}
                  className="relative group flex flex-col h-full"
                >
                  {/* Outer Glowing Energy Border Container */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-[#F37022]/40 via-transparent to-[#F37022]/20 opacity-40 group-hover:opacity-100 transition-opacity blur-xs pointer-events-none" />

                  {/* Cyber HUD Angled Card */}
                  <div
                    className="relative p-5 text-center transition-all duration-300 h-full flex flex-col justify-between flex-1 bg-gradient-to-b from-[#1a100a]/90 via-[#120a06]/90 to-[#0a0503]/95 backdrop-blur-xl border border-[#F37022]/35 group-hover:border-[#F37022] group-hover:shadow-[0_0_35px_rgba(243,112,34,0.3)] overflow-hidden"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}
                  >
                    {/* Top Cyber Corner Flare */}
                    <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-[#F37022]/60 to-transparent opacity-80" />
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#F37022]" />
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#F37022]" />
                    <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#F37022]" />
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#F37022]" />

                    {/* Top Section Header */}
                    <div>
                      {/* Step Hexagon Badge & Icon Tag Row */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-10 h-10 bg-gradient-to-br from-[#F37022] via-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(243,112,34,0.7)] border border-amber-300/40 group-hover:scale-110 transition-transform duration-300"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                          >
                            {step.step}
                          </div>
                         
                        </div>

                        {step.tag ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-600/30 to-[#F37022]/30 border border-[#F37022]/60 text-amber-300 text-[10px] font-black uppercase tracking-widest skew-x-[-8deg] shadow-[0_0_10px_rgba(243,112,34,0.4)]">
                            <span className="skew-x-[8deg] inline-block">{step.tag}</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-800/60 border border-slate-600/40 text-slate-300 text-[10px] font-bold uppercase tracking-widest skew-x-[-8deg]">
                            <span className="skew-x-[8deg] inline-block">VÒNG 1</span>
                          </span>
                        )}
                      </div>

                      {/* Card Title */}
                      <div className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-300 text-base sm:text-lg uppercase tracking-wider mb-4 min-h-12 flex items-center justify-center text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {step.label}
                      </div>
                    </div>

                    {/* Detail Bullets */}
                    <div className="pt-4 border-t border-[#F37022]/25 space-y-2.5 text-left flex-1 flex flex-col justify-start">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium leading-relaxed">
                          <span className="mt-1 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-[#F37022] rotate-45 shrink-0 shadow-[0_0_6px_#F37022]" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow Connector Indicator for Next Step */}
                    {idx < FLOW_STEPS.length - 1 && (
                      <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 rounded-full bg-[#1e110a] border border-[#F37022] items-center justify-center text-[#F37022] shadow-[0_0_12px_#F37022]">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Prize Structure — Sharp Esports Pyramid */}
        <motion.div {...fadeInUp} className="mt-16 sm:mt-20">
          {/* Header */}
          <div className="text-center mb-10 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />

           

            <h3 className="font-heading font-black text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 py-1 drop-shadow-[0_0_25px_rgba(243,112,34,0.75)]">
             CƠ CẤU GIẢI THƯỞNG <span className="text-[#F37022]"></span>
            </h3>
          </div>

          {/* Pyramid Container */}
          <div className="space-y-5">

            {/* ════════ TIER 1: CHAMPION ══════════ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div
                className="relative p-6 sm:p-8 text-center backdrop-blur-md border-2 border-[#F37022] bg-gradient-to-b from-[#281409]/95 via-[#1a0f08]/95 to-[#120a05]/95 shadow-[0_0_50px_rgba(243,112,34,0.5)] overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))' }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-12 h-[3px] bg-gradient-to-r from-[#F37022] to-transparent" />
                <div className="absolute top-0 left-0 w-[3px] h-12 bg-gradient-to-b from-[#F37022] to-transparent" />
                <div className="absolute bottom-0 right-0 w-12 h-[3px] bg-gradient-to-l from-[#F37022] to-transparent" />
                <div className="absolute bottom-0 right-0 w-[3px] h-12 bg-gradient-to-t from-[#F37022] to-transparent" />

                {/* Gold Halo */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Peak Badge */}
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 via-[#F37022] to-amber-500 text-white font-black text-xs uppercase tracking-widest mb-5 shadow-[0_0_25px_rgba(243,112,34,0.8)] border border-amber-400/60"
                  style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)' }}
                >
                  <span>TOP 1 — GIẢI QUÁN QUÂN</span>
                </div>

                {/* Crown Icon */}
               

                {/* Champion Amount */}
                <div className="font-heading font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 drop-shadow-[0_0_20px_rgba(243,112,34,0.9)] tracking-tight mb-1">
                  10.000.000 VNĐ
                </div>
                <div className="font-heading font-bold text-slate-200 text-base sm:text-lg uppercase tracking-[0.2em] mb-5">
                  NHÀ VÔ ĐỊCH TOÀN QUỐC
                </div>

                {/* Sub Details */}
                <div className="pt-4 border-t border-[#F37022]/30 text-xs sm:text-sm text-slate-300 font-medium flex items-center justify-center gap-2 flex-wrap">
                  {['+ Quà vật phẩm'].map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-[#F37022]/20 border border-[#F37022]/50 text-[#F37022] font-bold text-xs skew-x-[-4deg]">
                      <span className="skew-x-[4deg] inline-block">{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ══════════ TIER 2: 3 RUNNER-UP CARDS (Strict 3-Column Row on Mobile & Desktop) ═══════════ */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-4 max-w-5xl mx-auto">
              {[
                { rank: '', label: 'TOP 2 — Á QUÂN', amount: '5.000.000đ', sub: 'Quà vật phẩm',  borderColor: 'border-slate-400/50', bgColor: 'bg-[#10121a]/90', glowColor: 'shadow-[0_0_25px_rgba(148,163,184,0.2)]', iconColor: 'text-slate-200', amountGradient: 'from-slate-100 via-slate-200 to-slate-400', accentColor: '#94a3b8', badgeBg: 'bg-slate-800/90 border-slate-400/50 text-slate-200' },
                { rank: '', label: 'TOP 3 — ĐỒNG HẠNG 3', amount: '2.000.000đ', sub: 'Quà vật phẩm', icon: <Award className="w-4 h-4 sm:w-7 sm:h-7" />, borderColor: 'border-amber-600/50', bgColor: 'bg-[#15110a]/90', glowColor: 'shadow-[0_0_25px_rgba(217,119,6,0.2)]', iconColor: 'text-amber-500', amountGradient: 'from-amber-300 via-amber-400 to-amber-600', accentColor: '#d97706', badgeBg: 'bg-amber-950/80 border-amber-600/50 text-amber-400' },
                { rank: '', label: 'TOP 3 — ĐỒNG HẠNG 3', amount: '2.000.000đ', sub: 'Quà vật phẩm', icon: <Award className="w-4 h-4 sm:w-7 sm:h-7" />, borderColor: 'border-amber-600/50', bgColor: 'bg-[#15110a]/90', glowColor: 'shadow-[0_0_25px_rgba(217,119,6,0.2)]', iconColor: 'text-amber-500', amountGradient: 'from-amber-300 via-amber-400 to-amber-600', accentColor: '#d97706', badgeBg: 'bg-amber-950/80 border-amber-600/50 text-amber-400' },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div
                    className={`relative p-2 sm:p-5 text-center backdrop-blur-md border ${card.borderColor} ${card.bgColor} ${card.glowColor} hover:shadow-[0_0_35px_rgba(243,112,34,0.2)] transition-all h-full flex flex-col justify-between overflow-hidden`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                  >
                    {/* Corner Lines */}
                    <div className="absolute top-0 left-0 w-3 sm:w-6 h-[2px]" style={{ background: card.accentColor }} />
                    <div className="absolute top-0 left-0 w-[2px] h-3 sm:h-6" style={{ background: card.accentColor }} />
                    <div className="absolute bottom-0 right-0 w-3 sm:w-6 h-[2px]" style={{ background: card.accentColor }} />
                    <div className="absolute bottom-0 right-0 w-[2px] h-3 sm:h-6" style={{ background: card.accentColor }} />

                    <div>
                      <span className={`inline-block px-1 sm:px-3 py-0.5 sm:py-1 border font-black text-[8px] sm:text-xs tracking-tight sm:tracking-wider mb-1.5 sm:mb-3 skew-x-[-6deg] max-w-full truncate ${card.badgeBg}`}>
                        <span className="skew-x-[6deg] inline-block">{card.label}</span>
                      </span>

                      

                      <div className={`font-heading font-black text-xs xs:text-sm sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r ${card.amountGradient} my-0.5 sm:my-1`}>
                        {card.amount}
                      </div>
                    </div>

                    <div className="pt-1.5 sm:pt-3 border-t border-white/10 text-[8px] sm:text-xs text-slate-400 font-medium mt-1 sm:mt-2">
                      {card.sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ════════ TIER 3: SPECIAL AWARDS BAR (Bottom Row) ═══════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="max-w-3xl mx-auto group"
            >
              <div
                className="relative p-3 sm:p-5 backdrop-blur-md border border-orange-500/50 bg-[#180e08]/90 shadow-[0_0_30px_rgba(243,112,34,0.2)] flex flex-row items-center justify-between gap-2 sm:gap-4 overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-6 sm:w-8 h-[2px] bg-[#F37022]" />
                <div className="absolute top-0 left-0 w-[2px] h-6 sm:h-8 bg-[#F37022]" />
                <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-[2px] bg-[#F37022]" />
                <div className="absolute bottom-0 right-0 w-[2px] h-6 sm:h-8 bg-[#F37022]" />

                <div className="flex items-center gap-2 text-left">
                  <div>
                    <div className="font-heading font-black text-white text-xs sm:text-lg uppercase tracking-wide">
                      FMVP
                    </div>
                  </div>
                </div>

                <div className="text-right border-l border-white/10 pl-3 sm:pl-5 shrink-0">
                  <div className="font-heading font-black text-sm sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400">
                    1.000.000đ
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 font-medium">
                    Quà vật phẩm
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

