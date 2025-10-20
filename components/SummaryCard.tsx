
import React from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface SummaryCardProps {
  summary: string;
  confidence: number;
  language: Language;
}

const ConfidenceMeter: React.FC<{ score: number, language: Language }> = ({ score, language }) => {
    const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="transform -rotate-90" width="120" height="120" viewBox="0 0 100 100">
                <circle className="text-gray-600" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle className={scoreColor} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            </svg>
            <span className={`absolute text-2xl font-bold ${scoreColor}`}>{score}%</span>
        </div>
    );
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, confidence, language }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col md:flex-row items-start gap-6">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          {UI_TEXT[language].executiveSummary}
        </h2>
        <p className="text-gray-300 leading-relaxed">{summary}</p>
      </div>
      <div className="flex flex-col items-center flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
        <h3 className="text-lg font-semibold text-gray-400 mb-2">{UI_TEXT[language].confidenceScore}</h3>
        <ConfidenceMeter score={confidence} language={language} />
      </div>
    </div>
  );
};
