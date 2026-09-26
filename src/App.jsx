import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LivestreamBanner from './components/LivestreamBanner';
// Valorant Components
import HeroValorant from './components/valorant/Hero';
import IntroductionValorant from './components/valorant/Introduction';
import RulesValorant from './components/valorant/Rules';
import RegistrationValorant from './components/valorant/Registration';
import TeamListValorant from './components/valorant/TeamList';
import BracketValorant from './components/valorant/Bracket';
import SponsorValorant from './components/valorant/Sponsor';
import NewsValorant from './components/valorant/News';
import WorkshopValorant from './components/valorant/Workshop';

// AOV Components
import HeroAov from './components/aov/Hero';
import IntroductionAov from './components/aov/Introduction';
import RulesAov from './components/aov/Rules';
import RegistrationAov from './components/aov/Registration';
import TeamListAov from './components/aov/TeamList';
import BracketAov from './components/aov/Bracket';
import SponsorAov from './components/aov/Sponsor';
import NewsAov from './components/aov/News';
import WorkshopAov from './components/aov/Workshop';

import GameSelector from './components/GameSelector';
import AdminConsole from './components/admin/AdminConsole';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(() => {
    return localStorage.getItem('fang_selected_game') || null;
  });

  const [isAdminView, setIsAdminView] = useState(false);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    localStorage.setItem('fang_selected_game', game);
  };

  const handleChangeGame = () => {
    setSelectedGame(null);
  };

  if (!selectedGame) {
    return <GameSelector onSelectGame={handleSelectGame} />;
  }

  const isValorant = selectedGame === 'valorant';

  const Hero = isValorant ? HeroValorant : HeroAov;
  const Introduction = isValorant ? IntroductionValorant : IntroductionAov;
  const Rules = isValorant ? RulesValorant : RulesAov;
  const Registration = isValorant ? RegistrationValorant : RegistrationAov;
  const TeamList = isValorant ? TeamListValorant : TeamListAov;
  const Bracket = isValorant ? BracketValorant : BracketAov;
  const Sponsor = isValorant ? SponsorValorant : SponsorAov;
  const News = isValorant ? NewsValorant : NewsAov;
  const Workshop = isValorant ? WorkshopValorant : WorkshopAov;

  if (isAdminView) {
    return <AdminConsole onBackToLanding={() => setIsAdminView(false)} />;
  }

  return (
    <div className="h-screen overflow-x-hidden overflow-y-auto lg:snap-y lg:snap-proximity scroll-smooth bg-[#0e0906] text-slate-100 selection:bg-[#F37021] selection:text-white relative">
      {/* Header Container (Navbar + Livestream Banner) */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar selectedGame={selectedGame} onChangeGame={handleChangeGame} onOpenAdmin={() => setIsAdminView(true)} />
        <LivestreamBanner selectedGame={selectedGame} />
      </header>

      {/* Main Sections with Scroll Snap & Scroll Margin Top (Preventing Header Overlay) */}
      <div className="snap-start scroll-mt-24">
        <Hero selectedGame={selectedGame} onChangeGame={handleChangeGame} />
      </div>

      <div className="relative">
        {/* FPT Signature Orange #F37021 Ambient Atmospheric Glows throughout the page */}
        {/* Ambient glows — hidden on mobile for performance */}
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

      {/* Footer */}
      <footer className="snap-start scroll-mt-28 border-t border-[#F37022]/20 bg-[#090503] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div>
              <button
                onClick={() => setIsAdminView(true)}
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
