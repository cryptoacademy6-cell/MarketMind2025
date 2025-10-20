
import React, { useState, useRef } from 'react';
import type { Language } from '../types';
import { UI_TEXT } from '../constants';

interface SearchFormProps {
  onAnalyze: (asset: string, image?: File) => void;
  isLoading: boolean;
  language: Language;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onAnalyze, isLoading, language }) => {
  const [asset, setAsset] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (asset.trim() || image) {
      onAnalyze(asset.trim(), image || undefined);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearImage = () => {
      setImage(null);
      setImageName('');
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            placeholder={UI_TEXT[language].searchPlaceholder}
            className="w-full bg-gray-700 text-white placeholder-gray-400 border-2 border-transparent focus:border-blue-500 focus:ring-0 rounded-lg py-3 px-4 text-lg transition-colors duration-200"
            disabled={isLoading}
          />
        </div>

        <div className="text-center my-4 text-gray-400">{UI_TEXT[language].uploadButton}</div>

        <div className="flex items-center justify-center">
            {!imageName ? (
            <button
                type="button"
                onClick={handleUploadClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span>{UI_TEXT[language].uploadButton}</span>
            </button>
            ) : (
             <div className="w-full flex justify-between items-center bg-gray-700 text-green-400 font-mono py-3 px-4 rounded-lg">
                <span>{imageName}</span>
                <button type="button" onClick={clearImage} disabled={isLoading} className="text-red-400 hover:text-red-300">&times;</button>
            </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                disabled={isLoading}
            />
        </div>

        <button
          type="submit"
          disabled={isLoading || (!asset.trim() && !image)}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
        >
          {isLoading ? UI_TEXT[language].analyzing : UI_TEXT[language].analyzeButton}
        </button>
      </form>
    </div>
  );
};
