import React from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m12 14 4-2.5"></path><path d="m12 14-4-2.5"></path><path d="m12 14-4 2.5"></path><path d="m12 14 4 2.5"></path><path d="m12 6 4 2.5"></path><path d="m12 6-4 2.5"></path>
            </svg>
            <span className="text-xl font-bold text-white">
              {UI_TEXT[language].title}
            </span>
        </div>
        <button
          onClick={toggleLanguage}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {UI_TEXT[language].languageSwitch}
        </button>
      </div>
    </header>
  );
};