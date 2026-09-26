import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, CalendarDays, Clock, MapPin, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import bracketBg from '../../assets/background/background_32team.png';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

/* ====================================================================
   DATA: 16 đội Miền Nam (trái) + 16 đội Miền Bắc (phải)
   – Dễ dàng thay đổi tên đội, tỷ số, trạng thái, winner
   ==================================================================== */
const BRACKET_DATA = {
  nam: {
    label: 'MIỀN NAM',
    round16: [
      { id: 'NL1', team1: 'ĐH FPT TP.HCM', team2: 'ĐH Tôn Đức Thắng', score1: 2, score2: 0, winner: 1 },
      { id: 'NL2', team1: 'ĐH Bách Khoa HCM', team2: 'ĐH Khoa Học TN', score1: 2, score2: 1, winner: 1 },
      { id: 'NL3', team1: 'ĐH Công Nghệ SG', team2: 'ĐH Sư Phạm KT', score1: 2, score2: 0, winner: 1 },
      { id: 'NL4', team1: 'ĐH Kinh Tế HCM', team2: 'ĐH Mở TP.HCM', score1: 1, score2: 2, winner: 2 },
      { id: 'NR5', team1: 'ĐH Nông Lâm HCM', team2: 'ĐH Văn Lang', score1: 2, score2: 1, winner: 1 },
      { id: 'NR6', team1: 'ĐH Hoa Sen', team2: 'ĐH HUTECH', score1: 0, score2: 2, winner: 2 },
      { id: 'NR7', team1: 'ĐH Sài Gòn', team2: 'ĐH Nguyễn Tất Thành', score1: 2, score2: 0, winner: 1 },
      { id: 'NR8', team1: 'ĐH Quốc Tế Hồng Bàng', team2: 'ĐH Công Nghiệp HCM', score1: 1, score2: 2, winner: 2 },
    ],
    quarterFinals: [
      { id: 'NQ1', team1: 'ĐH FPT TP.HCM', team2: 'ĐH Bách Khoa HCM', score1: 2, score2: 1, winner: 1 },
      { id: 'NQ2', team1: 'ĐH Công Nghệ SG', team2: 'ĐH Mở TP.HCM', score1: 2, score2: 0, winner: 1 },
      { id: 'NQ3', team1: 'ĐH Nông Lâm HCM', team2: 'ĐH HUTECH', score1: 0, score2: 2, winner: 2 },
      { id: 'NQ4', team1: 'ĐH Sài Gòn', team2: 'ĐH Công Nghiệp HCM', score1: 2, score2: 1, winner: 1 },
    ],
    semiFinals: [
      { id: 'NS1', team1: 'ĐH FPT TP.HCM', team2: 'ĐH Công Nghệ SG', score1: 3, score2: 2, winner: 1 },
      { id: 'NS2', team1: 'ĐH HUTECH', team2: 'ĐH Sài Gòn', score1: 3, score2: 1, winner: 1 },
    ],
    final: { id: 'NF', team1: 'ĐH FPT TP.HCM', team2: 'ĐH HUTECH', score1: null, score2: null, winner: null, date: '20/10 - 17:00' },
    thirdPlace: { id: 'N3P', team1: 'ĐH Công Nghệ SG', team2: 'ĐH Sài Gòn', score1: 2, score2: 0, winner: 1, date: '19/10 - 16:00' },
  },
  bac: {
    label: 'MIỀN BẮC',
    round16: [
      { id: 'BL1', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Bách Khoa HN', score1: 2, score2: 0, winner: 1 },
      { id: 'BL2', team1: 'ĐH Kinh Tế QD', team2: 'ĐH Quốc Gia HN', score1: 2, score2: 1, winner: 1 },
      { id: 'BL3', team1: 'ĐH Công Nghệ GTVT', team2: 'ĐH Hà Nội', score1: 0, score2: 2, winner: 2 },
      { id: 'BL4', team1: 'Học Viện Bưu Chính', team2: 'ĐH Điện Lực', score1: 2, score2: 1, winner: 1 },
      { id: 'BR5', team1: 'ĐH Xây Dựng HN', team2: 'ĐH GTVT', score1: 2, score2: 0, winner: 1 },
      { id: 'BR6', team1: 'ĐH Thương Mại', team2: 'ĐH Thủy Lợi', score1: 1, score2: 2, winner: 2 },
      { id: 'BR7', team1: 'ĐH Sư Phạm HN', team2: 'ĐH Mỏ Địa Chất', score1: 2, score2: 0, winner: 1 },
      { id: 'BR8', team1: 'ĐH Mở Hà Nội', team2: 'ĐH Công Nghiệp HN', score1: 0, score2: 2, winner: 2 },
    ],
    quarterFinals: [
      { id: 'BQ1', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Kinh Tế QD', score1: 2, score2: 0, winner: 1 },
      { id: 'BQ2', team1: 'ĐH Hà Nội', team2: 'Học Viện Bưu Chính', score1: 1, score2: 2, winner: 2 },
      { id: 'BQ3', team1: 'ĐH Xây Dựng HN', team2: 'ĐH Thủy Lợi', score1: 2, score2: 1, winner: 1 },
      { id: 'BQ4', team1: 'ĐH Sư Phạm HN', team2: 'ĐH Công Nghiệp HN', score1: 0, score2: 2, winner: 2 },
    ],
    semiFinals: [
      { id: 'BS1', team1: 'ĐH FPT Hà Nội', team2: 'Học Viện Bưu Chính', score1: 3, score2: 1, winner: 1 },
      { id: 'BS2', team1: 'ĐH Xây Dựng HN', team2: 'ĐH Công Nghiệp HN', score1: 2, score2: 3, winner: 2 },
    ],
    final: { id: 'BF', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Công Nghiệp HN', score1: null, score2: null, winner: null, date: '20/10 - 15:00' },
    thirdPlace: { id: 'B3P', team1: 'Học Viện Bưu Chính', team2: 'ĐH Xây Dựng HN', score1: 2, score2: 1, winner: 1, date: '19/10 - 14:00' },
  },
};

const MOCK_SCHEDULE = [
  { date: '05/10/2026', time: '14:00', branch: 'Miền Bắc', round: 'Vòng 1/16', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Bách Khoa HN', venue: 'Online' },
  { date: '05/10/2026', time: '16:00', branch: 'Miền Bắc', round: 'Vòng 1/16', team1: 'ĐH Kinh Tế QD', team2: 'ĐH Quốc Gia HN', venue: 'Online' },
  { date: '06/10/2026', time: '14:00', branch: 'Miền Nam', round: 'Vòng 1/16', team1: 'ĐH FPT TP.HCM', team2: 'ĐH Tôn Đức Thắng', venue: 'Online' },
  { date: '12/10/2026', time: '14:00', branch: 'Miền Bắc', round: 'Bán kết', team1: 'ĐH FPT Hà Nội', team2: 'Học Viện Bưu Chính', venue: 'Online' },
  { date: '19/10/2026', time: '14:00', branch: 'Miền Bắc', round: 'Tranh hạng 3', team1: 'Học Viện Bưu Chính', team2: 'ĐH Xây Dựng HN', venue: 'Offline - HN' },
  { date: '20/10/2026', time: '15:00', branch: 'Chung kết', round: 'Grand Final', team1: 'TBD', team2: 'TBD', venue: 'Offline Hà Nội / HCM' },
];

/* ====================================================================
   Reusable: MatchRow — compact team-vs-team row
   ==================================================================== */
const MatchRow = ({ match }) => {
  if (!match) return null;
  const t1Win = match.winner === 1;
  const t2Win = match.winner === 2;
  const upcoming = match.winner == null;

  return (
    <div className={`rounded-lg border text-[11px] sm:text-xs overflow-hidden transition-all ${
      upcoming
        ? 'border-[#F37022]/40 bg-[#F37022]/5'
        : 'border-[#F37022]/15 bg-[#0e0906]/80'
    }`}>
      {/* Team 1 */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 gap-1 ${
        t1Win ? 'bg-[#F37022]/20 text-white font-bold' : t2Win ? 'text-slate-500' : 'text-slate-300'
      }`}>
        <span className="truncate">{match.team1 || 'TBD'}</span>
        <span className={`font-heading font-black text-xs min-w-[18px] text-center ${
          t1Win ? 'text-[#F37022]' : 'text-slate-500'
        }`}>{match.score1 ?? '-'}</span>
      </div>
      <div className="border-t border-orange-900/30" />
      {/* Team 2 */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 gap-1 ${
        t2Win ? 'bg-[#F37022]/20 text-white font-bold' : t1Win ? 'text-slate-500' : 'text-slate-300'
      }`}>
        <span className="truncate">{match.team2 || 'TBD'}</span>
        <span className={`font-heading font-black text-xs min-w-[18px] text-center ${
          t2Win ? 'text-[#F37022]' : 'text-slate-500'
        }`}>{match.score2 ?? '-'}</span>
      </div>
    </div>
  );
};

/* ====================================================================
   RoundAccordion — a collapsible round section for mobile
   ==================================================================== */
const RoundAccordion = ({ title, matches, color = '#F37022', defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all"
        style={{
          borderColor: `${color}33`,
          background: open ? `${color}15` : 'rgba(255,255,255,0.03)',
        }}
      >
        <span className="font-heading font-black text-xs uppercase tracking-wider" style={{ color }}>
          {title} ({matches.length} trận)
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4" style={{ color }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color }} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pt-2">
              {matches.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ====================================================================
   FinalCard — highlighted finals card (Chung kết / Tranh hạng 3)
   ==================================================================== */
const FinalCard = ({ title, match, trophy = false }) => {
  if (!match) return null;
  const upcoming = match.winner == null;

  return (
    <div className={`rounded-xl border p-3 backdrop-blur-sm ${
      trophy
        ? 'bg-gradient-to-b from-[#F37022]/15 via-[#1e130d] to-[#0e0906] border-[#F37022] shadow-[0_0_15px_rgba(243,112,34,0.25)]'
        : 'bg-[#0e0906]/80 border-[#F37022]/25'
    }`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        {trophy && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
        <span className="font-heading font-black text-[10px] sm:text-xs tracking-widest uppercase text-white">
          {title}
        </span>
        {trophy && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
      </div>
      {match.date && (
        <div className="text-center text-[10px] text-amber-400 font-bold mb-2 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" /> {match.date}
        </div>
      )}
      <MatchRow match={match} />
    </div>
  );
};

/* ====================================================================
   RegionBracketPanel — one side of the bracket (mobile: stacked rounds)
   ==================================================================== */
const RegionBracketPanel = ({ data }) => {
  return (
    <div className="flex-1 min-w-0">
      {/* Region Header */}
      <div className="text-center mb-3 sm:mb-4">
        <span className="inline-block font-heading font-black text-sm sm:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F37022] via-amber-400 to-[#F37022] uppercase">
          {data.label}
        </span>
        <div className="mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#F37022] to-transparent mt-1" />
      </div>

      {/* Rounds — Accordion on mobile, always open on desktop */}
      <RoundAccordion title="Vòng 1/16" matches={data.round16} color="#F37022" defaultOpen={false} />
      <RoundAccordion title="Tứ Kết" matches={data.quarterFinals} color="#f59e0b" defaultOpen={false} />
      <RoundAccordion title="Bán Kết" matches={data.semiFinals} color="#f43f5e" defaultOpen={true} />

      {/* Finals */}
      <div className="mt-3 space-y-2">
        <FinalCard title={`CHUNG KẾT ${data.label}`} match={data.final} trophy />
        <FinalCard title="TRANH HẠNG 3" match={data.thirdPlace} />
      </div>
    </div>
  );
};

/* ====================================================================
   Main Bracket Component
   ==================================================================== */
export default function Bracket({ selectedGame }) {
  const [viewMode, setViewMode] = useState('bracket');

  return (
    <section id="bracket" className="section-padding relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bracketBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0906] via-transparent to-[#0e0906]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header — Cyber HUD */}
        <motion.div {...fadeInUp} className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_30px_rgba(243,112,34,0.75)] uppercase">
              SƠ ĐỒ NHÁNH & LỊCH ĐẤU
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div {...fadeInUp} className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 rounded-2xl p-1.5 border border-[#F37022]/20">
            <button
              onClick={() => setViewMode('bracket')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                viewMode === 'bracket'
                  ? 'bg-[#F37022] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Sơ Đồ 16 Đội
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                viewMode === 'schedule'
                  ? 'bg-[#F37022] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Lịch Thi Đấu
            </button>
          </div>
        </motion.div>

        {viewMode === 'bracket' ? (
          <motion.div {...fadeInUp}>
            {/* Two-Panel Bracket: Nam (left) — Bắc (right) */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Miền Nam — Left */}
              <RegionBracketPanel data={BRACKET_DATA.nam} />

              {/* Center Divider (desktop only) */}
              <div className="hidden lg:flex flex-col items-center justify-center px-2">
                <div className="w-0.5 flex-1 bg-gradient-to-b from-transparent via-[#F37022] to-transparent opacity-40" />
                <div className="my-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#F37022] to-amber-600 flex items-center justify-center font-black text-white text-xs shadow-[0_0_25px_#F37022] border-2 border-white/20">
                  VS
                </div>
                <div className="w-0.5 flex-1 bg-gradient-to-b from-transparent via-[#F37022] to-transparent opacity-40" />
              </div>

              {/* Mobile Divider */}
              <div className="lg:hidden flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F37022] to-transparent opacity-40" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F37022] to-amber-600 flex items-center justify-center font-black text-white text-[10px] shadow-[0_0_15px_#F37022] border border-white/20">
                  VS
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F37022] to-transparent opacity-40" />
              </div>

              {/* Miền Bắc — Right */}
              <RegionBracketPanel data={BRACKET_DATA.bac} />
            </div>
          </motion.div>
        ) : (
          /* Schedule View */
          <motion.div {...fadeInUp} className="space-y-3">
            {MOCK_SCHEDULE.map((match, idx) => (
              <div
                key={idx}
                className="bg-glass rounded-2xl p-4 border-glow flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:min-w-[140px]">
                  <div className="flex items-center gap-1.5 text-sm">
                    <CalendarDays className="w-4 h-4 text-[#F37022]" />
                    <span className="text-slate-200 font-bold">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300 font-medium">{match.time}</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F37022]/15 text-[#F37022] text-xs font-bold border border-[#F37022]/30">
                    {match.branch}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 text-xs font-medium">{match.round}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm truncate max-w-[130px]">{match.team1}</span>
                  <span className="text-xs text-[#F37022] font-black">VS</span>
                  <span className="text-white font-bold text-sm truncate max-w-[130px]">{match.team2}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 sm:min-w-[80px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {match.venue}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
