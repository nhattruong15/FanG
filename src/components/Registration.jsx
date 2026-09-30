import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ExternalLink, ArrowRight, X, Download, Maximize2 } from 'lucide-react';
import bg3Img from '../assets/background/background3.jpg';
import qrCodeImg from '../assets/QRCodeDangKy/qrcode_register.png';
import { recordQrScan, subscribeQrConfig, INITIAL_QR_CONFIG } from '../config/firebase';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

export default function Registration({ selectedGame }) {
  const [qrConfig, setQrConfig] = useState(INITIAL_QR_CONFIG);
  const [scannedToast, setScannedToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeQrConfig((config) => {
      if (config) {
        setQrConfig(config);
      }
    });
    return () => unsub();
  }, []);

  const activeDestinationUrl = qrConfig?.destinationUrl || 'https://fangtv.vn/';
  const activeQrImage = qrConfig?.customQrUrl || qrCodeImg;

  const handleOpenQrModal = () => {
    setIsModalOpen(true);
  };

  const handleDirectClick = async () => {
    try {
      await recordQrScan(selectedGame ? selectedGame.toUpperCase() : 'GENERAL');
      setScannedToast(true);
      setTimeout(() => setScannedToast(false), 4000);
    } catch (err) {
      console.warn('Scan record error:', err);
    }
  };

  return (
    <section id="registration" className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
        style={{ backgroundImage: `url(${bg3Img})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0906]/50 via-transparent to-[#0e0906]/70 z-0 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#F37021]/30 via-amber-500/20 to-blue-600/20 rounded-full blur-[120px] z-0" />

      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6">
        <motion.div
          {...fadeInUp}
          className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(243,112,34,0.4)]"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#F37021] via-amber-400 to-[#005A9E] p-[1px]">
            <div className="absolute inset-[1px] rounded-3xl bg-[#0f1222]/85 backdrop-blur-md" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Column 1: Info & CTAs */}
              <div className="md:col-span-7 text-center md:text-left flex flex-col justify-center">
               

                <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-3 leading-tight">
                  Sẵn sàng xưng bá?
                </h2>

                <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                  Đăng ký tham gia bộ môn <strong className={selectedGame === 'valorant' ? 'text-[#ff4655]' : 'text-[#f39c12]'}>
                    {selectedGame === 'valorant' ? 'VALORANT' : 'AOV (LIÊN QUÂN)'}
                  </strong> qua FanG ID. Quét mã QR Code ở bên phải hoặc bấm nút <strong className="text-white">Mở trang Đăng Ký</strong> bên dưới để tham gia ngay!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href={activeDestinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectClick}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F37021] hover:bg-[#ff8235] text-white font-black text-base shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                    Mở trang Đăng Ký FanG ID
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  
                </div>
              </div>

              {/* Column 2: QR Code Card */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div 
                  onClick={handleOpenQrModal}
                  className="relative group cursor-pointer p-4 rounded-2xl bg-[#140c08]/90 border-2 border-[#F37021]/60 hover:border-[#F37021] shadow-[0_0_35px_rgba(243,112,34,0.3)] hover:shadow-[0_0_50px_rgba(243,112,34,0.5)] transition-all duration-300 transform hover:scale-[1.03]"
                >
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-[#F37021] opacity-80 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-2.5 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={activeQrImage}
                      alt="Mã QR Đăng Ký FanG"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-[#F37021] transition-colors flex items-center justify-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-[#F37021]" />
                      Quét mã QR Code để Đăng Ký
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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

              <div className="w-60 h-60 rounded-2xl bg-white p-3 shadow-2xl border-2 border-orange-400 flex items-center justify-center my-3">
                <img 
                  src={activeQrImage} 
                  alt="Mã QR Đăng Ký Rõ Nét" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="w-full space-y-2.5">
                <a
                  href={activeQrImage}
                  download="qrcode_register.png"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#ff8235] text-white font-black text-xs shadow-lg transition-all border border-orange-400/40"
                >
                  <Download className="w-4 h-4" />
                  Tải Về Mã QR Code (.png)
                </a>

                <a
                  href={activeDestinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDirectClick}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-white/5 text-slate-300 font-semibold text-xs hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#F37021]" />
                  Hoặc bấm mở trang Đăng Ký
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
