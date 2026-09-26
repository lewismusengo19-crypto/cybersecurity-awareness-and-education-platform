import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { OfflineLibraryModal } from './OfflineLibraryModal';
import { WifiOff, Wifi, HardDrive, Download, AlertCircle, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { translate } = useApp();
  const { isOnline, cachedItems } = useOfflineStorage();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Active Offline Alert Banner */}
      {!isOnline && (
        <aside
          aria-label={translate('Offline Mode Notice', 'Icishibisho ca Kukanaba pa Intaneti')}
          className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs transition-all shadow-lg animate-fade-in"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <WifiOff className="h-4 w-4" />
              </span>
              <div>
                <span className="font-bold block sm:inline mr-1.5">
                  {translate('Offline Mode Active', 'Tapali Intaneti (Offline)')}:
                </span>
                <span className="text-amber-300">
                  {translate(
                    `You are disconnected. Previously viewed educational videos, infographics, and quizzes are accessible from local storage.`,
                    `Intaneti tailiko. Amasambililo ayo mwatambile akale kuti mwayamona ukwabula ama bundle.`
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <button
                id="view-offline-library-btn"
                onClick={() => setShowModal(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow transition"
              >
                <HardDrive className="h-3.5 w-3.5" />
                <span>
                  {translate('Offline Library', 'Ifyasungwa')} ({cachedItems.length})
                </span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Offline Storage Library Modal */}
      <OfflineLibraryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
