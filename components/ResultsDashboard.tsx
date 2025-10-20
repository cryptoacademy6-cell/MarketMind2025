import React from 'react';
import type { AnalysisReport, Language } from '../types';
import { UI_TEXT } from '../constants';
import { SummaryCard } from './SummaryCard';
import { NewsCard } from './NewsCard';
import { SentimentCard } from './SentimentCard';
import { TechnicalAnalysisCard } from './TechnicalAnalysisCard';
import { PriceActionCard } from './PriceActionCard';
import { MarketDataCard } from './MarketDataCard';

interface ResultsDashboardProps {
  report: AnalysisReport;
  language: Language;
  assetName: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  isCooldown: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report, language, assetName, onRefresh, isRefreshing, isCooldown }) => {
    
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-content" className="mt-12 animate-fade-in">
        <div className="flex justify-end gap-4 mb-4">
             <button
                onClick={onRefresh}
                disabled={isRefreshing || isCooldown}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                title={isCooldown ? 'Please wait before refreshing' : ''}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>{isRefreshing ? UI_TEXT[language].analyzing : UI_TEXT[language].refreshButton}</span>
            </button>
             <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                <span>{UI_TEXT[language].printReport}</span>
            </button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {report.marketData && (
          <div className="lg:col-span-4">
            <MarketDataCard data={report.marketData} assetName={assetName} language={language} />
          </div>
        )}
        <div className="lg:col-span-4">
          <SummaryCard 
            summary={report.executiveSummary} 
            confidence={report.confidenceScore} 
            language={language} 
          />
        </div>
        <div className="lg:col-span-3">
            <NewsCard newsItems={report.news} language={language} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
             <SentimentCard data={report.sentimentAnalysis} language={language} />
        </div>
        <div className="lg:col-span-2">
           <TechnicalAnalysisCard analysis={report.technicalAnalysis} language={language} />
        </div>
        <div className="lg:col-span-2">
            <PriceActionCard reasons={report.priceActionReasons} language={language} />
        </div>
      </div>
    </div>
  );
};