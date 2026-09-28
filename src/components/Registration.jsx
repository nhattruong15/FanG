import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ExternalLink, Smartphone, ArrowRight, CheckCircle, X, Maximize2, Download } from 'lucide-react';
import bg3Img from '../assets/background/background3.jpg';
import qrCodeImg from '../assets/QRCodeDangKy/qrcode_406435144_6ae891fd1e64bae13b998f1a9c098065.png';
import { recordQrScan } from '../config/firebase';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function Registration({ selectedGame }) {
  const REGISTRATION_URL = 'https://fang.vn/register';
  const [scannedToast, setScannedToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenQrModal = async () => {
    setIsModalOpen(true);
    try {
      await recordQrScan(selectedGame ? selectedGame.toUpperCase() : 'GENERAL');
      setScannedToast(true);
      setTimeout(() => setScannedToast(false), 4000);
    } catch (err) {
      console.warn('Scan record error:', err);
    }
  };

  const handleDirectClick = async () => {
    try {
      await recordQrScan(selectedGame ? selectedGame.toUpperCase() : 'GENERAL');
    } catch (err) {
      console.warn('Scan record error:', err);
    }
  };

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
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#F37021]/20 text-[#F37021] border border-[#F37021]/40">
                    FanG ID Esports
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
                  </strong> qua FanG ID. Bấm vào mã QR bên dưới để mở mã nét và quét xuất thi đấu!
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleOpenQrModal}
                    className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F37021] hover:bg-[#ff8235] text-white font-black text-base shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <QrCode className="w-5 h-5 text-white animate-pulse" />
                    Hiển Thị Mã QR Đăng Ký
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectClick}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-700 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-slate-500 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-[#F37021]" />
                    Mở trang Đăng Ký FanG ID
                  </a>
                </div>
              </div>

              {/* Right: Blurred QR Code Preview Card */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  onClick={handleOpenQrModal}
                  className="relative group cursor-pointer transition-transform hover:scale-105"
                  title="Bấm vào đây để mở mã QR Code rõ nét và quét thi đấu!"
                >
                  <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-slate-950/80 p-3 shadow-2xl shadow-orange-950/60 border-2 border-[#F37021] relative overflow-hidden flex items-center justify-center">
                    
                    {/* Blurred QR Code Image */}
                    <img 
                      src={qrCodeImg} 
                      alt="Mã QR Đăng Ký FanG Esports" 
                      className="w-full h-full object-cover rounded-2xl filter blur-[7px] group-hover:blur-[4px] transition-all opacity-80"
                    />
                    
                    {/* Center Overlay CTA Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl">
                      <span className="w-12 h-12 rounded-2xl bg-[#F37021] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 mb-2 group-hover:scale-110 transition-transform">
                        <QrCode className="w-6 h-6 animate-pulse" />
                      </span>
                      <span className="bg-slate-900/90 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xl border border-[#F37021]/50 tracking-wider uppercase flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#F37021]" /> Bấm Để Mở QR Code
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-1">
                        (Mở mã nét & tính lượt quét)
                      </span>
                    </div>
                  </div>

                  {/* Scan Badge & Download Button */}
                  <div className="mt-3 text-center flex flex-col items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#F37021] text-xs font-bold tracking-wide">
                      <QrCode className="w-3.5 h-3.5 animate-pulse" /> Click vào QR để quét thi đấu
                    </span>

                    <a
                      href={qrCodeImg}
                      download="FanG_Esports_QRCode.png"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F37021]/20 hover:bg-[#F37021] text-[#F37021] hover:text-white font-bold text-xs border border-[#F37021]/50 transition-all cursor-pointer shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải về QR Code
                    </a>
                  </div>
                </div>

                {scannedToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Đã kích hoạt 1 lượt quét QR! Dữ liệu đã gửi về Dashboard.
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pop-up QR Code Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#0f1222] border-2 border-[#F37021] shadow-[0_0_80px_rgba(243,112,34,0.5)] p-6 text-center overflow-hidden flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-[#F37021]/50 text-[#F37021] text-xs font-black tracking-wider uppercase">
                  <QrCode className="w-4 h-4" /> Mã QR Đăng Ký Chính Thức
                </span>
              </div>

              {/* High Resolution Sharp QR Code Image */}
              <div className="w-60 h-60 rounded-2xl bg-white p-3 shadow-2xl border-2 border-orange-400 flex items-center justify-center my-3">
                <img 
                  src={qrCodeImg} 
                  alt="Mã QR Đăng Ký Rõ Nét" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="w-full space-y-2.5">
                <a
                  href={qrCodeImg}
                  download="FanG_Esports_QRCode.png"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#ff8235] text-white font-black text-xs shadow-lg transition-all border border-orange-400/40"
                >
                  <Download className="w-4 h-4" />
                  Tải Về Mã QR Code (.png)
                </a>

                <a
                  href={REGISTRATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-white/5 text-slate-300 font-semibold text-xs hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#F37021]" />
                  Hoặc bấm mở trang Đăng Ký
                </a>

                <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Đã ghi nhận +1 lượt quét về Admin Dashboard!
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
