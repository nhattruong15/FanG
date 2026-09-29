import React, { useEffect } from 'react';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, recordQrScan } from '../config/firebase';

/**
 * Component QrRedirect
 * Mục đích: 
 * 1. Được gắn vào một route ẩn (như /qr-register hoặc #qr-register).
 * 2. Khi người dùng quét mã QR, component tự động ghi nhận +1 lượt quét lên Firestore.
 * 3. Tự động chuyển hướng (Redirect) sang URL đăng ký của khách hàng kèm thông số UTM mà không lưu lại trang trung gian trong Lịch sử trình duyệt.
 */
export default function QrRedirect() {
  // 1. URL Đích đến của Form đăng ký khách hàng
  const CLIENT_FORM_URL = 'https://google.com/form...';

  // 2. Thông số UTM dùng để đo lường chiến dịch
  const UTM_PARAMS = '?utm_source=fang_campus&utm_medium=qr_code&utm_campaign=esports_2026';

  useEffect(() => {
    // Tạo URL hoàn chỉnh kèm các tham số UTM
    const finalUrl = CLIENT_FORM_URL.includes('?')
      ? `${CLIENT_FORM_URL}&${UTM_PARAMS.substring(1)}`
      : `${CLIENT_FORM_URL}${UTM_PARAMS}`;

    /**
     * Hàm xử lý ghi nhận lượt quét (Tracking) & chuyển hướng (Redirect)
     */
    const handleTrackAndRedirect = async () => {
      try {
        // Ghi nhận lượt quét vào hệ thống Analytics chính của Admin Dashboard (trực tiếp nâng totalScans trong qr_scans/stats)
        await recordQrScan('VALORANT');

        // Tham chiếu đến document 'val_register_qr' trong collection 'QR_scans' theo yêu cầu cụ thể
        const qrDocRef = doc(db, 'QR_scans', 'val_register_qr');

        // Ghi dữ liệu vào Firestore: Tăng totalScans thêm 1, cập nhật lastScanned
        await setDoc(
          qrDocRef,
          {
            totalScans: increment(1),
            lastScanned: serverTimestamp(),
            updatedAt: new Date().toISOString()
          },
          { merge: true } // Merge true giúp tự động tạo document nếu chưa tồn tại
        );
      } catch (error) {
        // Ghi log lỗi nếu rớt mạng hoặc Firestore bị lỗi, nhưng KHÔNG làm ngắt luồng chuyển hướng
        console.error('Lỗi khi ghi nhận lượt quét QR lên Firebase:', error);
      } finally {
        // BẮT BUỘC thực hiện chuyển hướng người dùng sang trang đích
        // Sử dụng window.location.replace để không lưu trang trung gian này vào History của trình duyệt
        window.location.replace(finalUrl);
      }
    };

    handleTrackAndRedirect();
  }, []);

  return (
    // Giao diện loading đơn giản (Nền đen, chữ trắng) trong lúc chờ chuyển hướng (dưới 0.5s)
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-10 h-10 border-4 border-[#F37022] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#F37022]" />
      <p className="text-sm font-semibold tracking-wide text-slate-200 animate-pulse">
        Đang chuyển hướng đến trang đăng ký...
      </p>
    </div>
  );
}
