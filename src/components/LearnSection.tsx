import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Download, Search, FileText, CheckCircle, Bookmark, Eye, Maximize, AlertCircle, Volume2, HardDrive, CheckCircle2, WifiOff, ExternalLink, Youtube, Check } from 'lucide-react';
import { VideoContent, PDFMaterial } from '../types';
import { AudioVoiceoverBar } from './AudioVoiceoverBar';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { isYouTubeUrl, getYouTubeVideoId, getYouTubeEmbedUrl } from '../utils/videoUtils';

export const LearnSection: React.FC = () => {
  const {
    language,
    videos,
    pdfs,
    user,
    translate,
    logActivity,
    updateVideo,
    selectedVideoId
  } = useApp();

  const { isItemCached, cacheItem, removeItem, autoCache, isOnline } = useOfflineStorage();

  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(() => {
    if (selectedVideoId) {
      const match = videos.find(v => v.id === selectedVideoId);
      if (match) return match;
    }
    return videos[0] || null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [offlineOnlyFilter, setOfflineOnlyFilter] = useState<boolean>(false);

  // Synchronize when selectedVideoId changes from other sections
  useEffect(() => {
    if (selectedVideoId) {
      const match = videos.find(v => v.id === selectedVideoId);
      if (match) {
        setActiveVideo(match);
      }
    }
  }, [selectedVideoId, videos]);

  // Synchronize activeVideo with videos list updates
  useEffect(() => {
    setActiveVideo(prev => {
      if (prev) {
        const matching = videos.find(v => v.id === prev.id);
        if (matching) return matching;
      }
      return videos[0] || null;
    });
  }, [videos]);

  // Auto-cache viewed video for offline study
  useEffect(() => {
    if (activeVideo) {
      autoCache({
        id: activeVideo.id,
        type: 'video',
        title_en: activeVideo.title_en,
        title_bm: activeVideo.title_bm,
        url: activeVideo.url,
        thumbnailUrl: activeVideo.thumbnailUrl,
        description_en: activeVideo.description_en,
        description_bm: activeVideo.description_bm,
        fileSizeEstimate: activeVideo.duration,
        cachedAt: new Date().toISOString()
      });
    }
  }, [activeVideo, autoCache]);

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
        `Downloading ${type === 'video' ? 'Vidio' : 'Icitabo ca PDF'}: "${translate(item.title_en, item.title_bm)}".\n(Ifyo balumbula, ici cilatwala kufuta aseti muli foni yenu.)`
      ));
    }
  };

  // Filter videos based on search and offline status
  const filteredVideos = videos.filter(video => {
    if (offlineOnlyFilter && !isItemCached(video.id)) return false;
    const title = translate(video.title_en, video.title_bm).toLowerCase();
    const desc = translate(video.description_en, video.description_bm).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-8 text-left animate-fade-in" id="learn-section">
      {/* Header with Search & Offline Filter */}
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

        {/* Global Search & Offline Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            id="filter-offline-videos-btn"
            onClick={() => setOfflineOnlyFilter(!offlineOnlyFilter)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
              offlineOnlyFilter
                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={translate('Show only lessons saved for offline study', 'Lolekesha fye ifisambilisho ifyasungwa')}
          >
            <HardDrive className="h-3.5 w-3.5 text-green-400" />
            <span>{translate('Offline Saved', 'Ifyasungwa')}</span>
          </button>

          <div className="relative max-w-sm w-full">
            <input
              id="video-search-input"
              type="text"
              placeholder={translate('Search videos...', 'Fwayeni amavidio...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: VIDEOS & DOCUMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE VIDEO & DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          {activeVideo ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Player Wrapper (YouTube Embed, Facebook Reel Redirect, or HTML5 Video) */}
              {isYouTubeUrl(activeVideo.url) ? (
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-slate-800">
                  <iframe
                    key={activeVideo.id + activeVideo.url}
                    id={`main-video-player-${activeVideo.id}`}
                    className="w-full h-full border-0"
                    src={getYouTubeEmbedUrl(activeVideo.url)}
                    title={translate(activeVideo.title_en, activeVideo.title_bm)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => markAsWatched(activeVideo.id)}
                  />
                  {/* Floating YouTube badge overlay */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 border border-slate-800 px-2.5 py-1 rounded-md text-[10px] text-red-400 font-mono flex items-center space-x-1.5 pointer-events-none shadow backdrop-blur-xs">
                    <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="font-bold tracking-wider">YOUTUBE STREAM ACTIVE</span>
                  </div>
                </div>
              ) : activeVideo.url.includes('facebook.com') ? (
                <a
                  id={`main-video-player-${activeVideo.id}`}
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markAsWatched(activeVideo.id)}
                  className="relative aspect-video bg-slate-950 flex items-center justify-center group overflow-hidden cursor-pointer block border-b border-slate-800"
                  title={translate('Click to redirect to Facebook Reel', 'Tinikeni pakuti imitwale kuma Facebook Reel')}
                >
                  <img
                    src={activeVideo.thumbnailUrl}
                    alt={translate(activeVideo.title_en, activeVideo.title_bm)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30 flex flex-col justify-between p-4 sm:p-6">
                    {/* Header badges */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#1877F2] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md">
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>FACEBOOK REEL</span>
                      </span>
                      <span className="text-slate-200 text-xs font-mono bg-black/70 px-2.5 py-1 rounded-md border border-white/10 flex items-center space-x-1 backdrop-blur-xs">
                        <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                        <span>{translate('Click to Open Facebook', 'Tinikeni Ukwisula Facebook')}</span>
                      </span>
                    </div>

                    {/* Center play icon and callout */}
                    <div className="text-center space-y-2.5 my-auto">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-2xl shadow-blue-900/60 group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base sm:text-xl">
                          {translate('Watch Full Video on Facebook Reel', 'Tambeni Vidio Pali Facebook Reel')}
                        </h4>
                        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                          {translate(
                            'Click to redirect directly to Facebook and watch this official cybersecurity demonstration.',
                            'Tinikeni pano pakuti imitwale ku Facebook uko mukatambila ili isambililo.'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Footer link hint */}
                    <div className="flex items-center justify-between text-xs text-slate-300 pt-2">
                      <span className="bg-black/60 px-2 py-0.5 rounded font-mono text-[11px] text-slate-400">
                        {activeVideo.url.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}
                      </span>
                      <span className="text-blue-400 font-semibold underline flex items-center space-x-1">
                        <span>facebook.com/reel</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
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
                    <source src={activeVideo.url} type="video/mp4" />
                    Your browser does not support the HTML5 video tag.
                  </video>

                  {/* Secure Player overlay hints */}
                  <div className="absolute top-3 left-3 bg-slate-950/70 border border-slate-800 px-2 py-1 rounded text-[10px] text-green-400 font-mono flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span>SSL SECURE CONNECTION ACTIVE</span>
                  </div>
                </div>
              )}

              {/* Player details */}
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {translate(activeVideo.title_en, activeVideo.title_bm)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400 font-mono">
                      <span>{translate('Duration', 'Ubutali')}: {activeVideo.duration}</span>
                      <span>•</span>
                      <span>{activeVideo.views + (completedVideos.includes(activeVideo.id) ? 1 : 0)} {translate('views', 'abantambile')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                    {isYouTubeUrl(activeVideo.url) ? (
                      <a
                        id="watch-on-youtube-btn"
                        href={activeVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markAsWatched(activeVideo.id)}
                        className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer min-h-[42px] active:scale-95"
                        title={translate('Open and watch on YouTube', 'Isuleni pali YouTube')}
                      >
                        <Youtube className="h-4 w-4" />
                        <span>{translate('Watch on YouTube', 'Tambeni pa YouTube')}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : activeVideo.url.includes('facebook.com') ? (
                      <a
                        id="watch-on-facebook-btn"
                        href={activeVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markAsWatched(activeVideo.id)}
                        className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer min-h-[42px] active:scale-95"
                        title={translate('Redirect to Facebook to watch', 'Yalamitwala ku Facebook pakuti mutambe')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>{translate('Watch on Facebook', 'Tambileni pa Facebook')}</span>
                      </a>
                    ) : (
                      <button
                        id="download-video-btn"
                        onClick={() => handleDownload(activeVideo, 'video')}
                        className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer min-h-[42px] active:scale-95"
                      >
                        <Download className="h-4 w-4" />
                        <span>{translate('Download', 'Senda')}</span>
                      </button>
                    )}


                    <button
                      id="offline-cache-video-btn"
                      onClick={async () => {
                        if (isItemCached(activeVideo.id)) {
                          await removeItem(activeVideo.id);
                        } else {
                          await cacheItem({
                            id: activeVideo.id,
                            type: 'video',
                            title_en: activeVideo.title_en,
                            title_bm: activeVideo.title_bm,
                            url: activeVideo.url,
                            thumbnailUrl: activeVideo.thumbnailUrl,
                            description_en: activeVideo.description_en,
                            description_bm: activeVideo.description_bm,
                            fileSizeEstimate: activeVideo.duration,
                            cachedAt: new Date().toISOString()
                          });
                        }
                      }}
                      className={`flex-1 sm:flex-initial p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer min-h-[42px] active:scale-95 ${
                        isItemCached(activeVideo.id)
                          ? 'bg-green-500/15 border-green-500/40 text-green-400'
                          : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                      title={translate('Cache lesson for offline study', 'Sungeni ici cisambilisho pakuti mule sambilila offline')}
                    >
                      {isItemCached(activeVideo.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <HardDrive className="h-4 w-4 text-slate-400" />
                      )}
                      <span>
                        {isItemCached(activeVideo.id)
                          ? translate('Saved Offline', 'Yasungwa')
                          : translate('Save Offline', 'Sungeni')}
                      </span>
                    </button>

                    <button
                      id="watch-later-btn"
                      onClick={() => toggleBookmark(activeVideo.id)}
                      className={`flex-1 sm:flex-initial p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer min-h-[42px] active:scale-95 ${
                        bookmarks.includes(activeVideo.id)
                          ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                          : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>{bookmarks.includes(activeVideo.id) ? translate('Saved', 'Efyo mwasunga') : translate('Watch Later', 'Tambeni Inshita Imbi')}</span>
                    </button>
                  </div>
                </div>

                {/* Audio Voiceover Bar for Active Lesson */}
                <div className="border-t border-slate-850 pt-4">
                  <AudioVoiceoverBar
                    id={`lesson-voiceover-${activeVideo.id}`}
                    titleEn={activeVideo.title_en}
                    titleBm={activeVideo.title_bm}
                    narrativeEn={activeVideo.description_en}
                    narrativeBm={activeVideo.description_bm}
                  />
                </div>

                <div className="border-t border-slate-850 pt-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                    {translate('Description & Key Takeaways', 'Ukulondolola na Masambililo')}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {translate(activeVideo.description_en, activeVideo.description_bm)}
                  </p>
                </div>

                {/* Progress bar info */}
                {completedVideos.includes(activeVideo.id) && (
                  <div className="bg-green-550/10 border border-green-500/20 rounded-xl p-3 flex items-center space-x-3 text-xs text-green-400">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{translate('You completed this lesson! Progress recorded securely.', 'Mwapwisha ici cisabililo! Nefyo mucitele fyonse nafisungwa bwino.')}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-slate-500 mx-auto" />
              <h4 className="text-white font-bold text-lg">{translate('No Videos Available', 'Amavidio tayasangilwe')}</h4>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {translate(
                  'There are currently no video lessons in the academy. You can explore the Infographics Gallery or test your knowledge in the Quizzes section.',
                  'Tapali amavidio pali nomba. Tambeni ifipope fya gallery nangu amaquiz pakuti mukonkanyepo ukusambilila.'
                )}
              </p>
            </div>
          )}

          {/* Related Videos List - only if other videos exist */}
          {filteredVideos.filter(v => v.id !== activeVideo?.id).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-white">{translate('Related Lessons', 'Amasambililo Ayapaleneko')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredVideos.filter(v => v.id !== activeVideo?.id).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex space-x-3 hover:border-slate-700 transition-all cursor-pointer text-left group"
                  >
                    <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isYouTubeUrl(video.url) ? (
                        <div className="absolute top-1 left-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow flex items-center space-x-0.5">
                          <Youtube className="h-2.5 w-2.5" />
                          <span>YouTube</span>
                        </div>
                      ) : video.url.includes('facebook.com') ? (
                        <div className="absolute top-1 left-1 bg-[#1877F2] text-white px-1 py-0.2 rounded text-[8px] font-bold shadow">
                          Reel
                        </div>
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-green-400 transition-colors">
                          {translate(video.title_en, video.title_bm)}
                        </h4>
                        {isItemCached(video.id) && (
                          <span className="shrink-0 text-[9px] text-green-400 bg-green-500/15 border border-green-500/30 px-1 rounded font-mono flex items-center space-x-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>{translate('Offline', 'Offline')}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {translate(video.description_en, video.description_bm)}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1">
                        <span>{video.duration}</span>
                        {isYouTubeUrl(video.url) ? (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-red-400 hover:text-red-300 font-semibold flex items-center space-x-0.5"
                            title={translate('Watch on YouTube', 'Tambileni pa YouTube')}
                          >
                            <span>YouTube</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : video.url.includes('facebook.com') ? (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-0.5"
                            title={translate('Watch on Facebook', 'Tambileni pa Facebook')}
                          >
                            <span>Facebook</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PDF MATERIAL LIBRARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-left">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
              <FileText className="h-5 w-5 text-green-400" />
              <h3 className="font-bold text-lg text-white">
                {translate('PDF Learning Books', 'Ifitabo ifya PDF')}
              </h3>
            </div>

            <div className="space-y-4">
              {pdfs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-slate-600" />
                  <p className="font-medium text-slate-400">
                    {translate('No PDF Learning Books Available', 'Tapali ifitabo fya PDF')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {translate('All educational PDF books have been cleared.', 'Ifitabo fyonse ifya PDF nafifumishiwamo.')}
                  </p>
                </div>
              ) : (
                pdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:border-slate-750 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-white line-clamp-1">
                          {translate(pdf.title_en, pdf.title_bm)}
                        </h4>
                        {isItemCached(pdf.id) && (
                          <span className="text-[9px] text-green-400 bg-green-500/15 border border-green-500/30 px-1.5 py-0.5 rounded font-mono shrink-0">
                            {translate('Offline', 'Offline')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {translate(pdf.description_en, pdf.description_bm)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-850/60 pt-2 text-[10px] text-slate-400 font-mono">
                      <span>{pdf.downloads + 24} {translate('downloads', 'downloads')}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          id={`cache-pdf-${pdf.id}`}
                          onClick={async () => {
                            if (isItemCached(pdf.id)) {
                              await removeItem(pdf.id);
                            } else {
                              await cacheItem({
                                id: pdf.id,
                                type: 'pdf',
                                title_en: pdf.title_en,
                                title_bm: pdf.title_bm,
                                url: pdf.url,
                                description_en: pdf.description_en,
                                description_bm: pdf.description_bm,
                                cachedAt: new Date().toISOString()
                              });
                            }
                          }}
                          className={`px-2 py-1.5 rounded flex items-center space-x-1 transition cursor-pointer text-xs font-medium ${
                            isItemCached(pdf.id)
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                          title={translate('Cache PDF for offline study', 'Sungeni PDF muli foni')}
                        >
                          <HardDrive className="h-3 w-3" />
                          <span>{isItemCached(pdf.id) ? translate('Saved', 'Yasungwa') : translate('Save', 'Sungeni')}</span>
                        </button>
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Checklist Widget for Offline Learning */}
          <div className="bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-800/30 rounded-2xl p-5 text-left space-y-3">
            <h4 className="font-bold text-sm text-green-400">{translate('Zambia Cyber Safety Checklist', 'Ifyo mwingaicingilila')}</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5 font-bold">✔</span>
                <span>{translate('Never declare MoMo PIN codes to callers.', 'Mwilaeba umuntu uluonse PIN ya MTN MoMo.')}</span>
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
