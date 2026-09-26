import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { subscribeVideoLivestream, parseYouTubeEmbed, INITIAL_VIDEO_LIVESTREAM } from '../config/firebase';

export default function LivestreamBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [streamData, setStreamData] = useState(INITIAL_VIDEO_LIVESTREAM);

  useEffect(() => {
    const unsub = subscribeVideoLivestream((data) => {
      if (data) {
        setStreamData(data);
      }
    });
    return () => unsub();
  }, []);

  // Hide banner if user closed it or if stream is toggled OFF (isLive === false)
  if (!isVisible || streamData.isLive === false) return null;

  const embedUrl = parseYouTubeEmbed(streamData.embedUrl || streamData.url) + '?autoplay=1';
  const watchUrl = streamData.url || streamData.embedUrl || 'https://www.youtube.com';

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full relative z-40"
    >
      <div className="bg-gradient-to-r from-orange-950/60 via-[#1e130d]/60 to-orange-950/60 backdrop-blur-sm border-b border-[#F37022]/20">
        {/* Compact Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F37022] text-white text-xs font-black animate-pulse shadow-md shadow-orange-900/40">
              <Radio className="w-3 h-3" />
              LIVE
            </span>
            <span className="text-sm font-semibold text-white/95 truncate">
              {streamData.title || 'Xem trực tiếp ngay!'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
              title={isExpanded ? 'Thu gọn' : 'Xem trực tiếp'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Embed */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="max-w-4xl mx-auto px-4 pb-4">
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#F37022]/30" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl}
                    title={streamData.title || "FanG Exports Livestream"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#F37022] to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-900/30 hover:opacity-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Xem live trực tiếp trên YouTube / FanG
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
