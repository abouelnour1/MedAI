import React, { forwardRef } from 'react';
import BackIcon from './icons/BackIcon';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';
import InstallIcon from './icons/InstallIcon';
import { TFunction, View } from '../types';
import { useAuth } from './auth/AuthContext';
import AdminIcon from './icons/AdminIcon';

interface HeaderProps {
  title: string;
  showBack: boolean;
  onBack: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
  t: TFunction;
  onLoginClick: () => void;
  onAdminClick: () => void;
  view: View;
}

const Header = forwardRef<HTMLElement, HeaderProps>(({ title, showBack, onBack, theme, toggleTheme, showInstallButton, onInstallClick, t, onLoginClick, onAdminClick, view }, ref) => {
  const { user, logout } = useAuth();
  
  return (
    <header ref={ref} className="bg-primary text-white sticky top-0 z-20 flex-shrink-0">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center max-w-7xl">
        <div className="flex-1 flex justify-start">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label={t('back')}
            >
              <span className={document.documentElement.lang === 'en' ? 'inline-block' : 'inline-block transform scale-x-[-1]'}>
                 <BackIcon />
              </span>
            </button>
          )}
        </div>
        
        <h1 className="text-lg font-bold whitespace-nowrap truncate px-2 text-center flex-shrink">
          {title}
        </h1>

        <div className="flex-1 flex justify-end items-center gap-1">
           <button
            onClick={onInstallClick}
            disabled={!showInstallButton}
            className={`p-2 text-white/80 transition-all rounded-full ${
              showInstallButton
                ? 'hover:text-white hover:bg-white/10 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label={showInstallButton ? t('installApp') : t('installNotAvailable')}
            title={showInstallButton ? t('installApp') : t('installNotAvailable')}
          >
            <InstallIcon />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          {user ? (
            <div className="relative group">
                <button className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center gap-2">
                    <span className="font-semibold text-sm">{user.username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-30 divide-y divide-slate-100 dark:divide-slate-700">
                    <div className="px-4 py-2">
                        <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary uppercase">{t('role')}</div>
                        <div className="font-semibold text-sm text-light-text dark:text-dark-text">{user.role === 'admin' ? t('adminRole') : t('premiumRole')}</div>
                    </div>
                    <div className="py-1">
                        {user.role === 'admin' && (
                             <button onClick={onAdminClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-700">{t('adminDashboard')}</button>
                        )}
                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">{t('logout')}</button>
                    </div>
                </div>
            </div>
          ) : (
            <button onClick={onLoginClick} className="px-3 py-1.5 text-sm font-semibold bg-white/20 hover:bg-white/30 rounded-lg transition-colors">{t('login')}</button>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;