import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Languages, Type, Eye, LogIn, LogOut, User as UserIcon, X, Menu, Settings } from 'lucide-react';

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
    errorMsg,
    setErrorMsg,
    translate
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regRole, setRegRole] = useState<'admin' | 'learner'>('learner');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      if (isRegistering) {
        await register(email, password, name, regRole);
      } else {
        await login(email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email) {
      setErrorMsg(translate('Please enter your email address first.', 'Sambilisheni inshila yenu iya email intanshi.'));
      return;
    }
    await resetPassword(email);
  };

  const menuItems = [
    { id: 'home', en: 'Home', bm: 'Icalo' },
    { id: 'learn', en: 'Learn', bm: 'Sambilila' },
    { id: 'gallery', en: 'Infographics', bm: 'Ifipope' },
    { id: 'quizzes', en: 'Quizzes', bm: 'Ifyayako' },
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
              title={translate('Switch to Bemba', 'Kutula ku Cingeleshi')}
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
                title={translate('Accessibility settings', 'Fya kucinsha imisungile')}
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
                    <span className="text-xs">{translate('High Contrast', 'Imitambulo iyakosa')}</span>
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
                  title={translate('Logout', 'Ingilamo ku nse')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={() => {
                  setIsRegistering(false);
                  setShowAuthModal(true);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                  highContrast 
                    ? 'bg-yellow-400 text-black font-black hover:bg-yellow-300' 
                    : 'bg-green-600 text-white hover:bg-green-500 shadow'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>{translate('Sign In', 'Kwingila')}</span>
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
              {translate('Admin Portal', 'Ifisambilisho Fya Admin')}
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
              <span>{translate('Contrast', 'Amakosa')}</span>
            </button>

            <button
              id="text-size-toggle-mobile"
              onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
              className={`p-2 rounded border text-xs flex items-center space-x-1 ${
                textSize === 'large' ? 'bg-green-600 text-white border-green-600' : 'border-slate-700 text-slate-300'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>{translate('Large Text', 'Ifikalamba')}</span>
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
                  {translate('Logout', 'Ingilamo ku nse')}
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-mobile"
                onClick={() => {
                  setIsRegistering(false);
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-center py-2.5 rounded font-bold text-sm cursor-pointer ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'
                }`}
              >
                {translate('Sign In', 'Kwingila')}
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
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <Shield className={`h-12 w-12 mx-auto mb-2 ${highContrast ? 'text-yellow-400' : 'text-green-500'}`} />
              <h3 className="text-2xl font-bold tracking-tight">
                {isRegistering 
                  ? translate('Create Account', 'Pangila Account Mpya') 
                  : translate('Welcome Back', 'Ingileni Mukati')}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {isRegistering 
                  ? translate('Learn and secure your online presence.', 'Sambilileni pa kuicingilila bwino.') 
                  : translate('Sign in to resume lessons and track quiz performance.', 'Ingileni mwasanguka ifisambilisho.')}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-550/25 border border-red-500 text-red-200 text-xs px-3 py-2 rounded mb-4 font-mono whitespace-pre-line">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegistering && (
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
                  {translate('Email Address', 'Inshila ya Email')}
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
                  {translate('Password', 'Ishiwi lya Kufisa')}
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
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={handleResetRequest}
                    className="text-xs text-green-400 hover:underline mt-1 block cursor-pointer"
                  >
                    {translate('Forgot Password?', 'Mwalaba ishiwi lya kufisa?')}
                  </button>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                    {translate('Account Role', 'Icipande ca Account')}
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
                      {translate('Learner/Student', 'Uusambilila')}
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
                      {translate('Administrator', 'Kangilila (Admin)')}
                    </button>
                  </div>
                </div>
              )}

              {/* Password strength meter hint for security */}
              {isRegistering && password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{translate('Password Security Strength', 'Amakosa ya Password')}:</span>
                    <span className={password.length < 6 ? 'text-red-400' : password.length < 10 ? 'text-yellow-400' : 'text-green-400'}>
                      {password.length < 6 ? translate('Weak', 'Ayasakana') : password.length < 10 ? translate('Medium', 'Ilingene') : translate('Strong', 'Iyakosa sana')}
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
                    : isRegistering
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow'
                      : 'bg-green-600 hover:bg-green-500 text-white shadow'
                }`}
              >
                <span>
                  {authLoading 
                    ? translate('Processing...', 'Cilebombako...') 
                    : isRegistering 
                      ? translate('Register Now', 'Pangila Account') 
                      : translate('Sign In Securely', 'Ingila lolesha')}
                </span>
              </button>
            </form>

            <div className="border-t border-slate-800 mt-5 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer hover:underline"
              >
                {isRegistering 
                  ? translate('Already have an account? Sign In', 'Mwalikwata kale account? Ingileni') 
                  : translate("Don't have an account? Sign Up", "Tamwakwata account? Pangileni imoneka")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
