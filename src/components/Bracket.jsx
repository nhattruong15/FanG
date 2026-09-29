import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, CalendarDays, Clock, Trophy, ChevronDown, ChevronUp, Gamepad2, Shield, X, Users, Award, Info } from 'lucide-react';
import bracketBg from '../assets/background/background_32team.png';
import { subscribeMatches, INITIAL_BRACKET_MATCHES, subscribeTeams, INITIAL_TEAMS } from '../config/firebase';
import { cleanTeamName } from './admin/AdminConsole';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

/**
 * Parse team string (or match with teams list) to extract clean Team Name & School Name separately
 */
export const parseTeamInfo = (teamStr, teamsList = []) => {
  if (!teamStr) return { teamName: 'TBD', schoolName: '', fullObj: null };

  const cleanedStr = cleanTeamName(teamStr);

  // Try matching against teamsList
  const matchedTeam = (teamsList || []).find((t) => {
    const cleanName = cleanTeamName(t.name);
    const cleanSchool = cleanTeamName(t.school);
    const combinedLabel = cleanSchool ? `${cleanName} - ${cleanSchool}` : cleanName;
    return (
      cleanedStr.toLowerCase() === combinedLabel.toLowerCase() ||
      cleanedStr.toLowerCase() === cleanName.toLowerCase() ||
      cleanedStr.toLowerCase() === (t.name || '').toLowerCase()
    );
  });

  if (matchedTeam) {
    const cleanName = cleanTeamName(matchedTeam.name);
    const cleanSchool = cleanTeamName(matchedTeam.school);
    let school = cleanSchool;
    if (cleanName && cleanSchool && cleanName.toLowerCase() === cleanSchool.toLowerCase()) {
      school = '';
    }
    return {
      teamName: cleanName || 'Đội chưa xác định',
      schoolName: school,
      fullObj: matchedTeam,
    };
  }

  // Fallback: Split string by ' - '
  if (cleanedStr.includes(' - ')) {
    const parts = cleanedStr.split(' - ');
    return {
      teamName: parts[0].trim(),
      schoolName: parts.slice(1).join(' - ').trim(),
      fullObj: null,
    };
  }

  return {
    teamName: cleanedStr,
    schoolName: '',
    fullObj: null,
  };
};

/**
 * Single Match Card in Bracket View
 */
const MatchRow = ({ match, teamsList = [], onSelectMatch }) => {
  if (!match) return null;
  const t1Win = match.winner === 1;
  const t2Win = match.winner === 2;
  const upcoming = match.winner == null;

  const t1Info = parseTeamInfo(match.team1, teamsList);
  const t2Info = parseTeamInfo(match.team2, teamsList);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'LIVE' || status === 'Đang thi đấu') {
      return (
        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Đang thi đấu
        </span>
      );
    }
    if (s === 'DONE' || status === 'Đã đấu') {
      return (
        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Đã đấu
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
        Sắp diễn ra
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelectMatch && onSelectMatch(match)}
      className={`rounded-xl border text-[11px] sm:text-xs overflow-hidden transition-all hover:border-[#F37022]/80 hover:shadow-[0_0_20px_rgba(243,112,34,0.25)] cursor-pointer group ${
        upcoming
          ? 'border-[#F37022]/40 bg-[#F37022]/5'
          : 'border-[#F37022]/15 bg-[#0e0906]/80'
      }`}
    >
      {/* Date, Time & Status Header Bar */}
      <div className="px-2.5 py-1 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] text-amber-400 font-medium">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-[#F37022]" /> {match.time || '--:--'} {match.date ? `· ${match.date}` : ''}
        </span>
        {getStatusBadge(match.status)}
      </div>

      {/* Team 1 Row */}
      <div className={`flex items-center justify-between px-2.5 py-2 gap-2 min-h-[38px] transition-colors group-hover:bg-white/5 ${
        t1Win ? 'bg-[#F37022]/25 font-bold' : t2Win ? 'opacity-60' : ''
      }`}>
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`truncate font-bold text-xs sm:text-sm ${t1Win ? 'text-white font-black' : 'text-slate-100'}`}>
            {t1Info.teamName}
          </span>
          {t1Info.schoolName && (
            <span className="truncate text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
              {t1Info.schoolName}
            </span>
          )}
        </div>
        <span className={`font-heading font-black text-sm sm:text-base min-w-[22px] text-center ${
          t1Win ? 'text-[#F37022]' : 'text-slate-400'
        }`}>
          {match.score1 ?? ''}
        </span>
      </div>

      <div className="border-t border-orange-900/30" />

      {/* Team 2 Row */}
      <div className={`flex items-center justify-between px-2.5 py-2 gap-2 min-h-[38px] transition-colors group-hover:bg-white/5 ${
        t2Win ? 'bg-[#F37022]/25 font-bold' : t1Win ? 'opacity-60' : ''
      }`}>
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`truncate font-bold text-xs sm:text-sm ${t2Win ? 'text-white font-black' : 'text-slate-100'}`}>
            {t2Info.teamName}
          </span>
          {t2Info.schoolName && (
            <span className="truncate text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
              {t2Info.schoolName}
            </span>
          )}
        </div>
        <span className={`font-heading font-black text-sm sm:text-base min-w-[22px] text-center ${
          t2Win ? 'text-[#F37022]' : 'text-slate-400'
        }`}>
          {match.score2 ?? ''}
        </span>
      </div>
    </div>
  );
};

const RoundAccordion = ({ title, subtitle, matches, teamsList, onSelectMatch, color = '#F37022', defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer"
        style={{
          borderColor: `${color}33`,
          background: open ? `${color}15` : 'rgba(255,255,255,0.03)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-heading font-black text-xs uppercase tracking-wider" style={{ color }}>
            {title} ({matches.length} trận)
          </span>
          {subtitle && (
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
              {subtitle}
            </span>
          )}
        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {matches.map((m) => (
                <MatchRow key={m.id} match={m} teamsList={teamsList} onSelectMatch={onSelectMatch} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FinalCard = ({ title, match, teamsList, onSelectMatch, trophy = false }) => {
  if (!match) return null;

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
      <MatchRow match={match} teamsList={teamsList} onSelectMatch={onSelectMatch} />
    </div>
  );
};

const RegionBracketPanel = ({ regionName, matches, teamsList, onSelectMatch }) => {
  const round16 = matches.filter(m => m.round?.toLowerCase().includes('1/16') || m.round?.toLowerCase().includes('tuần 1'));
  const quarterFinals = matches.filter(m => m.round?.toLowerCase().includes('tứ kết') || m.round?.toLowerCase().includes('tuần 2'));
  const semiFinals = matches.filter(m => m.round?.toLowerCase().includes('bán kết'));
  const final = matches.find(m => m.round?.toLowerCase().includes('chung kết')) || null;
  const thirdPlace = matches.find(m => m.round?.toLowerCase().includes('hạng 3')) || null;

  return (
    <div className="flex-1 min-w-0">
      <div className="text-center mb-3 sm:mb-4">
        <span className="inline-block font-heading font-black text-sm sm:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F37022] via-amber-400 to-[#F37022] uppercase">
          {regionName}
        </span>
        <div className="mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#F37022] to-transparent mt-1" />
      </div>

      <RoundAccordion
        title="Vòng 1/16"
        subtitle="Tuần 1: 16 Đội ➔ 8 Đội"
        matches={round16}
        teamsList={teamsList}
        onSelectMatch={onSelectMatch}
        color="#F37022"
        defaultOpen={true}
      />
      <RoundAccordion
        title="Tứ Kết"
        subtitle="Tuần 2: 8 Đội ➔ 4 Đội"
        matches={quarterFinals}
        teamsList={teamsList}
        onSelectMatch={onSelectMatch}
        color="#f59e0b"
        defaultOpen={true}
      />
      <RoundAccordion
        title="Bán Kết"
        subtitle="4 Đội Xuất Sắc"
        matches={semiFinals}
        teamsList={teamsList}
        onSelectMatch={onSelectMatch}
        color="#f43f5e"
        defaultOpen={true}
      />

      <div className="mt-3 space-y-2">
        <FinalCard title={`CHUNG KẾT ${regionName.toUpperCase()}`} match={final} teamsList={teamsList} onSelectMatch={onSelectMatch} trophy />
        {thirdPlace && <FinalCard title="TRANH HẠNG 3" match={thirdPlace} teamsList={teamsList} onSelectMatch={onSelectMatch} />}
      </div>
    </div>
  );
};

/**
 * Popup Modal Overlay displaying full Info & Rosters of both competing teams
 */
const MatchDetailModal = ({ match, teamsList, onClose }) => {
  if (!match) return null;

  const t1Info = parseTeamInfo(match.team1, teamsList);
  const t2Info = parseTeamInfo(match.team2, teamsList);

  const team1Obj = t1Info.fullObj;
  const team2Obj = t2Info.fullObj;

  const t1Members = team1Obj?.membersList || (team1Obj?.players || []).map((p, i) => ({
    name: p,
    role: i === 0 ? 'Đội trưởng' : i === 5 ? 'Dự bị' : 'Thành viên',
    ingame: `Player_${i + 1}`
  }));

  const t2Members = team2Obj?.membersList || (team2Obj?.players || []).map((p, i) => ({
    name: p,
    role: i === 0 ? 'Đội trưởng' : i === 5 ? 'Dự bị' : 'Thành viên',
    ingame: `Player_${i + 1}`
  }));

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 40 }}
        className="bg-[#120c08] border border-[#F37022]/40 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[88vh] flex flex-col shadow-[0_0_40px_rgba(243,112,34,0.3)] text-white"
      >
        {/* Sticky Header with Close Button */}
        <div className="flex items-center justify-end px-3.5 pt-3 pb-2 border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-3.5 sm:px-5 pb-3.5 sm:pb-5">

        {/* Header */}
        <div className="text-center mb-3.5 border-b border-white/10 pb-2.5">
         

          <h3 className="font-heading font-black text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 uppercase tracking-wider">
            THÔNG TIN TRẬN ĐẤU & ĐỘI TUYỂN
          </h3>

          <div className="text-[11px] text-amber-400 font-mono mt-0.5 flex items-center justify-center gap-1.5">
            <Clock className="w-3 h-3 text-[#F37022]" />
            <span>{match.time || '--:--'}</span>
            <span>·</span>
            <span>{match.date || 'Chưa cập nhật ngày'}</span>
          </div>
        </div>

        {/* Team Matchup Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 relative">
          {/* Team 1 Box */}
          <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
            match.winner === 1 ? 'bg-orange-500/20 border-[#F37022] shadow-[0_0_15px_rgba(243,112,34,0.3)]' : 'bg-white/5 border-slate-800'
          }`}>
            {team1Obj?.logo ? (
              <img src={team1Obj.logo} alt={t1Info.teamName} className="w-10 h-10 rounded-xl object-cover border border-[#F37022]/40 mb-1 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#F37022]/20 text-[#F37022] font-black text-base flex items-center justify-center border border-[#F37022]/40 mb-1 uppercase shadow-sm">
                {t1Info.teamName ? t1Info.teamName.charAt(0) : 'T1'}
              </div>
            )}
            <div className="font-heading font-bold text-sm sm:text-base text-white">{t1Info.teamName}</div>
            {t1Info.schoolName && (
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">{t1Info.schoolName}</div>
            )}
            <div className="mt-1 text-lg font-black font-heading text-[#F37022]">
              Tỷ số: {match.score1 ?? 0}
            </div>
          </div>

          {/* VS Badge */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F37022] font-black text-white text-[10px] items-center justify-center border-2 border-black shadow-[0_0_10px_#F37022] z-10">
            VS
          </div>

          {/* Team 2 Box */}
          <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
            match.winner === 2 ? 'bg-orange-500/20 border-[#F37022] shadow-[0_0_15px_rgba(243,112,34,0.3)]' : 'bg-white/5 border-slate-800'
          }`}>
            {team2Obj?.logo ? (
              <img src={team2Obj.logo} alt={t2Info.teamName} className="w-10 h-10 rounded-xl object-cover border border-[#F37022]/40 mb-1 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#F37022]/20 text-[#F37022] font-black text-base flex items-center justify-center border border-[#F37022]/40 mb-1 uppercase shadow-sm">
                {t2Info.teamName ? t2Info.teamName.charAt(0) : 'T2'}
              </div>
            )}
            <div className="font-heading font-bold text-sm sm:text-base text-white">{t2Info.teamName}</div>
            {t2Info.schoolName && (
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">{t2Info.schoolName}</div>
            )}
            <div className="mt-1 text-lg font-black font-heading text-[#F37022]">
              Tỷ số: {match.score2 ?? 0}
            </div>
          </div>
        </div>

        {/* Rosters Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Team 1 Roster */}
          <div className="bg-white/5 rounded-xl p-4 border border-slate-800">
            <h4 className="font-bold text-sm text-[#F37022] uppercase tracking-wider mb-3 flex items-center gap-2">
              <p className=" h-4" /> Thành Viên Đội: {t1Info.teamName}
            </h4>
            {t1Members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t1Members.map((m, idx) => {
                  const name = typeof m === 'object' ? m.name : m;
                  const ingame = typeof m === 'object' ? m.ingame : '';
                  const role = typeof m === 'object' ? m.role : (idx === 0 ? 'Đội trưởng' : 'Thành viên');
                  const isCaptain = role === 'Đội trưởng' || name.includes('(C)');
                  const isSub = role === 'Dự bị' || name.toLowerCase().includes('sub');

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs ${
                        isCaptain
                          ? 'bg-orange-500/15 border-orange-500/40 text-white'
                          : isSub
                          ? 'bg-sky-500/15 border-sky-500/30 text-slate-300'
                          : 'bg-white/5 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold truncate">{name}</span>
                        {isCaptain && (
                          <span className="text-[9px] font-black bg-[#F37022] text-white px-1.5 py-0.2 rounded uppercase">
                            C
                          </span>
                        )}
                        {isSub && (
                          <span className="text-[9px] font-black bg-sky-500 text-white px-1.5 py-0.2 rounded uppercase">
                            SUB
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        <span className="truncate">{ingame}</span>
                        {role && (
                          <span className="text-amber-300 font-sans font-semibold text-[9px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0 ml-1">
                            {role}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">Chưa có dữ liệu danh sách thi đấu.</div>
            )}
          </div>

          {/* Team 2 Roster */}
          <div className="bg-white/5 rounded-xl p-4 border border-slate-800">
            <h4 className="font-bold text-sm text-[#F37022] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Thành Viên Đội: {t2Info.teamName}
            </h4>
            {t2Members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t2Members.map((m, idx) => {
                  const name = typeof m === 'object' ? m.name : m;
                  const ingame = typeof m === 'object' ? m.ingame : '';
                  const role = typeof m === 'object' ? m.role : (idx === 0 ? 'Đội trưởng' : idx >= 5 ? 'Dự bị' : 'Thành viên');
                  const isCaptain = role === 'Đội trưởng' || name.includes('(C)');
                  const isSub = role === 'Dự bị' || name.toLowerCase().includes('sub') || idx >= 5;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs ${
                        isCaptain
                          ? 'bg-orange-500/15 border-orange-500/40 text-white'
                          : isSub
                          ? 'bg-sky-500/15 border-sky-500/30 text-slate-300'
                          : 'bg-white/5 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold truncate">{name}</span>
                        {isCaptain && (
                          <span className="text-[9px] font-black bg-[#F37022] text-white px-1.5 py-0.2 rounded uppercase">
                            C
                          </span>
                        )}
                        {isSub && (
                          <span className="text-[9px] font-black bg-sky-500 text-white px-1.5 py-0.2 rounded uppercase">
                            SUB
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        <span className="truncate">{ingame}</span>
                        {role && (
                          <span className="text-amber-300 font-sans font-semibold text-[9px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0 ml-1">
                            {role}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">Chưa có dữ liệu danh sách thi đấu.</div>
            )}
          </div>
        </div>

        <div className="mt-3.5 text-center">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-[#F37022] text-white font-bold text-xs uppercase hover:bg-orange-600 transition-colors shadow-md cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
        </div>{/* end scrollable content */}
      </motion.div>
    </div>
  );
};

export default function Bracket({ selectedGame: initialGame }) {
  const [viewMode, setViewMode] = useState('bracket');
  const [activeGame, setActiveGame] = useState(initialGame || 'VALORANT');
  const [allMatches, setAllMatches] = useState(INITIAL_BRACKET_MATCHES);
  const [teamsList, setTeamsList] = useState(INITIAL_TEAMS);
  const [selectedMatchModal, setSelectedMatchModal] = useState(null);

  // Sync state if parent selectedGame changes
  useEffect(() => {
    if (initialGame) {
      setActiveGame(initialGame);
    }
  }, [initialGame]);

  // Subscribe to real-time Firestore bracket match updates
  useEffect(() => {
    const unsubscribe = subscribeMatches((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setAllMatches(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore teams updates
  useEffect(() => {
    const unsubTeams = subscribeTeams((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTeamsList(data);
      }
    });
    return () => unsubTeams();
  }, []);

  const safeMatches = (Array.isArray(allMatches) && allMatches.length > 0) ? allMatches : INITIAL_BRACKET_MATCHES;

  // Filter matches by selected active game (case-insensitive)
  const currentMatches = safeMatches.filter(m => {
    const matchGame = (m.game || 'VALORANT').toLowerCase();
    const currentActiveGame = (activeGame || 'VALORANT').toLowerCase();
    return matchGame === currentActiveGame || matchGame === 'all';
  });

  const mienBacMatches = currentMatches.filter(m => {
    const r = (m.region || '').toLowerCase();
    return r === 'miền bắc' || r === 'mb' || r.includes('bắc');
  });

  const mienNamMatches = currentMatches.filter(m => {
    const r = (m.region || '').toLowerCase();
    return r === 'miền nam' || r === 'mn' || r.includes('nam');
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'LIVE' || status === 'Đang thi đấu') {
      return (
        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Đang thi đấu
        </span>
      );
    }
    if (s === 'DONE' || status === 'Đã đấu') {
      return (
        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Đã đấu
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
        Sắp diễn ra
      </span>
    );
  };

  return (
    <section id="bracket" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bracketBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0906] via-transparent to-[#0e0906]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title Header */}
        <motion.div {...fadeInUp} className="text-center mb-8 sm:mb-10 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_30px_rgba(243,112,34,0.75)] uppercase">
              SƠ ĐỒ NHÁNH & LỊCH THI ĐẤU
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
        </motion.div>

        {/* View Mode Controls (Sơ Đồ vs Lịch Thi Đấu) */}
        <motion.div {...fadeInUp} className="flex items-center justify-center sm:justify-end gap-4 mb-8">
          <div className="inline-flex bg-white/5 rounded-2xl p-1.5 border border-[#F37022]/20">
            <button
              onClick={() => setViewMode('bracket')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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

        {/* Content Section */}
        {viewMode === 'bracket' ? (
          <motion.div {...fadeInUp}>
            {/* Grand National Final Card Showcase */}
            {(() => {
              const nationalFinalMatch = currentMatches.find(
                m => m.region === 'Toàn Quốc' || (m.round && m.round.toLowerCase().includes('chung kết toàn quốc'))
              );
              if (!nationalFinalMatch) return null;
              const t1Info = parseTeamInfo(nationalFinalMatch.team1, teamsList);
              const t2Info = parseTeamInfo(nationalFinalMatch.team2, teamsList);

              return (
                <div
                  onClick={() => setSelectedMatchModal(nationalFinalMatch)}
                  className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-orange-950/50 to-amber-950/70 border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:shadow-[0_0_55px_rgba(245,158,11,0.55)] transition-all cursor-pointer relative overflow-hidden group"
                >
                  {/* Watermark Trophy Icon */}
                  <div className="absolute -right-6 -bottom-6 opacity-10 text-amber-400 pointer-events-none group-hover:scale-110 transition-transform">
                    <Trophy className="w-44 h-44" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Top Banner Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-amber-950/60 mb-3 animate-pulse">
                      <span>CHUNG KẾT TOÀN QUỐC</span>
                    </div>

                    <div className="text-amber-200/80 text-xs font-semibold mb-4 flex items-center justify-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-amber-400" /> {nationalFinalMatch.date || 'Đang cập nhật'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {nationalFinalMatch.time || '--:--'}</span>
                      <span>•</span>
                      {getStatusBadge(nationalFinalMatch.status)}
                    </div>

                    {/* Teams Battle Display */}
                    <div className="w-full flex items-center justify-center gap-3 sm:gap-8 my-1">
                      {/* Team 1 */}
                      <div className="flex-1 flex flex-col items-end text-right min-w-0">
                        <div className={`font-heading font-black text-base sm:text-2xl truncate max-w-full ${nationalFinalMatch.winner === 1 ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'text-white'}`}>
                          {t1Info.teamName}
                        </div>
                        {t1Info.schoolName && (
                          <div className="text-xs text-slate-300 truncate max-w-full font-medium">
                            {t1Info.schoolName}
                          </div>
                        )}
                      </div>

                      {/* Score Pill */}
                      <div className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-b from-amber-500 to-orange-600 border-2 border-white/20 text-white font-black font-heading text-lg sm:text-2xl shadow-xl flex items-center gap-2 shrink-0">
                        <span>{nationalFinalMatch.score1 ?? '-'}</span>
                        <span className="text-amber-200 text-sm sm:text-base">:</span>
                        <span>{nationalFinalMatch.score2 ?? '-'}</span>
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 flex flex-col items-start text-left min-w-0">
                        <div className={`font-heading font-black text-base sm:text-2xl truncate max-w-full ${nationalFinalMatch.winner === 2 ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'text-white'}`}>
                          {t2Info.teamName}
                        </div>
                        {t2Info.schoolName && (
                          <div className="text-xs text-slate-300 truncate max-w-full font-medium">
                            {t2Info.schoolName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-amber-300/80 font-semibold group-hover:text-amber-200 transition-colors flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Bấm để xem thông tin đội hình 2 đội
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Miền Nam Bracket */}
              <RegionBracketPanel regionName="Miền Nam" matches={mienNamMatches} teamsList={teamsList} onSelectMatch={(m) => setSelectedMatchModal(m)} />

              {/* Center Divider */}
              <div className="hidden lg:flex flex-col items-center justify-center px-2">
                <div className="w-0.5 flex-1 bg-gradient-to-b from-transparent via-[#F37022] to-transparent opacity-40" />
                <div className="my-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#F37022] to-amber-600 flex items-center justify-center font-black text-white text-xs shadow-[0_0_25px_#F37022] border-2 border-white/20">
                  VS
                </div>
                <div className="w-0.5 flex-1 bg-gradient-to-b from-transparent via-[#F37022] to-transparent opacity-40" />
              </div>

              <div className="lg:hidden flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F37022] to-transparent opacity-40" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F37022] to-amber-600 flex items-center justify-center font-black text-white text-[10px] shadow-[0_0_15px_#F37022] border border-white/20">
                  VS
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F37022] to-transparent opacity-40" />
              </div>

              {/* Miền Bắc Bracket */}
              <RegionBracketPanel regionName="Miền Bắc" matches={mienBacMatches} teamsList={teamsList} onSelectMatch={(m) => setSelectedMatchModal(m)} />
            </div>
          </motion.div>
        ) : (
          /* Real-time Schedule List View */
          <motion.div {...fadeInUp} className="space-y-3">
            {currentMatches.map((match) => {
              const t1Info = parseTeamInfo(match.team1, teamsList);
              const t2Info = parseTeamInfo(match.team2, teamsList);
              const isNatFinal = match.region === 'Toàn Quốc' || (match.round && match.round.toLowerCase().includes('chung kết toàn quốc'));

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatchModal(match)}
                  className={`backdrop-blur-md rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group ${
                    isNatFinal
                      ? 'bg-gradient-to-r from-amber-950/70 via-orange-950/50 to-amber-950/70 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-300'
                      : 'bg-black/60 border border-[#F37022]/20 hover:border-[#F37022]/60'
                  }`}
                >
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <CalendarDays className="w-4 h-4 text-[#F37022]" />
                    <div>
                      <div className="text-white font-bold text-xs">{match.date || 'Đang cập nhật'}</div>
                      <div className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {match.time || '--:--'}
                      </div>
                    </div>
                  </div>

                  {/* Region & Round */}
                  <div className="flex items-center gap-2 min-w-[150px]">
                    {isNatFinal ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/50 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" /> TOÀN QUỐC
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F37022]/15 text-[#F37022] text-xs font-bold border border-[#F37022]/30">
                        {match.region}
                      </span>
                    )}
                    <span className="text-slate-400 text-xs font-medium">{match.round}</span>
                  </div>

                  {/* Teams & Score Split */}
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="text-right truncate max-w-[160px]">
                      <div className={`font-bold text-xs sm:text-sm truncate ${match.winner === 1 ? 'text-[#F37022] font-black' : 'text-slate-200'}`}>
                        {t1Info.teamName}
                      </div>
                      {t1Info.schoolName && (
                        <div className="text-[10px] text-slate-400 truncate">{t1Info.schoolName}</div>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-black text-xs min-w-[44px] text-center font-mono shrink-0">
                      {match.score1 ?? '-'} : {match.score2 ?? '-'}
                    </span>

                    <div className="text-left truncate max-w-[160px]">
                      <div className={`font-bold text-xs sm:text-sm truncate ${match.winner === 2 ? 'text-[#F37022] font-black' : 'text-slate-200'}`}>
                        {t2Info.teamName}
                      </div>
                      {t2Info.schoolName && (
                        <div className="text-[10px] text-slate-400 truncate">{t2Info.schoolName}</div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-right shrink-0">
                    {getStatusBadge(match.status)}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Interactive Match & Teams Info Modal */}
        <AnimatePresence>
          {selectedMatchModal && (
            <MatchDetailModal
              match={selectedMatchModal}
              teamsList={teamsList}
              onClose={() => setSelectedMatchModal(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
