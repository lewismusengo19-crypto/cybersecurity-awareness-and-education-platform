import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { translate } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as standalone app, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className={`flex items-center space-x-1.5 rounded-xl border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 font-bold transition-all cursor-pointer shadow-sm ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
        title={translate('Install Cybersecurity App on your device for offline learning', 'Bikeni app iyi pa foni yenu pakuti musambilile ukwabula ama bundle')}
      >
        <Smartphone className="h-3.5 w-3.5 text-green-400 shrink-0" />
        <span>{translate('Install App', 'Bikeni App')}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 text-xs font-medium transition cursor-pointer ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{translate('Install App', 'Bikeni App')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-green-400" />
                  <h3 className="font-bold text-base text-white">
                    {translate('Install on iPhone / iPad', 'Bikeni pa iPhone nangu iPad')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <p>
                  {translate(
                    'Install this academy app on your home screen for full offline lessons:',
                    'Bikeni iyi app pa foni yenu pakuti mulesambilila nangu tapali intaneti:'
                  )}
                </p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-green-400">1.</span>
                    <span>{translate('Tap the Share icon in the Safari toolbar.', 'Tinikeni icon iyakucita Share muli Safari.')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-green-400">2.</span>
                    <span>{translate('Scroll down and select "Add to Home Screen".', 'Saleni "Add to Home Screen".')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-green-400">3.</span>
                    <span>{translate('Open the app icon directly from your device anytime!', 'Kuti mwaisula app iyi inshita ili yonse!')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                {translate('Got It', 'Naumfwa')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
