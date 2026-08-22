import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Languages, Type, Eye, LogIn, LogOut, User as UserIcon, X, Menu, Settings, KeyRound, Sparkles, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    activeSection,
    setActiveSection,
    user,
    profile,
    logout,
    login,
    register,
    resetPassword,
    quickLogin,
    errorMsg,
    setErrorMsg,
    translate
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regRole, setRegRole] = useState<'admin' | 'learner'>('learner');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg(null);
    setResetSuccessMsg(null);
    try {
      if (authMode === 'register') {
        await register(email, password, name, regRole);
        setShowAuthModal(false);
      } else if (authMode === 'login') {
        await login(email, password);
        setShowAuthModal(false);
      } else if (authMode === 'reset') {
        await resetPassword(email, password);
        // Auto sign in with the new password
        await login(email, password);
        setResetSuccessMsg(translate('Password successfully reset! Signed in.', 'Password naicenjwa bwino! Mwaingila.'));
        setTimeout(() => {
          setShowAuthModal(false);
        }, 1200);
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'learner') => {
    setAuthLoading(true);
    setErrorMsg(null);
    setResetSuccessMsg(null);
    try {
      await quickLogin(role);
      setShowAuthModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const menuItems = [
    { id: 'home', en: 'Home', bm: 'Icalo' },
    { id: 'learn', en: 'Learn', bm: 'Sambilileni' },
    { id: 'gallery', en: 'Infographics', bm: 'Ifipope' },
    { id: 'quizzes', en: 'Quizzes', bm: 'Quizzes' },
    { id: 'chatbot', en: 'Ba Cyber Advisor', bm: 'Ba Cyber Advisor' },
    { id: 'about', en: 'About', bm: 'Ifitulambika' },
    { id: 'contact', en: 'Contact', bm: 'Lanshanyeni' }
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b shadow-sm backdrop-blur transition-all duration-300 ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-400' 
        : 'bg-slate-900/95 border-slate-800 text-white'
    }`} id="main-nav">
      {/* Zambia colors accent line at the very top */}
      <div className="h-1.5 w-full flex">
        <div className="h-full bg-green-600 flex-1"></div>
        <div className="h-full bg-red-600 w-16"></div>
        <div className="h-full bg-orange-500 w-16"></div>
        <div className="h-full bg-black w-16"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveSection('home')}>
            <div className={`p-2 rounded-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'}`}>
              <Shield className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className={`font-bold tracking-tight block leading-tight ${textSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                {translate('Cybersecurity Academy', 'Ukuicingilila Academy')}
              </span>
              <span className="text-xs text-slate-400 block font-mono">ZAMBIA • {language.toUpperCase()}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 lg:space-x-3 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer text-sm ${
                  activeSection === item.id
                    ? highContrast 
                      ? 'bg-yellow-400 text-black font-extrabold' 
                      : 'bg-green-600 text-white shadow-md'
                    : highContrast
                      ? 'hover:bg-yellow-400/20 text-yellow-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {translate(item.en, item.bm)}
              </button>
            ))}

            {/* Admin Portal Tab (If admin) */}
            {profile?.role === 'admin' && (
              <button
                id="nav-item-admin"
                onClick={() => setActiveSection('admin')}
                className={`px-3 py-2 rounded-md text-sm font-bold border transition-all cursor-pointer ${
                  activeSection === 'admin'
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                {translate('Admin Portal', 'Ifisambilisho Fya Admin')}
              </button>
            )}
          </div>

          {/* Right Side Buttons (Languages, Accessibilities, Auth) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Switch */}
            <button
              id="lang-switch-btn"
              onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
              className={`p-2 rounded-lg flex items-center space-x-1 border cursor-pointer text-xs font-mono transition-all duration-200 ${
                highContrast 
                  ? 'border-yellow-400 hover:bg-yellow-400/10' 
                  : 'border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
              title={translate('Switch to Bemba', 'Kabiyeni ku Cibemba')}
            >
              <Languages className="h-4 w-4" />
              <span>{language === 'en' ? 'BEMBA' : 'ENGLISH'}</span>
            </button>

            {/* Accessibility Settings Dropdown */}
            <div className="relative">
              <button
                id="acc-settings-btn"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                  highContrast 
                    ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10' 
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title={translate('Accessibility settings', 'Ifya kucinja imisungile')}
              >
                <Settings className="h-4 w-4" />
              </button>

              {showSettingsDropdown && (
                <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg border p-3 space-y-3 z-50 ${
                  highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-slate-800 border-slate-700 text-white'
                }`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
                    {translate('Accessibility', 'Ukucite ifingafwa')}
                  </p>
                  
                  {/* High Contrast Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{translate('High Contrast', 'High Contrast')}</span>
                    <button
                      id="contrast-toggle"
                      onClick={() => setHighContrast(!highContrast)}
                      className={`p-1.5 rounded cursor-pointer ${
                        highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Text Size Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{translate('Large Text', 'Ifyalembwa ifikalamba')}</span>
                    <button
                      id="text-size-toggle"
                      onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
                      className={`p-1.5 rounded cursor-pointer ${
                        textSize === 'large' 
                          ? highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white' 
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Type className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                  highContrast ? 'border-yellow-400' : 'border-slate-700 bg-slate-800/50'
                }`}>
                  <UserIcon className="h-3.5 w-3.5 text-green-400" />
                  <span className="font-medium truncate max-w-[80px]" title={profile?.displayName}>
                    {profile?.displayName}
                  </span>
                </div>
                <button
                  id="logout-btn"
                  onClick={logout}
                  className={`p-2 rounded-lg border cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all ${
                    highContrast ? 'border-yellow-400 text-yellow-400' : 'border-slate-700 text-slate-300'
                  }`}
                  title={translate('Logout', 'Ukufumamo')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                  setShowAuthModal(true);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                  highContrast 
                    ? 'bg-yellow-400 text-black font-black hover:bg-yellow-300' 
                    : 'bg-green-600 text-white hover:bg-green-500 shadow'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>{translate('Sign In', 'Ukwingila')}</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switch Mobile */}
            <button
              id="lang-switch-mobile"
              onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
              className={`p-1.5 rounded border text-[10px] font-mono ${
                highContrast ? 'border-yellow-400 text-yellow-400' : 'border-slate-700 text-slate-300'
              }`}
            >
              {language.toUpperCase()}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                highContrast ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-2 pt-2 pb-4 space-y-1 ${
          highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-slate-850 border-slate-800 text-white'
        }`}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-item-${item.id}`}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeSection === item.id
                  ? highContrast 
                    ? 'bg-yellow-400 text-black font-bold' 
                    : 'bg-green-600 text-white'
                  : 'hover:bg-slate-800'
              }`}
            >
              {translate(item.en, item.bm)}
            </button>
          ))}

          {profile?.role === 'admin' && (
            <button
              id="mobile-nav-item-admin"
              onClick={() => {
                setActiveSection('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-orange-400 border border-orange-500/30 hover:bg-orange-500/10"
            >
              {translate('Admin Portal', 'Ifisambilisho Fyaba Admin')}
            </button>
          )}

          {/* Accessibility quick triggers in mobile */}
          <div className="border-t border-slate-700 pt-3 mt-3 flex items-center justify-around">
            <button
              id="contrast-toggle-mobile"
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded border text-xs flex items-center space-x-1 ${
                highContrast ? 'bg-yellow-400 text-black border-yellow-400' : 'border-slate-700 text-slate-300'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>{translate('Contrast', 'Contrast')}</span>
            </button>

            <button
              id="text-size-toggle-mobile"
              onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
              className={`p-2 rounded border text-xs flex items-center space-x-1 ${
                textSize === 'large' ? 'bg-green-600 text-white border-green-600' : 'border-slate-700 text-slate-300'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>{translate('Large Text', 'Amalembo ayakalamba')}</span>
            </button>
          </div>

          <div className="border-t border-slate-700 pt-3 mt-3 px-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs truncate max-w-[150px]">{profile?.displayName || user.email}</span>
                <button
                  id="logout-btn-mobile"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded bg-red-600 text-white text-xs font-medium cursor-pointer"
                >
                  {translate('Logout', 'Ukufumamo')}
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-mobile"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-center py-2.5 rounded font-bold text-sm cursor-pointer ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'
                }`}
              >
                {translate('Sign In', 'Ukwingila')}
              </button>
            )}
          </div>
        </div>
      )}

      </nav>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/85 overflow-y-auto z-[9999] backdrop-blur-sm" id="auth-modal">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 border transition-all my-8 ${
              highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
            <button
              id="close-auth-modal"
              onClick={() => {
                setShowAuthModal(false);
                setErrorMsg(null);
                setResetSuccessMsg(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <Shield className={`h-10 w-10 mx-auto mb-2 ${highContrast ? 'text-yellow-400' : 'text-green-500'}`} />
              <h3 className="text-xl font-bold tracking-tight">
                {authMode === 'register' 
                  ? translate('Create Academy Account', 'Pangeni Account Iyipya') 
                  : authMode === 'reset'
                    ? translate('Reset Password', 'Cenjeni Password')
                    : translate('Welcome Back', 'Mwaisenipo Mukwai')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'register' 
                  ? translate('Join Zambia Cybersecurity Academy and track your progress.', 'Sambilileni pa kuicingilila bwino mu Zambia.') 
                  : authMode === 'reset'
                    ? translate('Set a new password or restore access immediately.', 'Bikeni password ipya pa kuti mwingile bwangu.')
                    : translate('Sign in to continue lessons, quizzes, and security certifications.', 'Ingileni mukonkanyepo ifisambilisho.')}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg bg-slate-800/80 p-1 mb-4 border border-slate-700/60">
              <button
                type="button"
                id="tab-mode-login"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-green-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {translate('Sign In', 'Ingileni')}
              </button>
              <button
                type="button"
                id="tab-mode-register"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {translate('Register', 'Lembelembeni')}
              </button>
              <button
                type="button"
                id="tab-mode-reset"
                onClick={() => {
                  setAuthMode('reset');
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  authMode === 'reset'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {translate('Reset', 'Cenjeni')}
              </button>
            </div>

            {/* Success Message Banner */}
            {resetSuccessMsg && (
              <div className="bg-green-950/80 border border-green-500 text-green-200 text-xs px-3 py-2.5 rounded-lg mb-4 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            {/* Error Message Banner with Smart 1-Click Recovery Actions */}
            {errorMsg && (
              <div className="bg-red-950/70 border border-red-500/80 text-red-200 text-xs p-3 rounded-lg mb-4 space-y-2">
                <div className="font-mono">{errorMsg}</div>
                
                {/* If error is 'already registered', offer 1-click switch to sign in */}
                {errorMsg.toLowerCase().includes('already registered') && (
                  <div className="pt-2 border-t border-red-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-red-300">
                      {translate('Account exists with this email:', 'Account eipo kale:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMsg(null);
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>{translate('Switch to Sign In', 'Ingileni')}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* If error is 'incorrect password', offer instant reset or preset login */}
                {errorMsg.toLowerCase().includes('incorrect password') && (
                  <div className="pt-2 border-t border-red-800/60 space-y-1.5">
                    <div className="text-[11px] text-red-300">
                      {translate('Forgot your password? Reset or sign in with default credentials:', 'Mwalaba password? Cenjeni pano:')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={async () => {
                          setPassword('password123');
                          await resetPassword(email || 'lewismusengo19@gmail.com', 'password123');
                          await login(email || 'lewismusengo19@gmail.com', 'password123');
                          setShowAuthModal(false);
                        }}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        {translate('Reset to "password123" & Sign In', 'Bikeni "password123" & Ingileni')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('reset');
                          setErrorMsg(null);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        {translate('Set New Password', 'Cenjeni')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Full Name', 'Ishina Lyenu')}
                  </label>
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lewis Musengo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {translate('Email Address', 'Email Yenu')}
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lewismusengo19@gmail.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {authMode === 'reset' 
                    ? translate('New Password (min 4 characters)', 'Password Ipya') 
                    : translate('Password', 'Ishiwi lya Kufisa')}
                </label>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {authMode === 'login' && (
                  <div className="flex justify-between items-center mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('reset');
                        setErrorMsg(null);
                      }}
                      className="text-xs text-green-400 hover:underline cursor-pointer"
                    >
                      {translate('Forgot Password?', 'Mwalaba Password?')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('lewismusengo19@gmail.com');
                        setPassword('password123');
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {translate('Use Admin credentials', 'Bomfyeni ifya Admin')}
                    </button>
                  </div>
                )}
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                    {translate('Account Role', 'Efyo Account Icita')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('learner')}
                      className={`py-2 px-3 text-xs rounded-lg font-bold border cursor-pointer text-center ${
                        regRole === 'learner'
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {translate('Learner/Student', 'Kasambilila')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('admin')}
                      className={`py-2 px-3 text-xs rounded-lg font-bold border cursor-pointer text-center ${
                        regRole === 'admin'
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {translate('Administrator', 'Kakotolola (Admin)')}
                    </button>
                  </div>
                </div>
              )}

              {/* Password strength meter */}
              {(authMode === 'register' || authMode === 'reset') && password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{translate('Password Security Strength', 'Ukukosha kwa Password')}:</span>
                    <span className={password.length < 6 ? 'text-red-400' : password.length < 10 ? 'text-yellow-400' : 'text-green-400'}>
                      {password.length < 6 ? translate('Weak', 'Taikwete Amaka') : password.length < 10 ? translate('Medium', 'Nailinga') : translate('Strong', 'Naikosa bwino')}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      password.length < 6 ? 'bg-red-500 w-1/3' : password.length < 10 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                    }`}></div>
                  </div>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={authLoading}
                className={`w-full py-2.5 rounded-lg font-bold text-sm cursor-pointer flex items-center justify-center space-x-2 transition-all ${
                  highContrast 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                    : authMode === 'register'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow'
                      : authMode === 'reset'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                        : 'bg-green-600 hover:bg-green-500 text-white shadow'
                }`}
              >
                <span>
                  {authLoading 
                    ? translate('Processing...', 'Cilebombelapo...') 
                    : authMode === 'register' 
                      ? translate('Register Account', 'Pangeni Account') 
                      : authMode === 'reset'
                        ? translate('Set New Password & Sign In', 'Cenjeni & Ingileni')
                        : translate('Sign In Securely', 'Ingileni')}
                </span>
              </button>
            </form>

            {/* Quick 1-Click Demo Login Bar */}
            <div className="border-t border-slate-800 mt-5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>{translate('1-Click Demo Sign-in', 'Ukwingila kwa Bwangu')}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="quick-login-admin"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={authLoading}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-orange-950/60 border border-slate-700 hover:border-orange-500/60 text-orange-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                  title="Sign in as Admin Lewis Musengo"
                >
                  <Shield className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">Admin (Lewis)</span>
                </button>
                <button
                  type="button"
                  id="quick-login-learner"
                  onClick={() => handleQuickLogin('learner')}
                  disabled={authLoading}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-green-950/60 border border-slate-700 hover:border-green-500/60 text-green-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                  title="Sign in as Learner Chanda Mulenga"
                >
                  <UserIcon className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  <span className="truncate">Learner Demo</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )}
  </>
  );
};
