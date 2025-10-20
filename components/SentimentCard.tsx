
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { SentimentData, Language } from '../types';
import { UI_TEXT } from '../constants';

interface SentimentCardProps {
  data: SentimentData;
  language: Language;
}

const COLORS = {
  positive: '#22c55e', // green-500
  neutral: '#60a5fa',  // blue-400
  negative: '#f87171', // red-400
};

// A custom tooltip component to apply color to the text
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 px-3 text-sm shadow-lg">
        <p style={{ color: data.payload.color }}>
          {`${data.name}: ${data.value}%`}
        </p>
      </div>
    );
  }
  return null;
};


export const SentimentCard: React.FC<SentimentCardProps> = ({ data, language }) => {
  const chartData = [
    { name: UI_TEXT[language].positive, value: data.positive, color: COLORS.positive },
    { name: UI_TEXT[language].neutral, value: data.neutral, color: COLORS.neutral },
    { name: UI_TEXT[language].negative, value: data.negative, color: COLORS.negative },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        {UI_TEXT[language].sentimentAnalysis}
      </h2>
      
      <div className="w-full h-48 mb-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
               {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}
            />
             <Legend wrapperStyle={{ fontSize: '14px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-300 mb-2">{UI_TEXT[language].trendingKeywords}</h3>
        <div className="flex flex-wrap gap-2">
          {data.trendingKeywords.map((keyword, index) => (
            <span key={index} className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
