import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart2, BookOpen } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';

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

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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
      // Log the completed attempt to context / database
      addQuizAttempt({
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'guest@example.com',
        userName: profile?.displayName || 'Guest Learner',
        quizId: activeQuiz!.id,
        quizTitle_en: activeQuiz!.title_en,
        quizTitle_bm: activeQuiz!.title_bm,
        score: score + (selectedAnswerIndex === activeQuiz!.questions[currentQuestionIndex].correctAnswerIndex ? 1 : 0),
        totalQuestions: activeQuiz!.questions.length
      });
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in" id="quiz-section">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
          <Award className="h-6 w-6 text-green-500" />
          <span>{translate('Cybersecurity Quizzes', 'Ifyayako fya Kacingilila')}</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {translate('Test your awareness and verify you can identify common online threats in Zambia.', 'Eseni amano yenu pa kwishiba ubufi na bampulamafunde aba pa Intaneti.')}
        </p>
      </div>

      {/* QUIZ MAIN SCREEN */}
      {!activeQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of Available Quizzes */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-bold text-lg text-white mb-2">{translate('Available Quizzes', 'Ifyayako Ifilipo')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quizzes.map((quiz) => {
                const finishedBefore = attempts.find(a => a.quizId === quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between text-left shadow"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="p-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-mono font-bold">
                          {quiz.questions.length} {translate('Questions', 'Amepusho')}
                        </span>
                        {finishedBefore && (
                          <span className="p-1.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span>{translate('COMPLETED', 'PWISHILWE')}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-lg">
                        {translate(quiz.title_en, quiz.title_bm)}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {translate(quiz.description_en, quiz.description_bm)}
                      </p>
                    </div>

                    <button
                      id={`start-quiz-btn-${quiz.id}`}
                      onClick={() => startQuiz(quiz)}
                      className="w-full mt-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all shadow"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{translate('Start Quiz', 'Tampeni Icayako')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User performance / Attempts history */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-left">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-green-500" />
                <span>{translate('My Quiz Performance', 'Ifyayako fyandi ifyapita')}</span>
              </h3>

              {attempts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto" />
                  <p className="text-xs">{translate('No attempts logged yet. Complete quizzes to track progress!', 'Tapali ifyayako fyapwishwa fya kwasuka. Tampeni quizzes!')}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {attempts.map((att) => {
                    const percentage = Math.round((att.score / att.totalQuestions) * 100);
                    return (
                      <div
                        key={att.id}
                        className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-xs space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white truncate max-w-[120px]">
                            {translate(att.quizTitle_en, att.quizTitle_bm)}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            percentage >= 70 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>{att.score} / {att.totalQuestions} {translate('Correct', 'Amepusho ya kwasuka')}</span>
                          <span>{new Date(att.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 mt-4 text-[11px] text-slate-400">
              <span className="font-bold text-green-400 block mb-0.5">{translate('Continuous Improvement', 'Amafunde yalelanda')}</span>
              {translate(
                'Complete quizzes in both languages to achieve certified cybersecurity readiness. Aim for a score of 100%!',
                'Pwisheni ifyayako muli fyonse ifilipo, no kufumyapo 100% pa kwishiba ubufi bonse.'
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE PLAYING INTERACTIVE BOARD */
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
          {/* Progress header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-mono text-green-400 font-bold block mb-1">
                {translate(activeQuiz.title_en, activeQuiz.title_bm)}
              </span>
              <h3 className="font-bold text-lg text-white">
                {translate('Question', 'Ipusho')} {currentQuestionIndex + 1} {translate('of', 'muli')} {activeQuiz.questions.length}
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

              {/* Action buttons */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6">
                <button
                  id="cancel-quiz-btn"
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  {translate('Exit Quiz', 'Lekeni Icayako')}
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
                    {translate('Submit Answer', 'Aswani Ipusho')}
                  </button>
                ) : (
                  <button
                    id="next-question-btn"
                    onClick={nextQuestion}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs shadow cursor-pointer transition-all"
                  >
                    <span>
                      {currentQuestionIndex + 1 === activeQuiz.questions.length
                        ? translate('Finish Quiz', 'Pwisha Icayako')
                        : translate('Next Question', 'Ipusho Lilondelelo')}
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
                  {translate('Quiz Complete!', 'Icayako Pwishilwe!')}
                </h3>
                <p className="text-slate-400 text-sm">
                  {translate('Excellent effort! Here is your cybersecurity score details.', 'Cawama nga nshi! Nomba mone ifyo wasukile.')}
                </p>
              </div>

              <div className="max-w-sm mx-auto bg-slate-950/50 border border-slate-850 p-6 rounded-2xl">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-850 pb-3 font-mono text-sm">
                  <span>{translate('Total Questions', 'Amepusho Yonso')}:</span>
                  <span className="font-bold text-white">{activeQuiz.questions.length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-850 py-3 font-mono text-sm">
                  <span>{translate('Correct Answers', 'Yasukilwe Bwino')}:</span>
                  <span className="font-bold text-green-400">{score}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 font-mono text-sm">
                  <span>{translate('Accuracy Rating', 'Amakosa Yesho')}:</span>
                  <span className={`font-bold ${
                    (score / activeQuiz.questions.length) >= 0.7 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.round((score / activeQuiz.questions.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-3 pt-4">
                <button
                  id="retry-quiz-btn"
                  onClick={() => startQuiz(activeQuiz)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{translate('Retry Quiz', 'Eseni Kabili')}</span>
                </button>
                <button
                  id="back-quizzes-btn"
                  onClick={() => setActiveQuiz(null)}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-all shadow"
                >
                  {translate('Back to Quizzes', 'Bweleleni Kuli Quizzes')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
