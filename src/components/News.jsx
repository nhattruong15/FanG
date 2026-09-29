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

export default function News({ selectedGame, targetGame }) {
  const [newsList, setNewsList] = useState(INITIAL_NEWS_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const unsub = subscribeNews((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setNewsList(data);
      }
    });
    return () => unsub();
  }, []);

  const activeGame = (selectedGame || targetGame || 'ALL').toUpperCase();

  const filteredNews = newsList.filter(item => {
    if (activeGame === 'ALL') return true;
    const itemGame = (item.game || 'ALL').toUpperCase();
    return itemGame === activeGame || itemGame === 'ALL';
  });

  return (
    <section id="news" className="section-padding relative bg-[#090503] text-slate-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-16 bg-[#F37022]/20 blur-[60px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-80">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45" />
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {filteredNews.map((article, idx) => (
              <motion.article
                key={article.id || idx}
                {...fadeInUp}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#120b08] rounded-xl sm:rounded-2xl border border-[#F37022]/20 shadow-lg hover:shadow-2xl hover:shadow-[#F37022]/20 hover:border-[#F37022]/60 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-video bg-[#1e130c] overflow-hidden border-b border-[#F37022]/15">
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

                    <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm line-clamp-2 mb-2 sm:mb-4 leading-relaxed">
                      {article.summary || article.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-5 md:p-6 pt-0">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1e140f] border border-[#F37022]/30 text-white hover:bg-[#F37022] hover:border-[#F37022] text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer shadow-xs group-hover:bg-[#F37022] group-hover:border-[#F37022]"
                  >
                    <span>Xem chi tiết</span>
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#120b08] border border-[#F37022]/40 shadow-2xl rounded-3xl max-w-2xl w-full overflow-hidden my-6 relative text-slate-100"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-[#F37022] text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black">
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
                  <div className="w-full h-full flex items-center justify-center bg-[#1e130c] text-slate-500">
                    <Newspaper className="w-16 h-16" />
                  </div>
                )}
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
