import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, Newspaper } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const MOCK_NEWS = [
  {
    type: 'article',
    title: 'FanG Exports 2026: Giải đấu Esports Sinh viên lớn nhất quy tụ 32 trường',
    description: 'Chính thức khởi động giải đấu esports quy mô lớn dành cho sinh viên với tổng giải thưởng 80 triệu đồng.',
    thumbnail: null,
    url: '#',
    date: '20/09/2026',
  },
  {
    type: 'video',
    title: 'Highlight: Trận khai mạc Valorant — ĐH FPT Hà Nội vs ĐH Bách Khoa',
    description: 'Những pha gank và clutch đỉnh cao trong trận đấu khai mạc mùa giải 2026.',
    thumbnail: null,
    url: '#',
    date: '05/10/2026',
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    type: 'article',
    title: 'Phân tích meta AOV: Top 5 ứng viên vô địch khu vực miền Nam',
    description: 'Đánh giá chuyên sâu về đội hình Arena of Valor đến từ ĐH FPT TP.HCM và các trường miền Nam.',
    thumbnail: null,
    url: '#',
    date: '08/10/2026',
  },
  {
    type: 'video',
    title: 'VOD Livestream: Bán kết Bắc-AOV — ĐH FPT Hà Nội vs ĐH Bách Khoa',
    description: 'Trọn bộ video ghi hình livestream trận bán kết căng thẳng.',
    thumbnail: null,
    url: '#',
    date: '12/10/2026',
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

export default function News() {
  return (
    <section id="news" className="section-padding relative bg-gradient-to-b from-transparent via-[#1e130d]/70 to-transparent">
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
              TIN TỨC & HIGHLIGHTS
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {MOCK_NEWS.map((article, idx) => (
            <motion.article
              key={idx}
              {...fadeInUp}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-glass rounded-2xl overflow-hidden border-glow group"
            >
              {/* Thumbnail / Video */}
              <div className="relative aspect-video bg-[#150d09]">
                {article.type === 'video' && article.videoEmbed ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={article.videoEmbed}
                    title={article.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-950/40 via-[#1e130d] to-[#0e0906]">
                    <Newspaper className="w-12 h-12 text-[#F37022]/40" />
                  </div>
                )}

                {/* Video badge */}
                {article.type === 'video' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F37022] text-white text-xs font-black shadow-md">
                    <Play className="w-3 h-3 fill-current" />
                    HIGHLIGHT
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="text-xs font-semibold text-[#F37022] mb-2">{article.date}</div>
                <h3 className="font-heading font-bold text-white text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-[#F37022] transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{article.description}</p>
                <a
                  href={article.url}
                  className="inline-flex items-center gap-1.5 text-[#F37022] text-sm font-bold hover:text-amber-400 transition-colors"
                >
                  Xem chi tiết bài viết
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
