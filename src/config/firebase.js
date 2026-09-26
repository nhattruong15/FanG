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

// Initial default entry for videolivestream collection
export const INITIAL_VIDEO_LIVESTREAM = {
  id: 'stream_1',
  title: 'FanG Esports Tournament 2026 - Livestream Trực Tiếp',
  url: 'https://www.youtube.com/watch?v=cI5b71ZBAn0',
  embedUrl: 'https://www.youtube.com/embed/cI5b71ZBAn0',
  videoId: 'cI5b71ZBAn0',
  platform: 'YouTube',
  isLive: true,
  viewers: 14250,
  startTime: '15:00 - 26/09/2026',
  updatedAt: new Date().toISOString()
};

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
export async function saveVideoLivestream(data) {
  try {
    const embedUrl = parseYouTubeEmbed(data.embedUrl || data.url);
    const payload = {
      ...data,
      embedUrl,
      updatedAt: new Date().toISOString()
    };
    const streamDocRef = doc(db, 'videolivestream', 'active_stream');
    await setDoc(streamDocRef, payload, { merge: true });
    console.log('Successfully saved to Firestore document videolivestream/active_stream');
    localStorage.setItem('fang_videolivestream', JSON.stringify(payload));
    return { success: true, data: payload };
  } catch (error) {
    console.warn('Firestore write error:', error);
    const embedUrl = parseYouTubeEmbed(data.embedUrl || data.url);
    const payload = { ...data, embedUrl };
    localStorage.setItem('fang_videolivestream', JSON.stringify(payload));
    return { success: true, fallback: true, data: payload };
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
 * Subscribe to Real-time updates for "videolivestream" collection document
 */
export function subscribeVideoLivestream(callback) {
  try {
    // Ensure Admin account exists in Firestore DB
    saveAdminAccount(INITIAL_ADMIN_CREDENTIALS);

    const streamDocRef = doc(db, 'videolivestream', 'active_stream');
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        // Create initial default document in Firestore if not existing yet
        saveVideoLivestream(INITIAL_VIDEO_LIVESTREAM);
        callback(INITIAL_VIDEO_LIVESTREAM);
      }
    }, (err) => {
      console.warn('Firestore subscription warning:', err);
      const saved = localStorage.getItem('fang_videolivestream');
      if (saved) callback(JSON.parse(saved));
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore init error:', e);
    const saved = localStorage.getItem('fang_videolivestream');
    if (saved) callback(JSON.parse(saved));
    return () => {};
  }
}
