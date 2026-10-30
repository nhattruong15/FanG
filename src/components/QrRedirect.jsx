import React, { useEffect } from 'react';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, recordQrScan } from '../config/firebase';

export default function QrRedirect() {
  const UTM_PARAMS = '?utm_source=fang_campus&utm_medium=qr_code&utm_campaign=esports_2026';

  useEffect(() => {
    // 1. Extract game parameter from search, hash query, or pathname
    const searchParams = new URLSearchParams(window.location.search);
    let rawGame = searchParams.get('game');

    if (!rawGame && window.location.hash && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      rawGame = hashParams.get('game');
    }

    if (!rawGame && window.location.hash) {
      const lowerHash = window.location.hash.toLowerCase();
      if (lowerHash.includes('aov') || lowerHash.includes('lienquan')) rawGame = 'AOV';
      else if (lowerHash.includes('val') || lowerHash.includes('valorant')) rawGame = 'VALORANT';
    }

    if (!rawGame && window.location.pathname) {
      const lowerPath = window.location.pathname.toLowerCase();
      if (lowerPath.includes('aov') || lowerPath.includes('lienquan')) rawGame = 'AOV';
      else if (lowerPath.includes('val') || lowerPath.includes('valorant')) rawGame = 'VALORANT';
    }

    // Fallback to locally stored game if scanned in same browser session
    if (!rawGame) {
      try {
        const stored = localStorage.getItem('fang_selected_game');
        if (stored) rawGame = stored;
      } catch (e) {
        // ignore
      }
    }

    // 2. Normalize game parameter
    const cleanGame = (rawGame || '').trim().toUpperCase();
    const isAov = cleanGame === 'AOV' || cleanGame.includes('LIÊN QUÂN') || cleanGame.includes('LIEN QUAN');
    const isVal = cleanGame === 'VALORANT' || cleanGame === 'VAL' || cleanGame.includes('VALORANT');
    const gameParam = isAov ? 'AOV' : isVal ? 'VALORANT' : (cleanGame || 'GENERAL');

    const handleTrackAndRedirect = async () => {
      let clientUrl = 'https://fangtv.vn/';

      try {
        // Fetch dynamic QR Code destination URL from Firestore settings/qr_config
        const configSnap = await getDoc(doc(db, 'settings', 'qr_config'));
        if (configSnap.exists() && configSnap.data().destinationUrl) {
          clientUrl = configSnap.data().destinationUrl;
        }

        // Execute +1 scan tracking for the correct game
        await recordQrScan(gameParam);

        const qrDocId = isAov ? 'aov_register_qr' : isVal ? 'val_register_qr' : 'general_register_qr';
        const qrDocRef = doc(db, 'QR_scans', qrDocId);
        await setDoc(
          qrDocRef,
          {
            game: gameParam,
            totalScans: increment(1),
            lastScanned: serverTimestamp(),
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Lỗi khi ghi nhận lượt quét QR lên Firebase:', error);
      } finally {
        const finalUrl = clientUrl.includes('?')
          ? `${clientUrl}&${UTM_PARAMS.substring(1)}`
          : `${clientUrl}${UTM_PARAMS}`;

        window.location.replace(finalUrl);
      }
    };

    handleTrackAndRedirect();
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-10 h-10 border-4 border-[#F37022] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#F37022]" />
      <p className="text-sm font-semibold tracking-wide text-slate-200 animate-pulse">
        Đang chuyển hướng đến trang đăng ký...
      </p>
    </div>
  );
}
