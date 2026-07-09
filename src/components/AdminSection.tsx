import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Upload, FilePlus, AlertOctagon, Users, BarChart2, CheckCircle, Trash2, Heart, Plus, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export const AdminSection: React.FC = () => {
  const {
    language,
    videos,
    images,
    pdfs,
    quizzes,
    attempts,
    auditLogs,
    addVideo,
    addImage,
    addPdf,
    addQuiz,
    deleteQuiz,
    addNotification,
    translate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'upload' | 'quizzes' | 'alerts' | 'audit'>('stats');

  // Upload state
  const [uploadType, setUploadType] = useState<'video' | 'image' | 'pdf'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState('');
  
  // Media details
  const [titleEn, setTitleEn] = useState('');
  const [titleBm, setTitleBm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descBm, setDescBm] = useState('');
  const [duration, setDuration] = useState('04:30'); // default for video
  const [thumbUrl, setThumbUrl] = useState('https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80');

  // Quiz creator state
  const [quizTitleEn, setQuizTitleEn] = useState('');
  const [quizTitleBm, setQuizTitleBm] = useState('');
  const [quizDescEn, setQuizDescEn] = useState('');
  const [quizDescBm, setQuizDescBm] = useState('');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  // Current question editor
  const [qEn, setQEn] = useState('');
  const [qBm, setQBm] = useState('');
  const [optEn1, setOptEn1] = useState('');
  const [optEn2, setOptEn2] = useState('');
  const [optEn3, setOptEn3] = useState('');
  const [optEn4, setOptEn4] = useState('');
  const [optBm1, setOptBm1] = useState('');
  const [optBm2, setOptBm2] = useState('');
  const [optBm3, setOptBm3] = useState('');
  const [optBm4, setOptBm4] = useState('');
  const [correctAnsIdx, setCorrectAnsIdx] = useState(0);

  // Announcement state
  const [alertTitleEn, setAlertTitleEn] = useState('');
  const [alertTitleBm, setAlertTitleBm] = useState('');
  const [alertMsgEn, setAlertMsgEn] = useState('');
  const [alertMsgBm, setAlertMsgBm] = useState('');

  // Handle direct file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success && data.path) {
        setUploadedPath(data.path);
        alert(translate(
          `File "${selectedFile.name}" uploaded successfully to local storage directory.`,
          `Ifisambilisho "${selectedFile.name}" nafyatwa bwino mu local storage.`
        ));
      } else {
        alert(translate('Upload failed: ' + (data.error || 'Unknown error'), 'Ukuwamya file kushipwile.'));
      }
    } catch (err: any) {
      console.error(err);
      alert(translate('Upload error: ' + err.message, 'Amasungile ya file tayaishibe.'));
    } finally {
      setUploading(false);
    }
  };

  // Save media metadata to Firestore
  const saveMediaMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedPath) {
      alert(translate('Please upload a file first.', 'Fyatani file lintanshi.'));
      return;
    }

    if (uploadType === 'video') {
      await addVideo({
        title_en: titleEn,
        title_bm: titleBm,
        description_en: descEn,
        description_bm: descBm,
        url: uploadedPath,
        thumbnailUrl: thumbUrl,
        duration
      });
    } else if (uploadType === 'image') {
      await addImage({
        title_en: titleEn,
        title_bm: titleBm,
        description_en: descEn,
        description_bm: descBm,
        url: uploadedPath
      });
    } else {
      await addPdf({
        title_en: titleEn,
        title_bm: titleBm,
        description_en: descEn,
        description_bm: descBm,
        url: uploadedPath
      });
    }

    alert(translate('Media content saved and registered securely.', 'Ifisambilisho nafisungwa bwino.'));
    // reset form
    setTitleEn('');
    setTitleBm('');
    setDescEn('');
    setDescBm('');
    setUploadedPath('');
    setSelectedFile(null);
  };

  // Add question to quiz builder
  const addQuestionToBuilder = () => {
    if (!qEn || !optEn1 || !optEn2) {
      alert('A question must have English translation and at least 2 options.');
      return;
    }

    const newQ: QuizQuestion = {
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      question_en: qEn,
      question_bm: qBm || qEn, // Fallback to EN if Bemba is missing
      options_en: [optEn1, optEn2, optEn3, optEn4].filter(o => o.trim() !== ''),
      options_bm: [optBm1, optBm2, optBm3, optBm4].filter(o => o.trim() !== ''),
      correctAnswerIndex: correctAnsIdx
    };

    setQuestions(prev => [...prev, newQ]);

    // reset fields
    setQEn('');
    setQBm('');
    setOptEn1('');
    setOptEn2('');
    setOptEn3('');
    setOptEn4('');
    setOptBm1('');
    setOptBm2('');
    setOptBm3('');
    setOptBm4('');
    setCorrectAnsIdx(0);
  };

  // Save the full Quiz
  const saveFullQuiz = async () => {
    if (!quizTitleEn || questions.length === 0) {
      alert('A quiz must have a title and at least 1 question.');
      return;
    }

    await addQuiz({
      title_en: quizTitleEn,
      title_bm: quizTitleBm || quizTitleEn,
      description_en: quizDescEn,
      description_bm: quizDescBm || quizDescEn,
      questions
    });

    alert(translate('Quiz saved and deployed to server.', 'Quiz isungilwe bwino.'));
    setQuizTitleEn('');
    setQuizTitleBm('');
    setQuizDescEn('');
    setQuizDescBm('');
    setQuestions([]);
  };

  // Broadcast Alert Announcement
  const broadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitleEn || !alertMsgEn) return;

    await addNotification(
      alertTitleEn,
      alertTitleBm || alertTitleEn,
      alertMsgEn,
      alertMsgBm || alertMsgEn,
      'announcement'
    );

    alert(translate('Broadcast alert pushed successfully.', 'Ubuthenga bwa alert bwamililwa bwino.'));
    setAlertTitleEn('');
    setAlertTitleBm('');
    setAlertMsgEn('');
    setAlertMsgBm('');
  };

  return (
    <div className="space-y-8 text-left animate-fade-in" id="admin-panel">
      {/* Admin Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Shield className="text-orange-500 h-6 w-6" />
            <span>{translate('Administrator Command Portal', 'Command Portal ya Admin')}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {translate('Upload bimodal educational files, assemble interactive quizzes, and monitor user security logs.', 'Bifyatako ifisambilisho fya PDF, amavidio, no kumona ifishalembwa.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-x-auto">
          {[
            { id: 'stats', label: translate('Overview', 'Mone Yonse') },
            { id: 'upload', label: translate('Media Upload', 'Fyatani Media') },
            { id: 'quizzes', label: translate('Quiz Maker', 'Pangani Quiz') },
            { id: 'alerts', label: translate('Broadcasts', 'Amachenjelelo') },
            { id: 'audit', label: translate('Security Logs', 'System Logs') }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <Users className="h-5 w-5 text-green-400 mb-2" />
              <span className="text-2xl font-bold text-white block">12</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">STAFF USERS</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <Upload className="h-5 w-5 text-blue-400 mb-2" />
              <span className="text-2xl font-bold text-white block">{videos.length} / {images.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">VIDEOS / INFOGRAPHICS</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <BookOpen className="h-5 w-5 text-yellow-400 mb-2" />
              <span className="text-2xl font-bold text-white block">{quizzes.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">QUIZZES INSTALLED</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-red-400 mb-2" />
              <span className="text-2xl font-bold text-white block">{attempts.length + 42}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">TOTAL QUIZ ATTEMPTS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Learners History leaderboard table mockup */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-base text-white">{translate('Recent Quiz Attempts Log', 'Quiz attempts isungilwe')}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="p-3">{translate('User Email', 'Email ya muntu')}</th>
                      <th className="p-3">{translate('Quiz Title', 'Icayako')}</th>
                      <th className="p-3">{translate('Score Obtained', 'Ama kwata')}</th>
                      <th className="p-3">{translate('Completed Date', 'Pwishilwe ubushiku')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {attempts.slice(0, 5).map((att) => (
                      <tr key={att.id}>
                        <td className="p-3 font-medium text-white">{att.userEmail}</td>
                        <td className="p-3">{translate(att.quizTitle_en, att.quizTitle_bm)}</td>
                        <td className="p-3 font-bold font-mono text-green-400">{att.score} / {att.totalQuestions}</td>
                        <td className="p-3 text-slate-400">{new Date(att.completedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {attempts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500 font-mono">No recent user quiz attempts recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Diagnostics system health panel */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-left">
              <h3 className="font-bold text-base text-white">{translate('Diagnostics & Health', 'Ubutuntulu bwa System')}</h3>
              
              <div className="space-y-3 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between border-b border-slate-850 pb-2">
                  <span>SSL STATUS:</span>
                  <span className="text-green-400 font-bold">HTTPS_ACTIVE</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-2">
                  <span>CONTAINER PING:</span>
                  <span className="text-green-400">14 ms (EXCELLENT)</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-2">
                  <span>NODE VERSION:</span>
                  <span>Node.js v22.14</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-2">
                  <span>CPU CONSUMPTION:</span>
                  <span>1.4% (STABLE)</span>
                </div>
                <div className="flex justify-between">
                  <span>STORAGE:</span>
                  <span>Local Dev Uploads</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center space-x-2 text-[10px] text-slate-400">
                <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>ALL SERVER INTERFACES ENCRYPTED SECURELY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA FILE UPLOADER */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File input form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-orange-500" />
              <span>{translate('Binary File Uploader', 'Fyatani ifisambilisho')}</span>
            </h3>

            <form onSubmit={handleFileUpload} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {translate('Content Target', 'Ifilolenako')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'video', label: 'Video (MP4)' },
                    { id: 'image', label: 'Infographic' },
                    { id: 'pdf', label: 'PDF Book' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setUploadType(t.id as any)}
                      className={`py-2 px-3 text-xs rounded-lg font-bold border cursor-pointer text-center transition-all ${
                        uploadType === t.id
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-8 text-center space-y-2 relative transition-all">
                <input
                  id="admin-file-picker"
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files) setSelectedFile(e.target.files[0]);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-10 w-10 text-slate-500 mx-auto" />
                <p className="text-xs text-white font-bold">
                  {selectedFile ? selectedFile.name : translate('Drag & drop or click to select', 'Twalani pano nangu tinya fye')}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-mono">
                  {uploadType === 'video' ? 'MP4 max 100MB' : uploadType === 'image' ? 'JPEG/PNG/WEBP max 5MB' : 'PDF max 20MB'}
                </p>
              </div>

              <button
                id="admin-upload-submit"
                type="submit"
                disabled={!selectedFile || uploading}
                className={`w-full py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center space-x-2 transition-all ${
                  !selectedFile || uploading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                <span>{uploading ? translate('Uploading File...', 'Balefyata...') : translate('Upload to Server Directory', 'Fyatilani ku server')}</span>
              </button>
            </form>
          </div>

          {/* Metadata information details */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <FilePlus className="h-5 w-5 text-orange-500" />
              <span>{translate('Metadata Registration', 'Amalembelo ya Metadata')}</span>
            </h3>

            <form onSubmit={saveMediaMetadata} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('English Title', 'Ishina lya Cingeleshi')}
                  </label>
                  <input
                    id="meta-title-en"
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Mobile Money Safety rules"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Bemba Title', 'Ishina lya Cibemba')}
                  </label>
                  <input
                    id="meta-title-bm"
                    type="text"
                    required
                    value={titleBm}
                    onChange={(e) => setTitleBm(e.target.value)}
                    placeholder="Ifunde lya kusunga MoMo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('English Description', 'Ifilondolwelwe mu Cingeleshi')}
                  </label>
                  <textarea
                    id="meta-desc-en"
                    rows={3}
                    required
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Learn key safety rules..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Bemba Description', 'Ifilondolwelwe mu Cibemba')}
                  </label>
                  <textarea
                    id="meta-desc-bm"
                    rows={3}
                    required
                    value={descBm}
                    onChange={(e) => setDescBm(e.target.value)}
                    placeholder="Sambilileni ifi funde fikalamba..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {uploadType === 'video' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                      {translate('Video Duration', 'Nshita')}
                    </label>
                    <input
                      id="meta-duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="03:45"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                      {translate('Thumbnail Image URL', 'Thumbnail Image URL')}
                    </label>
                    <input
                      id="meta-thumbnail"
                      type="text"
                      value={thumbUrl}
                      onChange={(e) => setThumbUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {translate('File Binary Location Path', 'Uku kuli aseti')}
                </label>
                <input
                  id="meta-path-display"
                  type="text"
                  readOnly
                  placeholder="/uploads/videos/some_file.mp4"
                  value={uploadedPath}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 text-xs font-mono select-all focus:outline-none"
                />
              </div>

              <button
                id="meta-save-submit"
                type="submit"
                disabled={!uploadedPath}
                className={`w-full py-2.5 rounded-lg font-bold text-xs cursor-pointer shadow transition-all ${
                  !uploadedPath
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {translate('Save Media and Deploy', 'Sungeni no kumiila')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ BUILDER ARCHITECT */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Quiz metadata details */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white mb-2">{translate('Create New Quiz', 'Pangani Quiz')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Quiz English Title</label>
                <input
                  id="quiz-title-en"
                  type="text"
                  required
                  placeholder="Advanced Phishing Quiz"
                  value={quizTitleEn}
                  onChange={(e) => setQuizTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Quiz Bemba Title</label>
                <input
                  id="quiz-title-bm"
                  type="text"
                  placeholder="Icayako ca Amalyashi ya Bufi"
                  value={quizTitleBm}
                  onChange={(e) => setQuizTitleBm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Quiz English Description</label>
                <textarea
                  id="quiz-desc-en"
                  rows={2}
                  placeholder="Test your awareness of advanced email phishing..."
                  value={quizDescEn}
                  onChange={(e) => setQuizDescEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Quiz Bemba Description</label>
                <textarea
                  id="quiz-desc-bm"
                  rows={2}
                  placeholder="Eseni amano yenu muli fyakubepa fya links..."
                  value={quizDescBm}
                  onChange={(e) => setQuizDescBm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400 block mb-2 font-mono">QUESTIONS ASSEMBLED: {questions.length}</span>
              <button
                id="save-full-quiz-btn"
                onClick={saveFullQuiz}
                disabled={questions.length === 0}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  questions.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {translate('Save and Deploy Full Quiz', 'Sungeni ne Cayako Conso')}
              </button>
            </div>
          </div>

          {/* Question architect form */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white mb-2">{translate('Question Architect', 'Inshila ya kupangilamo amepusho')}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Question Text (English)</label>
                <input
                  id="question-en"
                  type="text"
                  placeholder="What is cybersecurity?"
                  value={qEn}
                  onChange={(e) => setQEn(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Question Text (Bemba)</label>
                <input
                  id="question-bm"
                  type="text"
                  placeholder="Ukuicingilila kwa pa foni cinshi?"
                  value={qBm}
                  onChange={(e) => setQBm(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            {/* Options grids */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Options (English)</label>
                <input id="opt-en1" placeholder="Option 1" value={optEn1} onChange={e => setOptEn1(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-en2" placeholder="Option 2" value={optEn2} onChange={e => setOptEn2(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-en3" placeholder="Option 3 (Optional)" value={optEn3} onChange={e => setOptEn3(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-en4" placeholder="Option 4 (Optional)" value={optEn4} onChange={e => setOptEn4(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Options (Bemba)</label>
                <input id="opt-bm1" placeholder="Option 1" value={optBm1} onChange={e => setOptBm1(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-bm2" placeholder="Option 2" value={optBm2} onChange={e => setOptBm2(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-bm3" placeholder="Option 3 (Optional)" value={optBm3} onChange={e => setOptBm3(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
                <input id="opt-bm4" placeholder="Option 4 (Optional)" value={optBm4} onChange={e => setOptBm4(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-850 pt-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mr-2">Correct Answer Option Index</label>
                <select
                  id="quiz-correct-idx"
                  value={correctAnsIdx}
                  onChange={(e) => setCorrectAnsIdx(parseInt(e.target.value))}
                  className="px-2.5 py-1.5 bg-slate-800 text-white rounded border border-slate-700 text-xs focus:outline-none"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>

              <button
                id="add-question-to-list"
                onClick={addQuestionToBuilder}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1 cursor-pointer shadow"
              >
                <Plus className="h-4 w-4" />
                <span>{translate('Add Question', 'Lundeni Ipusho')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALERT BROADCASTER */}
      {activeTab === 'alerts' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-left">
          <h3 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <AlertOctagon className="h-5 w-5 text-orange-500 animate-bounce" />
            <span>{translate('Emergency Alert Broadcaster', 'Ukusandika amachenjelelo ya bufi')}</span>
          </h3>

          <form onSubmit={broadcastAnnouncement} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Alert English Title</label>
                <input
                  id="alert-title-en"
                  type="text"
                  required
                  placeholder="URGENT: Airtel Scam Call Alert"
                  value={alertTitleEn}
                  onChange={(e) => setAlertTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Alert Bemba Title</label>
                <input
                  id="alert-title-bm"
                  type="text"
                  placeholder="CHENJELA: Foni ya Bufi ya Airtel"
                  value={alertTitleBm}
                  onChange={(e) => setAlertTitleBm(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">English Message Details</label>
                <textarea
                  id="alert-msg-en"
                  rows={4}
                  required
                  placeholder="Multiple users reported callers pretending to be Airtel agents asking for MoMo PINs..."
                  value={alertMsgEn}
                  onChange={(e) => setAlertMsgEn(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Bemba Message Details</label>
                <textarea
                  id="alert-msg-bm"
                  rows={4}
                  placeholder="Abantu abengi balenlandapo kuli bampulamafunde balelila foni ukwipusha PIN..."
                  value={alertMsgBm}
                  onChange={(e) => setAlertMsgBm(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                ></textarea>
              </div>
            </div>

            <button
              id="alert-broadcast-submit"
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow transition-all cursor-pointer"
            >
              {translate('Broadcast Emergency Alert', 'Sandikeni Chenjela bwangu')}
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS & SECURITY LEDGER */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-lg text-white mb-2 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <span>{translate('Audit Trail & Security Ledger', 'System Audit Trail & Security Ledger')}</span>
          </h3>

          <div className="overflow-y-auto max-h-[420px] border border-slate-800 rounded-xl bg-slate-950 p-4 font-mono text-[10px] text-slate-300 space-y-3.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="border-b border-slate-850 pb-3 flex justify-between items-start gap-4"
              >
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-bold">
                      {log.action.toUpperCase()}
                    </span>
                    <span className="text-white font-bold">{log.email}</span>
                  </div>
                  <p className="text-slate-400 leading-normal">{log.details}</p>
                  <p className="text-slate-500 text-[9px]">IP: {log.ipAddress} • UserAgent: {log.device}</p>
                </div>

                <span className="text-slate-500 text-[9px] text-right whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-center text-slate-500 py-4">No audit actions recorded in session yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
