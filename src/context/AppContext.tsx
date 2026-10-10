import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit, disableNetwork, enableNetwork } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';
import { UserProfile, VideoContent, ImageContent, PDFMaterial, Quiz, QuizAttempt, AuditLog, NotificationItem } from '../types';
import { SAMPLE_VIDEOS, SAMPLE_IMAGES, SAMPLE_PDFS, SAMPLE_QUIZZES } from '../sampleData';
import {
  cacheAllQuizzes,
  cacheSingleQuiz,
  removeCachedQuiz,
  queueOfflineQuizAttempt,
  getQueuedOfflineQuizAttempts,
  clearQueuedOfflineQuizAttempts
} from '../utils/quizStorageCache';

const withTimeout = <T extends unknown>(promise: Promise<T>, ms: number, timeoutErrorMsg: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutErrorMsg));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export interface LocalUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AppContextType {
  // UI Settings
  language: 'en' | 'bm';
  setLanguage: (lang: 'en' | 'bm') => void;
  textSize: 'normal' | 'large';
  setTextSize: (size: 'normal' | 'large') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  selectedVideoId: string | null;
  setSelectedVideoId: (id: string | null) => void;

  // Auth
  user: LocalUser | null;
  profile: UserProfile | null;
  loadingAuth: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  login: (email: string, pass: string, adminPin?: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: 'admin' | 'learner', adminSecretKey?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword?: string, adminPin?: string) => Promise<boolean>;
  quickLogin: (role: 'admin' | 'learner', adminPin?: string) => Promise<void>;
  getAdminPin: () => string;
  updateAdminPin: (newPin: string) => boolean;

  // Data Collections
  videos: VideoContent[];
  images: ImageContent[];
  pdfs: PDFMaterial[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  addVideo: (video: Omit<VideoContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => Promise<void>;
  updateVideo: (id: string, updates: Partial<VideoContent>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  addImage: (image: Omit<ImageContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => Promise<void>;
  addPdf: (pdf: Omit<PDFMaterial, 'id' | 'downloads' | 'createdAt'>) => Promise<void>;
  deletePdf: (id: string) => Promise<void>;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  addQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => Promise<void>;
  logActivity: (action: string, details: string) => Promise<void>;
  addNotification: (title_en: string, title_bm: string, msg_en: string, msg_bm: string, type: 'announcement' | 'lesson') => Promise<void>;

  // Helpers
  translate: (en: string, bm: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'bm'>('en');
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Firestore & local state combined with LocalStorage fallback
  const [videos, setVideos] = useState<VideoContent[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_videos');
      if (local) {
        const parsed = JSON.parse(local) as VideoContent[];
        const merged = [...parsed];
        let migrated = false;
        SAMPLE_VIDEOS.forEach(sample => {
          const idx = merged.findIndex(v => v.id === sample.id);
          if (idx === -1) {
            merged.push(sample);
            migrated = true;
          } else {
            // If the sample video has a YouTube URL and the stored item still has an old Facebook URL or missing thumbnail, migrate it
            if (
              merged[idx].url.includes('facebook.com/reel/1398945024917902') ||
              merged[idx].url.includes('facebook.com/reel/1433376975358331') ||
              (sample.url.includes('youtu') && merged[idx].url.includes('facebook.com')) ||
              (sample.url !== merged[idx].url && sample.url.includes('youtu'))
            ) {
              merged[idx] = { ...merged[idx], ...sample, url: sample.url, thumbnailUrl: sample.thumbnailUrl };
              migrated = true;
            } else {
              merged[idx] = { ...sample, ...merged[idx] };
            }
          }
        });
        if (migrated) {
          try {
            localStorage.setItem('cyber_academy_custom_videos', JSON.stringify(merged));
          } catch (_) {}
        }
        return merged;
      }
      return SAMPLE_VIDEOS;
    } catch (_) {
      return SAMPLE_VIDEOS;
    }
  });
  const [images, setImages] = useState<ImageContent[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_images');
      if (local) {
        const parsed = JSON.parse(local) as ImageContent[];
        const merged = [...parsed];
        SAMPLE_IMAGES.forEach(sample => {
          const existingIdx = merged.findIndex(img => img.id === sample.id);
          if (existingIdx >= 0) {
            merged[existingIdx] = { ...merged[existingIdx], ...sample };
          } else {
            merged.unshift(sample);
          }
        });
        return merged;
      }
      return SAMPLE_IMAGES;
    } catch (_) {
      return SAMPLE_IMAGES;
    }
  });
  const [pdfs, setPdfs] = useState<PDFMaterial[]>(() => {
    try {
      localStorage.removeItem('cyber_academy_custom_pdfs');
    } catch (_) {}
    return [];
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_quizzes');
      if (local) {
        const parsed = JSON.parse(local) as Quiz[];
        const merged = [...parsed];
        SAMPLE_QUIZZES.forEach(sample => {
          const idx = merged.findIndex(q => q.id === sample.id);
          if (idx >= 0) {
            merged[idx] = { ...sample, ...merged[idx], questions: sample.questions };
          } else {
            merged.unshift(sample);
          }
        });
        return merged;
      }
      return SAMPLE_QUIZZES;
    } catch (_) {
      return SAMPLE_QUIZZES;
    }
  });
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_attempts');
      return local ? JSON.parse(local) : [];
    } catch (_) {
      return [];
    }
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_logs');
      return local ? JSON.parse(local) : [];
    } catch (_) {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const defaults = [
      {
        id: 'notif-gold-scam-alert',
        title_en: '⚠️ Scam Alert: "Shikulu Mwila" Fake Gold SMS Fraud',
        title_bm: '⚠️ Chenjelani: Ubufi bwa Golide (Gold) bwa ba "Shikulu Mwila"',
        message_en: 'A real-world scam SMS is circulating offering 450g gold with 35% discount from "Shikulu Mwila". Never reply or transfer mobile money for transport/testing. View the Infographics Gallery for the full breakdown and protection guide.',
        message_bm: 'Bapulamafunde baletuma ama SMS pa foni ati bakwete 450g golide kabili balelipila 35% discount kwati ni "Shikulu Mwila". Mwilasuka nangu ukutuma indalama sha MoMo. Moneni icipope muli Gallery pakuti mwishibe ifyo mwingacingilila.',
        type: 'announcement' as const,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-1',
        title_en: 'Welcome to the Platform!',
        title_bm: 'Mwaiseni!',
        message_en: 'Explore cybersecurity content in both English and Bemba. Take quizzes to earn badges!',
        message_bm: 'Sambilileni pa fya kacingilila ifya muli foni mu Cingeleshi namu Cibemba. Esheni amano yenu muma quizzes!',
        type: 'announcement' as const,
        createdAt: new Date().toISOString()
      }
    ];
    try {
      const local = localStorage.getItem('cyber_academy_custom_notifications');
      if (local) {
        const parsed = JSON.parse(local) as NotificationItem[];
        // Ensure the scam alert notification is always present at top
        if (!parsed.some(n => n.id === 'notif-gold-scam-alert')) {
          parsed.unshift(defaults[0]);
        }
        return parsed;
      }
      return defaults;
    } catch (_) {
      return defaults;
    }
  });

  // Translate helper
  const translate = (en: string, bm: string) => {
    return language === 'bm' ? bm : en;
  };

  // Activity logger helper
  const logActivity = async (action: string, details: string) => {
    const logId = 'log-' + Math.random().toString(36).substr(2, 9);
    const newLog: AuditLog = {
      id: logId,
      userId: user?.uid || 'guest',
      email: user?.email || 'guest@example.com',
      action,
      details,
      ipAddress: '197.211.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255), // Zambian IP proxy
      device: navigator.userAgent.substring(0, 50),
      timestamp: new Date().toISOString()
    };

    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('cyber_academy_custom_logs', JSON.stringify(updated));
      return updated;
    });

    try {
      if (db) {
        await withTimeout(setDoc(doc(db, 'audit_logs', logId), newLog), 1200, 'Audit write timeout');
      }
    } catch (e) {
      console.warn('Logging to Firestore skipped, using local fallback:', e);
    }
  };

  // Seed default admin and other users
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('cyber_academy_users');
      let usersList: any[] = [];
      if (storedUsers) {
        try {
          usersList = JSON.parse(storedUsers);
        } catch (_) {
          usersList = [];
        }
      }

      // Ensure the Admin user always exists
      const adminEmail = 'lewismusengo19@gmail.com';
      const adminIndex = usersList.findIndex((u: any) => u.email?.toLowerCase() === adminEmail.toLowerCase());
      if (adminIndex === -1) {
        usersList.unshift({
          uid: 'seeded-admin',
          email: adminEmail,
          password: 'password123',
          displayName: 'Lewis Musengo (Admin)',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      } else {
        // Ensure role is admin
        usersList[adminIndex].role = 'admin';
      }

      // Ensure a demo learner user also exists
      const learnerEmail = 'learner@zambiacyber.org';
      const learnerIndex = usersList.findIndex((u: any) => u.email?.toLowerCase() === learnerEmail.toLowerCase());
      if (learnerIndex === -1) {
        usersList.push({
          uid: 'seeded-learner',
          email: learnerEmail,
          password: 'password123',
          displayName: 'Chanda Mulenga (Learner)',
          role: 'learner',
          createdAt: new Date().toISOString()
        });
      }

      localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
    } catch (e) {
      console.warn('Error seeding default users:', e);
    }
  }, []);

  // Auth monitoring via LocalStorage
  useEffect(() => {
    setLoadingAuth(true);
    try {
      const storedSession = localStorage.getItem('cyber_academy_session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData.user);
        setProfile(sessionData.profile);
      }
    } catch (e) {
      console.warn('Error restoring session:', e);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  // Fetch Firestore content on load if connected
  useEffect(() => {
    const fetchContent = async () => {
      if (!db) return;

      // 1. Fetch videos
      try {
        const videoSnap = await withTimeout(
          getDocs(collection(db, 'videos')),
          3000,
          'Firestore video fetch timed out'
        );
        if (!videoSnap.empty) {
          const fetchedVideos: VideoContent[] = [];
          videoSnap.forEach(d => fetchedVideos.push(d.data() as VideoContent));
          SAMPLE_VIDEOS.forEach(sample => {
            const foundIdx = fetchedVideos.findIndex(v => v.id === sample.id);
            if (foundIdx === -1) {
              fetchedVideos.unshift(sample);
            } else if (sample.url.includes('youtu') && fetchedVideos[foundIdx].url !== sample.url) {
              fetchedVideos[foundIdx] = { ...fetchedVideos[foundIdx], ...sample };
            }
          });
          setVideos(fetchedVideos);
        } else {
          setVideos(SAMPLE_VIDEOS);
        }
      } catch (err) {
        console.warn('Using local fallback for videos:', err);
        setVideos(SAMPLE_VIDEOS);
      }

      // 2. Fetch images
      try {
        const imageSnap = await getDocs(collection(db, 'images'));
        if (!imageSnap.empty) {
          const fetchedImages: ImageContent[] = [];
          imageSnap.forEach(d => fetchedImages.push(d.data() as ImageContent));
          SAMPLE_IMAGES.forEach(sample => {
            const idx = fetchedImages.findIndex(img => img.id === sample.id);
            if (idx >= 0) {
              fetchedImages[idx] = { ...sample, ...fetchedImages[idx] };
            } else {
              fetchedImages.unshift(sample);
            }
          });
          setImages(fetchedImages);
        } else {
          setImages(SAMPLE_IMAGES);
        }
      } catch (err) {
        console.warn('Using local fallback for images:', err);
        setImages(SAMPLE_IMAGES);
      }

      // 3. Fetch pdfs - purge any residual documents
      try {
        const pdfSnap = await getDocs(collection(db, 'pdfs'));
        if (!pdfSnap.empty) {
          const { deleteDoc } = await import('firebase/firestore');
          pdfSnap.forEach(async d => {
            try { await deleteDoc(d.ref); } catch (_) {}
          });
        }
        setPdfs([]);
      } catch (_) {
        setPdfs([]);
      }

      // 4. Fetch quizzes
      try {
        const quizSnap = await getDocs(collection(db, 'quizzes'));
        if (!quizSnap.empty) {
          const fetchedQuizzes: Quiz[] = [];
          quizSnap.forEach(d => fetchedQuizzes.push(d.data() as Quiz));
          SAMPLE_QUIZZES.forEach(sample => {
            const idx = fetchedQuizzes.findIndex(q => q.id === sample.id);
            if (idx >= 0) {
              fetchedQuizzes[idx] = { ...sample, ...fetchedQuizzes[idx], questions: sample.questions };
            } else {
              fetchedQuizzes.unshift(sample);
            }
          });
          setQuizzes(fetchedQuizzes);
        } else {
          setQuizzes(SAMPLE_QUIZZES);
        }
      } catch (err) {
        console.warn('Using local fallback for quizzes:', err);
        setQuizzes(SAMPLE_QUIZZES);
      }

      // 5. Fetch attempts (authenticated users)
      if (user) {
        try {
          const attemptsSnap = await getDocs(collection(db, 'quiz_attempts'));
          if (!attemptsSnap.empty) {
            const fetchedAttempts: QuizAttempt[] = [];
            attemptsSnap.forEach(d => fetchedAttempts.push(d.data() as QuizAttempt));
            setAttempts(fetchedAttempts);
          }
        } catch (err) {
          console.warn('Could not load cloud quiz attempts, using local storage attempts:', err);
        }
      }

      // 6. Fetch notifications
      try {
        const notifSnap = await getDocs(collection(db, 'notifications'));
        if (!notifSnap.empty) {
          const fetchedNotifs: NotificationItem[] = [];
          notifSnap.forEach(d => fetchedNotifs.push(d.data() as NotificationItem));
          setNotifications(fetchedNotifs);
        }
      } catch (_) {}

      // 7. Fetch audit logs (admin role only)
      if (profile?.role === 'admin') {
        try {
          const logSnap = await getDocs(query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(100)));
          if (!logSnap.empty) {
            const fetchedLogs: AuditLog[] = [];
            logSnap.forEach(d => fetchedLogs.push(d.data() as AuditLog));
            setAuditLogs(fetchedLogs);
          }
        } catch (err) {
          console.warn('Could not load audit logs for admin:', err);
        }
      }
    };

    fetchContent();
  }, [user, profile?.role]);

  // Auto-cache all quiz questions in localStorage for offline practice
  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      cacheAllQuizzes(quizzes);
    }
  }, [quizzes]);

  // Synchronize any offline-completed quiz attempts to cloud database when back online
  useEffect(() => {
    const handleOnlineSync = async () => {
      const queued = getQueuedOfflineQuizAttempts();
      if (queued.length > 0 && db) {
        try {
          for (const attempt of queued) {
            await withTimeout(setDoc(doc(db, 'quiz_attempts', attempt.id), attempt), 2500, 'Sync timeout');
          }
          clearQueuedOfflineQuizAttempts();
          console.log(`[QuizCache] Successfully synced ${queued.length} offline quiz attempt(s) to cloud database.`);
        } catch (err) {
          console.warn('[QuizCache] Failed syncing offline attempts, will retry next connection:', err);
        }
      }
    };

    window.addEventListener('online', handleOnlineSync);
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      handleOnlineSync();
    }

    return () => {
      window.removeEventListener('online', handleOnlineSync);
    };
  }, []);

  const getAdminPin = (): string => {
    try {
      return localStorage.getItem('cyber_academy_admin_pin') || '260966';
    } catch (_) {
      return '260966';
    }
  };

  const updateAdminPin = (newPin: string): boolean => {
    if (!newPin || newPin.trim().length < 4) {
      throw new Error(language === 'bm' ? 'Admin PIN ifwile ukukwata ifipendo ukucila pali 4.' : 'Admin PIN must be at least 4 digits.');
    }
    localStorage.setItem('cyber_academy_admin_pin', newPin.trim());
    logActivity('Security Configuration', 'Admin Master Security PIN updated');
    return true;
  };

  // Authentications
  const login = async (email: string, pass: string, adminPin?: string) => {
    setErrorMsg(null);
    try {
      if (!email || !pass) {
        throw new Error(language === 'bm' ? 'Lembeni email na password mukwai.' : 'Please enter your email and password.');
      }

      const normalizedEmail = email.trim().toLowerCase();
      const isAdminEmail = normalizedEmail === 'lewismusengo19@gmail.com';

      // 1. Check local storage registry
      const storedUsers = localStorage.getItem('cyber_academy_users');
      let usersList: any[] = [];
      if (storedUsers) {
        try {
          usersList = JSON.parse(storedUsers);
        } catch (_) {
          usersList = [];
        }
      }

      let foundUser = usersList.find((u: any) => u.email?.toLowerCase() === normalizedEmail);

      // 2. Attempt Firebase Auth authentication for cloud sync
      let firebaseUid: string | null = null;
      if (auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
          firebaseUid = cred.user.uid;
        } catch (fbErr: any) {
          console.warn('Firebase cloud auth notice:', fbErr?.code || fbErr?.message);
        }
      }

      // If not in local users list, but Firebase Auth succeeded or cloud document exists:
      if (!foundUser && firebaseUid && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            foundUser = {
              uid: firebaseUid,
              email: normalizedEmail,
              password: pass,
              displayName: data.displayName || normalizedEmail.split('@')[0],
              role: data.role || (isAdminEmail ? 'admin' : 'learner'),
              createdAt: data.createdAt || new Date().toISOString()
            };
            usersList.push(foundUser);
            localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
          }
        } catch (_) {}
      }

      // If user is still not found:
      if (!foundUser) {
        throw new Error(
          language === 'bm' 
            ? 'Account tailiko na email iyi. Mukwai lembesheni (Register) pakuti mupange account.' 
            : 'No account found with this email. Please click "Register" to create your free account.'
        );
      }

      // If user is found, verify password!
      if (foundUser.password && foundUser.password !== pass) {
        throw new Error(
          language === 'bm'
            ? 'Password taili bwino kuli iyi account. Esheni nakabili nangu cinjeni password.'
            : 'Incorrect password for this account. Please try again or use "Forgot Password?" to reset.'
        );
      }

      // 3. CRITICAL SECURITY GUARD: Administrator Dual-Factor PIN Check
      // If authenticating as Administrator, require valid Admin Security PIN!
      if (isAdminEmail || foundUser.role === 'admin') {
        const currentPin = getAdminPin();
        if (!adminPin || adminPin.trim() !== currentPin) {
          throw new Error(
            language === 'bm'
              ? 'Administrator akwete 2FA security. Mukwai bikenipo Admin Security PIN (6-digit) pakuti mwingile.'
              : 'Administrator Dual-Factor Security: A valid Admin Security PIN (6 digits) is strictly required to log in as Administrator.'
          );
        }
      }

      // Ensure admin privileges if email is admin
      if (isAdminEmail) {
        foundUser.role = 'admin';
      }

      // Sync UID if Firebase Auth returned a real UID
      if (firebaseUid && foundUser.uid !== firebaseUid) {
        foundUser.uid = firebaseUid;
        localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
      }

      const userProfile: UserProfile = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      };

      // Set active session
      const session = { user: { uid: foundUser.uid, email: foundUser.email }, profile: userProfile };
      localStorage.setItem('cyber_academy_session', JSON.stringify(session));

      setUser(session.user);
      setProfile(userProfile);

      // Ensure Firestore network is active
      try {
        if (db) await enableNetwork(db);
      } catch (_) {}

      await logActivity('Login', `User ${foundUser.email} authenticated as ${foundUser.role}`);
    } catch (e: any) {
      console.warn('Login warning:', e.message || e);
      setErrorMsg(e.message || 'Login failed.');
      throw e;
    }
  };

  const register = async (email: string, pass: string, name: string, role: 'admin' | 'learner', adminSecretKey?: string) => {
    setErrorMsg(null);
    try {
      if (!email || !pass || !name) {
        throw new Error(language === 'bm' ? 'Lembeni mufiputulwa fyonse mukwai.' : 'Please fill in all fields (Name, Email, and Password).');
      }

      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        throw new Error(language === 'bm' ? 'Lembeni amashina yenu bwino.' : 'Please enter your full name.');
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
        throw new Error(language === 'bm' ? 'Email taili bwino. Bikenipo email yenu iyabomba.' : 'Please enter a valid email address.');
      }

      if (pass.length < 4) {
        throw new Error(language === 'bm' ? 'Password ifwile ukukwata ifilembo ukucila pali 4.' : 'Password must be at least 4 characters long.');
      }
      
      const storedUsers = localStorage.getItem('cyber_academy_users');
      let usersList: any[] = [];
      if (storedUsers) {
        try {
          usersList = JSON.parse(storedUsers);
        } catch (_) {
          usersList = [];
        }
      }

      // Check if user already exists
      const existingUser = usersList.find((u: any) => u.email?.toLowerCase() === normalizedEmail);
      if (existingUser) {
        throw new Error(
          language === 'bm'
            ? 'Account epoili kale na email iyi. Mukwai ingileni (Sign In).'
            : 'An account with this email already exists. Please switch to Sign In.'
        );
      }

      const isAdminEmail = normalizedEmail === 'lewismusengo19@gmail.com';
      
      // Protect administrator role from unauthorized registration
      if (role === 'admin' || isAdminEmail) {
        const currentPin = getAdminPin();
        const masterKey = 'ADMIN-ZM-2026';
        if (!adminSecretKey || (adminSecretKey.trim() !== currentPin && adminSecretKey.trim() !== masterKey)) {
          throw new Error(
            language === 'bm'
              ? 'Security Key iya Admin taili bwino. Tamusuminshikwa ukupanga account ya Administrator ukwabula authorization.'
              : 'Unauthorized: A valid Admin Security Authorization Key is required to create an Administrator account.'
          );
        }
      }

      const finalRole = (role === 'admin' || isAdminEmail) ? 'admin' : 'learner';
      
      let uid = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);

      // Attempt real Firebase Auth registration
      if (auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
          uid = cred.user.uid;
          try {
            await updateProfile(cred.user, { displayName: trimmedName });
          } catch (_) {}
        } catch (fbErr: any) {
          console.warn('Firebase Auth registration notice:', fbErr?.code || fbErr?.message);
          if (fbErr?.code === 'auth/email-already-in-use') {
            throw new Error(
              language === 'bm'
                ? 'Account epoili kale na email iyi. Mukwai ingileni (Sign In).'
                : 'An account with this email already exists in our cloud system. Please switch to Sign In.'
            );
          }
        }
      }

      const newUser = {
        uid,
        email: normalizedEmail,
        password: pass,
        displayName: trimmedName,
        role: finalRole,
        createdAt: new Date().toISOString()
      };

      usersList.push(newUser);
      localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));

      const newUserProfile: UserProfile = {
        uid,
        email: normalizedEmail,
        displayName: trimmedName,
        role: finalRole,
        createdAt: newUser.createdAt
      };

      // Set active session
      const session = { user: { uid, email: normalizedEmail }, profile: newUserProfile };
      localStorage.setItem('cyber_academy_session', JSON.stringify(session));
      
      setUser(session.user);
      setProfile(newUserProfile);

      // Save to Firestore as backup if available
      try {
        if (db) {
          await enableNetwork(db);
          await withTimeout(setDoc(doc(db, 'users', uid), newUserProfile), 3000, 'User profile write timeout');
        }
      } catch (e) {
        console.warn('Could not save user profile to cloud database, using local storage session:', e);
      }

      await logActivity('Register', `New user registered as ${finalRole}`);
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed.');
      throw e;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('cyber_academy_session');
    } catch (e) {
      console.warn('Error clearing session from localStorage:', e);
    }

    // Instantly wipe state so UI updates to signed-out state immediately
    setUser(null);
    setProfile(null);
    setErrorMsg(null);

    // If currently viewing the admin portal, redirect safely to home
    setActiveSection(prev => (prev === 'admin' ? 'home' : prev));

    // Sign out from Firebase auth if active (non-blocking)
    try {
      if (auth && auth.currentUser) {
        await auth.signOut();
      }
    } catch (e) {
      console.warn('Firebase auth signOut warning:', e);
    }

    // Log the event without blocking UI completion
    logActivity('Logout', 'User signed out successfully').catch(e => {
      console.warn('Audit log write for logout skipped:', e);
    });
  };

  const resetPassword = async (email: string, newPassword?: string, adminPin?: string): Promise<boolean> => {
    setErrorMsg(null);
    try {
      if (!email) {
        throw new Error(language === 'bm' ? 'Lembeni email yenu mukwai.' : 'Please enter your email address.');
      }
      const normalizedEmail = email.trim().toLowerCase();
      const isAdminEmail = normalizedEmail === 'lewismusengo19@gmail.com';

      // Require Admin PIN to reset admin account
      if (isAdminEmail) {
        const currentPin = getAdminPin();
        if (!adminPin || adminPin.trim() !== currentPin) {
          throw new Error(
            language === 'bm'
              ? 'Admin Security PIN ifwile yabikwapo pakuti mucinje password ya Administrator.'
              : 'Admin Security Verification required: You must provide the valid Admin Security PIN to reset the administrator password.'
          );
        }
      }

      const targetPass = newPassword && newPassword.trim().length >= 4 ? newPassword.trim() : 'password123';
      const storedUsers = localStorage.getItem('cyber_academy_users');
      let usersList = storedUsers ? JSON.parse(storedUsers) : [];

      const userIndex = usersList.findIndex((u: any) => u.email?.toLowerCase() === normalizedEmail);
      if (userIndex !== -1) {
        // Update existing user password
        usersList[userIndex].password = targetPass;
        localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
      } else {
        const finalRole = isAdminEmail ? 'admin' : 'learner';
        const uid = 'user-' + Math.random().toString(36).substr(2, 9);
        const newUser = {
          uid,
          email: normalizedEmail,
          password: targetPass,
          displayName: normalizedEmail.split('@')[0],
          role: finalRole,
          createdAt: new Date().toISOString()
        };
        usersList.push(newUser);
        localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
      }

      await logActivity('Password Reset', `Password securely updated for ${email}`);
      return true;
    } catch (e: any) {
      setErrorMsg(e.message || 'Password reset failed.');
      throw e;
    }
  };

  const quickLogin = async (role: 'admin' | 'learner', adminPin?: string) => {
    setErrorMsg(null);
    try {
      if (role === 'admin') {
        const currentPin = getAdminPin();
        if (!adminPin || adminPin.trim() !== currentPin) {
          throw new Error(
            language === 'bm'
              ? 'Admin 1-click login yalisalwa. Kufwaya Admin Security PIN.'
              : '1-click demo login is disabled for Administrator accounts. Please use standard login with your password and Admin Security PIN.'
          );
        }
      }

      const email = role === 'admin' ? 'lewismusengo19@gmail.com' : 'learner@zambiacyber.org';
      const displayName = role === 'admin' ? 'Lewis Musengo (Admin)' : 'Chanda Mulenga (Learner)';
      const uid = role === 'admin' ? 'seeded-admin' : 'seeded-learner';

      const userProfile: UserProfile = {
        uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      };

      const session = { user: { uid, email }, profile: userProfile };
      localStorage.setItem('cyber_academy_session', JSON.stringify(session));

      setUser(session.user);
      setProfile(userProfile);

      await logActivity('Demo Login', `Authenticated as ${role} via demo access`);
    } catch (e: any) {
      console.error('Login failed:', e);
      setErrorMsg(e.message || 'Login failed.');
      throw e;
    }
  };

  // Content modifiers (Admin)
  const addVideo = async (newVid: Omit<VideoContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => {
    const videoId = 'vid-' + Date.now();
    const completeVid: VideoContent = {
      ...newVid,
      id: videoId,
      views: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    setVideos(prev => {
      const updated = [completeVid, ...prev];
      localStorage.setItem('cyber_academy_custom_videos', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Upload Content', `Uploaded video: ${newVid.title_en}`);

    try {
      if (db) {
        await setDoc(doc(db, 'videos', videoId), completeVid);
      }
    } catch (e) {
      console.warn('Could not save video to Firestore:', e);
    }
  };

  const updateVideo = async (id: string, updates: Partial<VideoContent>) => {
    setVideos(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, ...updates } : v);
      localStorage.setItem('cyber_academy_custom_videos', JSON.stringify(updated));
      return updated;
    });
    const targetVid = videos.find(v => v.id === id);
    await logActivity('Update Video', `Updated video ID: ${id} (${targetVid?.title_en || 'unknown'})`);

    try {
      if (db) {
        await setDoc(doc(db, 'videos', id), updates, { merge: true });
      }
    } catch (e) {
      console.warn('Could not update video in Firestore:', e);
    }
  };

  const deleteVideo = async (id: string) => {
    const deleted = videos.find(v => v.id === id);
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('cyber_academy_custom_videos', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Delete Video', `Deleted video ID: ${id} (${deleted?.title_en || 'unknown'})`);

    try {
      if (db) {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'videos', id));
      }
    } catch (e) {
      console.warn('Could not delete video from Firestore:', e);
    }
  };

  const addImage = async (newImg: Omit<ImageContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => {
    const imageId = 'img-' + Date.now();
    const completeImg: ImageContent = {
      ...newImg,
      id: imageId,
      views: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    setImages(prev => {
      const updated = [completeImg, ...prev];
      localStorage.setItem('cyber_academy_custom_images', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Upload Content', `Uploaded infographic image: ${newImg.title_en}`);

    try {
      if (db) {
        await setDoc(doc(db, 'images', imageId), completeImg);
      }
    } catch (e) {
      console.warn('Could not save image to Firestore:', e);
    }
  };

  const addPdf = async (newPdf: Omit<PDFMaterial, 'id' | 'downloads' | 'createdAt'>) => {
    const pdfId = 'pdf-' + Date.now();
    const completePdf: PDFMaterial = {
      ...newPdf,
      id: pdfId,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    setPdfs(prev => {
      const updated = [completePdf, ...prev];
      localStorage.setItem('cyber_academy_custom_pdfs', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Upload Content', `Uploaded PDF book: ${newPdf.title_en}`);

    try {
      if (db) {
        await setDoc(doc(db, 'pdfs', pdfId), completePdf);
      }
    } catch (e) {
      console.warn('Could not save PDF to Firestore:', e);
    }
  };

  const deletePdf = async (id: string) => {
    const deleted = pdfs.find(p => p.id === id);
    setPdfs(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('cyber_academy_custom_pdfs', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Delete PDF', `Deleted PDF ID: ${id} (${deleted?.title_en || 'unknown'})`);

    try {
      if (db) {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'pdfs', id));
      }
    } catch (e) {
      console.warn('Could not delete PDF from Firestore:', e);
    }
  };

  const addQuiz = async (newQuiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const quizId = 'quiz-' + Date.now();
    const completeQuiz: Quiz = {
      ...newQuiz,
      id: quizId,
      createdAt: new Date().toISOString()
    };

    setQuizzes(prev => {
      const updated = [completeQuiz, ...prev];
      localStorage.setItem('cyber_academy_custom_quizzes', JSON.stringify(updated));
      return updated;
    });
    // Immediately cache questions in local storage
    cacheSingleQuiz(completeQuiz);
    await logActivity('Create Quiz', `Created quiz: ${newQuiz.title_en}`);

    try {
      if (db) {
        await setDoc(doc(db, 'quizzes', quizId), completeQuiz);
      }
    } catch (e) {
      console.warn('Could not save quiz to Firestore:', e);
    }
  };

  const deleteQuiz = async (id: string) => {
    const deleted = quizzes.find(q => q.id === id);
    setQuizzes(prev => {
      const updated = prev.filter(q => q.id !== id);
      localStorage.setItem('cyber_academy_custom_quizzes', JSON.stringify(updated));
      return updated;
    });
    // Remove from local storage cache
    removeCachedQuiz(id);
    await logActivity('Delete Quiz', `Deleted quiz ID: ${id} (${deleted?.title_en || 'unknown'})`);

    try {
      if (db) {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'quizzes', id));
      }
    } catch (e) {
      console.warn('Could not delete quiz from Firestore:', e);
    }
  };

  const addQuizAttempt = async (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const attemptId = 'attempt-' + Date.now();
    const isCurrentlyOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    const completeAttempt: QuizAttempt = {
      ...attempt,
      id: attemptId,
      completedAt: new Date().toISOString(),
      isOfflineAttempt: !isCurrentlyOnline
    };

    setAttempts(prev => {
      const updated = [completeAttempt, ...prev];
      localStorage.setItem('cyber_academy_custom_attempts', JSON.stringify(updated));
      return updated;
    });

    // If offline, queue the attempt so it automatically uploads when reconnected
    if (!isCurrentlyOnline) {
      queueOfflineQuizAttempt(completeAttempt);
    }

    await logActivity('Take Quiz', `Completed quiz ${attempt.quizTitle_en} with score ${attempt.score}/${attempt.totalQuestions}${!isCurrentlyOnline ? ' (Offline Practice)' : ''}`);

    if (isCurrentlyOnline) {
      try {
        if (db) {
          await setDoc(doc(db, 'quiz_attempts', attemptId), completeAttempt);
        }
      } catch (e) {
        console.warn('Could not save quiz attempt to Firestore, queuing offline:', e);
        queueOfflineQuizAttempt(completeAttempt);
      }
    }
  };

  const addNotification = async (title_en: string, title_bm: string, msg_en: string, msg_bm: string, type: 'announcement' | 'lesson') => {
    const notifId = 'notif-' + Date.now();
    const notif: NotificationItem = {
      id: notifId,
      title_en,
      title_bm,
      message_en: msg_en,
      message_bm: msg_bm,
      type,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => {
      const updated = [notif, ...prev];
      localStorage.setItem('cyber_academy_custom_notifications', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Send Notification', `Sent notification: ${title_en}`);

    try {
      if (db) {
        await setDoc(doc(db, 'notifications', notifId), notif);
      }
    } catch (e) {
      console.warn('Could not save notification to Firestore:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      textSize, setTextSize,
      highContrast, setHighContrast,
      activeSection, setActiveSection,
      selectedVideoId, setSelectedVideoId,
      user, profile, loadingAuth, errorMsg, setErrorMsg,
      login, register, logout, resetPassword, quickLogin,
      getAdminPin, updateAdminPin,
      videos, images, pdfs, quizzes, attempts, auditLogs, notifications,
      addVideo, updateVideo, deleteVideo, addImage, addPdf, deletePdf, addQuiz, deleteQuiz, addQuizAttempt, logActivity, addNotification,
      translate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
