
import React from 'react';
import { Tab, TFunction, User } from '../types';
import SearchIcon from './icons/SearchIcon';
import HealthInsuranceIcon from './icons/HealthInsuranceIcon';
import ReceiptIcon from './icons/ReceiptIcon';
import CosmeticsIcon from './icons/CosmeticsIcon';
import SettingsIcon from './icons/SettingsIcon';

interface BottomNavBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  t: TFunction;
  user: User | null;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 group ${
        isActive 
          ? 'text-primary dark:text-primary-light' 
          : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'
      }`}
    >
      <div className={`w-6 h-6 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide">
        {label}
      </span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, t, user }) => {
  const navItems = [
    { id: 'search', labelKey: t('navSearch'), icon: <SearchIcon /> },
    { id: 'insurance', labelKey: t('navInsurance'), icon: <HealthInsuranceIcon /> },
    ...(user?.role === 'admin' ? [{ id: 'prescriptions', labelKey: t('navPrescriptions'), icon: <ReceiptIcon /> }] : []),
    { id: 'cosmetics', labelKey: t('navCosmetics'), icon: <CosmeticsIcon /> },
    { id: 'settings', labelKey: t('navSettings'), icon: <SettingsIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-slate-800 shadow-lg z-30 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2">
      <div className="flex justify-around items-center h-14 max-w-2xl mx-auto px-2">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            label={item.labelKey}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id as Tab)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
