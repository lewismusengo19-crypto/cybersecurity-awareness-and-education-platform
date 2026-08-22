import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speechService } from '../utils/speechService';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, Gauge, ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface AudioVoiceoverBarProps {
  id: string;
  titleEn: string;
  titleBm: string;
  narrativeEn: string;
  narrativeBm: string;
  compact?: boolean;
}

export const AudioVoiceoverBar: React.FC<AudioVoiceoverBarProps> = ({
  id,
  titleEn,
  titleBm,
  narrativeEn,
  narrativeBm,
  compact = false
}) => {
  const { language, translate } = useApp();
  const [speechStatus, setSpeechStatus] = useState(speechService.getStatus());
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<'en' | 'bm'>(language);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showScript, setShowScript] = useState<boolean>(false);

  // Sync selected voice language with global app language changes when idle
  useEffect(() => {
    if (!speechStatus.isSpeaking) {
      setSelectedVoiceLang(language);
    }
  }, [language, speechStatus.isSpeaking]);

  useEffect(() => {
    const unsubscribe = speechService.subscribe(() => {
      setSpeechStatus(speechService.getStatus());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isCurrentItemPlaying = speechStatus.isSpeaking && speechStatus.activeTextId === id;
  const isCurrentItemPaused = isCurrentItemPlaying && speechStatus.isPaused;

  const currentTitle = selectedVoiceLang === 'bm' ? titleBm : titleEn;
  const currentNarrative = selectedVoiceLang === 'bm' ? narrativeBm : narrativeEn;
  const fullNarrationScript = `${currentTitle}. ${currentNarrative}`;

  const handlePlayToggle = () => {
    if (isCurrentItemPlaying && !isCurrentItemPaused) {
      speechService.pause();
    } else if (isCurrentItemPaused) {
      speechService.resume();
    } else {
      speechService.speak(fullNarrationScript, id, selectedVoiceLang, {
        rate: playbackSpeed,
        pitch: selectedVoiceLang === 'bm' ? 1.05 : 1.0
      });
    }
  };

  const handleStop = () => {
    speechService.stop();
  };

  const handleReplay = () => {
    speechService.stop();
    setTimeout(() => {
      speechService.speak(fullNarrationScript, id, selectedVoiceLang, {
        rate: playbackSpeed,
        pitch: selectedVoiceLang === 'bm' ? 1.05 : 1.0
      });
    }, 100);
  };

  const cycleSpeed = () => {
    const speeds = [0.8, 1.0, 1.25];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);

    // If currently playing, restart at new speed
    if (isCurrentItemPlaying) {
      speechService.stop();
      setTimeout(() => {
        speechService.speak(fullNarrationScript, id, selectedVoiceLang, {
          rate: newSpeed,
          pitch: selectedVoiceLang === 'bm' ? 1.05 : 1.0
        });
      }, 50);
    }
  };

  const switchLanguage = (lang: 'en' | 'bm') => {
    setSelectedVoiceLang(lang);
    if (isCurrentItemPlaying) {
      speechService.stop();
      const script = lang === 'bm' ? `${titleBm}. ${narrativeBm}` : `${titleEn}. ${narrativeEn}`;
      setTimeout(() => {
        speechService.speak(script, id, lang, {
          rate: playbackSpeed,
          pitch: lang === 'bm' ? 1.05 : 1.0
        });
      }, 50);
    }
  };

  if (!speechStatus.isSupported) {
    return null;
  }

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 px-3">
        <button
          onClick={handlePlayToggle}
          className={`p-1.5 rounded-lg flex items-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
            isCurrentItemPlaying && !isCurrentItemPaused
              ? 'bg-green-600 text-white animate-pulse'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={isCurrentItemPlaying && !isCurrentItemPaused ? 'Pause Voiceover' : 'Play Voiceover'}
        >
          {isCurrentItemPlaying && !isCurrentItemPaused ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          <span>
            {isCurrentItemPlaying && !isCurrentItemPaused
              ? translate('Speaking...', 'Ulelanda...')
              : translate('Listen (Audio)', 'Kutika (Audio)')}
          </span>
        </button>

        {isCurrentItemPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all cursor-pointer"
            title="Stop Audio"
          >
            <VolumeX className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-750 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator & Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            isCurrentItemPlaying && !isCurrentItemPaused
              ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-500/10'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {isCurrentItemPlaying && !isCurrentItemPaused ? (
              <Radio className="h-5 w-5 animate-pulse text-green-400" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-green-400" />
                <span>{translate('AI Audio Voiceover', 'Voiceover ya Sambililo')}</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {selectedVoiceLang === 'bm' ? 'ICHIBEMBA' : 'ENGLISH'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
              {translate(
                'Listen to professional spoken instruction with synchronized audio narration.',
                'Kutikeni ku masambililo aya landwa mu Cibemba nangu mu Cingeleshi.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Controls & Speed */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => switchLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                selectedVoiceLang === 'en'
                  ? 'bg-green-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLanguage('bm')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                selectedVoiceLang === 'bm'
                  ? 'bg-green-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BM
            </button>
          </div>

          {/* Speed Selector */}
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 border border-slate-700 transition-all cursor-pointer"
            title="Adjust Speech Speed"
          >
            <Gauge className="h-3.5 w-3.5 text-slate-400" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Replay */}
          {isCurrentItemPlaying && (
            <button
              onClick={handleReplay}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Main Play / Pause Button */}
          <button
            id={`voiceover-play-btn-${id}`}
            onClick={handlePlayToggle}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer ${
              isCurrentItemPlaying && !isCurrentItemPaused
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/20'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isCurrentItemPlaying && !isCurrentItemPaused ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>{translate('Pause Narration', 'Kusilika')}</span>
              </>
            ) : isCurrentItemPaused ? (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{translate('Resume Audio', 'Konkanyapo')}</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{translate('Listen Voiceover', 'Kutikeni')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Sound Wave Visualizer when playing */}
      {isCurrentItemPlaying && !isCurrentItemPaused && (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/70 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-1 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-4 w-1 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-1 bg-green-500 rounded-full animate-bounce"></span>
            <span className="h-5 w-1 bg-green-300 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
            <span className="h-3 w-1 bg-green-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
          </div>

          <span className="text-[11px] text-green-400 font-mono">
            {translate('Playing audio voiceover in', 'Amasambililo yaleandwa mu')}{' '}
            {selectedVoiceLang === 'bm' ? 'Ichibemba' : 'English'} ({playbackSpeed}x)
          </span>

          <button
            onClick={handleStop}
            className="text-[11px] text-slate-400 hover:text-red-400 flex items-center space-x-1 cursor-pointer"
          >
            <VolumeX className="h-3.5 w-3.5" />
            <span>{translate('Stop', 'Lekeni')}</span>
          </button>
        </div>
      )}

      {/* Expandable Narration Transcript Drawer */}
      <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs">
        <button
          onClick={() => setShowScript(!showScript)}
          className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-medium cursor-pointer"
        >
          <span>{translate('Voiceover Transcript', 'Amalembo ya Audio')}</span>
          {showScript ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        <span className="text-[10px] text-slate-500 font-mono">
          {fullNarrationScript.split(' ').length} {translate('words', 'amashiwi')}
        </span>
      </div>

      {showScript && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
          <p className="font-semibold text-white mb-1">{currentTitle}</p>
          <p>{currentNarrative}</p>
        </div>
      )}
    </div>
  );
};
