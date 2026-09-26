import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ShieldCheck,
} from 'lucide-react';

import {
  INITIAL_VIDEO_LIVESTREAM,
  parseYouTubeEmbed,
  saveVideoLivestream,
  subscribeVideoLivestream,
  verifyAdminCredentials,
} from '../../config/firebase';

/* ====================================================================
   INITIAL MOCK DATA FOR ADMIN CONSOLE
   ==================================================================== */
const INITIAL_LIVESTREAM = INITIAL_VIDEO_LIVESTREAM;

const INITIAL_TEAMS = [
  { id: 1, name: 'ĐH FPT Hà Nội', school: 'Đại Học FPT', region: 'Miền Bắc', game: 'Valorant', captain: 'Nguyễn Văn A', members: 5, status: 'VERIFIED' },
  { id: 2, name: 'ĐH FPT TP.HCM', school: 'Đại Học FPT', region: 'Miền Nam', game: 'Valorant', captain: 'Trần Văn B', members: 5, status: 'VERIFIED' },
  { id: 3, name: 'ĐH Bách Khoa HN', school: 'ĐH Bách Khoa', region: 'Miền Bắc', game: 'AOV', captain: 'Lê Hoàng C', members: 5, status: 'VERIFIED' },
  { id: 4, name: 'ĐH HUTECH', school: 'ĐH HUTECH', region: 'Miền Nam', game: 'AOV', captain: 'Phạm Minh D', members: 5, status: 'VERIFIED' },
  { id: 5, name: 'ĐH Kinh Tế QD', school: 'ĐH Kinh Tế Quốc Dân', region: 'Miền Bắc', game: 'Valorant', captain: 'Vũ Quốc E', members: 5, status: 'PENDING' },
];

const INITIAL_BRACKET_MATCHES = [
  { id: 'M1', region: 'Miền Bắc', round: 'Vòng 1/16', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Bách Khoa HN', score1: 2, score2: 0, status: 'DONE', winner: 1 },
  { id: 'M2', region: 'Miền Bắc', round: 'Vòng 1/16', team1: 'ĐH Kinh Tế QD', team2: 'ĐH Quốc Gia HN', score1: 2, score2: 1, status: 'DONE', winner: 1 },
  { id: 'M3', region: 'Miền Bắc', round: 'Tứ Kết', team1: 'ĐH FPT Hà Nội', team2: 'ĐH Kinh Tế QD', score1: 2, score2: 0, status: 'DONE', winner: 1 },
  { id: 'M4', region: 'Miền Bắc', round: 'Bán Kết', team1: 'ĐH FPT Hà Nội', team2: 'Học Viện Bưu Chính', score1: 3, score2: 1, status: 'DONE', winner: 1 },
  { id: 'M5', region: 'Miền Nam', round: 'Chung Kết', team1: 'ĐH FPT TP.HCM', team2: 'ĐH HUTECH', score1: 0, score2: 0, status: 'UPCOMING', date: '20/10 - 17:00' },
];

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

  // Real-time State Management from Firestore
  const [livestream, setLivestream] = useState(INITIAL_LIVESTREAM);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [matches, setMatches] = useState(INITIAL_BRACKET_MATCHES);
  const [news, setNews] = useState(INITIAL_NEWS);

  // Subscribe to real-time Firestore database collection "videolivestream"
  React.useEffect(() => {
    const unsub = subscribeVideoLivestream((data) => {
      if (data) setLivestream(data);
    });
    return () => unsub();
  }, []);

  // Filters & Search
  const [teamSearch, setTeamSearch] = useState('');
  const [teamGameFilter, setTeamGameFilter] = useState('ALL');
  const [bracketRegionFilter, setBracketRegionFilter] = useState('Miền Bắc');

  // Modals & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);

  // New Team Form State
  const [newTeam, setNewTeam] = useState({ name: '', school: '', region: 'Miền Bắc', game: 'Valorant', captain: '', members: 5 });
  // New Article Form State
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Giải đấu', author: 'Admin', isFeatured: false });

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

  // Add Team Handler
  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name) return;
    const teamToAdd = {
      id: Date.now(),
      ...newTeam,
      status: 'VERIFIED',
    };
    setTeams([teamToAdd, ...teams]);
    setShowAddTeamModal(false);
    setNewTeam({ name: '', school: '', region: 'Miền Bắc', game: 'Valorant', captain: '', members: 5 });
    triggerToast('Đã thêm đội tuyển thành công!');
  };

  // Add Article Handler
  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const articleToAdd = {
      id: Date.now(),
      ...newArticle,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'PUBLISHED',
    };
    setNews([articleToAdd, ...news]);
    setShowAddNewsModal(false);
    setNewArticle({ title: '', category: 'Giải đấu', author: 'Admin', isFeatured: false });
    triggerToast('Đã đăng bài viết tin tức mới thành công!');
  };

  // Delete Handlers
  const handleDeleteTeam = (id) => {
    setTeams(teams.filter(t => t.id !== id));
    triggerToast('Đã xóa đội tuyển.');
  };

  const handleDeleteNews = (id) => {
    setNews(news.filter(n => n.id !== id));
    triggerToast('Đã xóa bài viết.');
  };

  // Update Match Score
  const handleScoreChange = (matchId, field, value) => {
    setMatches(matches.map(m => {
      if (m.id === matchId) {
        const updated = { ...m, [field]: Number(value) };
        if (updated.score1 > updated.score2) updated.winner = 1;
        else if (updated.score2 > updated.score1) updated.winner = 2;
        else updated.winner = null;
        return updated;
      }
      return m;
    }));
    triggerToast('Đã cập nhật tỷ số trận đấu!');
  };

  // Filtered Teams
  const filteredTeams = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(teamSearch.toLowerCase()) || t.school.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesGame = teamGameFilter === 'ALL' || t.game.toLowerCase() === teamGameFilter.toLowerCase();
    return matchesSearch && matchesGame;
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
              FanG <span className="text-[#F37022]">ADMIN CONSOLE</span>
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
            { id: 'overview', label: 'Tổng Quan (KPIs)' },
            { id: 'livestream', label: 'Quản Lý Livestream' },
            { id: 'teams', label: 'Quản Lý Đội Thi' },
            { id: 'bracket', label: 'Quản Lý Bảng Đấu' },
            { id: 'news', label: 'Quản Lý Tin Tức' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#F37022] text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Luồng Trực Tiếp</span>
                    <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">
                    {livestream.isLive ? 'ĐANG PHÁT LIVE' : 'TẮT'}
                  </div>
                  <div className="text-xs text-amber-600 font-semibold">{livestream.viewers.toLocaleString()} người xem</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Tổng Đội Thi Đấu</span>
                    <Users className="w-5 h-5 text-[#F37022]" />
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{teams.length} Đội</div>
                  <div className="text-xs text-emerald-600 font-semibold">100% Đã xác minh</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Trận Đấu Đã Tạo</span>
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{matches.length} Trận</div>
                  <div className="text-xs text-slate-500 font-semibold">Miền Bắc & Miền Nam</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">Bài Viết Tin Tức</span>
                    <Newspaper className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="font-heading font-black text-2xl text-slate-900 mb-1">{news.length} Bài</div>
                  <div className="text-xs text-slate-500 font-semibold">Xuất bản trên trang tin</div>
                </div>
              </div>

              {/* Quick System Summary */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <h3 className="font-heading font-bold text-md text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F37022]" />
                  TRẠNG THÁI LUỒNG PHÁT HIỆN TẠI
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-1">{livestream.title}</div>
                    <div className="text-xs text-slate-500">Nền tảng: {livestream.platform} · {livestream.startTime}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('livestream')}
                    className="px-4 py-2 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Chỉnh Sửa Livestream ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: LIVESTREAM ================= */}
          {activeTab === 'livestream' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                  QUẢN LÝ VIDEO LIVESTREAM
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${livestream.isLive ? 'bg-rose-100 text-rose-600 border border-rose-300' : 'bg-slate-200 text-slate-600'}`}>
                    {livestream.isLive ? '● LIVE BROADCAST' : '○ OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Livestream Controls Form */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu Đề Trực Tiếp</label>
                    <input
                      type="text"
                      value={livestream.title}
                      onChange={(e) => setLivestream({ ...livestream, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#F37022] focus:bg-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stream Link YouTube / Embed URL</label>
                    <input
                      type="text"
                      placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=cI5b71ZBAn0)"
                      value={livestream.embedUrl || livestream.url || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        setLivestream({
                          ...livestream,
                          url: newUrl,
                          embedUrl: parseYouTubeEmbed(newUrl)
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#F37022] focus:bg-white outline-none font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={async () => {
                        const nextLiveState = !livestream.isLive;
                        const updated = {
                          ...livestream,
                          isLive: nextLiveState,
                          embedUrl: parseYouTubeEmbed(livestream.embedUrl || livestream.url)
                        };
                        setLivestream(updated);
                        await saveVideoLivestream(updated);
                        triggerToast(nextLiveState ? 'Đã bật phát luồng livestream (Đã lưu CSDL!)' : 'Đã tắt luồng livestream (Đã lưu CSDL!)');
                      }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        livestream.isLive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {livestream.isLive ? 'Tắt Stream Live' : 'Bật Stream Live'}
                    </button>

                    <button
                      onClick={async () => {
                        const payload = {
                          ...livestream,
                          embedUrl: parseYouTubeEmbed(livestream.embedUrl || livestream.url)
                        };
                        await saveVideoLivestream(payload);
                        triggerToast('Đã lưu cấu hình livestream vào CSDL Firestore!');
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Lưu Thay Đổi (Firestore)
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                  <h3 className="font-heading font-bold text-sm text-slate-900 uppercase mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#F37022]" /> Xem Trước Khung Phát (Preview)
                  </h3>
                  <div className="aspect-video bg-black rounded-xl border border-slate-300 overflow-hidden relative flex items-center justify-center">
                    {(livestream.embedUrl || livestream.url) ? (
                      <iframe
                        className="w-full h-full"
                        src={parseYouTubeEmbed(livestream.embedUrl || livestream.url)}
                        title="Livestream Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-slate-400 text-xs font-bold uppercase text-center p-4">
                        <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        Chưa nhập link video livestream
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
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-[#F37022]" />
                  <select
                    value={teamGameFilter}
                    onChange={(e) => setTeamGameFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#F37022]"
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
                        <th className="p-3.5">Trường</th>
                        <th className="p-3.5">Khu Vực</th>
                        <th className="p-3.5">Bộ Môn</th>
                        <th className="p-3.5">Đội Trưởng</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-slate-50 transition-colors text-slate-800">
                          <td className="p-3.5 font-bold text-slate-900">{team.name}</td>
                          <td className="p-3.5 text-slate-600">{team.school}</td>
                          <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-orange-100 text-[#F37022] font-bold">{team.region}</span></td>
                          <td className="p-3.5"><span className="font-bold text-amber-600">{team.game}</span></td>
                          <td className="p-3.5 font-medium">{team.captain}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                              {team.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
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
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                  QUẢN LÝ TỶ SỐ BẢNG ĐẤU 16 ĐỘI
                </h2>
                <div className="flex gap-2">
                  {['Miền Bắc', 'Miền Nam'].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setBracketRegionFilter(reg)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        bracketRegionFilter === reg
                          ? 'bg-[#F37022] text-white shadow-md'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {matches.filter(m => m.region === bracketRegionFilter).map((match) => (
                  <div key={match.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-orange-100 text-[#F37022] font-bold text-xs border border-orange-200">
                        {match.round}
                      </span>
                      <span className="text-xs text-slate-500">Mã trận: <strong className="text-slate-900">{match.id}</strong></span>
                    </div>

                    {/* Interactive Match Score Editors */}
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${match.winner === 1 ? 'text-[#F37022]' : 'text-slate-800'}`}>{match.team1}</span>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={match.score1 ?? 0}
                        onChange={(e) => handleScoreChange(match.id, 'score1', e.target.value)}
                        className="w-10 text-center bg-slate-50 border border-slate-300 rounded-lg py-1 font-heading font-black text-sm text-slate-900 focus:border-[#F37022] outline-none"
                      />
                      <span className="text-slate-400 font-bold text-xs">VS</span>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={match.score2 ?? 0}
                        onChange={(e) => handleScoreChange(match.id, 'score2', e.target.value)}
                        className="w-10 text-center bg-slate-50 border border-slate-300 rounded-lg py-1 font-heading font-black text-sm text-slate-900 focus:border-[#F37022] outline-none"
                      />
                      <span className={`font-bold text-sm ${match.winner === 2 ? 'text-[#F37022]' : 'text-slate-800'}`}>{match.team2}</span>
                    </div>

                    <div className="text-xs text-emerald-600 font-bold">
                      {match.winner ? `Đội Thắng: ${match.winner === 1 ? match.team1 : match.team2}` : 'Hòa / Đang chờ'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: NEWS ================= */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wider">
                  QUẢN LÝ BÀI VIẾT TIN TỨC ({news.length})
                </h2>
                <button
                  onClick={() => setShowAddNewsModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#F37022] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Bài Viết Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-[#F37022] text-[10px] font-bold">
                          {item.category}
                        </span>
                        {item.isFeatured && (
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                            ★ Nổi bật
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                      <div className="text-xs text-slate-500">Tác giả: {item.author} · {item.date}</div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{item.status}</span>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-heading font-black text-lg text-slate-900 mb-4 uppercase">Thêm Đội Thi Đấu Mới</h3>
            <form onSubmit={handleAddTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Đội</label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Trường</label>
                <input
                  type="text"
                  required
                  value={newTeam.school}
                  onChange={(e) => setNewTeam({ ...newTeam, school: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khu Vực</label>
                  <select
                    value={newTeam.region}
                    onChange={(e) => setNewTeam({ ...newTeam, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                  >
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Nam">Miền Nam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bộ Môn</label>
                  <select
                    value={newTeam.game}
                    onChange={(e) => setNewTeam({ ...newTeam, game: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                  >
                    <option value="Valorant">VALORANT</option>
                    <option value="AOV">AOV</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F37022] text-white text-xs font-bold hover:bg-orange-600 shadow-md"
                >
                  Thêm Đội
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-heading font-black text-lg text-slate-900 mb-4 uppercase">Tạo Bài Viết Tin Tức Mới</h3>
            <form onSubmit={handleAddArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Danh Mục</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#F37022] outline-none"
                >
                  <option value="Giải đấu">Giải đấu</option>
                  <option value="Tin tức">Tin tức</option>
                  <option value="Lịch đấu">Lịch đấu</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F37022] text-white text-xs font-bold hover:bg-orange-600 shadow-md"
                >
                  Đăng Bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
