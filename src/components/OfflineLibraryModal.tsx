import React from 'react';
import { useApp } from '../context/AppContext';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import {
  WifiOff,
  Wifi,
  Download,
  Trash2,
  X,
  Play,
  Image as ImageIcon,
  FileText,
  Award,
  CheckCircle,
  HardDrive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface OfflineLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo?: (videoId: string) => void;
  onSelectImage?: (imageId: string) => void;
  onSelectQuiz?: (quizId: string) => void;
}

export const OfflineLibraryModal: React.FC<OfflineLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectVideo,
  onSelectImage,
  onSelectQuiz
}) => {
  const { videos, images, pdfs, quizzes, translate, setActiveSection } = useApp();
  const {
    isOnline,
    cachedItems,
    isItemCached,
    removeItem,
    clearCache,
    cacheAll,
    isBatchCaching,
    batchProgress,
    storageStats
  } = useOfflineStorage();

  if (!isOpen) return null;

  const handleCacheAll = () => {
    cacheAll(videos, images, pdfs, quizzes);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4 text-orange-400" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-400" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'quiz':
        return <Award className="h-4 w-4 text-yellow-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleOpenItem = (item: any) => {
    if (item.type === 'video') {
      setActiveSection('learn');
      if (onSelectVideo) onSelectVideo(item.id);
    } else if (item.type === 'image') {
      setActiveSection('gallery');
      if (onSelectImage) onSelectImage(item.id);
    } else if (item.type === 'quiz') {
      setActiveSection('quizzes');
      if (onSelectQuiz) onSelectQuiz(item.id);
    } else if (item.type === 'pdf') {
      setActiveSection('learn');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in text-left">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${
              isOnline 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <span>{translate('Offline Educational Storage', 'Ifisambilisho Ifyasungwa muli Foni')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
                  isOnline ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {isOnline ? translate('Online', 'Online') : translate('Offline', 'Tapali Intaneti')}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {translate(
                  'Access previously viewed lessons, infographics, and quizzes anytime without data.',
                  'Amasambililo ayo mwatambileko kuti mwayamona nangu tamukwete ama bundle.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Storage Stats Bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <HardDrive className="h-4 w-4 text-green-400" />
              <span className="font-mono text-white font-bold">{cachedItems.length}</span>
              <span className="text-slate-400">{translate('items cached', 'ifyasungwa')}</span>
            </div>
            <div className="text-slate-400 text-[11px] font-mono">
              ({storageStats.byType.videos > 0 ? `${storageStats.byType.videos} ${translate('videos', 'amavidio')}, ` : ''}{storageStats.byType.images} {translate('infographics', 'ifipope')}, {storageStats.byType.quizzes} {translate('quizzes', 'quizzes')})
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="cache-all-btn"
              onClick={handleCacheAll}
              disabled={isBatchCaching}
              className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow"
            >
              {isBatchCaching ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>
                {isBatchCaching 
                  ? translate('Caching...', 'Palesungwa...') 
                  : translate('Cache All Content', 'Sungeni Fyonse')}
              </span>
            </button>

            {cachedItems.length > 0 && (
              <button
                id="clear-offline-cache-btn"
                onClick={() => {
                  if (confirm(translate('Clear all offline cached lessons and materials?', 'Kufumyapo fyonse ifyo mwasunga muli cache?'))) {
                    clearCache();
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                title={translate('Clear Cache', 'Fumyapo fyonse')}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{translate('Clear', 'Fumyapo')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Batch Progress Bar */}
        {isBatchCaching && (
          <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span className="font-medium text-green-400">{batchProgress.label}</span>
              <span className="font-mono">{batchProgress.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 transition-all duration-300 rounded-full"
                style={{ width: `${batchProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cached Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cachedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="p-3 rounded-full bg-slate-800 w-12 h-12 mx-auto flex items-center justify-center text-slate-500">
                <HardDrive className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">
                {translate('No lessons cached yet', 'Tapali ifisambilisho ifyasungwa')}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {translate(
                  'As you explore videos, infographics, PDFs, and quizzes, they are automatically saved here for offline viewing. Or click "Cache All Content" above.',
                  'Amasambililo yonse ayo mulebelenga nangu ukutamba yalasungikwa ayene.'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cachedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition group"
                >
                  <div
                    onClick={() => handleOpenItem(item)}
                    className="flex items-center space-x-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-slate-850 border border-slate-800 shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white truncate">
                          {translate(item.title_en, item.title_bm)}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {translate('Cached for offline study', 'Naicisungwa pakuti mukonkanyepo amasambililo')} •{' '}
                        {new Date(item.cachedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pl-3">
                    <button
                      onClick={() => handleOpenItem(item)}
                      className="p-1.5 text-xs text-green-400 hover:text-green-300 hover:bg-slate-800 rounded-lg transition cursor-pointer flex items-center space-x-1"
                      title={translate('View Lesson', 'Moneni')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{translate('Open', 'Isuleni')}</span>
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title={translate('Remove from offline storage', 'Fumyamo')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
            <span>
              {translate(
                'Service worker caching active. Works completely without mobile data.',
                'Service worker yakusungilamo ifisambilisho ifya kubomfya ukwabula intaneti.'
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
          >
            {translate('Close', 'Isaleni')}
          </button>
        </div>
      </div>
    </div>
  );
};
