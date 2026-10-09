import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Play, Image, Award, Bot, Menu, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMoreMenu }) => {
  const {
    activeSection,
    setActiveSection,
    highContrast,
    translate,
    profile
  } = useApp();

  const navItems = [
    {
      id: 'home',
      labelEn: 'Home',
      labelBm: 'Home',
      icon: Shield
    },
    {
      id: 'learn',
      labelEn: 'Learn',
      labelBm: 'Sambilila',
      icon: Play
    },
    {
      id: 'gallery',
      labelEn: 'Infographics',
      labelBm: 'Ifipope',
      icon: Image
    },
    {
      id: 'quizzes',
      labelEn: 'Quizzes',
      labelBm: 'Quizzes',
      icon: Award
    },
    {
      id: 'chatbot',
      labelEn: 'Advisor',
      labelBm: 'Advisor',
      icon: Bot
    }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label={translate('Mobile Navigation', 'Imyendele ya pa Foni')}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-colors pb-[env(safe-area-inset-bottom)] ${
        highContrast
          ? 'bg-black/95 border-yellow-400 text-yellow-400'
          : 'bg-slate-950/95 border-slate-800/90 text-slate-300'
      }`}
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`mobile-tab-${item.id}`}
              onClick={() => {
                setActiveSection(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? highContrast
                    ? 'text-black bg-yellow-400 font-extrabold shadow'
                    : 'text-green-400 font-bold bg-green-500/10'
                  : highContrast
                    ? 'text-yellow-400 hover:text-white'
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.id === 'chatbot' && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight mt-1 truncate max-w-full font-medium">
                {translate(item.labelEn, item.labelBm)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
