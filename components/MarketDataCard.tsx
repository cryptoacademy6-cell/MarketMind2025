import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import type { MarketData, Language } from '../types';
import { UI_TEXT } from '../constants';

interface MarketDataCardProps {
  data: MarketData;
  assetName: string;
  language: Language;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value);
}

const formatNumber = (value: number) => {
    // Format with commas and no decimal places
    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
    // Abbreviate to B for billion, M for million, K for thousand
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${formatted}`;
}


export const MarketDataCard: React.FC<MarketDataCardProps> = ({ data, assetName, language }) => {
    const { currentPrice, priceChange, priceChangePercentage, high24h, low24h, marketCap, volume24h, historicalData, dataFreshness } = data;
    const isPositive = priceChange >= 0;
    const priceChangeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const chartStrokeColor = isPositive ? '#4ade80' : '#f87171';

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        {(assetName || 'Analysis').toUpperCase()} - {UI_TEXT[language].marketData}
                    </h2>
                     {dataFreshness && (
                        <div className="mt-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-md inline-block">
                            <span className="font-semibold">{UI_TEXT[language].dataFreshness}:</span> {dataFreshness}
                        </div>
                    )}
                    <p className="text-4xl font-bold text-white mt-2">{formatCurrency(currentPrice)}</p>
                    <div className={`flex items-center gap-2 mt-1 font-semibold ${priceChangeColor}`}>
                        <span>{isPositive ? '▲' : '▼'}</span>
                        <span>{formatCurrency(priceChange)} ({priceChangePercentage.toFixed(2)}%)</span>
                        <span className="text-gray-400 text-sm">({UI_TEXT[language].priceChange24h})</span>
                    </div>
                </div>
                <div className="w-full md:w-1/3 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <Tooltip
                                contentStyle={{
                                    background: '#1f2937',
                                    border: '1px solid #4b5563',
                                    borderRadius: '0.5rem',
                                }}
                                itemStyle={{ color: chartStrokeColor }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: any) => [formatCurrency(value), null]}
                            />
                            <Line type="monotone" dataKey="price" stroke={chartStrokeColor} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-700">
                <div>
                    <p className="text-sm text-gray-400">{UI_TEXT[language].high24h}</p>
                    <p className="font-semibold text-white">{high24h > 0 ? formatCurrency(high24h) : '--'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">{UI_TEXT[language].low24h}</p>
                    <p className="font-semibold text-white">{low24h > 0 ? formatCurrency(low24h) : '--'}</p>
                </div>
                {marketCap && (
                    <div>
                        <p className="text-sm text-gray-400">{UI_TEXT[language].marketCap}</p>
                        <p className="font-semibold text-white">{formatNumber(marketCap)}</p>
                    </div>
                )}
                {volume24h && (
                    <div>
                        <p className="text-sm text-gray-400">{UI_TEXT[language].volume24h}</p>
                        <p className="font-semibold text-white">{formatNumber(volume24h)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};