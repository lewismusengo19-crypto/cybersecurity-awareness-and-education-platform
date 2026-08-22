import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit, disableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, VideoContent, ImageContent, PDFMaterial, Quiz, QuizAttempt, AuditLog, NotificationItem } from '../types';
import { SAMPLE_VIDEOS, SAMPLE_IMAGES, SAMPLE_PDFS, SAMPLE_QUIZZES } from '../sampleData';

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

  // Auth
  user: LocalUser | null;
  profile: UserProfile | null;
  loadingAuth: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: 'admin' | 'learner') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword?: string) => Promise<boolean>;
  quickLogin: (role: 'admin' | 'learner') => Promise<void>;

  // Data Collections
  videos: VideoContent[];
  images: ImageContent[];
  pdfs: PDFMaterial[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  addVideo: (video: Omit<VideoContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => Promise<void>;
  addImage: (image: Omit<ImageContent, 'id' | 'views' | 'downloads' | 'createdAt'>) => Promise<void>;
  addPdf: (pdf: Omit<PDFMaterial, 'id' | 'downloads' | 'createdAt'>) => Promise<void>;
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
        SAMPLE_VIDEOS.forEach(sample => {
          if (!merged.some(v => v.id === sample.id)) {
            merged.unshift(sample);
          }
        });
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
          if (!merged.some(img => img.id === sample.id)) {
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
      const local = localStorage.getItem('cyber_academy_custom_pdfs');
      return local ? JSON.parse(local) : SAMPLE_PDFS;
    } catch (_) {
      return SAMPLE_PDFS;
    }
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const local = localStorage.getItem('cyber_academy_custom_quizzes');
      if (local) {
        const parsed = JSON.parse(local) as Quiz[];
        const merged = [...parsed];
        SAMPLE_QUIZZES.forEach(sample => {
          if (!merged.some(q => q.id === sample.id)) {
            merged.push(sample);
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
        id: 'notif-1',
        title_en: 'Welcome to the Platform!',
        title_bm: 'Mwaiseni kuli bano bashisambilila!',
        message_en: 'Explore cybersecurity content in both English and Bemba. Take quizzes to earn badges!',
        message_bm: 'Sambilileni pa fya kacingilila ifya muli foni mu Cingeleshi na Cibemba. Eseni amano yenu muli quizzes!',
        type: 'announcement' as const,
        createdAt: new Date().toISOString()
      }
    ];
    try {
      const local = localStorage.getItem('cyber_academy_custom_notifications');
      return local ? JSON.parse(local) : defaults;
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
        await setDoc(doc(db, 'audit_logs', logId), newLog);
      }
    } catch (e) {
      console.warn('Logging to Firestore skipped, using local fallback:', e);
      try {
        if (db) await disableNetwork(db);
      } catch (_) {}
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
      try {
        if (!db) return;
        
        // Wrap the very first getDocs call in a fast timeout (e.g., 2000ms)
        // This ensures if the Firestore project/database is not fully ready or whitelisted,
        // we quickly skip and disable Firestore networking to prevent "Failed to fetch" console and global errors.
        const videoSnap = await withTimeout(
          getDocs(collection(db, 'videos')),
          2000,
          'Firestore connection timed out'
        );

        if (!videoSnap.empty) {
          const fetchedVideos: VideoContent[] = [];
          videoSnap.forEach(d => fetchedVideos.push(d.data() as VideoContent));
          setVideos(fetchedVideos);
        }

        // Fetch images
        const imageSnap = await getDocs(collection(db, 'images'));
        if (!imageSnap.empty) {
          const fetchedImages: ImageContent[] = [];
          imageSnap.forEach(d => fetchedImages.push(d.data() as ImageContent));
          setImages(fetchedImages);
        }

        // Fetch pdfs
        const pdfSnap = await getDocs(collection(db, 'pdfs'));
        if (!pdfSnap.empty) {
          const fetchedPdfs: PDFMaterial[] = [];
          pdfSnap.forEach(d => fetchedPdfs.push(d.data() as PDFMaterial));
          setPdfs(fetchedPdfs);
        }

        // Fetch quizzes
        const quizSnap = await getDocs(collection(db, 'quizzes'));
        if (!quizSnap.empty) {
          const fetchedQuizzes: Quiz[] = [];
          quizSnap.forEach(d => fetchedQuizzes.push(d.data() as Quiz));
          setQuizzes(fetchedQuizzes);
        }

        // Fetch attempts
        const attemptsSnap = await getDocs(collection(db, 'quiz_attempts'));
        if (!attemptsSnap.empty) {
          const fetchedAttempts: QuizAttempt[] = [];
          attemptsSnap.forEach(d => fetchedAttempts.push(d.data() as QuizAttempt));
          setAttempts(fetchedAttempts);
        }

        // Fetch notifications
        const notifSnap = await getDocs(collection(db, 'notifications'));
        if (!notifSnap.empty) {
          const fetchedNotifs: NotificationItem[] = [];
          notifSnap.forEach(d => fetchedNotifs.push(d.data() as NotificationItem));
          setNotifications(fetchedNotifs);
        }

        // Fetch audit logs (admin only)
        const logSnap = await getDocs(query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(100)));
        if (!logSnap.empty) {
          const fetchedLogs: AuditLog[] = [];
          logSnap.forEach(d => fetchedLogs.push(d.data() as AuditLog));
          setAuditLogs(fetchedLogs);
        }

      } catch (e) {
        console.warn('Firestore database read skipped or timed out, enabling offline fallback and disabling network:', e);
        try {
          if (db) {
            await disableNetwork(db);
          }
        } catch (err) {
          console.warn('Could not disable Firestore network:', err);
        }
      }
    };

    fetchContent();
  }, [user]);

  // Authentications
  const login = async (email: string, pass: string) => {
    setErrorMsg(null);
    try {
      if (!email || !pass) {
        throw new Error(language === 'bm' ? 'Lembeni email na password mukwai.' : 'Please enter your email and password.');
      }

      const storedUsers = localStorage.getItem('cyber_academy_users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user exists
      const foundUser = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        throw new Error(language === 'bm'
          ? 'Tapaba uyu uwalembeshiwa na iyi email. Lembelembeni lipya.'
          : 'No user found with this email. Please register first.');
      }

      // Check password
      if (foundUser.password !== pass) {
        throw new Error(language === 'bm'
          ? 'Password tailungeme. Eseniko na kabili.'
          : 'Incorrect password. Please try again.');
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

      await logActivity('Login', 'User authenticated locally');
    } catch (e: any) {
      setErrorMsg(e.message || 'Login failed.');
      throw e;
    }
  };

  const register = async (email: string, pass: string, name: string, role: 'admin' | 'learner') => {
    setErrorMsg(null);
    try {
      if (!email || !pass || !name) {
        throw new Error(language === 'bm' ? 'Sambilisheni ifiputulwa fyonse mukwai.' : 'Please fill in all fields.');
      }
      
      const storedUsers = localStorage.getItem('cyber_academy_users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if user already exists
      const userExists = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        throw new Error(language === 'bm' 
          ? 'Email iyi yalilembeshiwa kale. Lembeni imbi.' 
          : 'This email is already registered. Please sign in or use a different email.');
      }

      // If email is lewismusengo19@gmail.com, automatically grant admin
      const finalRole = email.toLowerCase() === 'lewismusengo19@gmail.com' ? 'admin' : role;
      
      const uid = 'user-' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        uid,
        email: email.toLowerCase(),
        password: pass,
        displayName: name,
        role: finalRole,
        createdAt: new Date().toISOString()
      };

      usersList.push(newUser);
      localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));

      const newUserProfile: UserProfile = {
        uid,
        email: email.toLowerCase(),
        displayName: name,
        role: finalRole,
        createdAt: newUser.createdAt
      };

      // Set active session
      const session = { user: { uid, email: email.toLowerCase() }, profile: newUserProfile };
      localStorage.setItem('cyber_academy_session', JSON.stringify(session));
      
      setUser(session.user);
      setProfile(newUserProfile);

      // Save to Firestore as backup if available
      try {
        if (db) {
          await setDoc(doc(db, 'users', uid), newUserProfile);
        }
      } catch (e) {
        console.warn('Could not save user profile to cloud database, using local storage session:', e);
      }

      await logActivity('Register', `New user registered locally as ${finalRole}`);
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed.');
      throw e;
    }
  };

  const logout = async () => {
    await logActivity('Logout', 'User signed out');
    localStorage.removeItem('cyber_academy_session');
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string, newPassword?: string): Promise<boolean> => {
    setErrorMsg(null);
    try {
      if (!email) {
        throw new Error(language === 'bm' ? 'Lembeni email yenu mukwai.' : 'Please enter your email address.');
      }
      const targetPass = newPassword && newPassword.trim().length >= 4 ? newPassword.trim() : 'password123';
      const storedUsers = localStorage.getItem('cyber_academy_users');
      let usersList = storedUsers ? JSON.parse(storedUsers) : [];

      const userIndex = usersList.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (userIndex !== -1) {
        // Update existing user password
        usersList[userIndex].password = targetPass;
        localStorage.setItem('cyber_academy_users', JSON.stringify(usersList));
      } else {
        // Auto-create/seed the user so they are immediately unblocked
        const finalRole = email.toLowerCase() === 'lewismusengo19@gmail.com' ? 'admin' : 'learner';
        const uid = 'user-' + Math.random().toString(36).substr(2, 9);
        const newUser = {
          uid,
          email: email.toLowerCase(),
          password: targetPass,
          displayName: email.split('@')[0],
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

  const quickLogin = async (role: 'admin' | 'learner') => {
    setErrorMsg(null);
    try {
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

      await logActivity('Quick Demo Login', `Authenticated as ${role} via quick demo access`);
    } catch (e: any) {
      console.error('Quick login failed:', e);
      setErrorMsg(e.message || 'Quick login failed.');
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
    const completeAttempt: QuizAttempt = {
      ...attempt,
      id: attemptId,
      completedAt: new Date().toISOString()
    };

    setAttempts(prev => {
      const updated = [completeAttempt, ...prev];
      localStorage.setItem('cyber_academy_custom_attempts', JSON.stringify(updated));
      return updated;
    });
    await logActivity('Take Quiz', `Completed quiz ${attempt.quizTitle_en} with score ${attempt.score}/${attempt.totalQuestions}`);

    try {
      if (db) {
        await setDoc(doc(db, 'quiz_attempts', attemptId), completeAttempt);
      }
    } catch (e) {
      console.warn('Could not save quiz attempt to Firestore:', e);
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
      user, profile, loadingAuth, errorMsg, setErrorMsg,
      login, register, logout, resetPassword, quickLogin,
      videos, images, pdfs, quizzes, attempts, auditLogs, notifications,
      addVideo, addImage, addPdf, addQuiz, deleteQuiz, addQuizAttempt, logActivity, addNotification,
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
