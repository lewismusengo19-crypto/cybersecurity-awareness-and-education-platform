import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Send, Sparkles, Trash2, Smartphone, Key, HelpCircle } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set up welcome message on load
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: translate(
          "Muli shani! I am **Ba Cyber Advisor**, your digital security assistant. Ask me any question in English or Bemba. For example:\n- How do I secure my Mobile Money (MoMo)?\n- How do I set up WhatsApp Two-Factor Authentication?",
          "Muli shani! Nine **Ba Cyber Advisor**, uushila wenu uwa fya kacingilila. Mwinganjipusha muli Cingeleshi nelyo Cibemba. Mukasambilile:\n- Kuti nacingilila shani ndalama shandi isha MoMo?\n- Kuti nabomfya shani Two-Factor Authentication pali WhatsApp?"
        )
      }
    ]);
  }, [language]);

  // Keep scroll focused at the bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

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
        setMessages(prev => [...prev, {
          id: 'ai-' + Date.now(),
          role: 'model',
          content: data.reply
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: 'err-' + Date.now(),
          role: 'model',
          content: translate(
            'Sorry, I could not generate a response. Ensure your API key is correctly configured.',
            'Mpeeleleko ubwafya, nshaswike bwino. Moneni nga API key yenu yaba bwino.'
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
          'Ubwafya bwa masebela. Eseni kabili.'
        )
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: translate(
          "Muli shani! I am **Ba Cyber Advisor**, your digital security assistant. Ask me any question in English or Bemba.",
          "Muli shani! Nine **Ba Cyber Advisor**, uushila wenu uwa fya kacingilila. Mwinganjipusha muli Cingeleshi nelyo Cibemba."
        )
      }
    ]);
  };

  // Quick suggestions cards
  const suggestions = [
    {
      en: "Protect my MTN/Airtel MoMo",
      bm: "Ukuicingilila MoMo yandi",
      icon: Smartphone
    },
    {
      en: "How to spot a Facebook hack",
      bm: "Ukwishiba bufi bwa Facebook",
      icon: Key
    },
    {
      en: "How to set WhatsApp Two-Factor",
      bm: "Ukubomfya Two-Factor muli WhatsApp",
      icon: HelpCircle
    }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-left" id="chatbot-section">
      {/* Bot Chat Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl animate-pulse">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">Ba Cyber Advisor</h3>
            <span className="text-[10px] text-green-400 font-mono flex items-center space-x-1 mt-0.5">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
              <span>GEMINI MODEL ACCORD ACTIVE • {language.toUpperCase()}</span>
            </span>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={clearChat}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
          title={translate('Clear Chat', 'Lekeni chat')}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-green-600 text-white rounded-br-none shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
            }`}>
              {/* Formatted Text renderer */}
              <p className="whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 rounded-bl-none max-w-sm flex items-center space-x-2 text-slate-400 text-xs">
              <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{translate('Ba Cyber Advisor is drafting security response...', 'Cyber Advisor alemupangila kwasuka...')}</span>
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
          placeholder={translate('Type your cybersecurity question...', 'Lembani ipusho lyenu ilya kacingilila...')}
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
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
