import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Newspaper, X, Calendar, Tag } from 'lucide-react';
import { subscribeNews, parseYouTubeEmbed, INITIAL_NEWS_ARTICLES } from '../config/firebase';

const fadeInUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.4 },
};

export default function News({ targetGame = 'ALL' }) {
  const [newsList, setNewsList] = useState(INITIAL_NEWS_ARTICLES);
  const [selectedGameFilter, setSelectedGameFilter] = useState(targetGame);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const unsub = subscribeNews((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setNewsList(data);
      }
    });
    return () => unsub();
  }, []);

  const filteredNews = newsList.filter(item => {
    if (selectedGameFilter === 'ALL') return true;
    return item.game === selectedGameFilter || item.game === 'ALL' || !item.game;
  });

  return (
    <section id="news" className="section-padding relative bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] text-slate-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-16 bg-[#F37022]/15 blur-[60px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-80">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45" />
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 py-1 leading-tight tracking-wider uppercase">
              TIN TỨC
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-80">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45" />
            </div>
          </div>
        </motion.div>

        {/* Game Filter Buttons */}
        {targetGame === 'ALL' && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-10">
            {[
              { id: 'ALL', label: 'TẤT CẢ TIN TỨC' },
              { id: 'VALORANT', label: '🔴 VALORANT' },
              { id: 'AOV', label: '🔷 AOV (LIÊN QUÂN)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedGameFilter(tab.id)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-heading font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedGameFilter === tab.id
                    ? 'bg-[#F37022] text-white shadow-lg shadow-[#F37022]/30 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#F37022] hover:text-[#F37022] shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* News Cards Grid with Uplift & Glow Hover Effect */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">Chưa có bài viết tin tức nào cho danh mục này.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredNews.map((article, idx) => (
              <motion.article
                key={article.id || idx}
                {...fadeInUp}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:shadow-[#F37022]/15 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Thumbnail / Video Image Header */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                    {article.thumbnail ? (
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    ) : article.videoEmbed ? (
                      <iframe
                        className="w-full h-full pointer-events-none"
                        src={parseYouTubeEmbed(article.videoEmbed)}
                        title={article.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Newspaper className="w-12 h-12" />
                      </div>
                    )}

                    {/* Game Badge Only */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${
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

                  {/* Content Area */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center text-xs text-[#F37022] font-bold mb-2.5">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {article.date} {article.time ? `· ${article.time}` : ''}
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg mb-2.5 line-clamp-2 group-hover:text-[#F37022] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                      {article.summary || article.description}
                    </p>
                  </div>
                </div>

                {/* Footer Read Details Button */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-[#F37022] hover:border-[#F37022] hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shadow-xs group-hover:bg-[#F37022] group-hover:border-[#F37022] group-hover:text-white"
                  >
                    Xem chi tiết bài viết
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Light-Themed Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-2xl w-full overflow-hidden my-6 relative text-slate-900"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-[#F37022] text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video or Thumbnail Header */}
              <div className="relative aspect-video bg-slate-900">
                {selectedArticle.videoEmbed ? (
                  <iframe
                    className="w-full h-full"
                    src={parseYouTubeEmbed(selectedArticle.videoEmbed)}
                    title={selectedArticle.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedArticle.thumbnail ? (
                  <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <Newspaper className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Modal Body */}
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
                  <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#F37022]" />
                    {selectedArticle.date} {selectedArticle.time ? `· ${selectedArticle.time}` : ''}
                  </span>
                </div>

                <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                {selectedArticle.summary && (
                  <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-[#F37022] text-slate-700 text-sm font-medium">
                    {selectedArticle.summary}
                  </div>
                )}

                <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {selectedArticle.content || selectedArticle.summary || selectedArticle.description}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end text-xs text-slate-400 font-bold">
                  <span className="text-[#F37022]">FanG Esports Tournament</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
