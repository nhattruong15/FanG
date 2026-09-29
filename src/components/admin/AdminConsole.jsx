import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Tv,
  Users,
  GitBranch,
  Newspaper,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Radio,
  Search,
  Filter,
  Save,
  Trophy,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Lock,
  Key,
  LogOut,
  GraduationCap,
  Building2,
  ChevronDown,
  UserCheck,
  Phone,
  Upload,
  QrCode,
  BarChart3,
  Activity,
  TrendingUp,
  PieChart,
  MousePointer,
  Share2,
  RotateCcw,
} from 'lucide-react';

import {
  INITIAL_LIVESTREAM_STREAMS,
  INITIAL_VIDEO_LIVESTREAM,
  parseYouTubeEmbed,
  saveVideoLivestream,
  subscribeVideoLivestream,
  verifyAdminCredentials,
  INITIAL_NEWS_ARTICLES,
  saveNewsArticles,
  subscribeNews,
  INITIAL_TEAMS,
  saveTeams,
  subscribeTeams,
  subscribeQrScans,
  INITIAL_QR_STATS,
  subscribeLiveViews,
  INITIAL_LIVE_STATS,
  subscribeVisitorStats,
  INITIAL_BRACKET_MATCHES,
  saveMatches,
  subscribeMatches,
} from '../../config/firebase';

import {
  fetchVietnamUniversities,
  VIETNAM_UNIVERSITIES_FALLBACK
} from '../../services/universityApi';

/* ====================================================================
   INITIAL MOCK DATA FOR ADMIN CONSOLE
   ==================================================================== */
const INITIAL_LIVESTREAM = INITIAL_LIVESTREAM_STREAMS;

/* ====================================================================
   CLEAN TEAM LABELS & SEARCHABLE COMBBOX SELECTOR
   ==================================================================== */
export const cleanTeamName = (str) => {
  if (!str) return '';
  return str
    .replace(/\s*-\s*(VALORANT|Valorant|AOV|Liên Quân|\(LIÊN QUÂN\)|\(Liên Quân\))\s*-\s*/gi, ' - ')
    .replace(/\s*-\s*(VALORANT|Valorant|AOV|Liên Quân|\(LIÊN QUÂN\)|\(Liên Quân\))\s*/gi, '')
    .replace(/\s*(VALORANT|Valorant|AOV|Liên Quân|\(LIÊN QUÂN\)|\(Liên Quân\))\s*-\s*/gi, '')
    .replace(/\s*(VALORANT|Valorant|AOV|Liên Quân|\(LIÊN QUÂN\)|\(Liên Quân\))\s*/gi, '')
    .replace(/\s+-\s+-+/g, ' -')
    .replace(/\s+/g, ' ')
    .trim();
};

export const formatTeamLabel = (team) => {
  if (!team) return '';
  if (typeof team === 'string') {
    return cleanTeamName(team);
  }
  const cleanName = cleanTeamName(team.name);
  if (team.school) {
    const cleanSchool = cleanTeamName(team.school);
    if (cleanName && cleanSchool && cleanName.toLowerCase() !== cleanSchool.toLowerCase()) {
      return `${cleanName} - ${cleanSchool}`;
    }
    return cleanSchool || cleanName;
  }
  return cleanName;
};

function SearchableTeamSelect({ value, onChange, teams, isWinner, placeholder = '-- Chọn Đội --' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanCurrentValue = cleanTeamName(value);

  const filteredTeams = teams.filter(t => {
    if (!searchQuery) return true;
    const label = formatTeamLabel(t).toLowerCase();
    const query = searchQuery.toLowerCase();
    return label.includes(query) || (t.school && t.school.toLowerCase().includes(query)) || (t.name && t.name.toLowerCase().includes(query));
  });

  return (
    <div ref={containerRef} className="relative w-44 sm:w-56 shrink-0">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all text-left bg-slate-50 cursor-pointer shadow-2xs ${
          isWinner ? 'text-[#F37022] font-black bg-orange-50 border-orange-300' : 'text-slate-800 border-slate-300 hover:border-[#F37022]'
        }`}
      >
        <span className="truncate flex-1">
          {cleanCurrentValue || placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#F37022]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 sm:w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 text-slate-900">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-[#F37022] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Gõ để tìm tên đội / trường..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-0.5 divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              -- Chọn Đội (Bỏ chọn) --
            </button>

            {filteredTeams.map((t) => {
              const label = formatTeamLabel(t);
              const isSelected = cleanCurrentValue === label || value === label || value === t.name;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onChange(label);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 text-[#F37022] border border-orange-200'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate flex-1">{label}</span>
                  {t.region && (
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {t.region}
                    </span>
                  )}
                </button>
              );
            })}

            {value && !filteredTeams.some(t => formatTeamLabel(t) === cleanCurrentValue) && (
              <button
                type="button"
                onClick={() => {
                  onChange(value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold bg-orange-50 text-[#F37022]"
              >
                <span className="truncate">{cleanCurrentValue}</span>
              </button>
            )}

            {filteredTeams.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-400 italic">
                Không tìm thấy đội nào khớp với "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_NEWS = [
  { id: 1, title: 'Khai mạc giải đấu FanG Esports Tournament 2026 quy mô toàn quốc', category: 'Giải đấu', author: 'Admin', date: '25/09/2026', isFeatured: true, status: 'PUBLISHED' },
  { id: 2, title: 'Top 8 đội tuyển mạnh nhất vươn lên vòng Tứ Kết Miền Nam', category: 'Tin tức', author: 'Esports Team', date: '24/09/2026', isFeatured: false, status: 'PUBLISHED' },
  { id: 3, title: 'Lộ diện lịch thi đấu vòng Bán Kết bộ môn VALORANT', category: 'Lịch đấu', author: 'Admin', date: '23/09/2026', isFeatured: true, status: 'PUBLISHED' },
];

export default function AdminConsole({ onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('fang_admin_authenticated') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Real-time State Management from Firestore (Streams map per game)
  const [streamsMap, setStreamsMap] = useState(INITIAL_LIVESTREAM_STREAMS);
  const [selectedStreamGame, setSelectedStreamGame] = useState('VALORANT');
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [matches, setMatches] = useState(INITIAL_BRACKET_MATCHES);
  const [news, setNews] = useState(INITIAL_NEWS_ARTICLES);
  const [qrStats, setQrStats] = useState(INITIAL_QR_STATS);
  const [liveStats, setLiveStats] = useState(INITIAL_LIVE_STATS);
  const [visitorStats, setVisitorStats] = useState({ totalVisits: 0, onlineCount: 0, activeSessions: [], lastVisitTime: null });

  // Analytics & Tracking UI State
  const [overviewChartFilter, setOverviewChartFilter] = useState('ALL');
  const [overviewChartType, setOverviewChartType] = useState('LINE'); // 'LINE' or 'BAR'
  const [overviewTimeRange, setOverviewTimeRange] = useState('TODAY'); // 'TODAY' | 'YESTERDAY' | '7DAYS' | '30DAYS' | 'CUSTOM'
  const [selectedChartDate, setSelectedChartDate] = useState('2026-09-28');
  const [showScanLogs, setShowScanLogs] = useState(false);
  const [scanLogFilter, setScanLogFilter] = useState('ALL');
  const [scanLogPage, setScanLogPage] = useState(1);

  const [showLiveLogs, setShowLiveLogs] = useState(false);
  const [liveLogFilter, setLiveLogFilter] = useState('ALL');
  const [liveLogPage, setLiveLogPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Track initial load for QR notification trigger
  const isInitialQrLoad = React.useRef(true);
  const isInitialLiveLoad = React.useRef(true);

  // Subscribe to real-time Firestore database collection "videolivestream", "news", "teams", "qr_scans" & "live_views"
  React.useEffect(() => {
    const unsubStream = subscribeVideoLivestream((data) => {
      if (data) {
        if (data.VALORANT || data.AOV || data.ALL) {
          setStreamsMap(data);
        } else {
          setStreamsMap({
            ...INITIAL_LIVESTREAM_STREAMS,
            [data.game || 'VALORANT']: data
          });
        }
      }
    });
    const unsubNews = subscribeNews((data) => {
      if (Array.isArray(data)) setNews(data);
    });
    const unsubTeams = subscribeTeams((data) => {
      if (Array.isArray(data)) setTeams(data);
    });
    const unsubMatches = subscribeMatches((data) => {
      if (Array.isArray(data)) setMatches(data);
    });
    const unsubQr = subscribeQrScans((data) => {
      if (data) {
        setQrStats(prev => {
          if (!isInitialQrLoad.current && data.totalScans > (prev.totalScans || 0)) {
            triggerToast(`Đã nhận 1 lượt quét QR mới (${data.lastScanGame || 'ALL'})! Tổng: ${data.totalScans}`);
          }
          return data;
        });
        isInitialQrLoad.current = false;
      }
    });
    const unsubLive = subscribeLiveViews((data) => {
      if (data) {
        setLiveStats(prev => {
          if (!isInitialLiveLoad.current && data.totalViews > (prev.totalViews || 0)) {
            triggerToast(`Đã nhận 1 lượt xem Live mới (${data.lastViewGame || 'ALL'})! Tổng: ${data.totalViews}`);
          }
          return data;
        });
        isInitialLiveLoad.current = false;
      }
    });
    const unsubVisitor = subscribeVisitorStats((data) => {
      if (data) setVisitorStats(data);
    });
    return () => {
      unsubStream();
      unsubNews();
      unsubTeams();
      unsubMatches();
      unsubQr();
      unsubLive();
      unsubVisitor();
    };
  }, []);

  const currentStream = streamsMap[selectedStreamGame] || INITIAL_LIVESTREAM_STREAMS[selectedStreamGame] || {
    title: '',
    url: '',
    embedUrl: '',
    isLive: false,
    game: selectedStreamGame
  };

  // Filters & Search
  const [teamSearch, setTeamSearch] = useState('');
  const [teamGameFilter, setTeamGameFilter] = useState('ALL');
  const [teamRegionFilter, setTeamRegionFilter] = useState('ALL');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [selectedBracketGame, setSelectedBracketGame] = useState('VALORANT');
  const [bracketRegionFilter, setBracketRegionFilter] = useState('ALL');
  const [selectedBracketRound, setSelectedBracketRound] = useState('ALL');
  const [newsGameFilter, setNewsGameFilter] = useState('ALL');

  // Modals & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Vietnam Universities API & 5 Member Roster State
  const [universitiesList, setUniversitiesList] = useState(VIETNAM_UNIVERSITIES_FALLBACK);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [viewingTeamRoster, setViewingTeamRoster] = useState(null);

  const DEFAULT_7_MEMBERS = [
    { id: 1, name: '', ingame: '', phone: '', role: '' },
    { id: 2, name: '', ingame: '', phone: '', role: '' },
    { id: 3, name: '', ingame: '', phone: '', role: '' },
    { id: 4, name: '', ingame: '', phone: '', role: '' },
    { id: 5, name: '', ingame: '', phone: '', role: '' },
    { id: 6, name: '', ingame: '', phone: '', role: '' },
    { id: 7, name: '', ingame: '', phone: '', role: '' },
  ];
  const [newTeamMembers, setNewTeamMembers] = useState(DEFAULT_7_MEMBERS);

  // Fetch Vietnam Universities & Colleges API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadUnis() {
      setIsLoadingUniversities(true);
      try {
        const data = await fetchVietnamUniversities();
        console.log('[Admin] Universities loaded from API:', data.length, 'schools');
        if (isMounted) {
          setUniversitiesList(data);
          setIsLoadingUniversities(false);
        }
      } catch (err) {
        console.error('[Admin] Failed to load universities:', err);
        if (isMounted) setIsLoadingUniversities(false);
      }
    }
    loadUnis();
    return () => { isMounted = false; };
  }, []);

  // New Team Form State
  const [newTeam, setNewTeam] = useState({ name: '', school: '', region: 'Miền Bắc', game: 'Valorant', captain: '', members: 7, logo: '' });
  
  const handleLogoFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeam(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Article Form State (Supports full metadata & game selection)
  const [newArticle, setNewArticle] = useState({
    game: 'VALORANT',
    title: '',
    category: 'Tin tức',
    author: 'Admin',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    summary: '',
    content: '',
    thumbnail: '',
    videoEmbed: '',
    isFeatured: false,
    status: 'PUBLISHED'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setLoginError(null);
    try {
      const isValid = await verifyAdminCredentials(usernameInput, passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('fang_admin_authenticated', 'true');
        triggerToast('Đăng nhập Quản Trị Viên thành công!');
      } else {
        setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối cơ sở dữ liệu!');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('fang_admin_authenticated');
    setIsAuthenticated(false);
    triggerToast('Đã đăng xuất khỏi Admin Console.');
  };

  // Open Edit Team Modal
  const handleOpenEditTeam = (team) => {
    setEditingTeamId(team.id);
    setNewTeam({
      name: team.name || '',
      school: team.school || '',
      region: team.region || 'Miền Bắc',
      game: team.game || 'Valorant',
      captain: team.captain || '',
      members: 7,
      logo: team.logo || ''
    });
    setSchoolSearchQuery(team.school || '');
    const existingMembers = team.membersList || [];
    const filledMembers = Array.from({ length: 7 }).map((_, idx) => {
      const existing = existingMembers[idx] || {};
      return {
        id: idx + 1,
        name: existing.name || '',
        ingame: existing.ingame || '',
        phone: existing.phone || '',
        role: existing.role || ''
      };
    });
    setNewTeamMembers(filledMembers);
    setShowAddTeamModal(true);
  };

  // Add / Edit Team Handler with 7 Members
  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.school) return;

    const captainObj = newTeamMembers[0];
    const captainName = captainObj.name.trim() || 'Chưa đặt tên';

    const processedMembers = newTeamMembers.map((m, idx) => ({
      id: idx + 1,
      name: m.name.trim() || (idx >= 5 ? `Dự bị ${idx - 4}` : `Thành viên ${idx + 1}`),
      ingame: m.ingame.trim() || `Player_${idx + 1}`,
      phone: m.phone ? m.phone.trim() : '',
      role: m.role ? m.role.trim() : (idx === 0 ? 'Đội trưởng' : idx >= 5 ? 'Dự bị' : 'Thành viên')
    }));

    let updatedTeams;
    if (editingTeamId) {
      updatedTeams = teams.map(t => {
        if (t.id === editingTeamId) {
          return {
            ...t,
            name: newTeam.name,
            school: newTeam.school,
            region: newTeam.region || 'Miền Bắc',
            game: newTeam.game || 'Valorant',
            captain: captainName,
            membersCount: 7,
            membersList: processedMembers,
            logo: newTeam.logo || '',
          };
        }
        return t;
      });
      triggerToast('Đã cập nhật thông tin đội tuyển thành công!');
    } else {
      const teamToAdd = {
        id: Date.now(),
        name: newTeam.name,
        school: newTeam.school,
        region: newTeam.region || 'Miền Bắc',
        game: newTeam.game || 'Valorant',
        captain: captainName,
        membersCount: 7,
        membersList: processedMembers,
        logo: newTeam.logo || '',
        status: 'VERIFIED',
      };
      updatedTeams = [teamToAdd, ...teams];
      triggerToast('Đã thêm đội tuyển 7 thành viên (5 chính + 2 dự bị) thành công!');
    }

    setTeams(updatedTeams);
    await saveTeams(updatedTeams);
    setShowAddTeamModal(false);
    setEditingTeamId(null);
    setNewTeam({ name: '', school: '', region: 'Miền Bắc', game: 'Valorant', captain: '', members: 7, logo: '' });
    setSchoolSearchQuery('');
    setNewTeamMembers(DEFAULT_7_MEMBERS);
  };

  // Add / Update Article Handler
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title) return;

    let updatedNews;
    const embedUrl = parseYouTubeEmbed(newArticle.videoEmbed);

    if (editingArticleId) {
      // Edit existing article
      updatedNews = news.map(item => item.id === editingArticleId ? { ...item, ...newArticle, videoEmbed: embedUrl } : item);
      triggerToast('Đã cập nhật bài viết tin tức thành công!');
    } else {
      // Add new article
      const articleToAdd = {
        id: `news_${Date.now()}`,
        ...newArticle,
        videoEmbed: embedUrl,
        status: 'PUBLISHED',
      };
      updatedNews = [articleToAdd, ...news];
      triggerToast('Đã đăng bài viết tin tức mới thành công!');
    }

    setNews(updatedNews);
    await saveNewsArticles(updatedNews);

    setShowAddNewsModal(false);
    setEditingArticleId(null);
    setNewArticle({
      game: 'VALORANT',
      title: '',
      category: 'Tin tức',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      summary: '',
      content: '',
      thumbnail: '',
      videoEmbed: '',
      articleUrl: '',
      isFeatured: false,
      status: 'PUBLISHED'
    });
  };

  // Open Edit Modal
  const handleOpenEditNews = (item) => {
    setEditingArticleId(item.id);
    setNewArticle({
      game: item.game || 'VALORANT',
      title: item.title || '',
      category: item.category || 'Tin tức',
      author: item.author || 'Admin',
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || '12:00',
      summary: item.summary || item.description || '',
      content: item.content || '',
      thumbnail: item.thumbnail || '',
      videoEmbed: item.videoEmbed || '',
      articleUrl: item.articleUrl || item.url || item.link || '',
      isFeatured: !!item.isFeatured,
      status: item.status || 'PUBLISHED'
    });
    setShowAddNewsModal(true);
  };

  // Delete Handlers
  const handleDeleteTeam = async (id) => {
    const updatedTeams = teams.filter(t => t.id !== id);
    setTeams(updatedTeams);
    await saveTeams(updatedTeams);
    triggerToast('Đã xóa đội tuyển.');
  };

  const handleDeleteNews = async (id) => {
    const updatedNews = news.filter(n => n.id !== id);
    setNews(updatedNews);
    await saveNewsArticles(updatedNews);
    triggerToast('Đã xóa bài viết.');
  };

  // Update Match Details (Score, Teams, Date, Time)
  const handleMatchUpdate = async (matchId, field, value) => {
    const updated = matches.map(m => {
      if (m.id === matchId) {
        const item = { ...m, [field]: (field === 'score1' || field === 'score2') ? (value === '' ? null : Number(value)) : value };
        if (item.score1 !== null && item.score2 !== null) {
          if (item.score1 > item.score2) item.winner = 1;
          else if (item.score2 > item.score1) item.winner = 2;
          else item.winner = null;
        } else {
          item.winner = null;
        }
        return item;
      }
      return m;
    });
    setMatches(updated);
    await saveMatches(updated);
    triggerToast('Đã lưu thay đổi trận đấu!');
  };

  // Delete a specific match
  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trận đấu này không?')) {
      const updated = matches.filter(m => m.id !== matchId);
      setMatches(updated);
      await saveMatches(updated);
      triggerToast('Đã xóa trận đấu!');
    }
  };

  // Reset all matches team1 and team2 to blank (-- Chọn Đội --)
  const handleResetAllMatchesToEmpty = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả các trận đấu về "-- Chọn Đội --"?')) {
      const resetList = matches.map(m => ({
        ...m,
        team1: '',
        team2: '',
        score1: null,
        score2: null,
        winner: null,
        status: 'UPCOMING'
      }));
      setMatches(resetList);
      await saveMatches(resetList);
      triggerToast('Đã đặt lại tất cả các trận đấu về "-- Chọn Đội --"!');
    }
  };

  // Add a National Final (Chung Kết Toàn Quốc) match between 2 region champions
  const handleAddNationalFinal = async () => {
    const alreadyExists = matches.some(
      m => m.round && m.round.toLowerCase().includes('chung kết toàn quốc')
    );
    if (alreadyExists) {
      if (!window.confirm('Trận Chung Kết Toàn Quốc đã tồn tại. Bạn có muốn thêm thêm một trận nữa không?')) return;
    }
    const finalMatch = {
      id: `final_${Date.now()}`,
      game: selectedBracketGame || 'VALORANT',
      region: 'Toàn Quốc',
      round: 'Chung Kết Toàn Quốc',
      team1: '',
      team2: '',
      score1: null,
      score2: null,
      winner: null,
      status: 'UPCOMING',
      date: '',
      time: '',
    };
    const updated = [...matches, finalMatch];
    setMatches(updated);
    await saveMatches(updated);
    triggerToast('Đã thêm trận Chung Kết Toàn Quốc!');
  };

  // Filtered Teams
  const filteredTeams = teams.filter(t => {
    const searchLower = teamSearch.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(searchLower) ||
      t.school.toLowerCase().includes(searchLower) ||
      (t.region && t.region.toLowerCase().includes(searchLower)) ||
      (t.game && t.game.toLowerCase().includes(searchLower));
    const matchesGame = teamGameFilter === 'ALL' || t.game.toLowerCase() === teamGameFilter.toLowerCase();
    const matchesRegion = teamRegionFilter === 'ALL' || (t.region && t.region.toLowerCase() === teamRegionFilter.toLowerCase());
    return matchesSearch && matchesGame && matchesRegion;
  });

  // Login Screen Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090503] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient Orange Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F37022]/20 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md bg-[#120a06]/90 border border-[#F37022]/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(243,112,34,0.25)] backdrop-blur-xl"
        >
          {/* Back button */}
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay về Landing Page</span>
          </button>

          <div className="text-center mb-8">
            
            <h2 className="text-2xl font-black font-heading text-white uppercase tracking-wider">
            <span className="text-[#F37022]">LOGIN</span>
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Tài khoản</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Nhập tài khoản (ví dụ: admin)"
                  required
                  className="w-full bg-black/60 border border-slate-700 focus:border-[#F37022] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#F37022]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu (ví dụ: admin)"
                  required
                  className="w-full bg-black/60 border border-slate-700 focus:border-[#F37022] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#F37022]/30"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F37022] to-amber-500 hover:brightness-110 text-white font-black text-sm uppercase tracking-wide shadow-lg shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? 'Đang xác thực DB...' : 'Đăng Nhập'}
            </button>
          </form>

       
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-5 right-5 z-50 bg-[#F37022] text-white px-4 py-2.5 rounded-xl shadow-xl font-bold text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </motion.div>
      )}

      {/* Top Navbar for Admin (Light Theme) */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#F37022] hover:text-white text-slate-700 text-xs font-bold transition-all border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Landing Page</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F37022] animate-ping" />
            <h1 className="font-heading font-black text-lg text-slate-900 uppercase tracking-wider">
             <span className="text-[#F37022]">ADMIN </span>
            </h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-all border border-red-200"
          title="Đăng xuất khỏi Admin Console"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar (Light Theme) */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto shadow-sm">
          {[
            { id: 'overview', label: 'Tổng Quan (KPIs)', icon: LayoutDashboard },
            { id: 'analytics', label: 'Analytics & Tracking', icon: BarChart3, badge: qrStats.totalScans || 0 },
            { id: 'livestream', label: 'Quản Lý Livestream', icon: Tv },
            { id: 'teams', label: 'Quản Lý Đội Thi', icon: Users },
            { id: 'bracket', label: 'Quản Lý Bảng Đấu', icon: GitBranch },
            { id: 'news', label: 'Quản Lý Tin Tức', icon: Newspaper },
          ].map((tab) => {
            const active = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#F37022] text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    active ? 'bg-white text-[#F37022]' : 'bg-orange-100 text-[#F37022]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Content View (Light Theme) */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-50">
          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                BẢNG ĐIỀU KHIỂN HỆ THỐNG
              </h2>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Live Online Users Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-400/40 shadow-md shadow-emerald-500/10 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Đang Online
                    </span>
                  </div>
                  <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                    {visitorStats.onlineCount || 0} <span className="text-sm font-bold text-slate-500">người</span>
                  </div>
               
                  {/* Animated bg glow */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-400/15 rounded-full blur-2xl" />
                </div>

                {/* Total Page Visits Card */}
                <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-400/40 shadow-md shadow-blue-500/10 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 font-black uppercase tracking-wider flex items-center gap-1">
                      Tổng Lượt Truy Cập
                    </span>
                  </div>
                  <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                    {visitorStats.totalVisits || 0} <span className="text-sm font-bold text-slate-500">lượt</span>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/15 rounded-full blur-2xl" />
                </div>
                

                {/* Real-time QR Scan KPI Card (Links directly to Analytics & Tracking) */}
                <div 
                  onClick={() => {
                    setActiveTab('analytics');
                    setShowScanLogs(true);
                  }}
                  className="bg-gradient-to-br from-orange-50 to-white border-2 border-[#F37021]/40 shadow-md shadow-orange-500/10 rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:border-[#F37021] hover:scale-[1.02] transition-all group"
                  title="Bấm vào đây để chuyển sang mục Analytics & Tracking và mở sổ data lượt truy cập"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#F37021] font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#F37021] animate-ping" />
                      Lượt Quét QR Đăng Ký
                    </span>
                  </div>
                  <div className="font-heading font-black text-3xl text-slate-900 mb-1 flex items-baseline justify-between">
                    <span>{qrStats.totalScans || 0} <span className="text-sm font-bold text-slate-500">lượt</span></span>
                   
                  </div>
                 
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Tổng Đội Thi Đấu</span>
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{teams.length} Đội</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Trận Đấu Đã Tạo</span>
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{matches.length} Trận</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Bài Viết Tin Tức</span>
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{news.length} Bài</div>
                </div>
              </div>

              {/* BIỂU ĐỒ ĐƯỜNG DÂY NỀN TỐI CHUẨN ANALYTICS (EXACT MATCH REFERENCE CHART) */}
              <div className="bg-[#0B0F19] border border-slate-800 shadow-2xl rounded-2xl p-6 space-y-6 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="font-heading font-black text-lg text-white uppercase tracking-wide flex items-center gap-2">
                      <p className=" h-5 text-[#5B8FF9]" />
                      BIỂU ĐỒ THEO DÕI CÁC LƯỢT TRUY CẬP
                    </h3>
                    <div className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Thống kê ngày: <strong className="text-white">28/09/2026</strong></span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">
                        {overviewTimeRange === 'TODAY' ? 'Xem theo 24h hôm nay' : overviewTimeRange === '7DAYS' ? 'Xem 7 ngày qua' : 'Tất cả thời gian'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Date / Month Range Filter Selector */}
                    <div className="flex items-center gap-1 bg-[#161B26] p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setOverviewTimeRange('TODAY')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          overviewTimeRange === 'TODAY'
                            ? 'bg-[#5B8FF9] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hôm Nay (28/09)
                      </button>
                      <button
                        onClick={() => setOverviewTimeRange('YESTERDAY')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          overviewTimeRange === 'YESTERDAY'
                            ? 'bg-[#5B8FF9] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hôm Qua (27/09)
                      </button>
                      <button
                        onClick={() => setOverviewTimeRange('7DAYS')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          overviewTimeRange === '7DAYS'
                            ? 'bg-[#5B8FF9] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        7 Ngày Qua
                      </button>
                      <button
                        onClick={() => setOverviewTimeRange('30DAYS')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          overviewTimeRange === '30DAYS'
                            ? 'bg-[#5B8FF9] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Tháng 9/2026
                      </button>
                    </div>

                    {/* Chart Filter Toggle Tabs */}
                    <div className="flex items-center gap-1 bg-[#161B26] p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setOverviewChartFilter('ALL')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          overviewChartFilter === 'ALL'
                            ? 'bg-[#5B8FF9] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Tất Cả
                      </button>
                      <button
                        onClick={() => setOverviewChartFilter('QR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          overviewChartFilter === 'QR'
                            ? 'bg-[#F37021] text-white shadow-sm'
                            : 'text-slate-400 hover:text-[#F37021]'
                        }`}
                      >
                        <p className=" h-3.5" /> Quét Form QR
                      </button>
                      <button
                        onClick={() => setOverviewChartFilter('LIVE')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          overviewChartFilter === 'LIVE'
                            ? 'bg-[#36CFC9] text-slate-950 font-black shadow-sm'
                            : 'text-slate-400 hover:text-[#36CFC9]'
                        }`}
                      >
                        <p className=" h-3.5" /> Xem Live
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculate Time Slots / Date Slots Based on overviewTimeRange */}
                {(() => {
                  let slotsData = [];

                  if (overviewTimeRange === 'TODAY') {
                    const slots12 = [
                      { label: '00:00', start: 0, end: 2, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '02:00', start: 2, end: 4, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '04:00', start: 4, end: 6, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '06:00', start: 6, end: 8, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '08:00', start: 8, end: 10, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '10:00', start: 10, end: 12, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '12:00', start: 12, end: 14, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '14:00', start: 14, end: 16, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '16:00', start: 16, end: 18, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '18:00', start: 18, end: 20, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '20:00', start: 20, end: 22, qr: 0, live: 0, fullDate: '28/09/2026' },
                      { label: '22:00', start: 22, end: 24, qr: 0, live: 0, fullDate: '28/09/2026' },
                    ];

                    (qrStats.recentScans || []).forEach(scan => {
                      const hour = scan.timestamp ? new Date(scan.timestamp).getHours() : 14;
                      const idx = Math.min(Math.floor(hour / 2), 11);
                      slots12[idx].qr += 1;
                    });

                    (liveStats.recentViews || []).forEach(view => {
                      const hour = view.timestamp ? new Date(view.timestamp).getHours() : 18;
                      const idx = Math.min(Math.floor(hour / 2), 11);
                      slots12[idx].live += 1;
                    });

                    slotsData = slots12.map(s => ({
                      ...s,
                      total: s.qr + s.live,
                      dateStr: `Hôm Nay (28/09/2026) - ${s.label}`
                    }));
                  } else if (overviewTimeRange === 'YESTERDAY') {
                    // Yesterday (27/09/2026) 24h timeline
                    const slotsYesterday = [
                      { label: '00:00', qr: 2, live: 5, fullDate: '27/09/2026' },
                      { label: '02:00', qr: 1, live: 3, fullDate: '27/09/2026' },
                      { label: '04:00', qr: 0, live: 1, fullDate: '27/09/2026' },
                      { label: '06:00', qr: 3, live: 8, fullDate: '27/09/2026' },
                      { label: '08:00', qr: 12, live: 25, fullDate: '27/09/2026' },
                      { label: '10:00', qr: 18, live: 34, fullDate: '27/09/2026' },
                      { label: '12:00', qr: 15, live: 28, fullDate: '27/09/2026' },
                      { label: '14:00', qr: 22, live: 42, fullDate: '27/09/2026' },
                      { label: '16:00', qr: 19, live: 38, fullDate: '27/09/2026' },
                      { label: '18:00', qr: 25, live: 55, fullDate: '27/09/2026' },
                      { label: '20:00', qr: 14, live: 30, fullDate: '27/09/2026' },
                      { label: '22:00', qr: 6, live: 12, fullDate: '27/09/2026' },
                    ];

                    slotsData = slotsYesterday.map(s => ({
                      ...s,
                      total: s.qr + s.live,
                      dateStr: `Hôm Qua (27/09/2026) - ${s.label}`
                    }));
                  } else if (overviewTimeRange === '7DAYS') {
                    // Last 7 days aggregation (22/09 to 28/09)
                    const days7 = [
                      { label: '22/09', fullDate: '22/09/2026', qr: 12, live: 45 },
                      { label: '23/09', fullDate: '23/09/2026', qr: 28, live: 80 },
                      { label: '24/09', fullDate: '24/09/2026', qr: 45, live: 110 },
                      { label: '25/09', fullDate: '25/09/2026', qr: 60, live: 140 },
                      { label: '26/09', fullDate: '26/09/2026', qr: 95, live: 210 },
                      { label: '27/09', fullDate: '27/09/2026', qr: 110, live: 260 },
                      { label: '28/09', fullDate: '28/09/2026', qr: qrStats.totalScans || 130, live: liveStats.totalViews || 310 },
                    ];

                    slotsData = days7.map(s => ({
                      ...s,
                      total: s.qr + s.live,
                      dateStr: `Ngày ${s.fullDate}`
                    }));
                  } else {
                    // 30 Days (Month 09/2026 milestones)
                    const monthDays = [
                      { label: '01/09', fullDate: '01/09/2026', qr: 5, live: 15 },
                      { label: '05/09', fullDate: '05/09/2026', qr: 18, live: 50 },
                      { label: '10/09', fullDate: '10/09/2026', qr: 35, live: 90 },
                      { label: '15/09', fullDate: '15/09/2026', qr: 50, live: 130 },
                      { label: '20/09', fullDate: '20/09/2026', qr: 85, live: 190 },
                      { label: '25/09', fullDate: '25/09/2026', qr: 115, live: 270 },
                      { label: '28/09', fullDate: '28/09/2026', qr: qrStats.totalScans || 140, live: liveStats.totalViews || 320 },
                    ];

                    slotsData = monthDays.map(s => ({
                      ...s,
                      total: s.qr + s.live,
                      dateStr: `Tháng 9/2026 - ${s.fullDate}`
                    }));
                  }

                  const maxVal = Math.max(...slotsData.map(s => Math.max(s.qr, s.live)), 1);
                  const peakSlot = [...slotsData].sort((a, b) => b.total - a.total)[0];

                  return (
                    <div className="space-y-6">
                      {/* Metric Summary Header Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#161B26] p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">Khung Điểm Cao Nhất</div>
                            <div className="text-sm font-black text-white flex items-center gap-1.5">
                              <span>{peakSlot.label}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-[#5B8FF9] text-[10px] font-bold border border-blue-500/30">
                                {peakSlot.total} lượt
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">Quét Form QR</div>
                            <div className="text-sm font-black text-white">
                              {qrStats.totalScans || 0} lượt
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">Xem Live Stream</div>
                            <div className="text-sm font-black text-white">
                              {liveStats.totalViews || 0} lượt
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reference Image Styled Dark SVG Chart */}
                      <div className="pt-4 pb-2 relative">
                        <div className="h-64 w-full relative bg-[#0B0F19] rounded-xl overflow-hidden border border-slate-800/80">
                          {/* Fine Vertical Grid Lines across all intervals */}
                          <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-25">
                            {slotsData.map((_, i) => (
                              <div key={i} className="h-full border-r border-slate-700 w-0" />
                            ))}
                          </div>

                          {/* Horizontal Grid lines */}
                          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-15">
                            <div className="border-b border-slate-600 w-full" />
                            <div className="border-b border-slate-600 w-full" />
                            <div className="border-b border-slate-600 w-full" />
                          </div>

                          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            {(() => {
                              const svgWidth = 600;
                              const svgHeight = 160;
                              const padX = 24;
                              const usableW = svgWidth - padX * 2;
                              const stepX = usableW / (slotsData.length - 1);

                              const qrPts = slotsData.map((s, i) => ({
                                x: padX + i * stepX,
                                y: svgHeight - Math.max((s.qr / maxVal) * (svgHeight - 40), 10),
                                val: s.qr,
                                slot: s.label
                              }));

                              const livePts = slotsData.map((s, i) => ({
                                x: padX + i * stepX,
                                y: svgHeight - Math.max((s.live / maxVal) * (svgHeight - 40), 10),
                                val: s.live,
                                slot: s.label
                              }));

                              // Straight Angled Polyline Generator (matching reference image)
                              const getPolylinePath = (pts) => {
                                if (pts.length === 0) return '';
                                return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                              };

                              const qrLinePath = getPolylinePath(qrPts);
                              const liveLinePath = getPolylinePath(livePts);

                              return (
                                <>
                                  {/* Line 1: QR Scan Solid Line (#5B8FF9 / #F37021) */}
                                  {(overviewChartFilter === 'ALL' || overviewChartFilter === 'QR') && (
                                    <>
                                      <path d={qrLinePath} fill="none" stroke="#5B8FF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      {qrPts.map((p, i) => (
                                        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#5B8FF9" stroke="#0B0F19" strokeWidth="1.5" />
                                      ))}
                                    </>
                                  )}

                                  {/* Line 2: Live View Dashed Line (#36CFC9 Cyan Dashed) */}
                                  {(overviewChartFilter === 'ALL' || overviewChartFilter === 'LIVE') && (
                                    <>
                                      <path d={liveLinePath} fill="none" stroke="#36CFC9" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" strokeLinejoin="round" />
                                      {livePts.map((p, i) => (
                                        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#36CFC9" stroke="#0B0F19" strokeWidth="1" />
                                      ))}
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </svg>

                          {/* Hover Nodes & Floating Tooltip Card with Date Details */}
                          <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                            {slotsData.map((slot, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-center pointer-events-auto group relative h-full">
                                {/* Vertical Active Guide Line on Hover */}
                                <div className="absolute inset-y-0 w-px bg-slate-700/80 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Exact Floating Tooltip Box matching user image */}
                                <div className="absolute bottom-12 hidden group-hover:flex flex-col items-start z-30 pointer-events-none">
                                  <div className="bg-[#161B26] text-white text-xs p-3 rounded-lg shadow-2xl border border-slate-700/90 whitespace-nowrap space-y-1.5 min-w-[160px]">
                                    <div className="font-bold text-slate-300 border-b border-slate-700/60 pb-1 text-[11px] flex items-center justify-between gap-2">
                                      <span>{slot.dateStr}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-200 text-[11px] font-semibold">
                                      <span className="w-2 h-2 rounded-full bg-[#5B8FF9]" />
                                      <span>Quét Form QR : <strong className="text-white">{slot.qr}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-200 text-[11px] font-semibold">
                                      <span className="w-2 h-2 rounded-full bg-[#36CFC9]" />
                                      <span>Xem Live Stream : <strong className="text-white">{slot.live}</strong></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* X-Axis Labels (Date / Time slots) */}
                        <div className="flex justify-between px-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {slotsData.map((s, idx) => (
                            <div key={idx} className="text-center">{s.label}</div>
                          ))}
                        </div>
                      </div>

                      {/* Reference Legend Footer */}
                      <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-400 flex-wrap border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 rounded bg-[#5B8FF9] border border-[#5B8FF9]" />
                          <span className="w-2 h-2 rounded-full bg-[#5B8FF9]" />
                          <span>Lượt Quét Form QR (Đường liền nét)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 rounded border-t-2 border-dashed border-[#36CFC9]" />
                          <span className="w-2 h-2 rounded-full bg-[#36CFC9]" />
                          <span>Lượt Xem Live Stream (Đường đứt nét)</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Quick Navigation to Analytics & Tracking Section */}
             
            </div>
          )}

          {/* ================= TAB 2: ANALYTICS & TRACKING ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Single Main Expandable QR Scan Tracking Module */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Module Header Bar */}
                <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                   
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                        DANH SÁCH LƯỢT TRUY CẬP QUÉT MÃ QR ĐĂNG KÝ 
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Tổng cộng: <strong className="text-white font-bold">{qrStats.totalScans || 0} lượt quét</strong> trên toàn hệ thống
                      </p>
                    </div>
                  </div>

                  {/* Single Main Toggle Button: "Lượt quét Form đăng ký" */}
                  <button
                    onClick={() => setShowScanLogs(!showScanLogs)}
                    className="px-5 py-3 rounded-xl bg-[#F37021] hover:bg-orange-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 border border-orange-400/40 whitespace-nowrap"
                  >
                    <span>Lượt quét Form đăng ký</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showScanLogs ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Collapsible Content Area */}
                <AnimatePresence>
                  {showScanLogs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-6"
                    >
                      {/* Analytics KPI Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Card 1: Total Scans */}
                        <div className="bg-white border-2 border-[#F37021]/30 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">TỔNG LƯỢT QUÉT QR</span>
                            <QrCode className="w-5 h-5 text-[#F37021]" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {qrStats.totalScans || 0} lượt quét
                          </div>
                        </div>

                        {/* Card 2: VALORANT Scans */}
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">VALORANT SCANS</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {qrStats.valorantScans ?? (qrStats.recentScans || []).filter(s => s.game === 'VALORANT').length} lượt quét
                          </div>
                        </div>

                        {/* Card 3: AOV Scans */}
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">AOV (LIÊN QUÂN) SCANS</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {qrStats.aovScans ?? (qrStats.recentScans || []).filter(s => s.game === 'AOV').length} lượt quét
                          </div>
                        </div>
                      </div>

                      {/* Filter Bar & Log Entries with 10-Item Pagination */}
                      {(() => {
                        const filteredScans = (qrStats.recentScans || []).filter(
                          s => scanLogFilter === 'ALL' || s.game === scanLogFilter
                        );
                        const totalPages = Math.ceil(filteredScans.length / ITEMS_PER_PAGE) || 1;
                        const validPage = Math.min(Math.max(1, scanLogPage), totalPages);
                        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
                        const paginatedScans = filteredScans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                        return (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                  <Filter className="w-3.5 h-3.5" /> Lọc Theo Bộ Môn:
                                </span>
                                {['ALL', 'VALORANT', 'AOV'].map((filterGame) => (
                                  <button
                                    key={filterGame}
                                    onClick={() => {
                                      setScanLogFilter(filterGame);
                                      setScanLogPage(1);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      scanLogFilter === filterGame
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                    }`}
                                  >
                                    {filterGame}
                                  </button>
                                ))}
                              </div>

                              <span className="text-xs text-slate-500 font-semibold">
                                Hiển thị {filteredScans.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredScans.length)} / {filteredScans.length} lượt ({qrStats.totalScans || 0} tổng)
                              </span>
                            </div>

                            {/* Log Entries Grid */}
                            {filteredScans.length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-300 rounded-2xl bg-white">
                                Chưa có dữ liệu lượt quét nào. Hãy thử click hoặc quét mã QR từ điện thoại!
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {paginatedScans.map((scan, index) => {
                                  const globalIndex = filteredScans.length - (startIndex + index);
                                  return (
                                    <div
                                      key={scan.id || (startIndex + index)}
                                      className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200 hover:border-[#F37021] shadow-sm transition-all"
                                    >
                                      <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F37021] border border-orange-200 flex items-center justify-center font-black text-sm">
                                          #{globalIndex}
                                        </div>

                                        <div>
                                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <span>Ghi nhận lượt quét thành công</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                                              scan.game === 'VALORANT'
                                                ? 'bg-rose-600'
                                                : scan.game === 'AOV'
                                                ? 'bg-amber-600'
                                                : 'bg-[#F37021]'
                                            }`}>
                                              {scan.game || 'GENERAL'}
                                            </span>
                                          </div>
                                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                                            <span>Thời gian: <strong className="text-slate-700">{scan.formattedTime || new Date(scan.timestamp).toLocaleString('vi-VN')}</strong></span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Pagination Controls Footer */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 flex-wrap gap-3">
                                <div className="text-xs font-bold text-slate-500">
                                  Trang <span className="text-slate-900 font-black">{validPage}</span> / {totalPages}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setScanLogPage(prev => Math.max(1, prev - 1))}
                                    disabled={validPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  >
                                     Trước
                                  </button>

                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                                    <button
                                      key={pNum}
                                      onClick={() => setScanLogPage(pNum)}
                                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                        validPage === pNum
                                          ? 'bg-[#F37021] text-white shadow-md shadow-orange-500/20'
                                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                                      }`}
                                    >
                                      {pNum}
                                    </button>
                                  ))}

                                  <button
                                    onClick={() => setScanLogPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={validPage >= totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  >
                                    Sau 
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Phân phối lượt quét theo bộ môn */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-heading font-bold text-md text-slate-900 mb-3 flex items-center gap-2">
                          <p className="h-4 text-[#F37021]" />
                          PHÂN PHỐI LƯỢT QUÉT THEO BỘ MÔN
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-rose-600">VALORANT (5V5)</span>
                              <span>
                                {qrStats.valorantScans ?? (qrStats.recentScans || []).filter(s => s.game === 'VALORANT').length} lượt
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${qrStats.totalScans ? (((qrStats.valorantScans ?? (qrStats.recentScans || []).filter(s => s.game === 'VALORANT').length)) / Math.max(qrStats.totalScans, 1)) * 100 : 0}%`
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-amber-600">LIÊN QUÂN / AOV (5V5)</span>
                              <span>
                                {qrStats.aovScans ?? (qrStats.recentScans || []).filter(s => s.game === 'AOV').length} lượt
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${qrStats.totalScans ? (((qrStats.aovScans ?? (qrStats.recentScans || []).filter(s => s.game === 'AOV').length)) / Math.max(qrStats.totalScans, 1)) * 100 : 0}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Module 2: Single Main Expandable Live Stream View Tracking Module */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
                {/* Module Header Bar */}
                <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                        DANH SÁCH LƯỢT XEM LIVE 
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Tổng cộng: <strong className="text-white font-bold">{liveStats.totalViews || 0} lượt xem</strong> trên toàn hệ thống
                      </p>
                    </div>
                  </div>

                  {/* Single Main Toggle Button: "Lượt xem Live" */}
                  <button
                    onClick={() => setShowLiveLogs(!showLiveLogs)}
                    className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 border border-cyan-400/40 whitespace-nowrap"
                  >
                    <span>Lượt xem Live</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLiveLogs ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Collapsible Content Area */}
                <AnimatePresence>
                  {showLiveLogs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-6"
                    >
                      {/* Live View KPI Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Card 1: Total Live Views */}
                        <div className="bg-white border-2 border-cyan-500/30 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">TỔNG LƯỢT XEM LIVE</span>
                            <Radio className="w-5 h-5 text-cyan-600 animate-pulse" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {liveStats.totalViews || 0} lượt xem
                          </div>
                        </div>

                        {/* Card 2: VALORANT Live Views */}
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">VALORANT LIVE VIEWS</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {liveStats.valorantViews ?? (liveStats.recentViews || []).filter(s => s.game === 'VALORANT').length} lượt xem
                          </div>
                        </div>

                        {/* Card 3: AOV Live Views */}
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase">AOV (LIÊN QUÂN) LIVE VIEWS</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                          </div>
                          <div className="font-heading font-black text-3xl text-slate-900 mb-1">
                            {liveStats.aovViews ?? (liveStats.recentViews || []).filter(s => s.game === 'AOV').length} lượt xem
                          </div>
                        </div>
                      </div>

                      {/* Filter Bar & Live Log Entries with 10-Item Pagination */}
                      {(() => {
                        const filteredViews = (liveStats.recentViews || []).filter(
                          s => liveLogFilter === 'ALL' || s.game === liveLogFilter
                        );
                        const totalPages = Math.ceil(filteredViews.length / ITEMS_PER_PAGE) || 1;
                        const validPage = Math.min(Math.max(1, liveLogPage), totalPages);
                        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
                        const paginatedViews = filteredViews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                        return (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                  <Filter className="w-3.5 h-3.5" /> Lọc Theo Bộ Môn:
                                </span>
                                {['ALL', 'VALORANT', 'AOV'].map((filterGame) => (
                                  <button
                                    key={filterGame}
                                    onClick={() => {
                                      setLiveLogFilter(filterGame);
                                      setLiveLogPage(1);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      liveLogFilter === filterGame
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                    }`}
                                  >
                                    {filterGame}
                                  </button>
                                ))}
                              </div>

                              <span className="text-xs text-slate-500 font-semibold">
                                Hiển thị {filteredViews.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredViews.length)} / {filteredViews.length} lượt ({liveStats.totalViews || 0} tổng)
                              </span>
                            </div>

                            {/* Log Entries Grid */}
                            {filteredViews.length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-300 rounded-2xl bg-white">
                                Chưa có dữ liệu lượt xem live nào. Hãy thử click xem Livestream trên ứng dụng!
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {paginatedViews.map((view, index) => {
                                  const globalIndex = filteredViews.length - (startIndex + index);
                                  return (
                                    <div
                                      key={view.id || (startIndex + index)}
                                      className="flex items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200 hover:border-cyan-500 shadow-sm transition-all"
                                    >
                                      <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center font-black text-sm">
                                          #{globalIndex}
                                        </div>

                                        <div>
                                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <span>Ghi nhận lượt xem Livestream</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                                              view.game === 'VALORANT'
                                                ? 'bg-rose-600'
                                                : view.game === 'AOV'
                                                ? 'bg-amber-600'
                                                : 'bg-cyan-600'
                                            }`}>
                                              {view.game || 'ALL'}
                                            </span>
                                          </div>
                                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                                            <span>Thời gian: <strong className="text-slate-700">{view.formattedTime || new Date(view.timestamp).toLocaleString('vi-VN')}</strong></span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Pagination Controls Footer */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 flex-wrap gap-3">
                                <div className="text-xs font-bold text-slate-500">
                                  Trang <span className="text-slate-900 font-black">{validPage}</span> / {totalPages}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setLiveLogPage(prev => Math.max(1, prev - 1))}
                                    disabled={validPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  >
                                    Trước
                                  </button>

                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                                    <button
                                      key={pNum}
                                      onClick={() => setLiveLogPage(pNum)}
                                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                        validPage === pNum
                                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                                      }`}
                                    >
                                      {pNum}
                                    </button>
                                  ))}

                                  <button
                                    onClick={() => setLiveLogPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={validPage >= totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  >
                                    Sau
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ================= TAB 3: LIVESTREAM ================= */}
          {activeTab === 'livestream' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                  QUẢN LÝ VIDEO LIVESTREAM THEO GAME
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStream.isLive ? 'bg-rose-100 text-rose-600 border border-rose-300' : 'bg-slate-200 text-slate-600'}`}>
                    {currentStream.isLive ? `● LIVE BROADCAST [${selectedStreamGame}]` : `○ OFFLINE [${selectedStreamGame}]`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Livestream Controls Form */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Chọn Game Để Cấu Hình Video Live</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'VALORANT', label: 'VALORANT', color: 'bg-rose-600 border-rose-500' },
                        { id: 'AOV', label: 'AOV (Liên Quân)', color: 'bg-cyan-600 border-cyan-500' },
                      ].map((g) => {
                        const isSelected = selectedStreamGame === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedStreamGame(g.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? `${g.color} text-white shadow-md shadow-slate-300 scale-[1.02]`
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{g.label}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu Đề Trực Tiếp ({selectedStreamGame})</label>
                    <input
                      type="text"
                      value={currentStream.title || ''}
                      onChange={(e) => setStreamsMap({
                        ...streamsMap,
                        [selectedStreamGame]: { ...currentStream, title: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#F37022] focus:bg-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stream Link YouTube / Embed URL ({selectedStreamGame})</label>
                    <input
                      type="text"
                      placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=cI5b71ZBAn0)"
                      value={currentStream.embedUrl || currentStream.url || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        setStreamsMap({
                          ...streamsMap,
                          [selectedStreamGame]: {
                            ...currentStream,
                            url: newUrl,
                            embedUrl: parseYouTubeEmbed(newUrl)
                          }
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#F37022] focus:bg-white outline-none font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const nextLiveState = !currentStream.isLive;
                        const updatedMap = {
                          ...streamsMap,
                          [selectedStreamGame]: {
                            ...currentStream,
                            isLive: nextLiveState,
                            embedUrl: parseYouTubeEmbed(currentStream.embedUrl || currentStream.url)
                          }
                        };
                        setStreamsMap(updatedMap);
                        await saveVideoLivestream(updatedMap);
                        triggerToast(nextLiveState ? `Đã BẬT stream live cho ${selectedStreamGame}!` : `Đã TẮT stream live cho ${selectedStreamGame}!`);
                      }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        currentStream.isLive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {currentStream.isLive ? `Tắt Stream Live (${selectedStreamGame})` : `Bật Stream Live (${selectedStreamGame})`}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await saveVideoLivestream(streamsMap);
                        triggerToast(`Đã lưu cấu hình livestream riêng cho [${selectedStreamGame}] vào CSDL Firestore!`);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Lưu Thay Đổi (Firestore)
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-sm text-slate-900 uppercase flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#F37022]" /> Xem Trước Khung Phát ({selectedStreamGame})
                    </h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase text-white shadow-sm ${
                      selectedStreamGame === 'VALORANT'
                        ? 'bg-rose-600'
                        : selectedStreamGame === 'AOV'
                        ? 'bg-cyan-600'
                        : 'bg-amber-500'
                    }`}>
                      {selectedStreamGame === 'ALL' ? 'TẤT CẢ GAME' : selectedStreamGame}
                    </span>
                  </div>
                  <div className="aspect-video bg-black rounded-xl border border-slate-300 overflow-hidden relative flex items-center justify-center">
                    {(currentStream.embedUrl || currentStream.url) ? (
                      <iframe
                        className="w-full h-full"
                        src={parseYouTubeEmbed(currentStream.embedUrl || currentStream.url)}
                        title={`Livestream Preview ${selectedStreamGame}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-slate-400 text-xs font-bold uppercase text-center p-4">
                        <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        Chưa nhập link video livestream cho {selectedStreamGame}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: TEAMS ================= */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                  QUẢN LÝ DANH SÁCH ĐỘI THI ({filteredTeams.length})
                </h2>
                <button
                  onClick={() => setShowAddTeamModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Đội Thi Mới
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên đội, tên trường..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-[#F37022]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-[#F37022]" />
                  <select
                    value={teamRegionFilter}
                    onChange={(e) => setTeamRegionFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#F37022] font-semibold"
                  >
                    <option value="ALL">Tất cả khu vực</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Nam">Miền Nam</option>
                  </select>
                  <select
                    value={teamGameFilter}
                    onChange={(e) => setTeamGameFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#F37022] font-semibold"
                  >
                    <option value="ALL">Tất cả bộ môn</option>
                    <option value="Valorant">VALORANT</option>
                    <option value="AOV">AOV (Liên Quân)</option>
                  </select>
                </div>
              </div>

              {/* Teams Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                        <th className="p-3.5">Tên Đội</th>
                        <th className="p-3.5">Trường & Khu Vực</th>
                        <th className="p-3.5">Bộ Môn</th>
                        <th className="p-3.5">Đội Trưởng</th>
                        <th className="p-3.5">Thành Viên (Roster)</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-slate-50 transition-colors text-slate-800">
                          <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                            {team.logo ? (
                              <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F37022] font-black text-xs flex items-center justify-center border border-orange-200 shrink-0 uppercase">
                                {team.name ? team.name.charAt(0) : 'T'}
                              </div>
                            )}
                            <span>{team.name}</span>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div>{team.school}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-orange-100 text-[#F37022] font-bold text-[10px]">{team.region}</span>
                          </td>
                          <td className="p-3.5"><span className="font-bold text-amber-600">{team.game}</span></td>
                          <td className="p-3.5 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F37022]" />
                            {team.captain}
                          </td>
                          <td className="p-3.5">
                            {(() => {
                              const filledCount = team.membersList
                                ? team.membersList.filter(m => m.name && m.name.trim() !== '' && !m.name.includes('Thành viên Dự bị')).length
                                : (team.captain ? 6 : 0);
                              const displayCount = filledCount > 0 ? filledCount : 7;
                              return (
                                <button
                                  type="button"
                                  onClick={() => setViewingTeamRoster(team)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-[#F37022] text-slate-700 text-[11px] font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Users className="w-3.5 h-3.5 text-[#F37022]" />
                                  <span>{displayCount}/7 Thành Viên</span>
                                </button>
                              );
                            })()}
                          </td>
                         
                          <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingTeamRoster(team)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                              title="Xem chi tiết 7 thành viên"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditTeam(team)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer"
                              title="Sửa thông tin đội"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors cursor-pointer"
                              title="Xóa đội"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: BRACKET ================= */}
          {activeTab === 'bracket' && (
            <div className="space-y-6">
              {/* Header with Game Switcher, Region Filters & Round Dropdown */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    QUẢN LÝ TỶ SỐ & LỊCH THI ĐẤU 
                  </h2>
                 
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Game Selector Buttons (VALORANT vs AOV) */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    {[
                      { id: 'VALORANT', label: 'VALORANT', color: 'bg-rose-600 text-white' },
                      { id: 'AOV', label: 'AOV (LIÊN QUÂN)', color: 'bg-amber-500 text-white' }
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedBracketGame(g.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          selectedBracketGame === g.id
                            ? `${g.color} shadow-sm`
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>

                  {/* Region Selector Buttons (Miền Bắc vs Miền Nam) */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    {[
                      { id: 'Miền Bắc', label: ' MIỀN BẮC', activeClass: 'bg-red-600 text-white shadow-sm' },
                      { id: 'Miền Nam', label: ' MIỀN NAM', activeClass: 'bg-blue-600 text-white shadow-sm' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setBracketRegionFilter(r.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          bracketRegionFilter === r.id
                            ? r.activeClass
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>



                  {/* Round Dropdown Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 pl-1">Vòng:</span>
                    <select
                      value={selectedBracketRound}
                      onChange={(e) => setSelectedBracketRound(e.target.value)}
                      className="bg-white text-slate-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-300 outline-none focus:border-[#F37022] cursor-pointer"
                    >
                      <option value="ALL"> Tất cả các vòng</option>
                      <option value="Vòng 1/16">Vòng loại miền (Tuần 1)</option>
                      <option value="Tứ Kết">Vòng loại miền (Tuần 2)</option>
                      <option value="Bán Kết">Bán Kết Miền</option>
                      <option value="Chung Kết">Chung Kết Miền</option>
                    </select>
                  </div>

                  {/* Reset All Matches Button */}
                  <button
                    type="button"
                    onClick={handleResetAllMatchesToEmpty}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="Đặt lại tất cả các trận đấu về -- Chọn Đội --"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt lại -- Chọn Đội --
                  </button>

                  {/* Add National Final Button */}
                  <button
                    type="button"
                    onClick={handleAddNationalFinal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="Thêm trận Chung Kết Toàn Quốc (Miền Bắc vs Miền Nam)"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    + Chung Kết Toàn Quốc
                  </button>
                </div>
              </div>

              {/* Match Cards List */}
              <div className="space-y-4">
                {matches
                  .filter(m => (m.game === selectedBracketGame || (!m.game && selectedBracketGame === 'VALORANT')) && (bracketRegionFilter === 'ALL' || m.region === bracketRegionFilter || m.region === 'Toàn Quốc'))
                  .filter(m => selectedBracketRound === 'ALL' || (m.round && m.round.includes(selectedBracketRound)))
                  .map((match) => {
                    const matchRegion = (match.region || 'Miền Bắc').trim().toLowerCase();
                    const currentBracketGame = (selectedBracketGame || 'VALORANT').trim().toLowerCase();
                    const isNationalFinal = match.region === 'Toàn Quốc' || (match.round && match.round.toLowerCase().includes('chung kết toàn quốc'));

                    // Strictly filter available teams created in Team Management
                    // For National Final (Toàn Quốc), allow selection from ALL regions (Miền Bắc & Miền Nam)
                    const teamsToRender = teams.filter(t => {
                      const teamGame = (t.game || 'VALORANT').trim().toLowerCase();
                      const matchesGame = teamGame === currentBracketGame || teamGame === 'all';

                      if (isNationalFinal) {
                        return matchesGame;
                      }

                      const teamRegion = (t.region || '').trim().toLowerCase();
                      const matchesRegion = teamRegion === matchRegion || teamRegion === 'all';

                      return matchesGame && matchesRegion;
                    });

                    return (
                      <div
                        key={match.id}
                        className={`rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 transition-all relative ${
                          isNationalFinal
                            ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                            : 'bg-white border border-slate-200 shadow-sm hover:border-orange-300'
                        }`}
                      >
                        {/* Left: Region Badge, Round & Match Info */}
                        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                          {isNationalFinal ? (
                            <span className="px-3 py-1 rounded-lg font-black text-xs bg-amber-500 text-white border border-amber-600 flex items-center gap-1 shadow-sm">
                              <Trophy className="w-3.5 h-3.5" /> CHUNG KẾT TOÀN QUỐC
                            </span>
                          ) : (
                            <>
                              <span className={`px-2.5 py-1 rounded-lg font-extrabold text-xs border ${
                                match.region === 'Miền Nam' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                 {match.region || 'Miền Bắc'}
                              </span>
                              <span className={`px-3 py-1 rounded-lg font-black text-xs border ${
                                match.round?.includes('Tuần 1')
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : match.round?.includes('Tuần 2')
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-orange-50 text-[#F37022] border-orange-200'
                              }`}>
                                {match.round}
                              </span>
                            </>
                          )}
                          {/* Match Status Selector (Sắp diễn ra, Đang thi đấu, Đã đấu) */}
                          <select
                            value={match.status || (match.winner != null ? 'DONE' : 'UPCOMING')}
                            onChange={(e) => handleMatchUpdate(match.id, 'status', e.target.value)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs border outline-none cursor-pointer transition-all ${
                              (match.status === 'LIVE' || match.status === 'Đang thi đấu')
                                ? 'bg-rose-50 text-rose-600 border-rose-300 font-black'
                                : (match.status === 'DONE' || match.status === 'Đã đấu')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-sky-50 text-sky-700 border-sky-300'
                            }`}
                          >
                            <option value="UPCOMING">Sắp diễn ra</option>
                            <option value="LIVE">Đang thi đấu</option>
                            <option value="DONE">Đã đấu</option>
                          </select>
                        </div>

                        {/* Middle 1: Date & Time Editors */}
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Ngày & Giờ:</span>
                          <input
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={match.date || ''}
                            onChange={(e) => handleMatchUpdate(match.id, 'date', e.target.value)}
                            className="w-24 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-800 focus:border-[#F37022] outline-none"
                          />
                          <input
                            type="text"
                            placeholder="hh:mm"
                            value={match.time || ''}
                            onChange={(e) => handleMatchUpdate(match.id, 'time', e.target.value)}
                            className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-800 focus:border-[#F37022] outline-none"
                          />
                        </div>

                        {/* Middle 2: Interactive Match Score & Dynamic Team Selectors */}
                        <div className="flex items-center justify-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
                          {/* Team 1 Searchable Combobox Selector */}
                          <SearchableTeamSelect
                            value={match.team1 || ''}
                            onChange={(val) => handleMatchUpdate(match.id, 'team1', val)}
                            teams={teamsToRender}
                            isWinner={match.winner === 1}
                            placeholder="-- Chọn Đội 1 (MB/MN) --"
                          />

                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={match.score1 ?? ''}
                            onChange={(e) => handleMatchUpdate(match.id, 'score1', e.target.value)}
                            placeholder="0"
                            className="w-11 text-center bg-slate-100 border border-slate-300 rounded-lg py-1 font-heading font-black text-sm text-slate-900 focus:border-[#F37022] outline-none"
                          />

                          <span className="text-slate-400 font-black text-xs px-1">VS</span>

                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={match.score2 ?? ''}
                            onChange={(e) => handleMatchUpdate(match.id, 'score2', e.target.value)}
                            placeholder="0"
                            className="w-11 text-center bg-slate-100 border border-slate-300 rounded-lg py-1 font-heading font-black text-sm text-slate-900 focus:border-[#F37022] outline-none"
                          />

                          {/* Team 2 Searchable Combobox Selector */}
                          <SearchableTeamSelect
                            value={match.team2 || ''}
                            onChange={(val) => handleMatchUpdate(match.id, 'team2', val)}
                            teams={teamsToRender}
                            isWinner={match.winner === 2}
                            placeholder="-- Chọn Đội 2 (MB/MN) --"
                          />
                        </div>

                        {/* Right: Winner Badge & Delete Match Button */}
                        <div className="flex items-center gap-3 shrink-0 justify-end">
                          <div className="text-xs font-bold text-right">
                            {match.winner ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                Thắng: {match.winner === 1 ? match.team1 : match.team2}
                              </span>
                            ) : (
                              <span className="text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                Đang chờ kết quả
                              </span>
                            )}
                          </div>

                          {/* Delete Match Button (Only for National Final matches) */}
                          {isNationalFinal && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMatch(match.id)}
                              className="p-2 text-[#F37022] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-amber-300 hover:border-rose-300 bg-amber-50"
                              title="Xóa trận Chung Kết Toàn Quốc này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= TAB 5: NEWS ================= */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                    QUẢN LÝ BÀI VIẾT TIN TỨC & HIGHLIGHTS ({news.length})
                  </h2>
                
                </div>
                <button
                  onClick={() => {
                    setEditingArticleId(null);
                    setNewArticle({
                      game: 'VALORANT',
                      title: '',
                      category: 'Tin tức',
                      author: 'Admin',
                      date: new Date().toISOString().split('T')[0],
                      time: '12:00',
                      summary: '',
                      content: '',
                      thumbnail: '',
                      videoEmbed: '',
                      isFeatured: false,
                      status: 'PUBLISHED'
                    });
                    setShowAddNewsModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Bài Viết Mới
                </button>
              </div>

              {/* Game Filter Bar */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
                <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#F37022]" /> Lọc Game:
                </span>
                {[
                  { id: 'ALL', label: 'Tất Cả Bài Viết' },
                  { id: 'VALORANT', label: 'VALORANT' },
                  { id: 'AOV', label: 'AOV (Liên Quân)' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setNewsGameFilter(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      newsGameFilter === g.id
                        ? 'bg-[#F37022] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {news
                  .filter(item => newsGameFilter === 'ALL' || item.game === newsGameFilter || item.game === 'ALL')
                  .map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      {/* Thumbnail or Video Preview */}
                      <div className="relative aspect-video bg-slate-900 border-b border-slate-100 overflow-hidden">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : item.videoEmbed ? (
                          <iframe src={parseYouTubeEmbed(item.videoEmbed)} title={item.title} className="w-full h-full pointer-events-none" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <Newspaper className="w-8 h-8" />
                          </div>
                        )}

                        {/* Game Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm ${
                            item.game === 'VALORANT'
                              ? 'bg-rose-600 text-white'
                              : item.game === 'AOV'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}>
                            {item.game || 'ALL GAME'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>

                        {item.videoEmbed && (
                          <div className="absolute bottom-2 right-2 bg-rose-600 text-white p-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow">
                            <Radio className="w-3 h-3 animate-pulse" /> Video
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                          <span>{item.date} {item.time ? `· ${item.time}` : ''}</span>
                          <span className="font-medium text-slate-500">Tác giả: {item.author || 'Admin'}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mb-1.5 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.summary || item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border-t border-slate-100">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{item.status || 'PUBLISHED'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditNews(item)}
                          className="p-1.5 rounded-lg bg-slate-200 hover:bg-[#F37022] hover:text-white text-slate-700 transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Team Modal with 5 Members & Vietnam Universities API Combobox */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-2xl w-full my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase flex items-center gap-2">
                  <p className="w-5 h-5 text-[#F37022]" /> {editingTeamId ? 'Chỉnh Sửa Thông Tin Đội Thi' : 'Thêm Đội Thi Đấu Mới (5 Chính + 1 Dự Bị)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTeam} className="space-y-4">
              {/* Logo Upload Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logo Đội Thi (Tải từ máy tính)
                </label>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {newTeam.logo ? (
                      <img src={newTeam.logo} alt="Logo Đội" className="w-full h-full object-cover" />
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="team-logo-file-input"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="team-logo-file-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F37022]" />
                      {newTeam.logo ? 'Đổi Logo Khác' : 'Tải Logo Từ Máy Tính'}
                    </label>
                    {newTeam.logo && (
                      <button
                        type="button"
                        onClick={() => setNewTeam({ ...newTeam, logo: '' })}
                        className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                      >
                        Xóa Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* University / College API Combobox */}
              <div className="relative">
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    Trường Đại Học / Cao Đẳng
                  </span>
                 
                </label>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Gõ để tìm tên trường Đại Học / Cao Đẳng tại Việt Nam..."
                    value={newTeam.school}
                    onFocus={() => setShowUniDropdown(true)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewTeam({ ...newTeam, school: val });
                      setSchoolSearchQuery(val);
                      setShowUniDropdown(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium pr-8"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* API University Dropdown List */}
                {showUniDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 p-1 divide-y divide-slate-100">
                    {universitiesList
                      .filter(u =>
                        !schoolSearchQuery ||
                        u.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
                        (u.shortName && u.shortName.toLowerCase().includes(schoolSearchQuery.toLowerCase()))
                      )

                      .map((uni) => (
                        <div
                          key={uni.id}
                          onClick={() => {
                            const selectedName = uni.shortName || uni.name;
                            const defaultTeamName = selectedName;
                            setNewTeam({
                              ...newTeam,
                              school: uni.name,
                              region: uni.region || newTeam.region,
                              name: newTeam.name || defaultTeamName
                            });
                            setShowUniDropdown(false);
                          }}
                          className="p-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{uni.name}</div>
                            {uni.shortName && uni.shortName !== uni.name && (
                              <div className="text-[10px] text-slate-500">Viết tắt: {uni.shortName}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {uni.type || 'Đại học'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#F37022]">
                              {uni.region || 'Việt Nam'}
                            </span>
                          </div>
                        </div>
                      ))}
                    {universitiesList.filter(u => !schoolSearchQuery || u.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())).length === 0 && (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Không tìm thấy trường khớp. Bạn có thể tự nhập tên trường trực tiếp!
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Game, Region, Team Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bộ Môn</label>
                  <select
                    value={newTeam.game}
                    onChange={(e) => setNewTeam({ ...newTeam, game: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                  >
                    <option value="Valorant">VALORANT</option>
                    <option value="AOV">AOV (Liên Quân)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khu Vực</label>
                  <select
                    value={newTeam.region}
                    onChange={(e) => setNewTeam({ ...newTeam, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                  >
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Nam">Miền Nam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Đội *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: ĐH FPT Hà Nội - VALORANT"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                  />
                </div>
              </div>

              {/* 7 Members Form Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <p className="w-4 h-4 text-[#F37022]" /> Nhập Danh Sách 7 Vận Động Viên (5 Chính + 2 Dự Bị)
                  </label>
                  <span className="text-[11px] font-bold text-[#F37022] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                    5 Chính + 2 Dự Bị
                  </span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {newTeamMembers.map((member, index) => (
                    <div key={member.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="sm:col-span-2 flex items-center gap-1.5">
                        <span className={`px-1.5 py-1 rounded text-[9px] font-black uppercase truncate ${
                          index === 0
                            ? 'bg-amber-500 text-white'
                            : index >= 5
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {index === 0 ? ' Đội trưởng' : index >= 5 ? ` Dự bị ${index - 4}` : `Thành viên ${index + 1}`}
                        </span>
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          required={index < 5}
                          placeholder={index >= 5 ? `Họ và tên dự bị ${index - 4}...` : `Họ và tên tuyển thủ ${index + 1}...`}
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...newTeamMembers];
                            updated[index].name = e.target.value;
                            setNewTeamMembers(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder={index >= 5 ? `In-game ID dự bị ${index - 4}...` : `In-game ID`}
                          value={member.ingame}
                          onChange={(e) => {
                            const updated = [...newTeamMembers];
                            updated[index].ingame = e.target.value;
                            setNewTeamMembers(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#F37022] outline-none font-mono text-[11px]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Role trong game..."
                          value={member.role || ''}
                          onChange={(e) => {
                            const updated = [...newTeamMembers];
                            updated[index].role = e.target.value;
                            setNewTeamMembers(updated);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTeamModal(false);
                    setEditingTeamId(null);
                    setNewTeam({ name: '', school: '', region: 'Miền Bắc', game: 'Valorant', captain: '', members: 7 });
                    setSchoolSearchQuery('');
                    setNewTeamMembers(DEFAULT_7_MEMBERS);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F37022] text-white text-xs font-bold hover:bg-orange-600 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {editingTeamId ? 'Lưu Cập Nhật Đội Thi' : 'Xác Nhận Thêm Đội 7 Thành Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Team 5 Members Roster Modal */}
      {viewingTeamRoster && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-lg w-full relative">
            <button
              type="button"
              onClick={() => setViewingTeamRoster(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold px-2"
            >
              ✕
            </button>

            <div className="mb-4 flex items-center gap-3">
              {viewingTeamRoster.logo ? (
                <img src={viewingTeamRoster.logo} alt={viewingTeamRoster.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#F37022] font-black text-base flex items-center justify-center border border-orange-200 shrink-0 uppercase">
                  {viewingTeamRoster.name ? viewingTeamRoster.name.charAt(0) : 'T'}
                </div>
              )}
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-orange-100 text-[#F37022] border border-orange-200">
                  {viewingTeamRoster.region} · {viewingTeamRoster.game}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-0.5 uppercase">
                  {viewingTeamRoster.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <p className="h-4 text-[#F37022]" /> {viewingTeamRoster.school}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span>DANH SÁCH 6 VẬN ĐỘNG VIÊN (5 CHÍNH + 1 DỰ BỊ)</span>
                <span className="text-emerald-600 text-[11px]">6 Vận Động Viên</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {(viewingTeamRoster.membersList || [
                  { id: 1, name: viewingTeamRoster.captain || 'Nguyễn Văn A', ingame: 'Captain_IGN', role: 'Đội trưởng' },
                  { id: 2, name: 'Thành viên 2', ingame: 'Member2_IGN', role: 'Thành viên' },
                  { id: 3, name: 'Thành viên 3', ingame: 'Member3_IGN', role: 'Thành viên' },
                  { id: 4, name: 'Thành viên 4', ingame: 'Member4_IGN', role: 'Thành viên' },
                  { id: 5, name: 'Thành viên 5', ingame: 'Member5_IGN', role: 'Thành viên' },
                ]).map((m, idx) => (
                  <div key={m.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        m.role === 'Đội trưởng' || idx === 0
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {(m.role === 'Đội trưởng' || idx === 0) && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[9px] font-black border border-amber-300">
                              ĐỘI TRƯỞNG
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                          <span>IGN: {m.ingame || `Player_${idx + 1}`}</span>
                          {m.phone && (
                            <span className="text-[#F37022] font-semibold flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {m.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingTeamRoster(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-xl w-full my-8">
            <h3 className="font-heading font-black text-lg text-slate-900 mb-4 uppercase flex items-center gap-2">
              {editingArticleId ? 'Chỉnh Sửa Bài Viết Tin Tức' : 'Tạo Bài Viết Tin Tức Mới'}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              {/* 2 DISTINCT GAME SELECTION BUTTONS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Đăng Cho Bộ Môn (Chọn Game):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewArticle({ ...newArticle, game: 'VALORANT' })}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wide border transition-all cursor-pointer ${
                      newArticle.game === 'VALORANT'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/50'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                   VALORANT
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewArticle({ ...newArticle, game: 'AOV' })}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wide border transition-all cursor-pointer ${
                      newArticle.game === 'AOV'
                        ? 'bg-cyan-600 text-white border-cyan-700 shadow-md shadow-cyan-600/30 ring-2 ring-cyan-500/50'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                     AOV (LIÊN QUÂN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewArticle({ ...newArticle, game: 'ALL' })}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wide border transition-all cursor-pointer ${
                      newArticle.game === 'ALL'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    CẢ 2 GAME
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Bài Viết *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Danh Mục</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                  >
                    <option value="Tin tức">Tin tức</option>
                    <option value="Highlight">Highlight Video</option>
                    <option value="Giải đấu">Giải đấu</option>
                    <option value="Lịch đấu">Lịch đấu</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày Đăng</label>
                  <input
                    type="date"
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                  />
                </div>
                
              </div>

              {/* Thumbnail URL, Video Embed & Article Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link Ảnh Thumbnail</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newArticle.thumbnail}
                    onChange={(e) => setNewArticle({ ...newArticle, thumbnail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link Video YouTube</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newArticle.videoEmbed}
                    onChange={(e) => setNewArticle({ ...newArticle, videoEmbed: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link Bài Viết Gốc (URL)</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/... hoặc https://..."
                    value={newArticle.articleUrl}
                    onChange={(e) => setNewArticle({ ...newArticle, articleUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tóm Tắt Ngắn (Mô tả)</label>
                <textarea
                  rows="2"
                  placeholder="Nhập đoạn tóm tắt hiển thị ngoài trang chủ..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Chi Tiết Bài Viết</label>
                <textarea
                  rows="4"
                  placeholder="Nhập nội dung đầy đủ bài viết khi bấm xem chi tiết..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-[#F37022] outline-none font-medium"
                />
              </div>

              {/* Author & Featured Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={newArticle.isFeatured}
                    onChange={(e) => setNewArticle({ ...newArticle, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#F37022] rounded focus:ring-[#F37022]"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer">
                    ★ Đánh dấu là Bài Viết Nổi Bật
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNewsModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F37022] text-white text-xs font-bold hover:bg-orange-600 shadow-md cursor-pointer"
                  >
                    {editingArticleId ? 'Lưu Cập Nhật' : 'Đăng Bài Viết'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
