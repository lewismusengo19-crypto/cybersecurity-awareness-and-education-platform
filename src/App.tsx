import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { LearnSection } from './components/LearnSection';
import { GallerySection } from './components/GallerySection';
import { QuizSection } from './components/QuizSection';
import { ChatbotSection } from './components/ChatbotSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AdminSection } from './components/AdminSection';
import { OfflineBanner } from './components/OfflineBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Shield, Eye, Smartphone, Mail, Phone, ExternalLink } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    language,
    textSize,
    highContrast,
    activeSection,
    translate,
    profile
  } = useApp();

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'learn':
        return <LearnSection />;
      case 'gallery':
        return <GallerySection />;
      case 'quizzes':
        return <QuizSection />;
      case 'chatbot':
        return <ChatbotSection />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      case 'admin':
        return profile?.role === 'admin' ? <AdminSection /> : <HomeSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black text-yellow-400 selection:bg-yellow-400 selection:text-black' 
        : 'bg-slate-950 text-slate-100 selection:bg-green-500/30 selection:text-white'
    } ${
      textSize === 'large' ? 'text-lg' : 'text-sm'
    }`} id="app-container">
      {/* Navbar */}
      <Navbar />

      {/* Offline Connectivity & Storage Banner */}
      <OfflineBanner />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8 w-full">
        {renderSection()}
      </main>

      {/* Mobile Sticky Bottom Navigation Dock */}
      <MobileBottomNav onOpenMoreMenu={() => {
        const btn = document.getElementById('mobile-menu-btn');
        if (btn) btn.click();
      }} />

      {/* Footer */}
      <footer className={`border-t transition-all duration-300 py-10 text-left ${
        highContrast 
          ? 'bg-black border-yellow-400 text-yellow-400' 
          : 'bg-slate-950 border-slate-850 text-slate-400'
      }`} id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className={`h-5 w-5 ${highContrast ? 'text-yellow-400' : 'text-green-500'}`} />
              <span className="font-extrabold text-white text-sm">
                {translate('Cybersecurity Academy', 'Ukuicingilila Academy')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {translate(
                'A dedicated research initiative protecting Zambians from Mobile Money (MoMo) scams, social engineering, and online identity theft through native bimodal education.',
                ' Isambililo iyilelondolola pafyo mwingaicingilila pa foni kuli bapula amafunde abengafwaya ukumibila indalama isha mu Mobile Money mu Zambia, ukupitila mu Cingeleshi ne Cibemba.'
              )}
            </p>
          </div>

          {/* Quick Contacts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">{translate('Research Contacts', 'Ubutumishi Bwa Bwafya')}</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-green-500" />
                <a href="mailto:lewismusengo19@gmail.com" className="hover:underline hover:text-white">lewismusengo19@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-green-500" />
                <a href="tel:+260966500385" className="hover:underline hover:text-white">+260 966 500385</a>
              </div>
            </div>
          </div>

          {/* Local Regulatory Authorities & Accords */}
          <div className="space-y-3 text-xs text-slate-400">
            <h4 className="font-bold text-white uppercase tracking-wider">{translate('Regulatory Resources', 'Resources sha Buteko')}</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="https://www.zicta.zm" target="_blank" rel="noreferrer" className="hover:underline hover:text-white inline-flex items-center space-x-1">
                  <span>ZICTA Zambia</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-slate-500 font-mono mt-1">REPORT SUSPICIOUS SMS TO 709</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono">
          <p>© 2026 Cybersecurity Awareness and Education Platform. Chinsali, Zambia.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>DEVELOPERS: LEWIS MUSENGO & DYTON NG'AMBI</span>
            <span>BILINGUAL SYSTEM ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
