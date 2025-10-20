
import React from 'react';
import type { NewsItem, Language } from '../types';
import { UI_TEXT } from '../constants';

interface NewsCardProps {
  newsItems: NewsItem[];
  language: Language;
}

export const NewsCard: React.FC<NewsCardProps> = ({ newsItems, language }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        {UI_TEXT[language].latestNews}
      </h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {newsItems.map((item, index) => (
          <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-white">{item.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{item.summary}</p>
            <div className="mt-2 text-xs">
              <span className="text-gray-500">{UI_TEXT[language].source}: </span>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {item.source}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
