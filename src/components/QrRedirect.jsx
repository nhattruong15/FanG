import React, { useEffect } from 'react';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, recordQrScan } from '../config/firebase';

export default function QrRedirect() {
  const UTM_PARAMS = '?utm_source=fang_campus&utm_medium=qr_code&utm_campaign=esports_2026';

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const gameParam = searchParams.get('game')?.toUpperCase() || 'VALORANT';

    const handleTrackAndRedirect = async () => {
      let clientUrl = 'https://fangtv.vn/';

      try {
        // Fetch dynamic QR Code destination URL from Firestore settings/qr_config
        const configSnap = await getDoc(doc(db, 'settings', 'qr_config'));
        if (configSnap.exists() && configSnap.data().destinationUrl) {
          clientUrl = configSnap.data().destinationUrl;
        }

        // Execute +1 scan tracking
        await recordQrScan(gameParam);

        const qrDocRef = doc(db, 'QR_scans', 'val_register_qr');
        await setDoc(
          qrDocRef,
          {
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
