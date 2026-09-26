import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speechService } from '../utils/speechService';
import {
  Shield,
  Send,
  Trash2,
  Smartphone,
  Key,
  HelpCircle,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Gauge
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export const ChatbotSection: React.FC = () => {
  const { language, translate } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechStatus, setSpeechStatus] = useState(speechService.getStatus());
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to speech synthesis status
  useEffect(() => {
    const unsubscribe = speechService.subscribe(() => {
      setSpeechStatus(speechService.getStatus());
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  // Set up welcome message on load & stop speech on Bemba
  useEffect(() => {
    speechService.stop();
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: translate(
          "Muli shani! I am **Ba Cyber Advisor**, your digital security assistant. Ask me any question in English or Bemba. For example:\n- How do I secure my Mobile Money (MoMo)?\n- How do I set up WhatsApp Two-Factor Authentication?",
          "Muli shani! Nine **Ba Cyber Advisor**, uwakumyafilisha pafya kuicingilila pa intaneti. Kutimwanjipusha mu Cingeleshi namu Cibemba. Icilangililo:\n- Kuti nacingilila shani ndalama shandi isha pa Mobile Money?\n- Kuti nabomfya shani Two-Factor Authentication pali WhatsApp?"
        )
      }
    ]);
  }, [language]);

  // Keep scroll focused at the bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (language !== 'en') return;
    if (speechStatus.isSpeaking && speechStatus.activeTextId === msgId) {
      if (speechStatus.isPaused) {
        speechService.resume();
      } else {
        speechService.pause();
      }
    } else {
      speechService.speak(text, msgId, 'en', {
        rate: speechRate,
        pitch: 1.0
      });
    }
  };

  const cycleSpeechRate = () => {
    const rates = [0.8, 1.0, 1.25];
    const nextIndex = (rates.indexOf(speechRate) + 1) % rates.length;
    const newSpeed = rates[nextIndex];
    setSpeechRate(newSpeed);

    if (speechStatus.isSpeaking && language === 'en') {
      speechService.stop();
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Stop ongoing speech before sending new query
    speechService.stop();

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          language
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const newMsgId = 'ai-' + Date.now();
        setMessages(prev => [...prev, {
          id: newMsgId,
          role: 'model',
          content: data.reply
        }]);

        // Auto read if learner enabled auto-speak and in English
        if (autoSpeak && language === 'en') {
          setTimeout(() => {
            speechService.speak(data.reply, newMsgId, 'en', {
              rate: speechRate,
              pitch: 1.0
            });
          }, 200);
        }
      } else {
        setMessages(prev => [...prev, {
          id: 'err-' + Date.now(),
          role: 'model',
          content: translate(
            'Sorry, I could not generate a response. Ensure your API key is correctly configured.',
            'Njeleleniko, nshaswike bwino. Moneni nga API key yenu nga ilife bwino.'
          )
        }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'model',
        content: translate(
          'Network error. Please try again.',
          'Ubwafya bwa Network. Esheni nakabili.'
        )
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    speechService.stop();
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: translate(
          "Muli shani! I am **Ba Cyber Advisor**, your digital security assistant. Ask me any question in English or Bemba.",
          "Muli shani! Ninebo **Ba Cyber Advisor**, uwakumyafilisha pafya kacingilila. Kutimwanjipusha mu Cingeleshi namu Cibemba."
        )
      }
    ]);
  };

  // Quick suggestions cards
  const suggestions = [
    {
      en: "Protect my MTN/Airtel MoMo",
      bm: "Ukucingila MoMo/Airtel money yandi",
      icon: Smartphone
    },
    {
      en: "How to spot a Facebook hack",
      bm: "Kutinaishiba shani ubufi eyobengambepa pa Facebook",
      icon: Key
    },
    {
      en: "How to set WhatsApp Two-Factor",
      bm: "Ukubomfya Two-Factor pa WhatsApp",
      icon: HelpCircle
    }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-left" id="chatbot-section">
      {/* Bot Chat Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl animate-pulse">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">Ba Cyber Advisor</h3>
            <span className="text-[10px] text-green-400 font-mono flex items-center space-x-1 mt-0.5">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
              <span>
                {language === 'en'
                  ? 'GEMINI AI • INSTANT SUPPORT • TTS'
                  : 'GEMINI AI • UKWASUKA BWANGU'}
              </span>
            </span>
          </div>
        </div>

        {/* Header Audio & Action Controls */}
        <div className="flex items-center space-x-2">
          {language === 'en' && (
            <>
              {/* Speed Toggle */}
              <button
                onClick={cycleSpeechRate}
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10px] font-mono font-bold rounded-lg flex items-center space-x-1 cursor-pointer transition-all"
                title="Voice Speed"
              >
                <Gauge className="h-3 w-3 text-green-400" />
                <span>{speechRate}x</span>
              </button>

              {/* Auto Read Aloud Toggle */}
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`px-2.5 py-1 border text-[10px] font-bold rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  autoSpeak
                    ? 'bg-green-600/20 border-green-500/50 text-green-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Auto-speak incoming English responses"
              >
                <Volume2 className="h-3 w-3" />
                <span>{autoSpeak ? 'Voice ON' : 'Voice OFF'}</span>
              </button>
            </>
          )}

          {/* Stop active speech button if speaking */}
          {speechStatus.isSpeaking && (
            <button
              onClick={() => speechService.stop()}
              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
              title={translate('Stop Voice', 'Lekeni')}
            >
              <VolumeX className="h-4 w-4" />
            </button>
          )}

          <button
            id="clear-chat-btn"
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
            title={translate('Clear Chat', 'Lekeni ukulanshanya')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
        {messages.map((msg) => {
          const isThisSpeaking = speechStatus.isSpeaking && speechStatus.activeTextId === msg.id;
          const isThisPaused = isThisSpeaking && speechStatus.isPaused;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
              }`}>
                {/* Formatted Text renderer */}
                <p className="whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Model Audio Player Action Bar (English only) */}
                {msg.role === 'model' && language === 'en' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.content)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isThisSpeaking && !isThisPaused
                          ? 'bg-green-500 text-white shadow'
                          : isThisPaused
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                      title={
                        isThisSpeaking && !isThisPaused
                          ? 'Pause Speech'
                          : isThisPaused
                          ? 'Resume Speech'
                          : 'Listen to advice (English)'
                      }
                    >
                      {isThisSpeaking && !isThisPaused ? (
                        <>
                          <Pause className="h-3 w-3 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : isThisPaused ? (
                        <>
                          <Play className="h-3 w-3 fill-current" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3 text-green-400" />
                          <span>Listen Aloud</span>
                        </>
                      )}
                    </button>

                    {/* Active Voice Wave Animation */}
                    {isThisSpeaking && !isThisPaused && (
                      <div className="flex items-center space-x-1 text-green-400 font-mono text-[10px]">
                        <span className="h-2.5 w-0.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                        <span className="h-3.5 w-0.5 bg-green-300 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                        <span className="h-2 w-0.5 bg-green-400 rounded-full animate-bounce"></span>
                        <span className="text-[10px] ml-1">Speaking...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 rounded-bl-none max-w-sm flex items-center space-x-2 text-slate-400 text-xs">
              <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{translate('Ba Cyber Advisor is drafting security response...', 'Cyber Advisor alemipangila ubwasuko...')}</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Quick suggestions container */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-3 bg-slate-950/40 border-t border-slate-850/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map((s, index) => (
            <button
              key={index}
              id={`chat-suggestion-${index}`}
              onClick={() => sendMessage(translate(s.en, s.bm))}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-850 transition-all text-xs text-slate-300 font-medium flex items-center space-x-2 cursor-pointer text-left"
            >
              <s.icon className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span>{translate(s.en, s.bm)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(userInput);
        }}
        className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3"
      >
        <input
          id="chat-user-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={translate('Ask a cybersecurity question in English or Bemba...', 'Ipusheni ilipusho mu Cingeleshi nangu mu Cibemba...')}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          id="chat-send-btn"
          type="submit"
          disabled={!userInput.trim() || loading}
          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            !userInput.trim() || loading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white shadow'
          }`}
          title={translate('Send question', 'Tumeni ilipusho')}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

