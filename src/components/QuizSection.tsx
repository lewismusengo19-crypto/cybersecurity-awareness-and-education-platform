import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useQuizOfflineCache } from '../hooks/useQuizOfflineCache';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  BarChart2, 
  BookOpen, 
  HardDrive, 
  Download, 
  Wifi, 
  WifiOff, 
  Check, 
  Database,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Quiz } from '../types';

export const QuizSection: React.FC = () => {
  const {
    language,
    quizzes,
    attempts,
    user,
    profile,
    addQuizAttempt,
    translate
  } = useApp();

  const {
    isOnline,
    cachedQuizzes,
    cachedIds,
    stats,
    justCachedId,
    checkIsCached,
    cacheQuiz,
    cacheAll,
    removeQuiz
  } = useQuizOfflineCache(quizzes);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'offline'>('all');
  const [cacheToast, setCacheToast] = useState<string | null>(null);

  // Show temporary toast feedback
  const triggerToast = (msg: string) => {
    setCacheToast(msg);
    setTimeout(() => setCacheToast(null), 3000);
  };

  // Start a quiz
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Submit answer for evaluation
  const submitAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);
    
    const currentQuestion = activeQuiz!.questions[currentQuestionIndex];
    if (selectedAnswerIndex === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuiz!.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const isCorrect = selectedAnswerIndex === activeQuiz!.questions[currentQuestionIndex].correctAnswerIndex;
      const finalScore = score + (isCorrect ? 1 : 0);
      
      // Log the completed attempt to context / database / offline queue
      addQuizAttempt({
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'guest@example.com',
        userName: profile?.displayName || 'Guest Learner',
        quizId: activeQuiz!.id,
        quizTitle_en: activeQuiz!.title_en,
        quizTitle_bm: activeQuiz!.title_bm,
        score: finalScore,
        totalQuestions: activeQuiz!.questions.length
      });
    }
  };

  // Handle batch cache all quizzes
  const handleCacheAll = () => {
    const result = cacheAll(quizzes);
    triggerToast(
      translate(
        `Cached all ${result.success} quizzes (${stats.totalQuestions} questions) to local storage!`,
        `Amasambilisho yonse ${result.success} nayasungwa muli foni!`
      )
    );
  };

  // Filtered quizzes list
  const displayedQuizzes = filterMode === 'offline'
    ? quizzes.filter(q => checkIsCached(q.id))
    : quizzes;

  return (
    <div className="space-y-8 text-left animate-fade-in" id="quiz-section">
      {/* Toast Notification */}
      {cacheToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-green-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-slide-up text-xs">
          <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
          <span>{cacheToast}</span>
        </div>
      )}

      {/* Header with Offline Storage Details */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
              <Award className="h-7 w-7 text-green-500" />
              <span>{translate('Cybersecurity Quizzes', 'Ama Quizzes')}</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              {translate(
                'Test your awareness and verify you can identify common online threats in Zambia. All questions are cached in local storage for offline practice.',
                'Esheni amano yenu pa kwishiba ubufi eyo bamapulamafunde aba pa Intaneti. Amepusho yonse nayasungwa muli foni ukuti mulesambilila nangu tapali intaneti.'
              )}
            </p>
          </div>

          {/* Quick Cache Control Pill */}
          <div className="flex items-center space-x-2">
            <button
              id="cache-all-quizzes-btn"
              onClick={handleCacheAll}
              className="px-3.5 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow cursor-pointer"
              title={translate('Cache all quiz questions into local storage', 'Sungeni amepusho yonse muli foni')}
            >
              <Download className="h-3.5 w-3.5 text-green-400" />
              <span>{translate('Cache All for Offline', 'Sungeni Yonse')}</span>
            </button>
          </div>
        </div>

        {/* Storage status & connectivity banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className={`p-1.5 rounded-lg border ${
              isOnline 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            }`}>
              {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-300">
              <span className="font-bold">
                {isOnline 
                  ? translate('Online Mode', 'Intaneti Iliko') 
                  : translate('Offline Practice Active', 'Ukusambilila Ukwabula Intaneti (Offline)')}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center space-x-1">
                <HardDrive className="h-3 w-3 text-green-400 inline mr-1" />
                <span>
                  {translate(
                    `${stats.totalQuestions} questions cached in local storage (${stats.sizeFormatted})`,
                    `Amepusho ${stats.totalQuestions} nayasungwa muli foni (${stats.sizeFormatted})`
                  )}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-green-950/60 border border-green-800/60 text-green-300">
              <Check className="h-2.5 w-2.5 mr-1 text-green-400" />
              {translate('Offline Ready', 'Ili Tayari')}
            </span>
          </div>
        </div>
      </div>

      {/* Offline Alert when disconnected */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3 animate-fade-in shadow-lg">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <WifiOff className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              {translate('Offline Practice Mode Active', 'Muli mu Mode ya Kukanaba pa Intaneti')}
            </h4>
            <p className="text-amber-300/90 leading-relaxed">
              {translate(
                'No internet connection detected. You can freely practice any of the cached quizzes below without mobile data. All evaluation happens instantly on your device, and your scores are saved to local storage.',
                'Tapali intaneti. Kuti mwaeshamo amano yenu muma quizzes yonse ayasungwa muli foni ukwabula ukubomfya ama bundle. Fyonse filebomba bwino bwino kabili ifyo mukwete fyalasungwa muli foni.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* QUIZ MAIN SCREEN */}
      {!activeQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of Available Quizzes */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter mode header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-bold text-lg text-white">
                {translate('Available Quizzes', 'Ama Quizzes Ayalipo')}
              </h3>
              
              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {translate('All Quizzes', 'Yonse')} ({quizzes.length})
                </button>
                <button
                  onClick={() => setFilterMode('offline')}
                  className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition cursor-pointer ${
                    filterMode === 'offline'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HardDrive className="h-3 w-3" />
                  <span>{translate('Saved Offline', 'Ifyasungwa')} ({cachedQuizzes.length})</span>
                </button>
              </div>
            </div>
            
            {displayedQuizzes.length === 0 ? (
              <div className="py-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-3 p-6">
                <HardDrive className="h-8 w-8 text-slate-500 mx-auto" />
                <h4 className="text-white font-bold text-sm">
                  {translate('No quizzes filtered', 'Tapali ama quiz')}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {translate(
                    'Click "Cache All for Offline" above to save all quiz questions into local storage.',
                    'Tinikeni "Sungeni Yonse" pakuti amepusho yonse yasungwe muli foni.'
                  )}
                </p>
                <button
                  onClick={handleCacheAll}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {translate('Cache All Quizzes Now', 'Sungeni Yonse Nomba')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayedQuizzes.map((quiz) => {
                  const finishedBefore = attempts.find(a => a.quizId === quiz.id);
                  const isCached = checkIsCached(quiz.id);
                  const isJustCached = justCachedId === quiz.id;

                  return (
                    <div
                      key={quiz.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between text-left shadow group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="p-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-mono font-bold">
                            {quiz.questions.length} {translate('Questions', 'Amepusho')}
                          </span>

                          <div className="flex items-center space-x-1">
                            {/* Local Storage Offline Badge */}
                            {isCached && (
                              <span 
                                className="px-2 py-1 bg-slate-950 border border-slate-800 text-green-400 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1"
                                title={translate('Quiz questions stored in local storage for offline use', 'Yasungwa muli foni')}
                              >
                                <HardDrive className="h-3 w-3 text-green-400" />
                                <span className="hidden sm:inline">{translate('Offline Ready', 'Offline')}</span>
                              </span>
                            )}

                            {finishedBefore && (
                              <span className="p-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                <span>{translate('COMPLETED', 'MWAPWISHA')}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-base sm:text-lg group-hover:text-green-400 transition-colors">
                            {translate(quiz.title_en, quiz.title_bm)}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                            {translate(quiz.description_en, quiz.description_bm)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-5">
                        {/* Start Quiz CTA */}
                        <button
                          id={`start-quiz-btn-${quiz.id}`}
                          onClick={() => startQuiz(quiz)}
                          className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-all shadow"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>
                            {!isOnline
                              ? translate('Practice Offline', 'Sambilileni Ukwabula Intaneti')
                              : translate('Start Quiz', 'Tampeni Quiz')}
                          </span>
                        </button>

                        {/* Local Storage Toggle Button */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => {
                              if (isCached) {
                                removeQuiz(quiz.id);
                                triggerToast(translate(`Removed ${quiz.title_en} from local storage`, 'Fumyamo muli foni'));
                              } else {
                                cacheQuiz(quiz);
                                triggerToast(translate(`Saved ${quiz.title_en} to local storage for offline practice`, 'Cacisungwa muli foni'));
                              }
                            }}
                            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 py-1 px-1 rounded transition cursor-pointer"
                          >
                            <HardDrive className={`h-3 w-3 ${isCached ? 'text-green-400' : 'text-slate-500'}`} />
                            <span>
                              {isJustCached
                                ? translate('Saved in Storage!', 'Nacisungwa!')
                                : isCached
                                ? translate('Cached in Storage (Click to remove)', 'Cili muli foni')
                                : translate('Save for Offline Practice', 'Sungani muli foni')}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User performance & Offline Storage Overview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Offline Storage Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-green-400" />
                  <h4 className="font-bold text-sm text-white">
                    {translate('Offline Storage Cache', 'Ifisambilisho Ifyasungwa')}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono font-bold">
                  {translate('LOCAL STORAGE', 'MULI FON')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    {translate('Questions Cached', 'Amepusho')}
                  </span>
                  <span className="text-lg font-extrabold text-white font-mono mt-0.5 block">
                    {stats.totalQuestions}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    {translate('Quizzes Ready', 'Ama Quiz')}
                  </span>
                  <span className="text-lg font-extrabold text-white font-mono mt-0.5 block">
                    {stats.totalQuizzes}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>{translate('Local Storage Footprint', 'Ubukulu bwa muli foni')}:</span>
                  <span className="font-mono font-bold text-white">{stats.sizeFormatted}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{translate('Bilingual Support', 'Indimi Shonse')}:</span>
                  <span className="font-bold text-green-400">English & Cibemba</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  {translate(
                    'Questions, options, explanations, and local scoring run natively in browser storage without network data.',
                    'Amepusho yonse, ifyakwasuka, ne fyo mwapikilisha fyonse fyalabomba ukwabula indalama sha bundle.'
                  )}
                </p>
              </div>
            </div>

            {/* User performance / Attempts history */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-left space-y-4">
              <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-green-500" />
                <span>{translate('My Quiz Performance', 'Efyo Ncitile muli quiz')}</span>
              </h3>

              {attempts.length === 0 ? (
                <div className="py-6 text-center text-slate-500 space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto" />
                  <p className="text-xs">
                    {translate('No attempts logged yet. Complete quizzes to track progress!', 'Tampeni ama quiz ukwishiba epomuleindela!')}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {attempts.map((att) => {
                    const percentage = Math.round((att.score / att.totalQuestions) * 100);
                    return (
                      <div
                        key={att.id}
                        className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-xs space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {translate(att.quizTitle_en, att.quizTitle_bm)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {att.isOfflineAttempt && (
                              <span 
                                className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-mono font-bold flex items-center space-x-0.5"
                                title={translate('Attempt completed while offline and saved to device', 'Mwalembela ukwabula intaneti')}
                              >
                                <HardDrive className="h-2.5 w-2.5" />
                                <span>Offline</span>
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              percentage >= 70 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>{att.score} / {att.totalQuestions} {translate('Correct', 'Mwa asuka bwino')}</span>
                          <span>{new Date(att.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-400">
                <span className="font-bold text-green-400 block mb-0.5">
                  {translate('Continuous Learning', 'Epo Muleendela')}
                </span>
                {translate(
                  'Complete quizzes to achieve certified cybersecurity readiness. Offline scores auto-sync to the cloud whenever you reconnect.',
                  'Pwisheni ama quiz ukuti mube abacingililwe. Fyonse ifyo mukwete fyalasungwa muli cloud nga mwaingila pa intaneti.'
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE PLAYING INTERACTIVE BOARD */
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl relative text-left">
          {/* Progress header */}
          <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4 mb-6 gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] uppercase font-mono text-green-400 font-bold">
                  {translate(activeQuiz.title_en, activeQuiz.title_bm)}
                </span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-green-400 bg-green-950/60 border border-green-800/60 px-1.5 py-0.5 rounded">
                  <HardDrive className="h-2.5 w-2.5" />
                  <span>{translate('Local Storage', 'Muli Foni')}</span>
                </span>
                {!isOnline && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    <WifiOff className="h-2.5 w-2.5" />
                    <span>{translate('Offline', 'Tapali Intaneti')}</span>
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-white">
                {translate('Question', 'Ilipusho')} {currentQuestionIndex + 1} {translate('of', 'muli')} {activeQuiz.questions.length}
              </h3>
            </div>

            {/* Visual Progress ring proxy */}
            <div className="h-10 w-10 flex items-center justify-center bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-green-400 rounded-full">
              {Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%
            </div>
          </div>

          {!quizFinished ? (
            <div className="space-y-6">
              {/* Question Text */}
              <p className="text-white text-base sm:text-lg font-bold leading-normal">
                {translate(
                  activeQuiz.questions[currentQuestionIndex].question_en,
                  activeQuiz.questions[currentQuestionIndex].question_bm
                )}
              </p>

              {/* Options list */}
              <div className="space-y-3">
                {translate(
                  activeQuiz.questions[currentQuestionIndex].options_en,
                  activeQuiz.questions[currentQuestionIndex].options_bm
                ).map((option: string, index: number) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrect = index === activeQuiz.questions[currentQuestionIndex].correctAnswerIndex;
                  
                  let optionClass = 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (isSelected && !isAnswerSubmitted) {
                    optionClass = 'bg-green-600/10 border-green-500 text-green-400 ring-1 ring-green-500';
                  } else if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionClass = 'bg-green-500/15 border-green-500 text-green-300';
                    } else if (isSelected) {
                      optionClass = 'bg-red-500/15 border-red-500 text-red-300';
                    } else {
                      optionClass = 'opacity-40 bg-slate-950/20 border-slate-850 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={index}
                      id={`quiz-option-${index}`}
                      onClick={() => {
                        if (!isAnswerSubmitted) setSelectedAnswerIndex(index);
                      }}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle className="h-4.5 w-4.5 text-green-400 flex-shrink-0" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation Feedback upon submission */}
              {isAnswerSubmitted && (activeQuiz.questions[currentQuestionIndex].explanation_en || activeQuiz.questions[currentQuestionIndex].explanation_bm) && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 animate-fade-in shadow-inner">
                  <div className="flex items-center space-x-1.5 text-green-400 font-bold uppercase tracking-wider text-[11px]">
                    <Sparkles className="h-4 w-4 text-green-400 shrink-0" />
                    <span>{translate('Educational Insight & Scam Breakdown', 'Ukusambilila no Kulondolola Ubu Bufi')}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {translate(
                      activeQuiz.questions[currentQuestionIndex].explanation_en || '',
                      activeQuiz.questions[currentQuestionIndex].explanation_bm || ''
                    )}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6">
                <button
                  id="cancel-quiz-btn"
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  {translate('Exit Quiz', 'Fumeniko')}
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    id="submit-answer-btn"
                    onClick={submitAnswer}
                    disabled={selectedAnswerIndex === null}
                    className={`px-5 py-2.5 font-bold rounded-xl text-xs shadow cursor-pointer transition-all ${
                      selectedAnswerIndex === null
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-500 text-white'
                    }`}
                  >
                    {translate('Submit Answer', 'Shinikizheni Efyo Musangile')}
                  </button>
                ) : (
                  <button
                    id="next-question-btn"
                    onClick={nextQuestion}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs shadow cursor-pointer transition-all"
                  >
                    <span>
                      {currentQuestionIndex + 1 === activeQuiz.questions.length
                        ? translate('Finish Quiz', 'Napwisha Quiz')
                        : translate('Next Question', 'Ilipusho Elekonkapo')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* CONGRATULATIONS / RESULTS SCREEN */
            <div className="text-center py-6 space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-110"></div>
                <div className="relative bg-slate-950 border-2 border-green-500 p-5 rounded-full text-green-400">
                  <Award className="h-16 w-16" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {translate('Quiz Complete!', 'Mwapwisha!')}
                </h3>
                <p className="text-slate-400 text-sm">
                  {translate('Excellent effort! Here is your cybersecurity score details.', 'Cawama sana nganshi! Nomba moneni ifyo mukwete.')}
                </p>
              </div>

              {/* Local Storage Offline Notice */}
              {!isOnline && (
                <div className="max-w-md mx-auto p-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-300 flex items-start space-x-2.5 text-left">
                  <HardDrive className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">
                      {translate('Completed in Offline Practice Mode', 'Mwapwisha Ukwabula Intaneti')}
                    </span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {translate(
                        'Your score and attempt were safely recorded in browser local storage. When you reconnect to the internet, it will automatically synchronize to your profile in the cloud.',
                        'Ifyo mwasuka fyalasungwa muli foni yenu. Nga mwaingila pa intaneti, fyalatuminwa muli cloud.'
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="max-w-sm mx-auto bg-slate-950/50 border border-slate-850 p-6 rounded-2xl">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-850 pb-3 font-mono text-sm">
                  <span>{translate('Total Questions', 'Amepusho Yonse')}:</span>
                  <span className="font-bold text-white">{activeQuiz.questions.length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-850 py-3 font-mono text-sm">
                  <span>{translate('Correct Answers', 'Efyo Mwaswike Bwino')}:</span>
                  <span className="font-bold text-green-400">{score}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 font-mono text-sm">
                  <span>{translate('Accuracy Rating', 'Epo muleyendela')}:</span>
                  <span className={`font-bold ${
                    (score / activeQuiz.questions.length) >= 0.7 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.round((score / activeQuiz.questions.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Guest registration prompt to save achievements */}
              {!user && (
                <div className="max-w-md mx-auto p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-left flex items-start space-x-3">
                  <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs">
                      {translate('Save your progress & earn certificates', 'Sungeni epomuleendela ne mafunde')}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {translate(
                        'Create a free account or sign in to track your scores, save certificates, and build your digital cybersecurity badge.',
                        'Pangeni account ya mahala nangu ingileni ukusunga amashina ne fitupa fya masambililo.'
                      )}
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const loginTrigger = document.getElementById('login-trigger-btn');
                          if (loginTrigger) loginTrigger.click();
                        }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer transition shadow"
                      >
                        <span>{translate('Sign In / Register Free', 'Ingileni / Lembesheni')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-3 pt-4">
                <button
                  id="retry-quiz-btn"
                  onClick={() => startQuiz(activeQuiz)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{translate('Retry Quiz', 'Esheni Nakabili')}</span>
                </button>
                <button
                  id="back-quizzes-btn"
                  onClick={() => setActiveQuiz(null)}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-all shadow"
                >
                  {translate('Back to Quizzes', 'Bwekeleni Kuma Quiz')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
