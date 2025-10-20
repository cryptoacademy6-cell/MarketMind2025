
import React from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface LoadingSpinnerProps {
    language: Language;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ language }) => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300">{UI_TEXT[language].analyzing}</p>
    </div>
  );
};
