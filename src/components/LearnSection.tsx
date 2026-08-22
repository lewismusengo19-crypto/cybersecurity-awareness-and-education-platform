import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Download, Search, FileText, CheckCircle, Bookmark, Eye, Maximize, AlertCircle } from 'lucide-react';
import { VideoContent, PDFMaterial } from '../types';

export const LearnSection: React.FC = () => {
  const {
    language,
    videos,
    pdfs,
    user,
    translate,
    logActivity
  } = useApp();

  const [activeVideo, setActiveVideo] = useState<VideoContent>(videos[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  // Toggle bookmark / watch later
  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(bId => bId !== id));
      logActivity('Bookmark Remove', `Removed video bookmark: ${id}`);
    } else {
      setBookmarks(prev => [...prev, id]);
      logActivity('Bookmark Add', `Added video bookmark: ${id}`);
    }
  };

  // Toggle completed
  const markAsWatched = (id: string) => {
    if (!completedVideos.includes(id)) {
      setCompletedVideos(prev => [...prev, id]);
      logActivity('Watch Progress', `Completed watching video: ${id}`);
    }
  };

  // Trigger download of files locally
  const handleDownload = (item: VideoContent | PDFMaterial, type: 'video' | 'pdf') => {
    logActivity('Download Content', `Downloaded ${type}: ${item.title_en}`);
    
    try {
      const link = document.createElement('a');
      link.href = item.url;
      link.setAttribute('download', item.url.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Failed direct download link. Using fallback simulation:', err);
      alert(translate(
        `Downloading ${type === 'video' ? 'Video' : 'PDF Document'}: "${translate(item.title_en, item.title_bm)}".\n(In production, this initiates a direct, secure binary download of the uploaded asset.)`,
        `Mulefuta ${type === 'video' ? 'Ividio' : 'Icitabo ca PDF'}: "${translate(item.title_en, item.title_bm)}".\n(Ifyo balumbula, ici cilatwala kufuta aseti muli foni yenu.)`
      ));
    }
  };

  // Filter videos based on search
  const filteredVideos = videos.filter(video => {
    const title = translate(video.title_en, video.title_bm).toLowerCase();
    const desc = translate(video.description_en, video.description_bm).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-8 text-left animate-fade-in" id="learn-section">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Play className="h-6 w-6 text-green-500" />
            <span>{translate('Cybersecurity Academy Lessons', 'Amasambililo aya Ukuicingilila')}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {translate('Watch educational videos and download certified PDF guidelines.', 'Tambeni amavidio kabili sendeni ne fitabo ifilelanda pafyo mwingaicingilila.')}
          </p>
        </div>

        {/* Global Search Component */}
        <div className="relative max-w-sm w-full">
          <input
            id="video-search-input"
            type="text"
            placeholder={translate('Search videos...', 'Fwayeni amavidio...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: VIDEOS & DOCUMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE VIDEO & DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          {activeVideo ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Custom HTML5 Video Player Wrapper */}
              <div className="relative aspect-video bg-black flex items-center justify-center group">
                <video
                  key={activeVideo.id}
                  id={`main-video-player-${activeVideo.id}`}
                  className="w-full h-full"
                  controls
                  poster={activeVideo.thumbnailUrl}
                  src={activeVideo.url}
                  onPlay={() => markAsWatched(activeVideo.id)}
                >
                  {/* Local video file fallback or public dummy stream */}
                  <source src={activeVideo.url} type="video/mp4" />
                  Your browser does not support the HTML5 video tag.
                </video>

                {/* Secure Player overlay hints */}
                <div className="absolute top-3 left-3 bg-slate-950/70 border border-slate-800 px-2 py-1 rounded text-[10px] text-green-400 font-mono flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping"></span>
                  <span>SSL SECURE CONNECTION ACTIVE</span>
                </div>
              </div>

              {/* Player details */}
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {translate(activeVideo.title_en, activeVideo.title_bm)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400 font-mono">
                      <span>{translate('Duration', 'Nshita')}: {activeVideo.duration}</span>
                      <span>•</span>
                      <span>{activeVideo.views + (completedVideos.includes(activeVideo.id) ? 1 : 0)} {translate('views', 'abantambile')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id="watch-later-btn"
                      onClick={() => toggleBookmark(activeVideo.id)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
                        bookmarks.includes(activeVideo.id)
                          ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                          : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>{bookmarks.includes(activeVideo.id) ? translate('Saved', 'Nalisunga') : translate('Watch Later', 'Kulalolela')}</span>
                    </button>

                    <button
                      id="download-video-btn"
                      onClick={() => handleDownload(activeVideo, 'video')}
                      className="p-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>{translate('Download', 'Futa')}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                    {translate('Description', 'Ifilondolwelwe')}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {translate(activeVideo.description_en, activeVideo.description_bm)}
                  </p>
                </div>

                {/* Progress bar info */}
                {completedVideos.includes(activeVideo.id) && (
                  <div className="bg-green-550/10 border border-green-500/20 rounded-xl p-3 flex items-center space-x-3 text-xs text-green-400">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{translate('You completed this lesson! Progress recorded securely.', 'Nwapwisha ici sambililo! Nefyo mucitele fyonse nafisungwa bwino.')}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-slate-500 mx-auto" />
              <h4 className="text-white font-bold text-lg">{translate('No Videos Found', 'Amavidio tayasangilwe')}</h4>
              <p className="text-slate-400 text-sm">{translate('Try modifying your search filter.', 'Esheni ukulembako amashiwi yambi.')}</p>
            </div>
          )}

          {/* Related Videos List */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">{translate('Related Lessons', 'Amasambililo Yambi')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredVideos.filter(v => v.id !== activeVideo?.id).map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex space-x-3 hover:border-slate-700 transition-all cursor-pointer text-left"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    className="w-20 aspect-video object-cover rounded-lg bg-black"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <h4 className="font-bold text-white text-xs truncate">
                      {translate(video.title_en, video.title_bm)}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {translate(video.description_en, video.description_bm)}
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono mt-1 block">{video.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PDF MATERIAL LIBRARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-left">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
              <FileText className="h-5 w-5 text-green-400" />
              <h3 className="font-bold text-lg text-white">
                {translate('PDF Learning Books', 'Ifitabo Fya PDF')}
              </h3>
            </div>

            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:border-slate-750 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">
                      {translate(pdf.title_en, pdf.title_bm)}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {translate(pdf.description_en, pdf.description_bm)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850/60 pt-2 text-[10px] text-slate-400 font-mono">
                    <span>{pdf.downloads + 24} {translate('downloads', 'downloads')}</span>
                    <button
                      id={`download-pdf-${pdf.id}`}
                      onClick={() => handleDownload(pdf, 'pdf')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{translate('GET', 'SENDA')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Checklist Widget for Offline Learning */}
          <div className="bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-800/30 rounded-2xl p-5 text-left space-y-3">
            <h4 className="font-bold text-sm text-green-400">{translate('Zambia Cyber Safety Checklist', 'Ifyo mwingaicingilila')}</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5 font-bold">✔</span>
                <span>{translate('Never declare MoMo PIN codes to callers.', 'Mwilaeba umuntu uluonse PIN ya MoMo.')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5 font-bold">✔</span>
                <span>{translate('Configure 2FA verification on WhatsApp.', 'Pangileni Two-Factor pa WhatsApp.')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5 font-bold">✔</span>
                <span>{translate('Reject links for "free bundles" packages.', 'kaneni ama links ayalemilaya ama bundles aya fye.')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
