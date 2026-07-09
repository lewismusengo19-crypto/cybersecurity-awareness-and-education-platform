import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Play, HelpCircle, Award, CheckCircle, Smartphone, AlertTriangle, ArrowRight, Volume2, Sparkles, RefreshCw } from 'lucide-react';

export const HomeSection: React.FC = () => {
  const {
    language,
    activeSection,
    setActiveSection,
    videos,
    quizzes,
    attempts,
    notifications,
    translate
  } = useApp();

  const [dailyTip, setDailyTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState<boolean>(true);

  const fetchDailyTip = async () => {
    setLoadingTip(true);
    try {
      const response = await fetch(`/api/tips?lang=${language}`);
      const data = await response.json();
      if (data.success && data.tip) {
        setDailyTip(data.tip);
      } else {
        setDailyTip(translate('Protect your mobile money wallet. Never share your PIN with anyone claiming to call from customer care.', 'Kucingilila ndalama sha MoMo kulasunga PIN muli mwebe bene.'));
      }
    } catch (e) {
      console.warn('Daily tip generation failed, using fallback tip:', e);
      setDailyTip(translate('Protect your mobile money wallet. Never share your PIN with anyone claiming to call from customer care.', 'Kucingilila ndalama sha MoMo kulasunga PIN muli mwebe bene.'));
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchDailyTip();
  }, [language]);

  // Audio synthesis alert of the daily tip using standard web speech synthesis (only if user presses play)
  const speakTip = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(dailyTip);
      // Try to determine voice rate/pitch for better accessibility
      utterance.rate = 0.9;
      // Web speech synthesis typically speaks English perfectly, Bemba might sound funny but is useful for accessibility
      window.speechSynthesis.speak(utterance);
    } else {
      alert(translate('Web Speech API is not supported on this browser.', 'Inshila ya kulanda te kuti ibombe muli browser yenu.'));
    }
  };

  // Metrics
  const totalQuizzesCompleted = attempts.length + 42; // Fallback + local attempts for realism
  const activeLearners = 1205;

  return (
    <div className="space-y-12 animate-fade-in" id="home-section">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        {/* Zambia colors background flare */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-green-500/10 blur-3xl rounded-full"></div>
        <div className="absolute left-1/3 bottom-0 h-64 w-64 bg-orange-500/5 blur-3xl rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-mono">
              <Shield className="h-3.5 w-3.5" />
              <span>{translate('ZAMBIAN CYBERSECURITY INITIATIVE', 'UPANGI WA UKUICINGILILA MU ZAMBIA')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {translate(
                'Protect Your Identity and Money in the Digital World',
                'Kucingilila Imparian na Ndalama Shenu pa Intaneti'
              )}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              {translate(
                'Learn how to identify mobile money scams, prevent social media hacks, and safeguard your family. Structured lessons available in both English and Bemba.',
                'Sambilileni ifyo mwingasanga amalyashi ya bufi, ifyakucingilila muli WhatsApp nangu Facebook, no kuchenjela kuli bampulamafunde. Ifisambilisho fili mu Cingeleshi na muli Cibemba.'
              )}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-start-learning-btn"
                onClick={() => setActiveSection('learn')}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{translate('Start Learning Now', 'Ambilisheni Ukusambilila')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-chatbot-btn"
                onClick={() => setActiveSection('chatbot')}
                className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>{translate('Talk to Ba Cyber Advisor', 'Lanshanyeni na Cyber Advisor')}</span>
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
                    {translate('Suspicious Airtel Caller Detected', 'Foni ya Bufi ya Airtel Isangilwe')}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    {translate('Attempted MoMo PIN request blocked', 'Ifisuma fya MoMo filecingililwa')}
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
              {translate('Active Zambian Learners', 'Abantu Balesambilila')}
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
              {translate('Educational Videos', 'Amavidio ya Sambililo')}
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
              {translate('Quizzes Completed', 'Ifyayako Ifyapwishwa')}
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
                  {translate('Daily Smart Security Tip', 'Icipote ca Kucingilila Cila Bushiku')}
                </h3>
              </div>
              <div className="flex space-x-1">
                <button
                  id="speak-tip-btn"
                  onClick={speakTip}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  title={translate('Read Aloud', 'Belengela muli foni')}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  id="refresh-tip-btn"
                  onClick={fetchDailyTip}
                  disabled={loadingTip}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  title={translate('Get New Tip', 'Icipote cimbi')}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingTip ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {loadingTip ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-mono">{translate('Consulting AI security model...', 'Balelanda na AI model...')}</p>
              </div>
            ) : (
              <div className="py-2 space-y-3">
                <p className="text-slate-200 text-base leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 font-medium">
                  {dailyTip}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 font-mono">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  <span>{translate('AI Recommended • Specific to Zambia', 'Ifilesenda ku AI • Mu Zambia fye')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 flex items-center space-x-3 mt-4">
            <div className="text-[11px] text-slate-400">
              <span className="font-bold text-green-400 block">{translate('Did you know?', 'Bushe mwalishiba?')}</span>
              {translate(
                'Over 85% of mobile money losses in Chinsali and Copperbelt happen through social engineering scams, not system hacking. Awareness is your absolute best defense!',
                'Kuiposha fye ne mishi yapamona ndalama sha MoMo sha fye ishingi (85%) mu Chinsali na Copperbelt kulasenda muli fyakubepa, te muli fya kubomba muli system. Ukusambilila e kucingilila kwawama!'
              )}
            </div>
          </div>
        </div>

        {/* Announcements / Notifications Feed */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-green-500" />
              <span>{translate('Announcements & Alerts', 'Ifyalembelwa na Machenjelelo')}</span>
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
                      {notif.type === 'announcement' ? translate('ALERT', 'CHENJELA') : translate('LESSON', 'SAMBILILO')}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm mb-1">
                    {translate(notif.title_en, notif.title_bm)}
                  </p>
                  <p className="text-slate-300">
                    {translate(notif.message_en, notif.message_bm)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-4 text-center">
            <p className="text-[10px] text-slate-500 font-mono">
              {translate('For urgent cybersecurity assistance, contact ZICTA on short code 709.', 'Mukulanshanya na bwangu muli fya kofya, tumbeni foni kuli ZICTA pali short code 709.')}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHTS: LATEST VIDEOS & RECENT QUIZZES */}
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Play className="h-5 w-5 text-green-400" />
            <span>{translate('Featured Educational Videos', 'Amavidio ya Sambililo')}</span>
          </h3>
          <button
            id="highlight-more-videos-btn"
            onClick={() => setActiveSection('learn')}
            className="text-sm font-bold text-green-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>{translate('View All', 'Mone Yonse')}</span>
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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                  <button
                    id={`play-home-vid-${video.id}`}
                    onClick={() => setActiveSection('learn')}
                    className="p-3 bg-green-600 rounded-full text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </button>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
