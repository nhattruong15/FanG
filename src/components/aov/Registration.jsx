import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, ExternalLink, Smartphone, ArrowRight } from 'lucide-react';
import bg3Img from '../../assets/background/background3.jpg';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function Registration({ selectedGame }) {
  const REGISTRATION_URL = 'https://fang.vn/register';

  return (
    <section id="registration" className="section-padding relative overflow-hidden">
      {/* Background Image Layer — Bright & Vivid */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
        style={{ backgroundImage: `url(${bg3Img})` }}
      />

      {/* Light Soft Gradient Overlays for Smooth Transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0906]/50 via-transparent to-[#0e0906]/70 z-0 pointer-events-none" />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#F37021]/30 via-amber-500/20 to-blue-600/20 rounded-full blur-[120px] z-0" />

      <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6">
        <motion.div
          {...fadeInUp}
          className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(243,112,34,0.4)]"
        >
          {/* FPT Orange Gradient Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#F37021] via-amber-400 to-[#005A9E] p-[1px]">
            <div className="absolute inset-[1px] rounded-3xl bg-[#0f1222]/75 backdrop-blur-md" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Text & CTA */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                    ĐĂNG KÝ THI ĐẤU
                  </span>
                  {selectedGame && (
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${
                        selectedGame === 'valorant' 
                          ? 'border-[#ff4655]/50 bg-[#ff4655]/20 text-[#ff4655]' 
                          : 'border-[#f39c12]/50 bg-[#f39c12]/20 text-[#f39c12]'
                      }`}
                    >
                      {selectedGame === 'valorant' ? 'VALORANT 5V5' : 'AOV 5V5'}
                    </span>
                  )}
                </div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3">
                  Sẵn sàng xưng bá?
                </h2>
                <p className="text-slate-300 text-base mb-6">
                  Đăng ký tham gia bộ môn <strong className={selectedGame === 'valorant' ? 'text-[#ff4655]' : 'text-[#f39c12]'}>
                    {selectedGame === 'valorant' ? 'VALORANT' : 'AOV (LIÊN QUÂN)'}
                  </strong> qua FanG ID. Quét mã QR hoặc bấm nút bên dưới để xác nhận suất thi đấu!
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href={REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F37021] hover:bg-[#ff8235] text-white font-black text-base shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Đăng ký qua FanG ID
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href={REGISTRATION_URL}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-700 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-slate-500 transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-[#F37021]" />
                    Mở ứng dụng FanG Mobile
                  </a>
                </div>
              </div>

              {/* Right: QR Code */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-white p-4 shadow-2xl shadow-orange-950/40 border-2 border-[#F37021]">
                    <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200">
                      <QrCode className="w-20 h-20 text-slate-900" />
                    </div>
                  </div>
                  {/* Floating FPT badge */}
                 
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
