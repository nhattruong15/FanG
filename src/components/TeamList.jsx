import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { subscribeTeams, INITIAL_TEAMS } from '../config/firebase';

const TEAMS_PER_PAGE = 4;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function TeamList({ selectedGame = 'valorant' }) {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsub = subscribeTeams((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTeams(data);
      }
    });
    return () => unsub();
  }, []);

  const activeGame = selectedGame
    ? (selectedGame.toLowerCase() === 'valorant' ? 'Valorant' : selectedGame.toLowerCase() === 'aov' ? 'AOV' : selectedGame)
    : 'Valorant';

  const filteredTeams = teams.filter((team) => {
    const matchGame = !activeGame || team.game.toLowerCase() === activeGame.toLowerCase();

    const teamRegionLower = (team.region || '').toLowerCase();
    const matchRegion =
      regionFilter === 'all' ||
      (regionFilter === 'bac' && (teamRegionLower.includes('bắc') || teamRegionLower === 'bac')) ||
      (regionFilter === 'nam' && (teamRegionLower.includes('nam') || teamRegionLower === 'nam'));

    const searchLower = search.toLowerCase();
    const membersArray = team.membersList
      ? team.membersList.map(m => typeof m === 'object' ? m.name : m)
      : (team.players || []);
    const matchSearch =
      !search ||
      (team.school && team.school.toLowerCase().includes(searchLower)) ||
      (team.name && team.name.toLowerCase().includes(searchLower)) ||
      membersArray.some(p => p && p.toLowerCase().includes(searchLower));

    return matchGame && matchRegion && matchSearch;
  });

  const schoolGroups = {};
  filteredTeams.forEach((team) => {
    const schoolName = team.school || team.name;
    if (!schoolGroups[schoolName]) schoolGroups[schoolName] = [];
    schoolGroups[schoolName].push(team);
  });

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, regionFilter, selectedGame]);

  // Pagination logic
  const allSchoolEntries = Object.entries(schoolGroups);
  const totalPages = Math.max(1, Math.ceil(allSchoolEntries.length / TEAMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * TEAMS_PER_PAGE;
  const paginatedEntries = allSchoolEntries.slice(startIdx, startIdx + TEAMS_PER_PAGE);

  return (
    <section id="teams" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />

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

        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-8">
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

          <div className="flex gap-1.5">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'bac', label: 'Miền Bắc' },
              { value: 'nam', label: 'Miền Nam' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRegionFilter(opt.value)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${regionFilter === opt.value
                  ? 'bg-[#F37021] text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-slate-800'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedEntries.map(([school, teamList], idx) => (
            <motion.div
              key={school}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-glass rounded-2xl overflow-hidden border-glow"
            >
              <button
                onClick={() => setExpandedTeam(expandedTeam === school ? null : school)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {teamList[0]?.logo ? (
                    <img src={teamList[0].logo} alt={school} className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0 shadow-md" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#F37021]/20 text-[#F37021] font-black text-sm flex items-center justify-center border border-[#F37021]/30 shrink-0 uppercase">
                      {school ? school.charAt(0) : 'T'}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-bold text-white text-sm sm:text-base">{school}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className={`font-bold ${activeGame === 'Valorant' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {activeGame}
                      </span>
                      <span>·</span>
                      <span>
                        {teamList[0]?.region?.toLowerCase().includes('bắc') || teamList[0]?.region === 'bac'
                          ? 'Miền Bắc'
                          : 'Miền Nam'}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedTeam === school ? (
                  <ChevronUp className="w-4 h-4 text-[#F37021]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {expandedTeam === school && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800/60">
                  {teamList.map((tItem, tIdx) => {
                    const members = tItem.membersList || (tItem.players || []).map((p, i) => ({
                      id: i + 1,
                      name: p,
                      role: i === 0 ? 'Đội trưởng' : i === 5 ? 'Dự bị' : 'Thành viên',
                      ingame: `Player_${i + 1}`
                    }));

                    return (
                      <div key={tIdx} className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">

                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${tItem.game === 'Valorant' ? 'bg-rose-500/15 text-rose-400' : 'bg-[#F37021]/15 text-[#F37021]'
                                }`}
                            >
                              Tên đội: {tItem.name || tItem.game}
                            </span>
                          </div>

                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {members.map((mObj, mIdx) => {
                            const name = typeof mObj === 'object' ? mObj.name : mObj;
                            const ingame = typeof mObj === 'object' ? mObj.ingame : '';
                            const role = typeof mObj === 'object' ? (mObj.role || mObj.ingameRole || '') : '';
                            const isCaptain = typeof mObj === 'object'
                              ? (mObj.role === 'Đội trưởng' || name.includes('(C)'))
                              : mIdx === 0;
                            const isSub = typeof mObj === 'object'
                              ? (mObj.role === 'Dự bị' || name.toLowerCase().includes('sub') || name.toLowerCase().includes('dự bị'))
                              : mIdx === 5;

                            return (
                              <div
                                key={mIdx}
                                className={`px-2.5 py-2 rounded-xl border transition-all ${isCaptain
                                  ? 'bg-orange-500/10 border-orange-500/30 text-white'
                                  : isSub
                                    ? 'bg-sky-500/10 border-sky-500/30 text-white'
                                    : 'bg-white/5 border-slate-800 text-slate-300'
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold truncate">{name}</span>

                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono truncate mt-0.5 gap-1">
                                  <span className="truncate">{ingame}</span>
                                  {role && (
                                    <span className="text-amber-300 font-sans font-semibold text-[9px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                                      {role}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {allSchoolEntries.length > TEAMS_PER_PAGE && (
          <motion.div
            {...fadeInUp}
            className="flex items-center justify-center gap-2 mt-8"
          >
            {/* Previous Button */}
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                setExpandedTeam(null);
                document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              disabled={safePage <= 1}
              className={`p-2 rounded-xl border transition-all ${
                safePage <= 1
                  ? 'border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
                  : 'border-slate-700 text-slate-300 hover:bg-white/10 hover:border-[#F37021] hover:text-[#F37021] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show: first, last, current, and neighbors of current
              const isVisible =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - safePage) <= 1;
              const isEllipsisBefore =
                page === safePage - 2 && safePage > 3;
              const isEllipsisAfter =
                page === safePage + 2 && safePage < totalPages - 2;

              if (!isVisible && !isEllipsisBefore && !isEllipsisAfter) return null;

              if ((isEllipsisBefore || isEllipsisAfter) && !isVisible) {
                return (
                  <span key={`ellipsis-${page}`} className="px-1 text-slate-600 text-sm select-none">
                    ···
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setExpandedTeam(null);
                    document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all ${
                    page === safePage
                      ? 'bg-[#F37021] text-white shadow-lg shadow-orange-900/40 scale-105'
                      : 'bg-white/5 text-slate-400 border border-slate-800 hover:bg-white/10 hover:text-white hover:border-[#F37021] cursor-pointer'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                setExpandedTeam(null);
                document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              disabled={safePage >= totalPages}
              className={`p-2 rounded-xl border transition-all ${
                safePage >= totalPages
                  ? 'border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
                  : 'border-slate-700 text-slate-300 hover:bg-white/10 hover:border-[#F37021] hover:text-[#F37021] cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Page Info */}
            <span className="ml-3 text-xs text-slate-500 font-medium">
              Trang {safePage}/{totalPages} · {allSchoolEntries.length} đội
            </span>
          </motion.div>
        )}

        {filteredTeams.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium">
            Chưa có đội thi đấu nào cho bộ môn <strong className="text-white uppercase">{activeGame}</strong> phù hợp với bộ lọc.
          </div>
        )}
      </div>
    </section>
  );
}
