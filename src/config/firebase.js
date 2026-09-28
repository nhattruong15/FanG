import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, increment } from 'firebase/firestore';

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

/**
 * Initial Default Teams list with 5-member rosters for Valorant and AOV
 */
export const INITIAL_TEAMS = [
  {
    id: 'team_1',
    name: 'ĐH FPT Hà Nội - Valorant',
    school: 'Trường Đại học FPT Hà Nội',
    region: 'Miền Bắc',
    game: 'Valorant',
    captain: 'Nguyễn Văn A',
    membersCount: 6,
    membersList: [
      { id: 1, name: 'Nguyễn Văn A', ingame: 'FPT_Alpha#101', role: 'Đội trưởng' },
      { id: 2, name: 'Trần Văn B', ingame: 'FPT_Bravo#102', role: 'Thành viên' },
      { id: 3, name: 'Lê Hoàng C', ingame: 'FPT_Charlie#103', role: 'Thành viên' },
      { id: 4, name: 'Phạm Minh D', ingame: 'FPT_Delta#104', role: 'Thành viên' },
      { id: 5, name: 'Vũ Quốc E', ingame: 'FPT_Echo#105', role: 'Thành viên' },
      { id: 6, name: 'Khoa DM', ingame: 'FPT_Sub#106', role: 'Dự bị' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_2',
    name: 'ĐH FPT TP.HCM - Valorant',
    school: 'Trường Đại học FPT TP.HCM',
    region: 'Miền Nam',
    game: 'Valorant',
    captain: 'Trần Văn B',
    membersCount: 6,
    membersList: [
      { id: 1, name: 'Trần Văn B', ingame: 'FPT_Leader#201', role: 'Đội trưởng' },
      { id: 2, name: 'Alex TN', ingame: 'FPT_Alex#202', role: 'Thành viên' },
      { id: 3, name: 'Brian LP', ingame: 'FPT_Brian#203', role: 'Thành viên' },
      { id: 4, name: 'Chris HV', ingame: 'FPT_Chris#204', role: 'Thành viên' },
      { id: 5, name: 'David NM', ingame: 'FPT_David#205', role: 'Thành viên' },
      { id: 6, name: 'Eric TA', ingame: 'FPT_Sub#206', role: 'Dự bị' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_3',
    name: 'ĐH FPT Hà Nội - AOV',
    school: 'Trường Đại học FPT Hà Nội',
    region: 'Miền Bắc',
    game: 'AOV',
    captain: 'Sơn ĐN',
    membersCount: 6,
    membersList: [
      { id: 1, name: 'Sơn ĐN', ingame: 'FPT_Son#301', role: 'Đội trưởng' },
      { id: 2, name: 'Hiếu LT', ingame: 'FPT_Hieu#302', role: 'Thành viên' },
      { id: 3, name: 'Trung VH', ingame: 'FPT_Trung#303', role: 'Thành viên' },
      { id: 4, name: 'Đạt NQ', ingame: 'FPT_Dat#304', role: 'Thành viên' },
      { id: 5, name: 'Hải PM', ingame: 'FPT_Hai#305', role: 'Thành viên' },
      { id: 6, name: 'Cường TT', ingame: 'FPT_Sub#306', role: 'Dự bị' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_4',
    name: 'ĐH FPT TP.HCM - AOV',
    school: 'Trường Đại học FPT TP.HCM',
    region: 'Miền Nam',
    game: 'AOV',
    captain: 'Gary VT',
    membersCount: 6,
    membersList: [
      { id: 1, name: 'Gary VT', ingame: 'FPT_Gary#401', role: 'Đội trưởng' },
      { id: 2, name: 'Henry DQ', ingame: 'FPT_Henry#402', role: 'Thành viên' },
      { id: 3, name: 'Ivan NK', ingame: 'FPT_Ivan#403', role: 'Thành viên' },
      { id: 4, name: 'Jack MT', ingame: 'FPT_Jack#404', role: 'Thành viên' },
      { id: 5, name: 'Ken LH', ingame: 'FPT_Ken#405', role: 'Thành viên' },
      { id: 6, name: 'Leo PC', ingame: 'FPT_Sub#406', role: 'Dự bị' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_5',
    name: 'ĐH Bách Khoa HN - Valorant',
    school: 'Trường Đại học Bách Khoa Hà Nội',
    region: 'Miền Bắc',
    game: 'Valorant',
    captain: 'Minh PL',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'Minh PL', ingame: 'BKA_Minh#501', role: 'Đội trưởng' },
      { id: 2, name: 'Hoàng VT', ingame: 'BKA_Hoang#502', role: 'Thành viên' },
      { id: 3, name: 'Đức TN', ingame: 'BKA_Duc#503', role: 'Thành viên' },
      { id: 4, name: 'Hùng NM', ingame: 'BKA_Hung#504', role: 'Thành viên' },
      { id: 5, name: 'Long ĐV', ingame: 'BKA_Long#505', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_6',
    name: 'ĐH Bách Khoa HN - AOV',
    school: 'Trường Đại học Bách Khoa Hà Nội',
    region: 'Miền Bắc',
    game: 'AOV',
    captain: 'Lê Hoàng C',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'Lê Hoàng C', ingame: 'BKA_Cap#601', role: 'Đội trưởng' },
      { id: 2, name: 'Nam DT', ingame: 'BKA_Nam#602', role: 'Thành viên' },
      { id: 3, name: 'Quang HN', ingame: 'BKA_Quang#603', role: 'Thành viên' },
      { id: 4, name: 'Thắng LM', ingame: 'BKA_Thang#604', role: 'Thành viên' },
      { id: 5, name: 'Việt NP', ingame: 'BKA_Viet#605', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_7',
    name: 'ĐH Kinh Tế QD - Valorant',
    school: 'Trường Đại học Kinh Tế Quốc Dân',
    region: 'Miền Bắc',
    game: 'Valorant',
    captain: 'Vũ Quốc E',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'Vũ Quốc E', ingame: 'NEU_Cap#701', role: 'Đội trưởng' },
      { id: 2, name: 'Tú NM', ingame: 'NEU_Tu#702', role: 'Thành viên' },
      { id: 3, name: 'Nguyên PH', ingame: 'NEU_Nguyen#703', role: 'Thành viên' },
      { id: 4, name: 'Trường LQ', ingame: 'NEU_Truong#704', role: 'Thành viên' },
      { id: 5, name: 'Thành NV', ingame: 'NEU_Thanh#705', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_8',
    name: 'ĐH Kinh Tế QD - AOV',
    school: 'Trường Đại học Kinh Tế Quốc Dân',
    region: 'Miền Bắc',
    game: 'AOV',
    captain: 'Hưng TM',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'Hưng TM', ingame: 'NEU_Hung#801', role: 'Đội trưởng' },
      { id: 2, name: 'Quân VP', ingame: 'NEU_Quan#802', role: 'Thành viên' },
      { id: 3, name: 'Sỹ NL', ingame: 'NEU_Sy#803', role: 'Thành viên' },
      { id: 4, name: 'Tài HĐ', ingame: 'NEU_Tai#804', role: 'Thành viên' },
      { id: 5, name: 'Uy TV', ingame: 'NEU_Uy#805', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_9',
    name: 'ĐH Tôn Đức Thắng - Valorant',
    school: 'Trường Đại học Tôn Đức Thắng',
    region: 'Miền Nam',
    game: 'Valorant',
    captain: 'An NV',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'An NV', ingame: 'TDT_An#901', role: 'Đội trưởng' },
      { id: 2, name: 'Bảo TH', ingame: 'TDT_Bao#902', role: 'Thành viên' },
      { id: 3, name: 'Cường LM', ingame: 'TDT_Cuong#903', role: 'Thành viên' },
      { id: 4, name: 'Duy PQ', ingame: 'TDT_Duy#904', role: 'Thành viên' },
      { id: 5, name: 'Phát HV', ingame: 'TDT_Phat#905', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  },
  {
    id: 'team_10',
    name: 'ĐH Tôn Đức Thắng - AOV',
    school: 'Trường Đại học Tôn Đức Thắng',
    region: 'Miền Nam',
    game: 'AOV',
    captain: 'Gia BN',
    membersCount: 5,
    membersList: [
      { id: 1, name: 'Gia BN', ingame: 'TDT_Gia#1001', role: 'Đội trưởng' },
      { id: 2, name: 'Hào TV', ingame: 'TDT_Hao#1002', role: 'Thành viên' },
      { id: 3, name: 'Khanh DL', ingame: 'TDT_Khanh#1003', role: 'Thành viên' },
      { id: 4, name: 'Linh PN', ingame: 'TDT_Linh#1004', role: 'Thành viên' },
      { id: 5, name: 'Minh TQ', ingame: 'TDT_Minh#1005', role: 'Thành viên' },
    ],
    status: 'VERIFIED'
  }
];

/**
 * Save / Update Teams list in Firestore collection "teams/teams_list"
 */
export async function saveTeams(teams) {
  try {
    const payload = {
      items: teams,
      updatedAt: new Date().toISOString()
    };
    const teamsDocRef = doc(db, 'teams', 'teams_list');
    await setDoc(teamsDocRef, payload, { merge: true });
    console.log('Successfully saved teams to Firestore teams/teams_list');
    localStorage.setItem('fang_registered_teams', JSON.stringify(teams));
    return { success: true, teams };
  } catch (error) {
    console.warn('Firestore teams write error:', error);
    localStorage.setItem('fang_registered_teams', JSON.stringify(teams));
    return { success: true, fallback: true, teams };
  }
}

/**
 * Subscribe to Real-time updates for "teams" collection
 */
export function subscribeTeams(callback) {
  try {
    const teamsDocRef = doc(db, 'teams', 'teams_list');
    const unsubscribe = onSnapshot(teamsDocRef, (docSnap) => {
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        callback(docSnap.data().items);
      } else {
        saveTeams(INITIAL_TEAMS);
        callback(INITIAL_TEAMS);
      }
    }, (err) => {
      console.warn('Firestore teams subscription warning:', err);
      const saved = localStorage.getItem('fang_registered_teams');
      if (saved) callback(JSON.parse(saved));
      else callback(INITIAL_TEAMS);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore teams init error:', e);
    const saved = localStorage.getItem('fang_registered_teams');
    if (saved) callback(JSON.parse(saved));
    else callback(INITIAL_TEAMS);
    return () => {};
  }
}

/**
 * Initial Default QR Code Scan Statistics
 */
export const INITIAL_QR_STATS = {
  totalScans: 0,
  valorantScans: 0,
  aovScans: 0,
  lastScanTime: null,
  lastScanGame: 'ALL',
  recentScans: []
};

/**
 * Record a QR Code Scan event in Firestore collection "qr_scans/stats"
 */
export async function recordQrScan(gameName = 'ALL') {
  const newScanEntry = {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    game: gameName,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  try {
    const qrDocRef = doc(db, 'qr_scans', 'stats');
    const docSnap = await getDoc(qrDocRef);

    let currentTotal = 0;
    let currentVal = 0;
    let currentAov = 0;
    let recent = [];

    if (docSnap.exists()) {
      const data = docSnap.data();
      currentTotal = data.totalScans || 0;
      recent = Array.isArray(data.recentScans) ? data.recentScans : [];
      // Calculate or retrieve existing game counts
      currentVal = data.valorantScans ?? recent.filter(s => s.game === 'VALORANT').length;
      currentAov = data.aovScans ?? recent.filter(s => s.game === 'AOV').length;
    }

    const updatedTotal = currentTotal + 1;
    const updatedVal = gameName === 'VALORANT' ? currentVal + 1 : currentVal;
    const updatedAov = gameName === 'AOV' ? currentAov + 1 : currentAov;
    const updatedRecent = [newScanEntry, ...recent].slice(0, 100);

    const payload = {
      totalScans: updatedTotal,
      valorantScans: updatedVal,
      aovScans: updatedAov,
      lastScanTime: newScanEntry.timestamp,
      lastScanGame: gameName,
      recentScans: updatedRecent,
      updatedAt: newScanEntry.timestamp
    };

    await setDoc(qrDocRef, payload, { merge: true });
    console.log('[Firestore] QR scan recorded successfully. Total scans:', updatedTotal);
    localStorage.setItem('fang_qr_stats', JSON.stringify(payload));
    return { success: true, stats: payload, newScan: newScanEntry };
  } catch (error) {
    console.warn('[Firestore] QR scan record fallback:', error);
    const saved = localStorage.getItem('fang_qr_stats');
    let parsed = saved ? JSON.parse(saved) : INITIAL_QR_STATS;
    const recentArr = [newScanEntry, ...(parsed.recentScans || [])].slice(0, 100);
    const updatedVal = gameName === 'VALORANT' ? (parsed.valorantScans || 0) + 1 : (parsed.valorantScans || 0);
    const updatedAov = gameName === 'AOV' ? (parsed.aovScans || 0) + 1 : (parsed.aovScans || 0);
    const updatedStats = {
      totalScans: (parsed.totalScans || 0) + 1,
      valorantScans: updatedVal,
      aovScans: updatedAov,
      lastScanTime: newScanEntry.timestamp,
      lastScanGame: gameName,
      recentScans: recentArr,
      updatedAt: newScanEntry.timestamp
    };
    localStorage.setItem('fang_qr_stats', JSON.stringify(updatedStats));
    return { success: true, fallback: true, stats: updatedStats, newScan: newScanEntry };
  }
}

/**
 * Subscribe to Real-time QR Code Scan Updates from Firestore "qr_scans/stats"
 */
export function subscribeQrScans(callback) {
  try {
    const qrDocRef = doc(db, 'qr_scans', 'stats');
    const unsubscribe = onSnapshot(qrDocRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(INITIAL_QR_STATS);
      }
    }, (err) => {
      console.warn('[Firestore] QR scans subscription error:', err);
      const saved = localStorage.getItem('fang_qr_stats');
      if (saved) callback(JSON.parse(saved));
      else callback(INITIAL_QR_STATS);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[Firestore] QR scans init error:', e);
    const saved = localStorage.getItem('fang_qr_stats');
    if (saved) callback(JSON.parse(saved));
    else callback(INITIAL_QR_STATS);
    return () => {};
  }
}

/**
 * Initial Default Live Stream View Statistics
 */
export const INITIAL_LIVE_STATS = {
  totalViews: 0,
  valorantViews: 0,
  aovViews: 0,
  lastViewTime: null,
  lastViewGame: 'ALL',
  recentViews: []
};

/**
 * Record a Live View event in Firestore collection "live_views/stats"
 */
export async function recordLiveView(gameName = 'ALL') {
  const newViewEntry = {
    id: `live_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    game: gameName,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  try {
    const liveDocRef = doc(db, 'live_views', 'stats');
    const docSnap = await getDoc(liveDocRef);

    let currentTotal = 0;
    let currentVal = 0;
    let currentAov = 0;
    let recent = [];

    if (docSnap.exists()) {
      const data = docSnap.data();
      currentTotal = data.totalViews || 0;
      recent = Array.isArray(data.recentViews) ? data.recentViews : [];
      currentVal = data.valorantViews ?? recent.filter(s => s.game === 'VALORANT').length;
      currentAov = data.aovViews ?? recent.filter(s => s.game === 'AOV').length;
    }

    const updatedTotal = currentTotal + 1;
    const updatedVal = gameName === 'VALORANT' ? currentVal + 1 : currentVal;
    const updatedAov = gameName === 'AOV' ? currentAov + 1 : currentAov;
    const updatedRecent = [newViewEntry, ...recent].slice(0, 100);

    const payload = {
      totalViews: updatedTotal,
      valorantViews: updatedVal,
      aovViews: updatedAov,
      lastViewTime: newViewEntry.timestamp,
      lastViewGame: gameName,
      recentViews: updatedRecent,
      updatedAt: newViewEntry.timestamp
    };

    await setDoc(liveDocRef, payload, { merge: true });
    console.log('[Firestore] Live view recorded. Total views:', updatedTotal);
    localStorage.setItem('fang_live_stats', JSON.stringify(payload));
    return { success: true, stats: payload, newView: newViewEntry };
  } catch (error) {
    console.warn('[Firestore] Live view record fallback:', error);
    const saved = localStorage.getItem('fang_live_stats');
    let parsed = saved ? JSON.parse(saved) : INITIAL_LIVE_STATS;
    const recentArr = [newViewEntry, ...(parsed.recentViews || [])].slice(0, 100);
    const updatedVal = gameName === 'VALORANT' ? (parsed.valorantViews || 0) + 1 : (parsed.valorantViews || 0);
    const updatedAov = gameName === 'AOV' ? (parsed.aovViews || 0) + 1 : (parsed.aovViews || 0);
    const updatedStats = {
      totalViews: (parsed.totalViews || 0) + 1,
      valorantViews: updatedVal,
      aovViews: updatedAov,
      lastViewTime: newViewEntry.timestamp,
      lastViewGame: gameName,
      recentViews: recentArr,
      updatedAt: newViewEntry.timestamp
    };
    localStorage.setItem('fang_live_stats', JSON.stringify(updatedStats));
    return { success: true, fallback: true, stats: updatedStats, newView: newViewEntry };
  }
}

/**
 * Subscribe to Real-time Live Stream View Updates from Firestore "live_views/stats"
 */
export function subscribeLiveViews(callback) {
  try {
    const liveDocRef = doc(db, 'live_views', 'stats');
    const unsubscribe = onSnapshot(liveDocRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(INITIAL_LIVE_STATS);
      }
    }, (err) => {
      console.warn('[Firestore] Live views subscription error:', err);
      const saved = localStorage.getItem('fang_live_stats');
      if (saved) callback(JSON.parse(saved));
      else callback(INITIAL_LIVE_STATS);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[Firestore] Live views init error:', e);
    const saved = localStorage.getItem('fang_live_stats');
    if (saved) callback(JSON.parse(saved));
    else callback(INITIAL_LIVE_STATS);
    return () => {};
  }
}

/**
 * =========================================================
 * REAL-TIME VISITOR TRACKING & ONLINE PRESENCE SYSTEM
 * =========================================================
 * Uses Firestore heartbeat-based presence detection.
 * - `site_analytics/visitors` stores totalVisits + active sessions array
 * - Each session sends a heartbeat every 30s
 * - Sessions older than 60s are pruned as "offline"
 * =========================================================
 */

// Generate a unique session ID per browser tab
const SESSION_ID = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

/**
 * Initial Default Visitor Stats
 */
export const INITIAL_VISITOR_STATS = {
  totalVisits: 0,
  activeSessions: [],
  lastVisitTime: null
};

/**
 * Record a Page Visit (called once per session on page load)
 * Uses atomic increment for totalVisits counter
 */
export async function recordPageVisit() {
  const now = new Date().toISOString();
  const sessionEntry = {
    id: SESSION_ID,
    startedAt: now,
    lastSeen: now,
    userAgent: navigator.userAgent?.substring(0, 80) || 'Unknown',
    page: window.location.pathname + window.location.search
  };

  try {
    const visitorDocRef = doc(db, 'site_analytics', 'visitors');
    const docSnap = await getDoc(visitorDocRef);

    let currentTotal = 0;
    let activeSessions = [];

    if (docSnap.exists()) {
      const data = docSnap.data();
      currentTotal = data.totalVisits || 0;
      activeSessions = Array.isArray(data.activeSessions) ? data.activeSessions : [];
    }

    // Prune stale sessions (older than 90 seconds)
    const cutoffMs = Date.now() - 90 * 1000;
    activeSessions = activeSessions.filter(s => {
      const lastSeenMs = s.lastSeen ? new Date(s.lastSeen).getTime() : 0;
      return lastSeenMs > cutoffMs;
    });

    // Add current session
    activeSessions = activeSessions.filter(s => s.id !== SESSION_ID);
    activeSessions.push(sessionEntry);

    const payload = {
      totalVisits: currentTotal + 1,
      activeSessions,
      lastVisitTime: now,
      updatedAt: now
    };

    await setDoc(visitorDocRef, payload, { merge: true });
    console.log('[Visitor] Page visit recorded. Total:', currentTotal + 1, 'Active:', activeSessions.length);
    localStorage.setItem('fang_visitor_stats', JSON.stringify(payload));
    return { success: true, stats: payload };
  } catch (error) {
    console.warn('[Visitor] Record page visit fallback:', error);
    const saved = localStorage.getItem('fang_visitor_stats');
    const parsed = saved ? JSON.parse(saved) : INITIAL_VISITOR_STATS;
    const updated = {
      ...parsed,
      totalVisits: (parsed.totalVisits || 0) + 1,
      lastVisitTime: now
    };
    localStorage.setItem('fang_visitor_stats', JSON.stringify(updated));
    return { success: true, fallback: true, stats: updated };
  }
}

/**
 * Update Presence Heartbeat (called every 30 seconds via setInterval)
 * Refreshes the current session's lastSeen timestamp & prunes stale sessions
 */
export async function updatePresenceHeartbeat() {
  const now = new Date().toISOString();

  try {
    const visitorDocRef = doc(db, 'site_analytics', 'visitors');
    const docSnap = await getDoc(visitorDocRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();
    let activeSessions = Array.isArray(data.activeSessions) ? data.activeSessions : [];

    // Prune stale sessions (older than 90 seconds)
    const cutoffMs = Date.now() - 90 * 1000;
    activeSessions = activeSessions.filter(s => {
      const lastSeenMs = s.lastSeen ? new Date(s.lastSeen).getTime() : 0;
      return lastSeenMs > cutoffMs;
    });

    // Update current session's lastSeen
    const idx = activeSessions.findIndex(s => s.id === SESSION_ID);
    if (idx >= 0) {
      activeSessions[idx].lastSeen = now;
    } else {
      // Session was pruned or never added, re-register
      activeSessions.push({
        id: SESSION_ID,
        startedAt: now,
        lastSeen: now,
        userAgent: navigator.userAgent?.substring(0, 80) || 'Unknown',
        page: window.location.pathname + window.location.search
      });
    }

    await setDoc(visitorDocRef, {
      activeSessions,
      updatedAt: now
    }, { merge: true });

  } catch (error) {
    console.warn('[Visitor] Heartbeat update error:', error);
  }
}

/**
 * Remove current session from active sessions on page unload
 */
export async function removePresenceSession() {
  try {
    const visitorDocRef = doc(db, 'site_analytics', 'visitors');
    const docSnap = await getDoc(visitorDocRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    let activeSessions = Array.isArray(data.activeSessions) ? data.activeSessions : [];
    activeSessions = activeSessions.filter(s => s.id !== SESSION_ID);

    await setDoc(visitorDocRef, {
      activeSessions,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('[Visitor] Remove session error:', e);
  }
}

/**
 * Subscribe to Real-time Visitor Stats from Firestore "site_analytics/visitors"
 */
export function subscribeVisitorStats(callback) {
  try {
    const visitorDocRef = doc(db, 'site_analytics', 'visitors');
    const unsubscribe = onSnapshot(visitorDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Count only active sessions (seen within last 90 seconds)
        const cutoffMs = Date.now() - 90 * 1000;
        const activeSessions = (data.activeSessions || []).filter(s => {
          const lastSeenMs = s.lastSeen ? new Date(s.lastSeen).getTime() : 0;
          return lastSeenMs > cutoffMs;
        });
        callback({
          totalVisits: data.totalVisits || 0,
          onlineCount: activeSessions.length,
          activeSessions,
          lastVisitTime: data.lastVisitTime || null
        });
      } else {
        callback({ totalVisits: 0, onlineCount: 0, activeSessions: [], lastVisitTime: null });
      }
    }, (err) => {
      console.warn('[Visitor] Stats subscription error:', err);
      const saved = localStorage.getItem('fang_visitor_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        callback({
          totalVisits: parsed.totalVisits || 0,
          onlineCount: 0,
          activeSessions: [],
          lastVisitTime: parsed.lastVisitTime || null
        });
      } else {
        callback({ totalVisits: 0, onlineCount: 0, activeSessions: [], lastVisitTime: null });
      }
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[Visitor] Stats init error:', e);
    callback({ totalVisits: 0, onlineCount: 0, activeSessions: [], lastVisitTime: null });
    return () => {};
  }
}
