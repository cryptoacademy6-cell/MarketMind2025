import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Footer } from './components/Disclaimer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getFinancialAnalysis } from './services/geminiService';
import type { AnalysisReport, Language } from './types';
import { UI_TEXT } from './constants';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ar');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [lastQuery, setLastQuery] = useState<{ asset: string; image?: string } | null>(null);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
    };
  }, []);

  const performAnalysis = useCallback(async (asset: string, imageBase64?: string) => {
    setIsLoading(true);
    setError(null);
    // Keep stale data while loading new data for a smoother refresh experience
    if (!analysisReport) {
      setAnalysisReport(null);
    }
    
    setLastQuery({ asset, image: imageBase64 });

    try {
      const report = await getFinancialAnalysis(asset, language, imageBase64);
      setAnalysisReport(report);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('API_QUOTA_EXHAUSTED')) {
          setError(UI_TEXT[language].errorApiExhausted);
        } else if (err.message.includes('JSON_PARSE_ERROR')) {
          setError(UI_TEXT[language].errorJson);
        } else {
          setError(UI_TEXT[language].error);
        }
      } else {
        setError(UI_TEXT[language].error);
      }
      console.error(err);
      // Clear old results if the refresh fails
      setAnalysisReport(null); 
    } finally {
      setIsLoading(false);
      // Set cooldown period to prevent spamming
      setIsCooldown(true);
      cooldownTimer.current = setTimeout(() => setIsCooldown(false), 15000); // 15-second cooldown
    }
  }, [language, analysisReport]);


  const handleFormSubmit = useCallback(async (asset: string, image?: File) => {
    let imageBase64: string | undefined = undefined;
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          imageBase64 = (reader.result as string).split(',')[1];
          resolve();
        };
        reader.onerror = (error) => reject(error);
      });
    }
    performAnalysis(asset, imageBase64);
  }, [performAnalysis]);
  
  const handleRefresh = useCallback(() => {
      if (lastQuery && !isCooldown) {
          performAnalysis(lastQuery.asset, lastQuery.image);
      }
  }, [lastQuery, performAnalysis, isCooldown]);


  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
            {UI_TEXT[language].mainTitle}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {UI_TEXT[language].subtitle}
          </p>
        </div>
        
        <SearchForm onAnalyze={handleFormSubmit} isLoading={isLoading} language={language} />

        {isLoading && <LoadingSpinner language={language} />}
        {error && <div className="text-center text-red-400 mt-8 bg-red-900/20 p-4 rounded-lg">{error}</div>}
        
        {analysisReport && lastQuery && (
          <ResultsDashboard 
            report={analysisReport} 
            language={language} 
            assetName={lastQuery.asset}
            onRefresh={handleRefresh}
            isRefreshing={isLoading}
            isCooldown={isCooldown}
          />
        )}
      </main>
      <Footer language={language} />
    </div>
  );
};

export default App;