import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, ArrowRight, Users, Swords, Trophy, Crown, Sparkles, Zap, Radio, Activity } from 'lucide-react';
import { subscribeRulesLinks, INITIAL_RULES_LINKS } from '../config/firebase';

const fadeInUp = {};

const AOV_STEPS = [
  {
    step: '1',
    code: 'STG-01',
    label: 'Vòng Loại Trường',
    tag: null,
    icon: <Users className="w-5 h-5" />,
    details: [
      '32 trường tự tổ chức vòng loại',
      '1 Team AOV / trường',
      'Tổng cộng: 32 đội tranh tài',
    ],
  },
  {
    step: '2',
    code: 'STG-02',
    label: 'Vòng Loại Miền',
    tag: 'ONLINE',
    icon: <Swords className="w-5 h-5" />,
    details: [
      'Miền Bắc: 16 Team — Miền Nam: 16 Team',
      'Giai đoạn 1: 16 → 8 đội / miền (BO3)',
      'Giai đoạn 2: 8 → 4 → 2 đội / miền (BO3)',
    ],
  },
  {
    step: '3',
    code: 'STG-03',
    label: 'Chung Kết Miền',
    tag: 'OFFLINE',
    icon: <Shield className="w-5 h-5" />,
    details: [
      'Chung kết miền: 2 → 1 đội / miền (BO5)',
      'Mỗi miền chọn một đại diện',
      'Vào Chung kết Toàn quốc',
    ],
  },
  {
    step: '4',
    code: 'STG-04',
    label: 'Chung Kết Toàn Quốc',
    tag: 'OFFLINE',
    icon: <Crown className="w-5 h-5" />,
    details: [
      '1 Team Miền Bắc VS 1 Team Miền Nam',
      'Thi đấu BO7 — Tìm ra Nhà Vô Địch',
    ],
  },
];

const VLR_STEPS = [
  {
    step: '1',
    code: 'STG-01',
    label: 'Vòng Loại Trường',
    tag: null,
    icon: <Users className="w-5 h-5" />,
    details: [
      '32 trường tự tổ chức vòng loại',
      '1 Team VALORANT / trường',
      'Tổng cộng: 32 đội tranh tài',
    ],
  },
  {
    step: '2',
    code: 'STG-02',
    label: 'Vòng Loại Miền',
    tag: 'ONLINE',
    icon: <Swords className="w-5 h-5" />,
    details: [
      'Miền Bắc: 16 Team — Miền Nam: 16 Team',
      'Giai đoạn 1: 16 → 8 đội / miền (BO1)',
      'Giai đoạn 2: 8 → 4 → 2 đội / miền (BO1)',
    ],
  },
  {
    step: '3',
    code: 'STG-03',
    label: 'Chung Kết Miền',
    tag: 'OFFLINE',
    icon: <Shield className="w-5 h-5" />,
    details: [
      'Chung kết miền: 2 → 1 đội / miền (BO3)',
      'Mỗi miền chọn một đại diện',
      'Vào Chung kết Toàn quốc',
    ],
  },
  {
    step: '4',
    code: 'STG-04',
    label: 'Chung Kết Toàn Quốc',
    tag: 'OFFLINE',
    icon: <Crown className="w-5 h-5" />,
    details: [
      '1 Team Miền Bắc VS 1 Team Miền Nam',
      'Thi đấu BO5 — Tìm ra Nhà Vô Địch',
    ],
  },
];

function GameFlowColumn({ steps, gameName, gameColor, detailLink, isValorant }) {
  const accentColor = isValorant ? '#FF4655' : '#F37022';
  const accentGlow = isValorant ? 'rgba(255,70,85,0.6)' : 'rgba(243,112,34,0.6)';

  return (
    <div className="w-full">
      {/* Outer Futuristic Cyber HUD Container */}
      <div className="relative group/hud rounded-3xl p-[2px] transition-all duration-500">
        {/* Animated Electric Ambient Glow */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-35 group-hover/hud:opacity-70 transition-opacity duration-700 blur-2xl pointer-events-none"
          style={{
            background: isValorant
              ? 'linear-gradient(135deg, rgba(255,70,85,0.35), rgba(255,100,120,0.1), rgba(255,70,85,0.35))'
              : 'linear-gradient(135deg, rgba(243,112,34,0.4), rgba(251,191,36,0.15), rgba(243,112,34,0.4))'
          }}
        />

        {/* Outer Electric Cyber Frame */}
        <div className="relative rounded-3xl p-5 sm:p-7 lg:p-9 bg-gradient-to-b from-[#180e08]/95 via-[#0f0906]/98 to-[#080402]/98 backdrop-blur-xl border-2 border-[#F37022]/40 shadow-[0_0_50px_rgba(243,112,34,0.18)] overflow-hidden">

          {/* Subtle Cyber Grid Matrix Background */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${accentColor} 1px, transparent 1px), linear-gradient(to bottom, ${accentColor} 1px, transparent 1px)`,
              backgroundSize: '28px 28px'
            }}
          />

          {/* Top High-Voltage Electric Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-transparent overflow-hidden">
            <div
              className="w-56 h-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_18px_#F37022]"
              style={{ animation: 'electric-conduit 4.5s linear infinite' }}
            />
          </div>

          {/* Bottom High-Voltage Electric Beam */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-transparent overflow-hidden">
            <div
              className="w-56 h-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_18px_#F37022]"
              style={{ animation: 'electric-conduit 4.5s linear infinite reverse' }}
            />
          </div>

          {/* Tech HUD Corner Accents */}
          {/* Top-Left */}
          <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none opacity-80">
            <span className="w-3 h-[2px] bg-[#F37022] shadow-[0_0_6px_#F37022]" />
            <span className="text-[10px] font-mono text-[#F37022] font-black">[+]</span>
          </div>
          {/* Top-Right */}
          <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none opacity-80">
            <span className="text-[10px] font-mono text-amber-400 font-bold tracking-widest hidden sm:inline">CIRCUIT // 04 STAGES</span>
            <span className="w-3 h-[2px] bg-[#F37022] shadow-[0_0_6px_#F37022]" />
          </div>
          {/* Bottom-Left */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 pointer-events-none opacity-60">
            <span className="w-2.5 h-[2px] bg-[#F37022]" />
            <span className="text-[9px] font-mono text-slate-500">FANG//FORMAT</span>
          </div>
          {/* Bottom-Right */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 pointer-events-none opacity-60">
            <span className="text-[9px] font-mono text-slate-500 tracking-wider">PWR: HIGH-VOLTAGE</span>
            <span className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_6px_#F37022]" />
          </div>

          {/* HUD Telemetry Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-7 border-b border-[#F37022]/20 relative z-10">
            {/* Left Status Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400">

              <span className="text-slate-400 text-[11px] hidden md:inline">LỘ TRÌNH 4 GIAI ĐOẠN</span>
            </div>

            {/* Center Game Pill */}
            <div
              className={`inline-flex items-center justify-center gap-2 py-2 px-8 border ${gameColor.border} ${gameColor.bg} shadow-[0_0_20px_rgba(243,112,34,0.3)] backdrop-blur-sm`}
              style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)' }}
            >
              <span className={`font-heading font-black text-xs sm:text-sm uppercase tracking-widest ${gameColor.text}`}>
                {gameName}
              </span>
            </div>

            {/* Right Telemetry Progress */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 hidden sm:inline text-[11px]">TIẾN TRÌNH:</span>
              <span className="font-bold text-amber-300 text-[11px]">STAGE 01 → 04</span>
              <div className="flex gap-1 ml-1">
                <span className="w-2 h-2.5 bg-[#F37022] shadow-[0_0_6px_#F37022]" />
                <span className="w-2 h-2.5 bg-[#F37022] shadow-[0_0_6px_#F37022]" />
                <span className="w-2 h-2.5 bg-[#F37022] shadow-[0_0_6px_#F37022]" />
                <span className="w-2 h-2.5 bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Steps Grid with Electric High-Voltage Conduit */}
          <div className="relative z-10">
            {/* Desktop High-Voltage Conduit Bus Line */}
            <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#F37022]/20 via-[#F37022] to-[#F37022]/20 z-0 pointer-events-none rounded-full">
              <div className="absolute inset-0 bg-[#F37022]/40 blur-xs" />
              {/* Traveling Plasma Bolt */}
              <div
                className="w-32 h-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_16px_#F37022]"
                style={{ animation: 'electric-conduit 4s linear infinite' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative group flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
                >
                  {/* Electric Glow Aura on Hover */}
                  <div
                    className="absolute -inset-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur-lg pointer-events-none"
                    style={{
                      background: isValorant
                        ? 'radial-gradient(circle, rgba(255,70,85,0.65) 0%, transparent 75%)'
                        : 'radial-gradient(circle, rgba(243,112,34,0.7) 0%, transparent 75%)'
                    }}
                  />

                  {/* Outer Chamfered Electric Border Wrapper (p-[2px] creates the razor-sharp glowing angled border) */}
                  <div
                    className="relative p-[2px] h-full flex flex-col transition-all duration-300"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                      background: isValorant
                        ? 'linear-gradient(135deg, #FF4655 0%, rgba(255,70,85,0.4) 40%, rgba(255,100,120,0.2) 60%, #FF4655 100%)'
                        : 'linear-gradient(135deg, #F37022 0%, rgba(251,191,36,0.9) 35%, rgba(243,112,34,0.3) 65%, #F37022 100%)'
                    }}
                  >
                    {/* Inner Card Container with identical clip-path */}
                    <div
                      className="relative p-5 text-center transition-all duration-300 h-full flex flex-col bg-gradient-to-b from-[#1c1109]/98 via-[#130b06]/98 to-[#0a0503]/98 backdrop-blur-md overflow-hidden"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                      }}
                    >
                      {/* Subtle Electric Circuit Texture Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${accentColor} 1px, transparent 1px)`,
                          backgroundSize: '16px 16px'
                        }}
                      />

                      {/* Top Cyber Corner Bracket ┌ */}
                      <div className="absolute top-0 left-0 w-8 h-[2px] bg-gradient-to-r from-amber-300 to-[#F37022] shadow-[0_0_6px_#F37022]" />
                      <div className="absolute top-0 left-0 w-[2px] h-8 bg-gradient-to-b from-amber-300 to-[#F37022] shadow-[0_0_6px_#F37022]" />

                      {/* Top-Right Chamfer Cut Accent */}
                      <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-amber-400/40 via-[#F37022]/20 to-transparent pointer-events-none" />

                      {/* Bottom Cyber Corner Bracket ┘ */}
                      <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-gradient-to-l from-amber-300 to-[#F37022] shadow-[0_0_6px_#F37022]" />
                      <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-gradient-to-t from-amber-300 to-[#F37022] shadow-[0_0_6px_#F37022]" />

                      {/* Header Row: Stage Code, Number Hexagon & Tag */}
                      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          {/* Hexagonal Stage Number with Electric Pulse */}
                          <div
                            className="w-10 h-10 bg-gradient-to-br from-[#F37022] via-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(243,112,34,0.8)] border border-amber-200/50 group-hover:scale-110 transition-transform duration-300"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                          >
                            {step.step}
                          </div>

                          {/* Tech Stage Code */}
                          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                            {step.code}
                          </span>
                        </div>

                        {/* Tag Pill with Electric Border */}
                        {step.tag === 'ONLINE' ? (
                          <span className="px-2.5 py-1 bg-cyan-950/70 border border-cyan-400/70 text-cyan-300 text-[10px] font-black uppercase tracking-widest skew-x-[-8deg] shadow-[0_0_12px_rgba(6,182,212,0.45)]">
                            <span className="skew-x-[8deg] inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                              {step.tag}
                            </span>
                          </span>
                        ) : step.tag === 'OFFLINE' ? (
                          <span className="px-2.5 py-1 bg-orange-950/70 border border-[#F37022] text-amber-300 text-[10px] font-black uppercase tracking-widest skew-x-[-8deg] shadow-[0_0_12px_rgba(243,112,34,0.5)]">
                            <span className="skew-x-[8deg] inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                              {step.tag}
                            </span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-600/60 text-slate-200 text-[10px] font-bold uppercase tracking-widest skew-x-[-8deg]">
                            <span className="skew-x-[8deg] inline-block">VÒNG 1</span>
                          </span>
                        )}
                      </div>

                      {/* Stage Label */}
                      <div className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-300 text-base sm:text-lg uppercase tracking-wider mb-4 min-h-12 flex items-center justify-center text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] relative z-10">
                        {step.label}
                      </div>

                      {/* Details List with Electric Bullet Points */}
                      <div className="pt-4 border-t border-[#F37022]/30 space-y-2.5 text-left flex-1 flex flex-col justify-start relative z-10">
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors">
                            <span className="mt-1 w-1.5 h-1.5 bg-gradient-to-r from-amber-300 to-[#F37022] rotate-45 shrink-0 shadow-[0_0_8px_#F37022]" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Arrow Connector between steps (desktop) */}
                      {idx < steps.length - 1 && (
                        <div className="hidden lg:flex absolute -right-3.5 top-[68px] -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-[#160c07] border-2 border-[#F37022] items-center justify-center text-amber-300 shadow-[0_0_16px_rgba(243,112,34,0.8)] group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Electric Detail Link CTA Button */}
          <div className="flex justify-center mt-9 sm:mt-11 relative z-10">
            <a
              href={detailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-widest text-amber-200 bg-gradient-to-r from-[#F37022]/20 via-[#F37022]/35 to-[#F37022]/20 border-2 border-[#F37022] hover:border-amber-300 hover:text-white transition-all duration-300 shadow-[0_0_25px_rgba(243,112,34,0.4)] hover:shadow-[0_0_45px_rgba(243,112,34,0.85)] hover:-translate-y-0.5 overflow-hidden"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              {/* Electric light sweep effect on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              />
              <Zap className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_10px_#F37022]" />
              <span>Chi tiết thể thức giải đấu</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 text-[#F37022] group-hover:text-amber-300" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Rules({ selectedGame }) {
  const isValorant = selectedGame === 'valorant';
  const steps = isValorant ? VLR_STEPS : AOV_STEPS;
  const gameColor = isValorant
    ? { border: 'border-rose-500/60', bg: 'bg-rose-500/15', text: 'text-rose-300' }
    : { border: 'border-[#F37022]/60', bg: 'bg-[#F37022]/15', text: 'text-amber-300' };
  const gameName = isValorant ? 'VALORANT' : 'Arena of Valor';

  const [rulesLinks, setRulesLinks] = useState(INITIAL_RULES_LINKS);

  useEffect(() => {
    const unsub = subscribeRulesLinks((data) => {
      if (data) setRulesLinks(data);
    });
    return () => unsub();
  }, []);

  const detailLink = isValorant
    ? (rulesLinks.valorant || '#')
    : (rulesLinks.aov || '#');

  return (
    <section id="rules" className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section title */}
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />
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

        {/* Single-game format — horizontal */}
        <motion.div {...fadeInUp} className="mb-14 relative">
          <GameFlowColumn
            steps={steps}
            gameName={gameName}
            gameColor={gameColor}
            detailLink={detailLink}
            isValorant={isValorant}
          />
        </motion.div>

        {/* Prize section */}
        <motion.div {...fadeInUp} className="mt-16 sm:mt-20">
          <div className="text-center mb-10 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />
            <h3 className="font-heading font-black text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 py-1 drop-shadow-[0_0_25px_rgba(243,112,34,0.75)]">
              CƠ CẤU GIẢI THƯỞNG <span className="text-[#F37022]"></span>
            </h3>
          </div>

          <div className="space-y-5">
            {/* Champion Card with Chamfered Electric Border */}
            <div
              className="max-w-2xl mx-auto relative group hover:-translate-y-1.5 transition-transform duration-300"
            >
              <div
                className="absolute -inset-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(243,112,34,0.75) 0%, transparent 75%)'
                }}
              />
              <div
                className="relative p-[2px] transition-all duration-300"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))',
                  background: 'linear-gradient(135deg, #F37022 0%, #fbbf24 35%, rgba(243,112,34,0.4) 65%, #F37022 100%)'
                }}
              >
                <div
                  className="relative p-6 sm:p-8 text-center backdrop-blur-md bg-gradient-to-b from-[#281409]/98 via-[#1a0f08]/98 to-[#120a05]/98 overflow-hidden"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))' }}
                >
                  <div className="absolute top-0 left-0 w-12 h-[3px] bg-gradient-to-r from-[#F37022] to-transparent shadow-[0_0_8px_#F37022]" />
                  <div className="absolute top-0 left-0 w-[3px] h-12 bg-gradient-to-b from-[#F37022] to-transparent shadow-[0_0_8px_#F37022]" />
                  <div className="absolute bottom-0 right-0 w-12 h-[3px] bg-gradient-to-l from-[#F37022] to-transparent shadow-[0_0_8px_#F37022]" />
                  <div className="absolute bottom-0 right-0 w-[3px] h-12 bg-gradient-to-t from-[#F37022] to-transparent shadow-[0_0_8px_#F37022]" />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                  <div
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 via-[#F37022] to-amber-500 text-white font-black text-xs uppercase tracking-widest mb-5 shadow-[0_0_25px_rgba(243,112,34,0.8)] border border-amber-400/60"
                    style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)' }}
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-200" />
                    <span>TOP 1 — GIẢI VÔ ĐỊCH</span>
                  </div>

                  <div className="font-heading font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 drop-shadow-[0_0_20px_rgba(243,112,34,0.9)] tracking-tight mb-1">
                    15.000.000 VNĐ
                  </div>
                  <div className="font-heading font-bold text-slate-200 text-base sm:text-lg uppercase tracking-[0.2em] mb-5">
                    NHÀ VÔ ĐỊCH TOÀN QUỐC
                  </div>

                  <div className="pt-4 border-t border-[#F37022]/30 text-xs sm:text-sm text-slate-300 font-medium flex items-center justify-center gap-2 flex-wrap">
                    {['+ Quà vật phẩm'].map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-[#F37022]/20 border border-[#F37022]/50 text-[#F37022] font-bold text-xs skew-x-[-4deg]">
                        <span className="skew-x-[4deg] inline-block">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Runner-up & 3rd place with Electric Chamfered Borders */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-4 max-w-5xl mx-auto">
              {[
                { rank: '', label: 'TOP 2 — Á QUÂN', amount: '7.000.000đ', sub: 'Quà vật phẩm', borderColor: 'border-slate-400/50', bgColor: 'bg-[#10121a]/95', glowColor: 'shadow-[0_0_25px_rgba(148,163,184,0.2)]', amountGradient: 'from-slate-100 via-slate-200 to-slate-400', accentColor: '#94a3b8', badgeBg: 'bg-slate-800/90 border-slate-400/50 text-slate-200', borderGrad: 'linear-gradient(135deg, #94a3b8 0%, rgba(148,163,184,0.3) 50%, #94a3b8 100%)' },
                { rank: '', label: 'TOP 3 — ĐỒNG HẠNG', amount: '3.000.000đ', sub: 'Quà vật phẩm', borderColor: 'border-amber-600/50', bgColor: 'bg-[#15110a]/95', glowColor: 'shadow-[0_0_25px_rgba(217,119,6,0.2)]', amountGradient: 'from-amber-300 via-amber-400 to-amber-600', accentColor: '#d97706', badgeBg: 'bg-amber-950/80 border-amber-600/50 text-amber-400', borderGrad: 'linear-gradient(135deg, #d97706 0%, rgba(217,119,6,0.3) 50%, #d97706 100%)' },
                { rank: '', label: 'TOP 3 — ĐỒNG HẠNG', amount: '3.000.000đ', sub: 'Quà vật phẩm', borderColor: 'border-amber-600/50', bgColor: 'bg-[#15110a]/95', glowColor: 'shadow-[0_0_25px_rgba(217,119,6,0.2)]', amountGradient: 'from-amber-300 via-amber-400 to-amber-600', accentColor: '#d97706', badgeBg: 'bg-amber-950/80 border-amber-600/50 text-amber-400', borderGrad: 'linear-gradient(135deg, #d97706 0%, rgba(217,119,6,0.3) 50%, #d97706 100%)' },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="group hover:-translate-y-1 transition-transform duration-200"
                >
                  <div
                    className="p-[1.5px] h-full"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                      background: card.borderGrad
                    }}
                  >
                    <div
                      className={`relative p-2 sm:p-5 text-center backdrop-blur-sm ${card.bgColor} ${card.glowColor} hover:shadow-[0_0_35px_rgba(243,112,34,0.2)] transition-all h-full flex flex-col justify-between overflow-hidden`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
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
                  </div>
                </div>
              ))}
            </div>

            {/* FMVP Card */}
            <div
              className="max-w-3xl mx-auto group hover:-translate-y-1 transition-transform duration-200"
            >
              <div
                className="p-[1.5px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                  background: 'linear-gradient(135deg, #F37022 0%, rgba(251,191,36,0.5) 50%, #F37022 100%)'
                }}
              >
                <div
                  className="relative p-3 sm:p-5 backdrop-blur-sm bg-[#180e08]/95 shadow-[0_0_30px_rgba(243,112,34,0.2)] flex flex-row items-center justify-between gap-2 sm:gap-4 overflow-hidden"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
                >
                  <div className="absolute top-0 left-0 w-6 sm:w-8 h-[2px] bg-[#F37022]" />
                  <div className="absolute top-0 left-0 w-[2px] h-6 sm:h-8 bg-[#F37022]" />
                  <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-[2px] bg-[#F37022]" />
                  <div className="absolute bottom-0 right-0 w-[2px] h-6 sm:h-8 bg-[#F37022]" />

                  <div className="flex items-center gap-2 text-left">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-heading font-black text-white text-xs sm:text-lg uppercase tracking-wide">
                        FMVP — TUYỂN THỦ XUẤT SẮC NHẤT
                      </div>
                    </div>
                  </div>

                  <div className="text-right border-l border-white/10 pl-3 sm:pl-5 shrink-0">
                    <div className="font-heading font-black text-sm sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400">
                      2.000.000đ
                    </div>
                    <div className="text-[9px] sm:text-[11px] text-slate-400 font-medium">
                      Quà vật phẩm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes electric-conduit {
          0% { transform: translateX(-100%); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateX(350%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
