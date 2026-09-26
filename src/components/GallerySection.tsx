import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Image,
  ZoomIn,
  Download,
  X,
  Search,
  Maximize2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  PhoneOff,
  PhoneCall,
  Copy,
  Check,
  Sparkles,
  Info,
  ChevronRight,
  Award
} from 'lucide-react';
import { ImageContent } from '../types';
import { AudioVoiceoverBar } from './AudioVoiceoverBar';
import { useOfflineStorage } from '../hooks/useOfflineStorage';

export const GallerySection: React.FC = () => {
  const app = useApp();
  const { isItemCached, cacheItem, removeItem, autoCache } = useOfflineStorage();
  const [activeImage, setActiveImage] = useState<ImageContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offlineOnlyFilter, setOfflineOnlyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalTab, setActiveModalTab] = useState<'breakdown' | 'howItWorks' | 'redFlags' | 'recommendations' | 'reporting'>('breakdown');
  const [copiedText, setCopiedText] = useState(false);
  const [imageZoomLevel, setImageZoomLevel] = useState<number>(1);

  // Auto-cache viewed/zoomed image for offline study
  useEffect(() => {
    if (activeImage) {
      autoCache({
        id: activeImage.id,
        type: 'image',
        title_en: activeImage.title_en,
        title_bm: activeImage.title_bm,
        url: activeImage.url,
        thumbnailUrl: activeImage.url,
        description_en: activeImage.description_en,
        description_bm: activeImage.description_bm,
        cachedAt: new Date().toISOString()
      });
      // Reset zoom and tab when active image changes
      setImageZoomLevel(1);
      setActiveModalTab('breakdown');
    }
  }, [activeImage, autoCache]);

  const handleDownload = (img: ImageContent) => {
    app.logActivity('Download Content', `Downloaded infographic image: ${img.title_en}`);
    // Create an anchor and download image directly
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `${img.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyScamText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const categories = [
    { id: 'all', label_en: 'All Infographics', label_bm: 'Fyonse Pamo' },
    { id: 'scams', label_en: '⚠️ Scam Case Studies', label_bm: '⚠️ Ifilecitika' },
    { id: 'momo', label_en: 'Mobile Money & Security', label_bm: 'Impiya sha pa Foni' },
    { id: 'social', label_en: 'WhatsApp & Social', label_bm: 'WhatsApp na Social' }
  ];

  const filteredImages = app.images.filter(img => {
    if (offlineOnlyFilter && !isItemCached(img.id)) return false;

    if (selectedCategory === 'scams' && !img.scamAnalysis && !img.category?.toLowerCase().includes('scam')) {
      return false;
    }
    if (selectedCategory === 'momo' && !img.title_en.toLowerCase().includes('momo') && !img.title_en.toLowerCase().includes('money') && !img.category?.toLowerCase().includes('momo')) {
      return false;
    }
    if (selectedCategory === 'social' && !img.title_en.toLowerCase().includes('whatsapp') && !img.title_en.toLowerCase().includes('facebook') && !img.title_en.toLowerCase().includes('grant')) {
      return false;
    }

    const title = app.translate(img.title_en, img.title_bm).toLowerCase();
    const desc = app.translate(img.description_en, img.description_bm).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-8 text-left animate-fade-in" id="gallery-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{app.translate('Evidence-Based Cyber Defense', 'Ukwishiba Ubufi no Kuicingilila')}</span>
          </div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Image className="h-7 w-7 text-green-500" />
            <span>{app.translate('Cybersecurity Infographics & Scam Evidence Gallery', 'Ifipope fya Kuicingilila ku Bufi')}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {app.translate(
              'Inspect real-world SMS fraud screenshots, learn why scammers target Zambian mobile users, and master defensive counter-measures.',
              'Moneni ama SMS aya bufi neya cine, sambilileni imilandu bapulamafunde bapanga mu Zambia, kabili mwishibe ifyo mwingaicingilila.'
            )}
          </p>
        </div>

        {/* Search & Offline filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            id="filter-offline-gallery-btn"
            onClick={() => setOfflineOnlyFilter(!offlineOnlyFilter)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
              offlineOnlyFilter
                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={app.translate('Show only infographics saved for offline study', 'Lolekesha fye ifipope ifyasungwa')}
          >
            <HardDrive className="h-3.5 w-3.5 text-green-400" />
            <span>{app.translate('Offline Saved', 'Ifyasungwa')}</span>
          </button>

          <div className="relative max-w-sm w-full">
            <input
              id="gallery-search-input"
              type="text"
              placeholder={app.translate('Search scams & guides...', 'Fwayeni ubufi ubwama scammers...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            id={`gallery-category-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-green-600 text-white shadow font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            {app.translate(cat.label_en, cat.label_bm)}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => {
          const hasAnalysis = Boolean(img.scamAnalysis);
          return (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all flex flex-col justify-between group shadow-lg cursor-pointer hover:shadow-green-500/5"
            >
              {/* Image Preview Container */}
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-950 flex items-center justify-center">
                <img
                  src={img.url}
                  alt={app.translate(img.title_en, img.title_bm)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  {hasAnalysis ? (
                    <span className="px-2.5 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded-lg shadow-md flex items-center space-x-1 backdrop-blur-sm">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{app.translate('REAL SCAM CASE', 'UBUFI BWA CINE')}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-950/80 text-slate-300 text-[10px] rounded font-mono border border-slate-700">
                      {img.category || 'Visual Guide'}
                    </span>
                  )}
                </div>

                {isItemCached(img.id) && (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="text-[10px] text-green-300 bg-green-950/80 border border-green-500/40 px-2 py-0.5 rounded font-mono flex items-center space-x-1 shadow">
                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                      <span>{app.translate('Saved Offline', 'Offline')}</span>
                    </span>
                  </div>
                )}

                {/* Lightbox Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                  <button
                    id={`zoom-img-${img.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(img);
                    }}
                    className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium text-xs shadow-lg flex items-center space-x-1.5 transition-transform transform scale-95 hover:scale-100 cursor-pointer"
                  >
                    <ZoomIn className="h-4 w-4" />
                    <span>{hasAnalysis ? app.translate('Inspect Scam & Advice', 'Moneni Ubufi') : app.translate('Inspect', 'Moneni')}</span>
                  </button>

                  <button
                    id={`cache-img-${img.id}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (isItemCached(img.id)) {
                        await removeItem(img.id);
                      } else {
                        await cacheItem({
                          id: img.id,
                          type: 'image',
                          title_en: img.title_en,
                          title_bm: img.title_bm,
                          url: img.url,
                          thumbnailUrl: img.url,
                          description_en: img.description_en,
                          description_bm: img.description_bm,
                          cachedAt: new Date().toISOString()
                        });
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-transform transform scale-95 hover:scale-100 cursor-pointer ${
                      isItemCached(img.id)
                        ? 'bg-green-500/20 border-green-500/40 text-green-300'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={isItemCached(img.id) ? app.translate('Saved Offline', 'Iyasungwa Offline') : app.translate('Save Offline', 'Sungeni')}
                  >
                    <HardDrive className="h-4 w-4" />
                  </button>

                  <button
                    id={`download-img-${img.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img);
                    }}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-transform transform scale-95 hover:scale-100 cursor-pointer"
                    title={app.translate('Download', 'Senda')}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Image info */}
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-bold text-white text-base line-clamp-1 group-hover:text-green-400 transition-colors">
                    {app.translate(img.title_en, img.title_bm)}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                    {app.translate(img.description_en, img.description_bm)}
                  </p>
                </div>

                {/* Audio Voiceover Trigger */}
                <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                  <AudioVoiceoverBar
                    id={`gallery-card-voice-${img.id}`}
                    titleEn={img.title_en}
                    titleBm={img.title_bm}
                    narrativeEn={img.description_en}
                    narrativeBm={img.description_bm}
                    compact={true}
                  />
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>{img.views + 42} {app.translate('views', 'abantambile')}</span>
                  <span>{img.downloads + 12} {app.translate('downloads', 'ifisendelwe')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL SCREEN / DETAILED SCAM BREAKDOWN MODAL */}
      {activeImage && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          {/* Close button */}
          <button
            id="close-lightbox"
            onClick={() => setActiveImage(null)}
            className="fixed top-4 right-4 p-2.5 bg-slate-900/90 border border-slate-700 text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer z-50 shadow-xl"
            title={app.translate('Close', 'Isaleni')}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className={`w-full ${
              activeImage.scamAnalysis ? 'max-w-6xl' : 'max-w-4xl'
            } bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative my-auto flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {activeImage.scamAnalysis ? (
                    <span className="px-2.5 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-xs font-mono font-bold flex items-center space-x-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{app.translate('COMMUNITY REPORTED SCAM CASE', 'UBUFI EBO TUPOKELELWE')}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-mono font-bold">
                      {app.translate('VERIFIED LESSON MATERIAL', 'ICISABILISHO CA CINE')}
                    </span>
                  )}
                  {isItemCached(activeImage.id) && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-mono">
                      {app.translate('Saved Offline', 'Casungwa Offline')}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {app.translate(activeImage.title_en, activeImage.title_bm)}
                </h3>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center space-x-2">
                <button
                  id="modal-offline-btn"
                  onClick={async () => {
                    if (isItemCached(activeImage.id)) {
                      await removeItem(activeImage.id);
                    } else {
                      await cacheItem({
                        id: activeImage.id,
                        type: 'image',
                        title_en: activeImage.title_en,
                        title_bm: activeImage.title_bm,
                        url: activeImage.url,
                        thumbnailUrl: activeImage.url,
                        description_en: activeImage.description_en,
                        description_bm: activeImage.description_bm,
                        cachedAt: new Date().toISOString()
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                    isItemCached(activeImage.id)
                      ? 'bg-green-500/20 border-green-500/40 text-green-300'
                      : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                  }`}
                >
                  <HardDrive className="h-3.5 w-3.5" />
                  <span>{isItemCached(activeImage.id) ? app.translate('Saved Offline', 'Ifyasungwa') : app.translate('Save Offline', 'Sungeni')}</span>
                </button>

                <button
                  id="modal-download-btn"
                  onClick={() => handleDownload(activeImage)}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 transition shadow cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{app.translate('Download', 'Senda')}</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Two Column for Scam Analysis, or side-by-side for regular image */}
            {activeImage.scamAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
                {/* Left Column: Image Viewer */}
                <div className="lg:col-span-5 bg-slate-950 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center min-h-[280px]">
                      <img
                        src={activeImage.url}
                        alt=""
                        style={{ transform: `scale(${imageZoomLevel})` }}
                        className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-200"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm border border-slate-700 rounded-lg p-1">
                        <button
                          onClick={() => setImageZoomLevel(prev => Math.max(1, prev - 0.25))}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white font-mono"
                          title="Zoom Out"
                        >
                          -
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono px-1">{Math.round(imageZoomLevel * 100)}%</span>
                        <button
                          onClick={() => setImageZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white font-mono"
                          title="Zoom In"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Original SMS Copyable Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="font-mono text-[11px] text-green-400">{app.translate('Original Message Text:', 'Ilembo lya Cine:')}</span>
                        <button
                          onClick={() => handleCopyScamText(activeImage.scamAnalysis!.originalText)}
                          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy scam message text"
                        >
                          {copiedText ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-400" />
                              <span className="text-green-400 text-[11px]">{app.translate('Copied', 'Icakopwa')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="text-[11px]">{app.translate('Copy Text', 'Kopeni Ilembo')}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 font-mono text-xs text-amber-200 select-all">
                        "{activeImage.scamAnalysis.originalText}"
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {activeImage.scamAnalysis.senderInfo}
                      </p>
                    </div>

                    {/* Audio Voiceover Component */}
                    <div>
                      <AudioVoiceoverBar
                        id={`gallery-modal-voice-${activeImage.id}`}
                        titleEn={activeImage.title_en}
                        titleBm={activeImage.title_bm}
                        narrativeEn={`${activeImage.description_en} Recommendations: ${activeImage.scamAnalysis.recommendations_en.join('. ')}`}
                        narrativeBm={`${activeImage.description_bm} Ifyo mwingacingilila: ${activeImage.scamAnalysis.recommendations_bm.join('. ')}`}
                      />
                    </div>

                    {/* Quick Quiz Link */}
                    <button
                      id="modal-take-scam-quiz-btn"
                      onClick={() => {
                        setActiveImage(null);
                        app.setActiveSection('quizzes');
                      }}
                      className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition transform hover:scale-[1.02]"
                      title={app.translate('Test your knowledge on this scam in the quiz section', 'Esheni amano yenu muli quiz')}
                    >
                      <Award className="h-4 w-4" />
                      <span>{app.translate('Take Fake Gold Quiz', 'Pitileni mu Quiz ya Golide')}</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Interactive Educational Tabs */}
                <div className="lg:col-span-7 flex flex-col bg-slate-900 overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-800 bg-slate-950/40 overflow-x-auto scrollbar-none px-4 pt-3">
                    <button
                      onClick={() => setActiveModalTab('breakdown')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeModalTab === 'breakdown'
                          ? 'border-green-500 text-green-400 bg-green-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span>{app.translate('Scam Decoded', 'Ukupilibula Amashiwi')}</span>
                    </button>

                    <button
                      onClick={() => setActiveModalTab('howItWorks')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeModalTab === 'howItWorks'
                          ? 'border-green-500 text-green-400 bg-green-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{app.translate('How It Works', 'Ifyo Babepa')}</span>
                    </button>

                    <button
                      onClick={() => setActiveModalTab('redFlags')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeModalTab === 'redFlags'
                          ? 'border-red-500 text-red-400 bg-red-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{app.translate('Red Flags', 'Ifishibilo fya Bufi')}</span>
                    </button>

                    <button
                      onClick={() => setActiveModalTab('recommendations')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeModalTab === 'recommendations'
                          ? 'border-green-500 text-green-400 bg-green-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{app.translate('Protection Guide', 'Ifya Kucita Ifingamicingilila')}</span>
                    </button>

                    <button
                      onClick={() => setActiveModalTab('reporting')}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeModalTab === 'reporting'
                          ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>{app.translate('Report Scam', 'Lembesheni ngakuli abalefwaya ukumibepa nangula ukumibila')}</span>
                    </button>
                  </div>

                  {/* Tab Content Panels */}
                  <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left">
                    {/* 1. Scam Decoded Tab */}
                    {activeModalTab === 'breakdown' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">
                            {app.translate('Summary Explanation', 'Ukulondolola')}
                          </h4>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {app.translate(activeImage.description_en, activeImage.description_bm)}
                          </p>
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                          {app.translate('Phrase-by-Phrase Linguistic & Psychological Breakdown:', 'Ukulondolola kwa Mashiwi:')}
                        </h4>

                        <div className="grid grid-cols-1 gap-3">
                          {activeImage.scamAnalysis.breakdown.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  "{item.term}"
                                </span>
                                <span className="text-[10px] text-slate-400 uppercase font-mono">
                                  {app.translate('Psychological Trap', 'Iciteyo')}
                                </span>
                              </div>

                              <p className="text-xs font-medium text-slate-200">
                                <strong>{app.translate('Meaning: ', 'Ubupilibulo: ')}</strong>
                                {app.translate(item.meaning_en, item.meaning_bm)}
                              </p>

                              <p className="text-xs text-slate-400 leading-normal bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                                <span className="text-green-400 font-semibold">{app.translate('Why scammers use this: ', 'Ninshi Ama Scmmers Babomfesha ifi: ')}</span>
                                {app.translate(item.psychologicalTactic_en, item.psychologicalTactic_bm)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. How It Works Tab */}
                    {activeModalTab === 'howItWorks' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">
                            {app.translate('The Fraudster Playbook (Modus Operandi)', 'Inshila sha Bapulamafunde')}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {app.translate(
                              'This scam relies on a coordinated multi-stage social engineering attack. Here is the sequence of events that unfolds when a victim responds:',
                              'Ubu bufi bucitika munshila isha pusanapusana. Moneni ifyo bapulamafunde balolenkanya ukutampa ilyo mwa-asuka:'
                            )}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {(app.language === 'bm'
                            ? activeImage.scamAnalysis.howItWorks_bm
                            : activeImage.scamAnalysis.howItWorks_en
                          ).map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl"
                            >
                              <div className="h-6 w-6 rounded-full bg-green-500/15 border border-green-500/40 text-green-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Red Flags Tab */}
                    {activeModalTab === 'redFlags' && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center space-x-1.5">
                            <ShieldAlert className="h-4 w-4" />
                            <span>{app.translate('Critical Warning Signs (Red Flags)', 'Ifishibilo fya Bwafya')}</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            {app.translate(
                              'Whenever you receive an SMS with any of the following traits, treat it immediately as hostile fraud:',
                              'Nga mwapokelela SMS iyakwata ifi fishibilo, ilukeni nombaline ukuti ubu bufi:'
                            )}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {(app.language === 'bm'
                            ? activeImage.scamAnalysis.redFlags_bm
                            : activeImage.scamAnalysis.redFlags_en
                          ).map((flag, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-red-500/20 rounded-xl"
                            >
                              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                                {flag}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Recommendations & Protection Guide */}
                    {activeModalTab === 'recommendations' && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1 flex items-center space-x-1.5">
                            <ShieldCheck className="h-4 w-4" />
                            <span>{app.translate('Actionable Protection Protocols', 'Ifyo Mufwile Ukucita pa Kuicingilila')}</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            {app.translate(
                              'Follow these strict defensive rules whenever you encounter mineral or advance-fee scams:',
                              'Konkeni aya mafunde pa kuti mupusushe indalama shonse ishaba mufoni yenu:'
                            )}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {(app.language === 'bm'
                            ? activeImage.scamAnalysis.recommendations_bm
                            : activeImage.scamAnalysis.recommendations_en
                          ).map((rec, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-green-500/30 transition"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                {rec}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Reporting Channels Tab */}
                    {activeModalTab === 'reporting' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center space-x-1.5">
                            <PhoneOff className="h-4 w-4" />
                            <span>{app.translate('Official Reporting & De-registration Helplines', 'Nambala iyakulembesha')}</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            {app.translate(
                              'Reporting scam numbers helps ZICTA and mobile network operators blacklist SIM cards and shut down criminal syndicates across Zambia.',
                              'Ukulembesha kuli ba ZICTA kulalenga baishiba  amanambala eyo ama scammers babomfya ukubepa abantu bambi.'
                            )}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {(app.language === 'bm'
                            ? activeImage.scamAnalysis.reportingChannels_bm
                            : activeImage.scamAnalysis.reportingChannels_en
                          ).map((channel, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-900 text-blue-400 rounded-lg">
                                  <PhoneCall className="h-4 w-4" />
                                </div>
                                <span className="text-xs sm:text-sm text-slate-200 font-medium">
                                  {channel}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Single Image View for regular infographics */
              <div className="flex flex-col md:flex-row bg-slate-900 overflow-hidden max-h-[75vh]">
                <div className="md:flex-1 bg-black flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={activeImage.url}
                    alt=""
                    className="w-full h-full object-contain max-h-[60vh]"
                  />
                </div>

                <div className="p-6 md:w-88 flex flex-col justify-between bg-slate-900 text-left border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto">
                  <div className="space-y-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {app.translate(activeImage.description_en, activeImage.description_bm)}
                    </p>

                    <AudioVoiceoverBar
                      id={`gallery-modal-voice-${activeImage.id}`}
                      titleEn={activeImage.title_en}
                      titleBm={activeImage.title_bm}
                      narrativeEn={activeImage.description_en}
                      narrativeBm={activeImage.description_bm}
                    />
                  </div>

                  <div className="border-t border-slate-800 pt-4 mt-6">
                    <p className="text-[11px] text-slate-500 font-mono text-center">
                      CYBERSECURITY ACADEMY INFOGRAPHIC
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
