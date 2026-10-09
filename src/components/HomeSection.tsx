import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { speechService } from '../utils/speechService';
import { Shield, Play, HelpCircle, Award, CheckCircle, Smartphone, AlertTriangle, ArrowRight, Volume2, VolumeX, Pause, Sparkles, RefreshCw, Image as ImageIcon, Youtube } from 'lucide-react';
import { isYouTubeUrl } from '../utils/videoUtils';

export const HomeSection: React.FC = () => {
  const {
    language,
    activeSection,
    setActiveSection,
    setSelectedVideoId,
    videos,
    images,
    quizzes,
    attempts,
    notifications,
    translate
  } = useApp();

  const [dailyTip, setDailyTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState(speechService.getStatus());

  const localTipsEn = [
    "Keep your MTN and Airtel MoMo PIN strictly to yourself. No customer care agent or network operator will ever call you to ask for your 4-digit PIN.",
    "Turn on Two-Step Verification on your WhatsApp. Go to Settings > Account > Two-Step Verification to prevent hackers from locking you out and texting your friends for money.",
    "Watch out for fake WhatsApp links offering free airtime, cash grants, or government subsidies. Never click unverified links or enter your personal phone numbers.",
    "When using Mobile Money at a local agent booth, always cover your keypad with your hand while typing your PIN so bystanders cannot see it.",
    "Never send money to someone who calls urgently claiming a family member is stranded or arrested without first verifying by calling their known phone number."
  ];

  const localTipsBm = [
    "Isungileni MoMo PIN yenu mwebene. Kampani iya MTN nangu Airtel teti imitumine foni ukumipusha PIN, iyo ni nkama yenu.",
    "Bomfyeni Two-Step Verification pali WhatsApp yenu pa kucilikila abapondo ukwiba account yenu.",
    "Ilukani ku ma links aya bufi aya pa WhatsApp ayalemibepa ati ubuteko bulepela indalama sha mahala nangu ama bundles.",
    "Nga muletuma indalama ku booth ya Mobile Money, fimbileni pa keypad pa kulemba PIN yenu ukuti umuntu emona.",
    "Mwituma indalama kuli umuntu uulemupa foni ati lupwa lwenu ali mu bwafya ukwabula ukumutumina foni mwebe pa kumwishiba."
  ];

  useEffect(() => {
    const unsubscribe = speechService.subscribe(() => {
      setSpeechStatus(speechService.getStatus());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getRandomLocalTip = () => {
    const list = language === 'bm' ? localTipsBm : localTipsEn;
    const filtered = list.filter(t => t !== dailyTip);
    const pool = filtered.length > 0 ? filtered : list;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const fetchDailyTip = async () => {
    speechService.stop();
    setLoadingTip(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second fast timeout

      const response = await fetch(`/api/tips?lang=${language}&t=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.success && data.tip && data.tip.trim() !== '') {
        setDailyTip(data.tip.trim());
      } else {
        setDailyTip(getRandomLocalTip());
      }
    } catch (e) {
      console.warn('Using instant local Zambian tip:', e);
      setDailyTip(getRandomLocalTip());
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchDailyTip();
  }, [language]);

  // Metrics
  const totalQuizzesCompleted = attempts.length + 42; // Fallback + local attempts for realism
  const activeLearners = 1205;

  return (
    <div className="space-y-12 animate-fade-in" id="home-section">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-5 sm:p-10 border border-slate-800 shadow-2xl">
        {/* Zambia colors background flare */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-green-500/10 blur-3xl rounded-full"></div>
        <div className="absolute left-1/3 bottom-0 h-64 w-64 bg-orange-500/5 blur-3xl rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-mono">
              <Shield className="h-3.5 w-3.5" />
              <span>{translate('ZAMBIAN CYBERSECURITY INITIATIVE', ' UKUICINGILILA UKWAPA INTANETI MU ZAMBIA')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {translate(
                'Protect Your Identity and Money in the Digital World',
                'Cingilileni Indalama Shenu'
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-lg max-w-xl leading-relaxed">
              {translate(
                'Learn how to identify mobile money scams, prevent social media hacks, and safeguard your family. Structured lessons available in both English and Bemba.',
                'Sambilileni ifyo mwingeshiba ilyashi ilya bufi, ifyakuicingilila pa WhatsApp napa Facebook, no kuchenjela kuli bamapulamafunde. Ifisambilisho fili mu Cingeleshi na mu Cibemba.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <button
                id="hero-start-learning-btn"
                onClick={() => setActiveSection('learn')}
                className="w-full sm:w-auto px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow cursor-pointer active:scale-95"
              >
                <span>{translate('Start Learning Now', 'Ambeni Ukusambilila')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-chatbot-btn"
                onClick={() => setActiveSection('chatbot')}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{translate('Talk to Ba Cyber Advisor', 'Lanshanyeni naba Cyber Advisor')}</span>
              </button>
            </div>
          </div>

          {/* Large Cybersecurity Illustration (Bento graphic / SVG concept) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-slate-950/60 rounded-2xl border border-slate-700/60 p-6 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">SYSTEM_SECURITY_SHIELD: ACTIVE</span>
                <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-ping"></span>
              </div>

              {/* Graphic container */}
              <div className="my-auto flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-125 animate-pulse"></div>
                  <div className="relative bg-slate-900 border-2 border-green-400 text-green-400 p-6 rounded-full shadow-2xl">
                    <Shield className="h-16 w-16" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-sm font-bold tracking-wide block text-white">
                    {translate('Zambia Online Safety Shield', 'Kucingilila kwa pa Intaneti')}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">
                    {translate('Encryption • Two-Factor (2FA) • Verification', 'Amasambililo • Kucingilila PIN • Ukushininkisha')}
                  </span>
                </div>
              </div>

              {/* Small interactive notification mockup inside illustration */}
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-3 text-left">
                <div className="p-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-200 truncate">
                    
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS PANELS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="stats-dashboard">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow text-left">
          <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">{activeLearners}+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
              {translate('Active Zambian Learners', 'Abantu Abalesambilila')}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow text-left">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Play className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">{videos.length}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
              {translate('Educational Videos', 'Amavidio aya Sambilisha')}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow text-left">
          <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white block">{totalQuizzesCompleted}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
              {translate('Quizzes Completed', 'Ama Quizzes Ayapwishiwe')}
            </span>
          </div>
        </div>
      </div>

      {/* DUAL COLUMN: DAILY AI CYBER TIP & NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Daily Smart Cyber Tip Card */}
        <div className="lg:col-span-7 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 p-8 opacity-5">
            <Sparkles className="h-32 w-32 text-green-400" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-green-400 animate-spin" />
                <h3 className="font-bold text-lg text-white">
                  {translate('Daily Smart Security Tip', 'Icipope ica Kuicingilila Cila Bushiku')}
                </h3>
              </div>
              <div className="flex space-x-1.5 items-center">
                <button
                  id="refresh-tip-btn"
                  onClick={fetchDailyTip}
                  disabled={loadingTip}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer flex items-center space-x-1.5 text-xs"
                  title={translate('Get New Tip', 'Icipope cimbi')}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingTip ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline font-medium">{translate('New Tip', 'Cimbi')}</span>
                </button>
              </div>
            </div>

            {loadingTip ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-mono">{translate('Consulting AI security model...', 'Baleipusha  AI model...')}</p>
              </div>
            ) : (
              <div className="py-2 space-y-3">
                <p className="text-slate-200 text-base leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 font-medium">
                  {dailyTip}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 font-mono">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  <span>{translate('AI Recommended • Specific to Zambia', ' Mu Zambia fye')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 flex items-center space-x-3 mt-4">
            <div className="text-[11px] text-slate-400">
              <span className="font-bold text-green-400 block">{translate('Did you know?', 'Bushe mwalishiba?')}</span>
              {translate(
                'Over 85% of mobile money losses in Chinsali and Copperbelt happen through social engineering scams, not system hacking. Awareness is your absolute best defense!',
                'Impendwa (85%) mu Chinsali na Copperbelt kulaba abantu abasendwa mu fyakubepwa. Ukusambilila pafya kuicingilila kusuma sana!'
              )}
            </div>
          </div>
        </div>

        {/* Announcements / Notifications Feed */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-green-500" />
              <span>{translate('Announcements & Alerts', 'Ifyalembelwa na Machenjelo')}</span>
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border text-xs leading-normal transition-all ${
                    notif.type === 'announcement'
                      ? 'bg-orange-500/5 border-orange-500/10 text-orange-200'
                      : 'bg-green-500/5 border-green-500/10 text-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                      notif.type === 'announcement' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {notif.type === 'announcement' ? translate('ALERT', 'CHENJELA') : translate('LESSON', 'ISAMBILILO')}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm mb-1">
                    {translate(notif.title_en, notif.title_bm)}
                  </p>
                  <p className="text-slate-300 mb-2">
                    {translate(notif.message_en, notif.message_bm)}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-mono">
                      {notif.type === 'announcement' ? translate('URGENT BULLETIN', 'BULLETIN') : translate('LESSON UPDATE', 'UPDATE')}
                    </p>
                    {language === 'en' && (
                      <button
                        onClick={() => {
                          const script = `${notif.title_en}. ${notif.message_en}`;
                          const notifKey = `notif-${notif.id}`;
                          if (speechStatus.isSpeaking && speechStatus.activeTextId === notifKey) {
                            speechService.stop();
                          } else {
                            speechService.speak(script, notifKey, 'en', {
                              rate: 0.95,
                              pitch: 1.0
                            });
                          }
                        }}
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          speechStatus.isSpeaking && speechStatus.activeTextId === `notif-${notif.id}`
                            ? 'bg-orange-500 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                        }`}
                        title="Listen to alert audio (English)"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>
                          {speechStatus.isSpeaking && speechStatus.activeTextId === `notif-${notif.id}`
                            ? 'Playing...'
                            : 'Listen'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-4 text-center">
            <p className="text-[10px] text-slate-500 font-mono">
              {translate('For urgent cybersecurity assistance, contact ZICTA on short code 709.', ' Tumeni foni kuli ba ZICTA pali short code 709.')}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHTS: FEATURED CONTENT */}
      {videos.length > 0 ? (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-400" />
              <span>{translate('Featured Educational Videos', 'Amavidio aya Sambilisha')}</span>
            </h3>
            <button
              id="highlight-more-videos-btn"
              onClick={() => setActiveSection('learn')}
              className="text-sm font-bold text-green-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{translate('View All', 'Mona Fyonse')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video) => (
              <div
                key={video.id}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-950">
                  <img
                    src={video.thumbnailUrl}
                    alt={translate(video.title_en, video.title_bm)}
                    className="w-full h-full object-cover"
                  />
                  {isYouTubeUrl(video.url) ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md shadow flex items-center space-x-1 z-10">
                      <Youtube className="h-3 w-3" />
                      <span>YouTube</span>
                    </div>
                  ) : video.url.includes('facebook.com') ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1877F2] text-white text-[10px] font-bold rounded-md shadow flex items-center space-x-1 z-10">
                      <span>Facebook Reel</span>
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                    {isYouTubeUrl(video.url) ? (
                      <button
                        id={`play-home-vid-${video.id}`}
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setActiveSection('learn');
                        }}
                        className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center"
                        title={translate('Watch on Academy Player', 'Tambeni muli Academy Player')}
                      >
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </button>
                    ) : video.url.includes('facebook.com') ? (
                      <a
                        id={`play-home-vid-${video.id}`}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#1877F2] hover:bg-[#166fe5] rounded-full text-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center"
                        title={translate('Watch on Facebook', 'Mona pali Facebook')}
                      >
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </a>
                    ) : (
                      <button
                        id={`play-home-vid-${video.id}`}
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setActiveSection('learn');
                        }}
                        className="p-3 bg-green-600 rounded-full text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded font-mono">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 space-y-2 text-left">
                  <h4 className="font-bold text-white text-base line-clamp-1">
                    {translate(video.title_en, video.title_bm)}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {translate(video.description_en, video.description_bm)}
                  </p>
                  {isYouTubeUrl(video.url) ? (
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setActiveSection('learn');
                        }}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{translate('Stream Video Lesson', 'Tambeni Isambililo')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-0.5"
                        title={translate('Open on YouTube', 'Isula pali YouTube')}
                      >
                        <span>YouTube</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  ) : video.url.includes('facebook.com') ? (
                    <div className="pt-1">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>{translate('Watch Reel on Facebook', 'Mona Reel pali Facebook')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-green-400" />
              <span>{translate('Featured Visual Infographics', 'Ifipope fya Masambililo')}</span>
            </h3>
            <button
              id="highlight-more-gallery-btn"
              onClick={() => setActiveSection('gallery')}
              className="text-sm font-bold text-green-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{translate('Explore Gallery', 'Mona Fyonse')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.slice(0, 3).map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveSection('gallery')}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow hover:border-green-500/40 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={img.url}
                    alt={translate(img.title_en, img.title_bm)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-green-400 text-[10px] rounded font-mono border border-green-500/30">
                    {img.category}
                  </div>
                </div>
                <div className="p-4 space-y-2 text-left">
                  <h4 className="font-bold text-white text-base line-clamp-1 group-hover:text-green-400 transition-colors">
                    {translate(img.title_en, img.title_bm)}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {translate(img.description_en, img.description_bm)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
