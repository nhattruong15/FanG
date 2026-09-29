import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LivestreamBanner from './components/LivestreamBanner';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import Rules from './components/Rules';
import Registration from './components/Registration';
import TeamList from './components/TeamList';
import Bracket from './components/Bracket';
import Sponsor from './components/Sponsor';
import News from './components/News';
import Workshop from './components/Workshop';
import GameSelector from './components/GameSelector';
import AdminConsole from './components/admin/AdminConsole';
import QrRedirect from './components/QrRedirect';
import { recordQrScan, recordPageVisit, updatePresenceHeartbeat, removePresenceSession } from './config/firebase';

export default function App() {
  // Kiểm tra xem trình duyệt có đang truy cập route ẩn /qr-register hay không
  const isQrRedirectRoute =
    window.location.pathname.toLowerCase().includes('/qr-register') ||
    window.location.hash.toLowerCase().includes('qr-register') ||
    window.location.search.toLowerCase().includes('qr-register') ||
    window.location.search.toLowerCase().includes('qr_register');

  if (isQrRedirectRoute) {
    return <QrRedirect />;
  }

  const [selectedGame, setSelectedGame] = useState(() => {
    return localStorage.getItem('fang_selected_game') || null;
  });

  const [isAdminView, setIsAdminView] = useState(() => {
    return localStorage.getItem('fang_is_admin_view') === 'true' || window.location.hash === '#admin';
  });

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    localStorage.setItem('fang_is_admin_view', 'true');
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    localStorage.setItem('fang_is_admin_view', 'false');
    if (window.location.hash === '#admin') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isQrAccess = 
        params.get('src') === 'qr_scan' || 
        params.get('scan') === 'qr' || 
        params.get('scan') === 'true' || 
        params.get('qr') === '1' ||
        params.get('ref') === 'qr' ||
        params.get('from') === 'qr';

      if (isQrAccess) {
        const sessionTrackedKey = `fang_qr_tracked_${window.location.search}`;
        if (!sessionStorage.getItem(sessionTrackedKey)) {
          const gameParam = params.get('game')?.toUpperCase() || 'GENERAL';
          recordQrScan(gameParam);
          sessionStorage.setItem(sessionTrackedKey, 'true');
        }
      }
    } catch (err) {
      console.warn('QR auto scan detection error:', err);
    }
  }, []);

  useEffect(() => {
    const openTabsKey = 'fang_open_tabs_count';
    const currentTabs = parseInt(localStorage.getItem(openTabsKey) || '0', 10);
    localStorage.setItem(openTabsKey, (currentTabs + 1).toString());

    const visitTrackedKey = 'fang_visit_tracked_session';
    if (!sessionStorage.getItem(visitTrackedKey)) {
      recordPageVisit();
      sessionStorage.setItem(visitTrackedKey, 'true');
    }

    const heartbeatInterval = setInterval(() => {
      updatePresenceHeartbeat();
    }, 30000);

    const handleUnload = () => {
      removePresenceSession();
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    localStorage.setItem('fang_selected_game', game);
  };

  const handleChangeGame = () => {
    setSelectedGame(null);
  };

  if (isAdminView) {
    return <AdminConsole onBackToLanding={handleCloseAdmin} />;
  }

  if (!selectedGame) {
    return <GameSelector onSelectGame={handleSelectGame} />;
  }

  return (
    <div className="h-screen overflow-x-hidden overflow-y-auto lg:snap-y lg:snap-proximity scroll-smooth bg-[#0e0906] text-slate-100 selection:bg-[#F37021] selection:text-white relative">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar selectedGame={selectedGame} onChangeGame={handleChangeGame} onOpenAdmin={handleOpenAdmin} />
        <LivestreamBanner selectedGame={selectedGame} />
      </header>

      <div className="snap-start scroll-mt-24">
        <Hero selectedGame={selectedGame} onChangeGame={handleChangeGame} />
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#F37021]/15 rounded-full blur-[180px] pointer-events-none" />
        <div className="hidden md:block absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#F37021]/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="hidden md:block absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#F37021]/20 rounded-full blur-[170px] pointer-events-none" />
        <div className="hidden md:block absolute top-3/4 left-1/4 w-[550px] h-[550px] bg-[#F37021]/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="snap-start scroll-mt-28">
          <Introduction selectedGame={selectedGame} onChangeGame={handleChangeGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <Rules selectedGame={selectedGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <Registration selectedGame={selectedGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <TeamList selectedGame={selectedGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <Bracket selectedGame={selectedGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <Sponsor />
        </div>
        <div className="snap-start scroll-mt-28">
          <News selectedGame={selectedGame} />
        </div>
        <div className="snap-start scroll-mt-28">
          <Workshop />
        </div>
      </div>

      <footer className="snap-start scroll-mt-28 border-t border-[#F37022]/20 bg-[#090503] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div>
              <button
                onClick={handleOpenAdmin}
                title="Truy cập Admin Console"
                className="font-heading font-black text-sm text-white hover:text-[#F37022] transition-colors cursor-pointer inline-flex items-center gap-1 group"
              >
                <span>FanG</span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#F37022] font-semibold transition-opacity">(Admin)</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Đang chọn: <strong className={selectedGame === 'valorant' ? 'text-[#ff4655]' : 'text-[#f39c12]'}>
              {selectedGame === 'valorant' ? 'VALORANT' : 'AOV (LIÊN QUÂN)'}
            </strong></span>
            <button
              onClick={handleChangeGame}
              className="text-[#F37022] hover:underline font-semibold"
            >
              [Đổi bộ môn]
            </button>
          </div>

          <p className="text-slate-500 text-xs text-center sm:text-right">
            © 2026 FanG Exports. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
