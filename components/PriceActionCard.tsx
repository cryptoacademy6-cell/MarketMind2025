import React from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface PriceActionCardProps {
  reasons: string;
  language: Language;
}

export const PriceActionCard: React.FC<PriceActionCardProps> = ({ reasons, language }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        {UI_TEXT[language].priceActionReasons}
      </h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{reasons}</p>
    </div>
  );
};