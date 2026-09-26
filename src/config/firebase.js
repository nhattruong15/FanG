import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Real Firebase Project Configuration provided by user (fang-58ac3)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCPU2CWMFL80L9B9vz4wQXm8WPqoK3GnE4",
  authDomain: "fang-58ac3.firebaseapp.com",
  projectId: "fang-58ac3",
  storageBucket: "fang-58ac3.firebasestorage.app",
  messagingSenderId: "978911438383",
  appId: "1:978911438383:web:61db7a6e2d82cdb7fd08da",
  measurementId: "G-S8CN4BQY81"
};

// Initialize Firebase App & Firestore Database
export const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

// Initial default entries per game for videolivestream collection
export const INITIAL_LIVESTREAM_STREAMS = {
  VALORANT: {
    id: 'stream_valorant',
    title: 'FanG Esports VALORANT Tournament 2026 - Livestream Trực Tiếp',
    url: 'https://www.youtube.com/watch?v=cI5b71ZBAn0',
    embedUrl: 'https://www.youtube.com/embed/cI5b71ZBAn0',
    videoId: 'cI5b71ZBAn0',
    platform: 'YouTube',
    isLive: true,
    game: 'VALORANT',
    viewers: 14250,
    startTime: '15:00 - 26/09/2026',
    updatedAt: new Date().toISOString()
  },
  AOV: {
    id: 'stream_aov',
    title: 'FanG Esports AOV (Liên Quân) 2026 - Trực Tiếp Vòng Bảng',
    url: 'https://www.youtube.com/watch?v=MKoXxqcKVb4',
    embedUrl: 'https://www.youtube.com/embed/MKoXxqcKVb4',
    videoId: 'MKoXxqcKVb4',
    platform: 'YouTube',
    isLive: true,
    game: 'AOV',
    viewers: 9800,
    startTime: '16:00 - 26/09/2026',
    updatedAt: new Date().toISOString()
  },
  ALL: {
    id: 'stream_all',
    title: 'FanG Esports All-Stars 2026 - Sự Kiện Tổng Hợp Trực Tiếp',
    url: 'https://www.youtube.com/watch?v=cI5b71ZBAn0',
    embedUrl: 'https://www.youtube.com/embed/cI5b71ZBAn0',
    videoId: 'cI5b71ZBAn0',
    platform: 'YouTube',
    isLive: false,
    game: 'ALL',
    viewers: 25000,
    startTime: '18:00 - 26/09/2026',
    updatedAt: new Date().toISOString()
  }
};

export const INITIAL_VIDEO_LIVESTREAM = INITIAL_LIVESTREAM_STREAMS.VALORANT;

/**
 * Normalize Firestore stream data to ensure per-game streams object map
 */
export function normalizeLivestreamData(raw) {
  if (!raw) return INITIAL_LIVESTREAM_STREAMS;
  if (raw.VALORANT || raw.AOV || raw.ALL) {
    return {
      VALORANT: { ...INITIAL_LIVESTREAM_STREAMS.VALORANT, ...(raw.VALORANT || {}) },
      AOV: { ...INITIAL_LIVESTREAM_STREAMS.AOV, ...(raw.AOV || {}) },
      ALL: { ...INITIAL_LIVESTREAM_STREAMS.ALL, ...(raw.ALL || {}) }
    };
  }
  const legacyGame = raw.game || 'VALORANT';
  return {
    ...INITIAL_LIVESTREAM_STREAMS,
    [legacyGame]: {
      ...raw,
      embedUrl: parseYouTubeEmbed(raw.embedUrl || raw.url)
    }
  };
}

/**
 * Convert standard YouTube watch link to Embed URL
 */
export function parseYouTubeEmbed(url) {
  if (!url) return 'https://www.youtube.com/embed/mrBPS2WscD8';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}

/**
 * Save / Update Livestream Document in Firestore collection "videolivestream"
 */
export async function saveVideoLivestream(streamsMapOrSingle) {
  try {
    let normalized = normalizeLivestreamData(streamsMapOrSingle);
    if (streamsMapOrSingle && streamsMapOrSingle.game && !streamsMapOrSingle.VALORANT) {
      const gKey = streamsMapOrSingle.game || 'VALORANT';
      const existingSaved = localStorage.getItem('fang_videolivestream');
      const existingMap = existingSaved ? normalizeLivestreamData(JSON.parse(existingSaved)) : INITIAL_LIVESTREAM_STREAMS;
      normalized = {
        ...existingMap,
        [gKey]: {
          ...streamsMapOrSingle,
          embedUrl: parseYouTubeEmbed(streamsMapOrSingle.embedUrl || streamsMapOrSingle.url),
          updatedAt: new Date().toISOString()
        }
      };
    }
    const payload = {
      ...normalized,
      updatedAt: new Date().toISOString()
    };
    const streamDocRef = doc(db, 'videolivestream', 'active_stream');
    await setDoc(streamDocRef, payload, { merge: true });
    console.log('Successfully saved to Firestore document videolivestream/active_stream');
    localStorage.setItem('fang_videolivestream', JSON.stringify(payload));
    return { success: true, data: payload };
  } catch (error) {
    console.warn('Firestore write error:', error);
    let normalized = normalizeLivestreamData(streamsMapOrSingle);
    localStorage.setItem('fang_videolivestream', JSON.stringify(normalized));
    return { success: true, fallback: true, data: normalized };
  }
}

/**
 * Initial Default Admin Account Credentials
 */
export const INITIAL_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  role: 'superadmin',
  updatedAt: new Date().toISOString()
};

/**
 * Initialize / Save Admin Credentials to Firestore collection "admin_users"
 */
export async function saveAdminAccount(credentials = INITIAL_ADMIN_CREDENTIALS) {
  try {
    const adminDocRef = doc(db, 'admin_users', 'admin');
    await setDoc(adminDocRef, credentials, { merge: true });
    console.log('Successfully saved admin credentials to Firestore collection admin_users/admin');
    localStorage.setItem('fang_admin_credentials', JSON.stringify(credentials));
    return { success: true };
  } catch (error) {
    console.warn('Firestore admin save warning:', error);
    localStorage.setItem('fang_admin_credentials', JSON.stringify(credentials));
    return { success: true, fallback: true };
  }
}

/**
 * Verify Admin Credentials from Firestore
 */
export async function verifyAdminCredentials(username, password) {
  try {
    const adminDocRef = doc(db, 'admin_users', 'admin');
    const snap = await getDoc(adminDocRef);

    if (snap.exists()) {
      const data = snap.data();
      return data.username === username && data.password === password;
    } else {
      // If doc doesn't exist yet in DB, create it in DB and check
      await saveAdminAccount(INITIAL_ADMIN_CREDENTIALS);
      return username === 'admin' && password === 'admin';
    }
  } catch (error) {
    console.warn('Firestore admin verification fallback:', error);
    // Fallback logic
    const saved = localStorage.getItem('fang_admin_credentials');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.username === username && parsed.password === password;
    }
    return username === 'admin' && password === 'admin';
  }
}

/**
 * Initial Default News Articles list
 */
export const INITIAL_NEWS_ARTICLES = [
  {
    id: 'news_1',
    game: 'VALORANT', // 'VALORANT' | 'AOV' | 'ALL'
    title: 'Highlight: Trận khai mạc Valorant — ĐH FPT Hà Nội vs ĐH Bách Khoa',
    summary: 'Những pha gank và clutch đỉnh cao trong trận đấu khai mạc mùa giải 2026 với sự tham gia của 32 trường.',
    content: 'Giải đấu Thể thao Điện tử Sinh viên FanG Esports 2026 chính thức khởi động với trận khai mạc nảy lửa giữa ĐH FPT Hà Nội và ĐH Bách Khoa. Hai đội đã cống hiến những màn rượt đuổi tỷ số kịch tính, những pha xử lý cá nhân xuất thần và chiến thuật phối hợp đồng đội vô cùng bài bản. Cùng xem lại toàn bộ highlight kỹ năng đỉnh cao!',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Highlight',
    author: 'Admin',
    date: '2026-09-26',
    time: '15:30',
    isFeatured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'news_2',
    game: 'AOV',
    title: 'Phân tích meta AOV: Top 5 ứng viên vô địch khu vực miền Nam',
    summary: 'Đánh giá chuyên sâu về đội hình Arena of Valor đến từ ĐH FPT TP.HCM và các đại diện trường miền Nam.',
    content: 'Bước vào vòng bảng giải đấu AOV FanG Esports 2026, các đội tuyển khu vực miền Nam đang thể hiện phong độ hủy diệt với chiến thuật đảo gank linh hoạt và kiểm soát tà thần hoàn hảo. ĐH FPT TP.HCM cùng 4 cái tên hàng đầu đang là ứng cử viên nặng ký cho chiếc cúp vô địch toàn quốc.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    videoEmbed: '',
    category: 'Tin tức',
    author: 'Esports Team',
    date: '2026-09-25',
    time: '10:00',
    isFeatured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'news_3',
    game: 'VALORANT',
    title: 'FanG Exports 2026: Công bố sơ đồ bảng đấu VALORANT toàn quốc',
    summary: 'Chính thức khởi động vòng loại bảng đấu VALORANT với tổng giá trị giải thưởng lên đến 80 triệu đồng.',
    content: 'Ban tổ chức FanG Esports chính thức công bố danh sách 16 đội tuyển VALORANT xuất sắc nhất tiến vào vòng chung kết miền. Các trận đấu sẽ được livestream trực tiếp trên kênh chính thức với sự bình luận của các Caster hàng đầu.',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    videoEmbed: '',
    category: 'Giải đấu',
    author: 'Admin',
    date: '2026-09-24',
    time: '14:00',
    isFeatured: false,
    status: 'PUBLISHED'
  }
];

/**
 * Save / Update News Articles list in Firestore collection "news/articles_list"
 */
export async function saveNewsArticles(articles) {
  try {
    const payload = {
      items: articles,
      updatedAt: new Date().toISOString()
    };
    const newsDocRef = doc(db, 'news', 'articles_list');
    await setDoc(newsDocRef, payload, { merge: true });
    console.log('Successfully saved news to Firestore news/articles_list');
    localStorage.setItem('fang_news_articles', JSON.stringify(articles));
    return { success: true, articles };
  } catch (error) {
    console.warn('Firestore news write error:', error);
    localStorage.setItem('fang_news_articles', JSON.stringify(articles));
    return { success: true, fallback: true, articles };
  }
}

/**
 * Subscribe to Real-time updates for "news" collection
 */
export function subscribeNews(callback) {
  try {
    const newsDocRef = doc(db, 'news', 'articles_list');
    const unsubscribe = onSnapshot(newsDocRef, (docSnap) => {
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        callback(docSnap.data().items);
      } else {
        saveNewsArticles(INITIAL_NEWS_ARTICLES);
        callback(INITIAL_NEWS_ARTICLES);
      }
    }, (err) => {
      console.warn('Firestore news subscription warning:', err);
      const saved = localStorage.getItem('fang_news_articles');
      if (saved) callback(JSON.parse(saved));
      else callback(INITIAL_NEWS_ARTICLES);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore news init error:', e);
    const saved = localStorage.getItem('fang_news_articles');
    if (saved) callback(JSON.parse(saved));
    else callback(INITIAL_NEWS_ARTICLES);
    return () => {};
  }
}

/**
 * Subscribe to Real-time updates for "videolivestream" collection document
 */
export function subscribeVideoLivestream(callback) {
  try {
    // Ensure Admin account exists in Firestore DB
    saveAdminAccount(INITIAL_ADMIN_CREDENTIALS);

    const streamDocRef = doc(db, 'videolivestream', 'active_stream');
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(normalizeLivestreamData(docSnap.data()));
      } else {
        // Create initial default document in Firestore if not existing yet
        saveVideoLivestream(INITIAL_LIVESTREAM_STREAMS);
        callback(INITIAL_LIVESTREAM_STREAMS);
      }
    }, (err) => {
      console.warn('Firestore subscription warning:', err);
      const saved = localStorage.getItem('fang_videolivestream');
      if (saved) {
        callback(normalizeLivestreamData(JSON.parse(saved)));
      } else {
        callback(INITIAL_LIVESTREAM_STREAMS);
      }
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore init error:', e);
    const saved = localStorage.getItem('fang_videolivestream');
    if (saved) {
      callback(normalizeLivestreamData(JSON.parse(saved)));
    } else {
      callback(INITIAL_LIVESTREAM_STREAMS);
    }
    return () => {};
  }
}

