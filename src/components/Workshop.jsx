import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, X, ChevronRight as ArrowRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const WORKSHOPS = [
  {
    id: 1,
    title: 'Workshop 1: Chiến thuật Valorant nâng cao',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    date: '15/09/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH FPT Hà Nội',
    guest: 'Coach ProX (FPT Esports)',
    description: 'Phân tích bản đồ, chiến thuật push site, và cách giao tiếp hiệu quả trong ranked.',
    color: 'from-[#F37021]/20 to-orange-600/10',
    borderColor: 'border-[#F37021]/40',
  },
  {
    id: 2,
    title: 'Workshop 2: Đào tạo đội hình AOV chuyên nghiệp',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    date: '22/09/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH FPT TP.HCM',
    guest: 'Pro Player AlphaKing',
    description: 'Build đội hình meta, kỹ năng giao tranh teamfight và phối hợp đồng đội 5v5.',
    color: 'from-[#F37021]/20 to-amber-600/10',
    borderColor: 'border-[#F37021]/40',
  },
  {
    id: 3,
    title: 'Workshop 3: Content Creation & Streaming Esports',
    thumbnail: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    date: '29/09/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH FPT Đà Nẵng',
    guest: 'Streamer VietGaming (FanG)',
    description: 'Hướng dẫn tạo video highlight, livestream và xây dựng thương hiệu cá nhân gamer.',
    color: 'from-blue-600/20 to-indigo-600/10',
    borderColor: 'border-blue-500/40',
  },
  {
    id: 4,
    title: 'Workshop 4: Tâm lý thi đấu & Mental Game',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    date: '06/10/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH FPT Cần Thơ',
    guest: 'Chuyên gia Tâm lý Dr. Lan',
    description: 'Quản lý stress, giữ vững sự tập trung dưới áp lực sân thi đấu lớn.',
    color: 'from-emerald-600/20 to-teal-600/10',
    borderColor: 'border-emerald-500/40',
  },
  {
    id: 5,
    title: 'Workshop 5: Định hướng sự nghiệp Ngành Esports',
    thumbnail: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80',
    date: '13/10/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH FPT Quy Nhơn',
    guest: 'Chuyên gia từ FPT Telecom',
    description: 'Con đường phát triển nghề nghiệp: Pro Player, Coach, Caster, Manager & Event Planner.',
    color: 'from-[#F37021]/20 to-orange-600/10',
    borderColor: 'border-[#F37021]/40',
  },
  {
    id: 6,
    title: 'Workshop 6: Kỹ năng Aim & Phản xạ Đỉnh cao',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    date: '20/10/2026',
    time: '14:00 – 16:30',
    venue: 'ĐH Bách Khoa HN',
    guest: 'AimLab Certified Coach',
    description: 'Hướng dẫn luyện tập kĩ năng ngắm bắn, crosshair placement và bài tập reflex.',
    color: 'from-amber-600/20 to-orange-600/10',
    borderColor: 'border-amber-500/40',
  },
];

export default function Workshop() {
  const scrollRef = useRef(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="workshop" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div {...fadeInUp} className="text-center mb-8 sm:mb-14 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-[#F37022]/20 blur-[50px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F37022] to-[#F37022]" />
            </div>

            <h2 className="font-heading font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-400 py-2 leading-tight tracking-wider drop-shadow-[0_0_30px_rgba(243,112,34,0.75)] uppercase">
              LỊCH 6 BUỔI WORKSHOP
            </h2>

            <div className="hidden sm:flex items-center gap-1.5 opacity-70">
              <div className="w-12 sm:w-20 md:w-24 h-[2px] bg-gradient-to-r from-[#F37022] via-[#F37022] to-transparent" />
              <div className="w-1.5 h-1.5 bg-[#F37022] rotate-45 shadow-[0_0_8px_#F37022]" />
            </div>
          </div>
          <p className="sm:hidden text-xs text-slate-400 mt-2">
            Nhấp vào từng buổi Workshop để xem thông tin chi tiết
          </p>
        </motion.div>

        <div className="hidden sm:flex justify-end gap-2 mb-4">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-[#F37021]/20 border border-slate-700 hover:border-[#F37021] text-slate-300 hover:text-[#F37021] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-[#F37021]/20 border border-slate-700 hover:border-[#F37021] text-slate-300 hover:text-[#F37021] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="block sm:hidden space-y-4">
          {WORKSHOPS.map((ws, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedWorkshop(ws)}
              className={`cursor-pointer overflow-hidden rounded-2xl bg-[#140c08] border ${ws.borderColor} shadow-lg hover:border-[#F37021] transition-all flex flex-col`}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={ws.thumbnail}
                  alt={ws.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#140c08]/40 to-transparent" />

                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F37021] text-white font-heading font-black text-xs shadow-md">
                  <span>Buổi {idx + 1}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2">
                    {ws.title}
                  </h3>

                  <p className="text-slate-300 text-xs line-clamp-2 mb-3">
                    {ws.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#F37021] flex-shrink-0" />
                    <span className="font-semibold text-slate-200">{ws.date} ({ws.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{ws.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate font-medium">{ws.guest}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeInUp} className="hidden sm:block">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory"
          >
            {WORKSHOPS.map((ws, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedWorkshop(ws)}
                className={`cursor-pointer flex-shrink-0 w-[340px] rounded-2xl bg-[#140c08] border ${ws.borderColor} overflow-hidden snap-start flex flex-col justify-between hover:scale-[1.02] hover:border-[#F37021] shadow-xl transition-all group`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={ws.thumbnail}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#140c08]/50 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-[#F37021] text-white font-heading font-black text-xs shadow-md">
                      BUỔI {idx + 1}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-black text-white text-base mb-2.5 leading-snug group-hover:text-[#F37021] transition-colors line-clamp-2 min-h-[44px]">
                      {ws.title}
                    </h3>

                    <p className="text-slate-300 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {ws.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F37021] flex-shrink-0" />
                      <span className="font-semibold text-slate-200">{ws.date}</span>
                      <span className="text-amber-400 font-medium">({ws.time})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate text-slate-300">{ws.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate font-medium text-slate-200">{ws.guest}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedWorkshop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <div
                className="absolute inset-0"
                onClick={() => setSelectedWorkshop(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-xl rounded-2xl bg-[#140c08] border border-[#F37021]/50 shadow-[0_0_50px_rgba(243,112,33,0.35)] overflow-hidden"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={selectedWorkshop.thumbnail}
                    alt={selectedWorkshop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#140c08]/60 to-transparent" />

                  <button
                    onClick={() => setSelectedWorkshop(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-[#F37021] text-white transition-all cursor-pointer z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-[#F37021] uppercase tracking-widest bg-black/50 px-2.5 py-1 rounded-md border border-[#F37021]/40">
                      FPT WORKSHOP SERIES • BUỔI {selectedWorkshop.id}
                    </span>
                    <h3 className="font-heading font-black text-white text-lg sm:text-2xl mt-1.5 leading-snug drop-shadow-md">
                      {selectedWorkshop.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-slate-200 text-xs sm:text-sm leading-relaxed">
                    <p className="font-semibold text-amber-300 text-xs mb-1 uppercase tracking-wider">Mô tả nội dung:</p>
                    <p>{selectedWorkshop.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm mb-6">
                    <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-slate-800">
                      <Calendar className="w-5 h-5 text-[#F37021] flex-shrink-0" />
                      <div>
                        <span className="block text-[10px] text-slate-400">Ngày diễn ra</span>
                        <strong className="text-white font-semibold">{selectedWorkshop.date}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-slate-800">
                      <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <span className="block text-[10px] text-slate-400">Thời gian</span>
                        <strong className="text-white font-semibold">{selectedWorkshop.time}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-slate-800">
                      <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] text-slate-400">Địa điểm</span>
                        <strong className="text-white font-semibold truncate block">{selectedWorkshop.venue}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-slate-800">
                      <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] text-slate-400">Diễn giả / Khách mời</span>
                        <strong className="text-white font-semibold truncate block">{selectedWorkshop.guest}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedWorkshop(null)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F37021] to-amber-500 hover:brightness-110 text-white font-heading font-bold text-sm shadow-lg transition-all cursor-pointer"
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
