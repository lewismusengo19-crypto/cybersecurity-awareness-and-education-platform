// Speech Synthesis and Audio Voiceover Utility
// Provides robust, clean Text-to-Speech across devices with Markdown stripping and chunking

export interface SpeechOptions {
  rate?: number; // 0.5 to 2.0 (default: 1.0)
  pitch?: number; // 0.5 to 2.0 (default: 1.0)
  volume?: number; // 0 to 1.0 (default: 1.0)
  lang?: string; // 'en-US', 'en-GB', 'en-ZA', etc.
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (err: any) => void;
}

class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private activeTextId: string | null = null;
  private listeners: Set<() => void> = new Set();
  private keepAliveInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Preload voices
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      activeTextId: this.activeTextId,
      isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
    };
  }

  // Strip markdown styling so TTS reads natural human language smoothly
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      .replace(/https?:\/\/\S+/g, 'link') // replace URLs with "link"
      .replace(/\*\*([^*]+)\*\*/g, '$1') // remove bold asterisks
      .replace(/\*([^*]+)\*/g, '$1') // remove italic asterisks
      .replace(/`([^`]+)`/g, '$1') // remove code ticks
      .replace(/#+\s/g, '') // remove headings
      .replace(/[-*•]\s/g, ', ') // convert bullet points into natural breath pauses
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // replace markdown links with label
      .replace(/[|><~]/g, '') // remove markdown table/quote chars
      .replace(/\n+/g, '. ') // replace newlines with pauses
      .replace(/\s+/g, ' ') // collapse multi-spaces
      .trim();
  }

  public speak(
    text: string,
    id: string = 'generic',
    language: 'en' | 'bm' = 'en',
    options?: SpeechOptions
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // If currently speaking this exact item, pause/resume
    if (this.activeTextId === id && this.isSpeaking) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
      return;
    }

    // Stop any ongoing speech
    this.stop();

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      this.currentUtterance = utterance;
      this.activeTextId = id;

      // Rate & pitch settings
      utterance.rate = options?.rate || 0.95; // Slightly slower for crisp clear comprehension
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      // Voice selection
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (language === 'bm') {
          const zaVoice = voices.find(v => v.lang.includes('en-ZA') || v.lang.includes('en_ZA'));
          const gbVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
          if (zaVoice || gbVoice) {
            utterance.voice = zaVoice || gbVoice;
          }
          utterance.lang = 'en-ZA';
        } else {
          const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Premium')));
          if (enVoice) {
            utterance.voice = enVoice;
          } else {
            const genericEn = voices.find(v => v.lang.startsWith('en'));
            if (genericEn) utterance.voice = genericEn;
          }
          utterance.lang = utterance.voice?.lang || 'en-US';
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        this.notify();
        options?.onStart?.();
        this.startKeepAlive();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.activeTextId = null;
        this.currentUtterance = null;
        this.stopKeepAlive();
        this.notify();
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e);
          options?.onError?.(e);
        }
        this.isSpeaking = false;
        this.isPaused = false;
        this.activeTextId = null;
        this.currentUtterance = null;
        this.stopKeepAlive();
        this.notify();
      };

      utterance.onpause = () => {
        this.isPaused = true;
        this.notify();
        options?.onPause?.();
      };

      utterance.onresume = () => {
        this.isPaused = false;
        this.notify();
        options?.onResume?.();
      };

      // Ensure speech synthesis is in a clean unpaused state
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      console.error('Failed to initiate speech:', err);
    }
  }

  // Workaround for Chrome bug where long speech stops after ~14 seconds
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        this.isPaused = true;
        this.notify();
      }
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.isPaused = false;
        this.notify();
      }
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.stopKeepAlive();
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.activeTextId = null;
      this.currentUtterance = null;
      this.notify();
    }
  }
}

export const speechService = new SpeechService();
