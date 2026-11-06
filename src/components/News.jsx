import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Newspaper, X, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeNews, parseYouTubeEmbed, INITIAL_NEWS_ARTICLES } from '../config/firebase';

const NEWS_PER_PAGE = 6;

const fadeInUp = {};

export default function News({ selectedGame, targetGame }) {
  const [newsList, setNewsList] = useState(INITIAL_NEWS_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsub = subscribeNews((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setNewsList(data);
      }
    });
    return () => unsub();
  }, []);

  const activeGame = (selectedGame || targetGame || 'ALL').toUpperCase();

  // Reset page when category/game changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGame, targetGame]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    if (selectedArticle) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  const filteredNews = newsList.filter(item => {
    if (activeGame === 'ALL') return true;
    const itemGame = (item.game || 'ALL').toUpperCase();
    return itemGame === activeGame || itemGame === 'ALL';
  });

  // Pagination calculation (6 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / NEWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * NEWS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIdx, startIdx + NEWS_PER_PAGE);

  return (
    <section id="news" className="section-padding relative bg-[#090503] text-slate-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-16 bg-[#F37022]/20 blur-[60px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-80">
              <div className="w-1.5 h-1.5 bg-[#F 37022] rotate-45" />
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white py-1 leading-tight tracking-wider uppercase">
              TIN TỨC
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-80">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45" />
            </div>
          </div>
        </motion.div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">Chưa có bài viết tin tức nào cho danh mục này.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
              {paginatedNews.map((article, idx) => (
                <motion.article
                  key={article.id || idx}
                  {...fadeInUp}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-[#120b08] rounded-xl sm:rounded-2xl border border-[#F37022]/20 shadow-lg hover:shadow-2xl hover:shadow-[#F37022]/20 hover:border-[#F37022]/60 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video bg-[#1e130c] overflow-hidden border-b border-[#F37022]/15">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" loading="lazy"
                        />
                      ) : article.videoEmbed ? (
                        <iframe
                          className="w-full h-full pointer-events-none"
                          src={parseYouTubeEmbed(article.videoEmbed)}
                          title={article.title}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1e130c] text-slate-600">
                          <Newspaper className="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>
                      )}

                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          article.game === 'VALORANT'
                            ? 'bg-rose-600 text-white'
                            : article.game === 'AOV'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {article.game || 'ALL'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-5 md:p-6">
                      <div className="flex items-center text-[10px] sm:text-xs text-[#F37022] font-bold mb-1.5 sm:mb-2.5">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        {article.date}
                      </div>

                      <h3 className="font-heading font-bold text-white text-xs sm:text-base md:text-lg mb-1.5 sm:mb-2.5 line-clamp-2 group-hover:text-[#F37022] transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-relaxed">
                        {article.summary || article.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-10 pt-6 border-t border-[#F37022]/15"
              >
                {/* Prev Button */}
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  disabled={safePage <= 1}
                  className={`p-2 rounded-xl border transition-all ${
                    safePage <= 1
                      ? 'border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
                      : 'border-slate-700 text-slate-300 hover:bg-white/10 hover:border-[#F37022] hover:text-[#F37022] cursor-pointer'
                  }`}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                        document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all ${
                        page === safePage
                          ? 'bg-[#F37022] text-white shadow-lg shadow-orange-900/40 scale-105'
                          : 'bg-white/5 text-slate-400 border border-slate-800 hover:bg-white/10 hover:text-white hover:border-[#F37022] cursor-pointer'
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
                    document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  disabled={safePage >= totalPages}
                  className={`p-2 rounded-xl border transition-all ${
                    safePage >= totalPages
                      ? 'border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
                      : 'border-slate-700 text-slate-300 hover:bg-white/10 hover:border-[#F37022] hover:text-[#F37022] cursor-pointer'
                  }`}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Page Info */}
                <span className="ml-3 text-xs text-slate-500 font-medium">
                  Trang {safePage}/{totalPages} · {filteredNews.length} bài viết
                </span>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <div
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#120b08] border border-[#F37022]/40 shadow-2xl rounded-3xl max-w-2xl w-full overflow-hidden my-6 relative text-slate-100 cursor-default"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-[#F37022] text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black">
                
                  <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full h-full object-cover" />
              
              </div>

              <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    selectedArticle.game === 'VALORANT'
                      ? 'bg-rose-600 text-white'
                      : selectedArticle.game === 'AOV'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {selectedArticle.game || 'ALL'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#F37022]" />
                    {selectedArticle.date}
                  </span>
                </div>

                <h2 className="font-heading font-black text-xl sm:text-2xl text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                {selectedArticle.summary && (
                  <div className="p-4 rounded-xl bg-[#1e140f] border-l-4 border-[#F37022] text-slate-200 text-sm font-medium">
                    {selectedArticle.summary}
                  </div>
                )}

                <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {selectedArticle.content || selectedArticle.summary || selectedArticle.description}
                </div>

                {(selectedArticle.articleUrl || selectedArticle.url || selectedArticle.link) && (
                  <div className="pt-4 border-t border-[#F37022]/20 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-medium">Nguồn bài viết / Link gốc:</span>
                    <a
                      href={selectedArticle.articleUrl || selectedArticle.url || selectedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F37022] hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <span>Xem bài viết gốc</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
