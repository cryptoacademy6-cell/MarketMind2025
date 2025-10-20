import React from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm space-y-2">
        <p>{UI_TEXT[language].disclaimer}</p>
        <p>{UI_TEXT[language].footerText}</p>
      </div>
    </footer>
  );
};