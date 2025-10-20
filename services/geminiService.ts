import { GoogleGenAI } from "@google/genai";
import type { AnalysisReport, Language } from '../types';

const jsonSchemaDescription = `{
  "marketData": {
    "currentPrice": "number - The current market price in USD.",
    "priceChange": "number - The price change in the last 24 hours in USD.",
    "priceChangePercentage": "number - The percentage price change in the last 24 hours.",
    "high24h": "number - The highest price in the last 24 hours.",
    "low24h": "number - The lowest price in the last 24 hours.",
    "marketCap": "number | null - The market capitalization in USD.",
    "volume24h": "number | null - The 24-hour trading volume in USD.",
    "historicalData": "Array<{ time: string, price: number }> - An array of 24 hourly price points for the last 24 hours.",
    "dataFreshness": "string | null - A brief description of the data's age, e.g., 'Live', 'Delayed 15 minutes'. If data is real-time, this can be null."
  },
  "executiveSummary": "string - A short summary of the asset's current situation.",
  "news": "Array<{ title: string, source: string, link: string, summary: string }> - An array of 3-5 recent, relevant news articles.",
  "sentimentAnalysis": {
    "positive": "number - Percentage of positive sentiment (0-100).",
    "negative": "number - Percentage of negative sentiment (0-100).",
    "neutral": "number - Percentage of neutral sentiment (0-100).",
    "trendingKeywords": "Array<string> - An array of 3-5 trending keywords."
  },
  "technicalAnalysis": "string - A simplified technical analysis.",
  "priceActionReasons": "string - A bulleted or numbered list of likely reasons for recent price movement.",
  "confidenceScore": "number - A score from 0 to 100 representing confidence in the analysis."
}`;

export const getFinancialAnalysis = async (assetName: string, language: Language, imageBase64?: string): Promise<AnalysisReport> => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const langInstruction = language === 'ar' 
        ? "All text output, including summaries and analyses, must be in clear, simple Arabic."
        : "All text output, including summaries and analyses, must be in English.";

    const prompt = `
        You are an expert financial analyst AI. Your task is to provide a comprehensive, real-time analysis of a financial asset.
        
        Asset: "${assetName}"

        Instructions:
        1.  **Use Search Tool for Live Data from Primary Sources**: This is your most critical instruction. You MUST use the provided Google Search tool to find real-time, live market data. Your primary and preferred sources for all market data (prices, volume, market cap, etc.) and news MUST be Yahoo Finance (https://finance.yahoo.com) and TradingView (https://ar.tradingview.com/). Prioritize these two sources above all others. Crucially, you must always return valid, non-zero numbers for \`high24h\` and \`low24h\` for any active asset.
        2.  **Analyze News via Search from Primary Sources**: Use the search tool to find the latest, most relevant news. Your primary sources MUST be Yahoo Finance (finance.yahoo.com) and TradingView (https://ar.tradingview.com/).
        3.  **Analyze Social Media Sentiment**: Use the search tool to analyze recent discussions on platforms like X (Twitter) and Reddit to gauge public sentiment.
        4.  **Data Freshness**: If you cannot find live data on Yahoo Finance or TradingView, find the most recent data available from them and report its age in the 'dataFreshness' field (e.g., 'Delayed 15 minutes').
        5.  **Technical Analysis**: If an image is provided, analyze it. If not, perform a general technical analysis based on the price data found via search.
        6.  **Identify Price Drivers**: Synthesize all gathered information to determine the most likely reasons for the asset's recent price movements.
        7.  **Language**: ${langInstruction}
        8.  **Output Format**: You MUST return your response as a single, valid JSON object and nothing else. Do not include any text, markdown formatting (like \`\`\`json), or explanations outside of the JSON object. The JSON object must strictly conform to the following structure:
            ${jsonSchemaDescription}
    `;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
            },
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
            config: {
                tools: [{googleSearch: {}}],
                temperature: 0.2,
            },
        });
        
        const text = response.text;
        let parsedJson;

        try {
            // Find the start and end of the JSON object to handle cases where the model returns markdown
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}');

            if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
                console.error("Invalid response format, couldn't find JSON:", text);
                throw new Error("Could not find a valid JSON object in the model's response.");
            }
            const jsonText = text.substring(jsonStart, jsonEnd + 1);
            parsedJson = JSON.parse(jsonText);
        } catch (jsonError) {
             console.error("Failed to parse JSON:", jsonError, "Raw text:", text);
             throw new Error(`JSON_PARSE_ERROR: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
        }

        // Robust validation and normalization to prevent crashes from malformed API responses
        const validatedReport: AnalysisReport = {
            executiveSummary: parsedJson.executiveSummary || '',
            news: Array.isArray(parsedJson.news) ? parsedJson.news : [],
            sentimentAnalysis: {
                positive: parsedJson.sentimentAnalysis?.positive ?? 0,
                negative: parsedJson.sentimentAnalysis?.negative ?? 0,
                neutral: parsedJson.sentimentAnalysis?.neutral ?? 0,
                trendingKeywords: Array.isArray(parsedJson.sentimentAnalysis?.trendingKeywords) 
                    ? parsedJson.sentimentAnalysis.trendingKeywords 
                    : [],
            },
            technicalAnalysis: parsedJson.technicalAnalysis || '',
            priceActionReasons: parsedJson.priceActionReasons || '',
            confidenceScore: parsedJson.confidenceScore ?? 50,
            marketData: {
                currentPrice: parsedJson.marketData?.currentPrice ?? 0,
                priceChange: parsedJson.marketData?.priceChange ?? 0,
                priceChangePercentage: parsedJson.marketData?.priceChangePercentage ?? 0,
                high24h: parsedJson.marketData?.high24h ?? 0,
                low24h: parsedJson.marketData?.low24h ?? 0,
                marketCap: parsedJson.marketData?.marketCap,
                volume24h: parsedJson.marketData?.volume24h,
                historicalData: Array.isArray(parsedJson.marketData?.historicalData) 
                    ? parsedJson.marketData.historicalData 
                    : [],
                dataFreshness: parsedJson.marketData?.dataFreshness,
            },
        };
        
        if (validatedReport.marketData.historicalData.length === 0 && validatedReport.marketData.currentPrice > 0) {
            validatedReport.marketData.historicalData.push({ time: 'now', price: validatedReport.marketData.currentPrice });
        }
        
        if (!validatedReport.executiveSummary || !validatedReport.marketData) {
             throw new Error("JSON_PARSE_ERROR: Invalid JSON structure received from API: missing essential fields.");
        }

        return validatedReport;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("429")) {
                throw new Error("API_QUOTA_EXHAUSTED");
            }
            // re-throw parsing errors to be handled by UI
            if (error.message.startsWith('JSON_PARSE_ERROR')) {
                throw error;
            }
        }
        throw new Error("Failed to get financial analysis from the AI model.");
    }
};