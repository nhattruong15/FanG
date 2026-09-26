import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, School, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_TEAMS = [
  { school: 'ĐH FPT Hà Nội', region: 'bac', game: 'Valorant', players: ['Kiên TT', 'Dũng NH', 'Tùng PV', 'Bình HS', 'Lâm QT', 'Khoa DM'] },
  { school: 'ĐH FPT Hà Nội', region: 'bac', game: 'AOV', players: ['Sơn ĐN', 'Hiếu LT', 'Trung VH', 'Đạt NQ', 'Hải PM', 'Cường TT'] },
  { school: 'ĐH FPT TP.HCM', region: 'nam', game: 'Valorant', players: ['Alex TN', 'Brian LP', 'Chris HV', 'David NM', 'Eric TA', 'Frank PH'] },
  { school: 'ĐH FPT TP.HCM', region: 'nam', game: 'AOV', players: ['Gary VT', 'Henry DQ', 'Ivan NK', 'Jack MT', 'Ken LH', 'Leo PC'] },
  { school: 'ĐH Bách Khoa HN', region: 'bac', game: 'Valorant', players: ['Minh PL', 'Hoàng VT', 'Đức TN', 'Hùng NM', 'Long ĐV', 'Tuấn AK'] },
  { school: 'ĐH Bách Khoa HN', region: 'bac', game: 'AOV', players: ['Nam DT', 'Quang HN', 'Thắng LM', 'Việt NP', 'Khải TC', 'Phong BQ'] },
  { school: 'ĐH Tôn Đức Thắng', region: 'nam', game: 'Valorant', players: ['An NV', 'Bảo TH', 'Cường LM', 'Duy PQ', 'Em TN', 'Phát HV'] },
  { school: 'ĐH Tôn Đức Thắng', region: 'nam', game: 'AOV', players: ['Gia BN', 'Hào TV', 'Khanh DL', 'Linh PN', 'Minh TQ', 'Ngọc HM'] },
  { school: 'ĐH Kinh Tế QD', region: 'bac', game: 'Valorant', players: ['Tú NM', 'Nguyên PH', 'Trường LQ', 'Thành NV', 'Vinh ĐT', 'Anh KN'] },
  { school: 'ĐH Kinh Tế QD', region: 'bac', game: 'AOV', players: ['Hưng TM', 'Quân VP', 'Sỹ NL', 'Tài HĐ', 'Uy TV', 'Vũ PQ'] },
  { school: 'ĐH Công Nghệ SG', region: 'nam', game: 'Valorant', players: ['Bình NQ', 'Châu LM', 'Đại TV', 'Giang PH', 'Hòa NM', 'Kha TV'] },
  { school: 'ĐH Công Nghệ SG', region: 'nam', game: 'AOV', players: ['Lam PQ', 'Nghĩa TH', 'Phúc NV', 'Quý LĐ', 'Sang TM', 'Thịnh HN'] },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function TeamList({ selectedGame }) {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [gameFilter, setGameFilter] = useState(() => {
    if (selectedGame === 'valorant') return 'Valorant';
    if (selectedGame === 'aov') return 'AOV';
    return 'all';
  });
  const [expandedTeam, setExpandedTeam] = useState(null);

  const filteredTeams = MOCK_TEAMS.filter((team) => {
    const matchSearch = team.school.toLowerCase().includes(search.toLowerCase()) ||
      team.players.some(p => p.toLowerCase().includes(search.toLowerCase()));
    const matchRegion = regionFilter === 'all' || team.region === regionFilter;
    const matchGame = gameFilter === 'all' || team.game === gameFilter;
    return matchSearch && matchRegion && matchGame;
  });

  const schoolGroups = {};
  filteredTeams.forEach(team => {
    if (!schoolGroups[team.school]) schoolGroups[team.school] = [];
    schoolGroups[team.school].push(team);
  });

  return (
    <section id="teams" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
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
              ĐỘI TUYỂN & TRƯỜNG ĐẠI HỌC
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F37021]" />
            <input
              type="text"
              placeholder="Tìm tên trường hoặc tên tuyển thủ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-[#F37021] focus:outline-none focus:ring-1 focus:ring-[#F37021]/40 transition-all"
            />
          </div>

          {/* Region Filter */}
          <div className="flex gap-1.5">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'bac', label: 'Miền Bắc' },
              { value: 'nam', label: 'Miền Nam' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRegionFilter(opt.value)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  regionFilter === opt.value
                    ? 'bg-[#F37021] text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(schoolGroups).map(([school, teams], idx) => (
            <motion.div
              key={school}
              {...fadeInUp}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-glass rounded-2xl overflow-hidden border-glow"
            >
              {/* School Header */}
              <button
                onClick={() => setExpandedTeam(expandedTeam === school ? null : school)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                 
                  <div className="text-left">
                    <div className="font-bold text-white text-sm sm:text-base">{school}</div>
                    <div className="text-xs text-slate-400">
                      {teams.map(t => t.game).join(' & ')} · {teams[0].region === 'bac' ? 'Miền Bắc' : 'Miền Nam'}
                    </div>
                  </div>
                </div>
                {expandedTeam === school ? (
                  <ChevronUp className="w-4 h-4 text-[#F37021]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Expanded Roster */}
              {expandedTeam === school && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800/60">
                  {teams.map((team, tIdx) => (
                    <div key={tIdx} className="mt-3">
                      <div className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold mb-2 ${
                        team.game === 'Valorant' ? 'bg-rose-500/15 text-rose-400' : 'bg-[#F37021]/15 text-[#F37021]'
                      }`}>
                        {team.game}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {team.players.map((player, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300">
                            <Users className="w-3 h-3 text-[#F37021] flex-shrink-0" />
                            <span className="truncate font-medium">{player}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Không tìm thấy đội nào phù hợp
          </div>
        )}
      </div>
    </section>
  );
}
