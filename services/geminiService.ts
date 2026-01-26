
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGuardianAdvice = async (
  userPrompt: string, 
  financialState: string, 
  options: { useSearch?: boolean; useThinking?: boolean } = {}
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = options.useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    const config: any = {
      systemInstruction: "You are the Capital Compass Guardian. Your goal is to monitor financial and social data for creators. You must be supportive, professional, and risk-averse. Never give direct investment advice. Always reference data veracity and SHA-256 hashes. If a risk is detected, provide a stabilization plan instead of a warning.",
      temperature: options.useThinking ? 1 : 0.4,
    };

    if (options.useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    if (options.useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { 
        parts: [{ 
          text: `Context: 4-Quadrant Matrix State: ${financialState}
User Inquiry: ${userPrompt}
Specific Task:
1. Analyze the creator's current stability.
2. If risks are present, output a 'STABILIZATION PLAN' instead of a warning.
3. Reference the integrity of the SHA-256 hash in your reasoning.
4. Maintain a supportive yet risk-averse professional tone.`
        }]
      },
      config
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      text: response.text || "No response generated.",
      sources: sources || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "Verification interrupted. Core underwriting engines are unresponsive.",
      sources: []
    };
  }
};

export const generateFeasibilityReport = async (matrixState: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{
          text: `Generate a professional, institutional-grade Feasibility Study Executive Summary based on this Capital Matrix:
${matrixState}

Structure the report with:
1. OVERALL FEASIBILITY SCORE (Out of 1000)
2. KEY RISK VECTORS
3. RECOMMENDED UNDERWRITING STRATEGY
4. GO / NO-GO VERDICT (Be professional but firm)

Maintain a high-end financial tone. Include SHA-256 integrity reminders.`
        }]
      },
      config: { 
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Report generation failed", error);
    return "Error generating institutional report. Please retry.";
  }
};

export const analyzeVideo = async (videoBase64: string, prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'video/mp4', data: videoBase64 } },
          { text: prompt },
        ]
      },
    });
    return response.text;
  } catch (error) {
    console.error("Video Analysis Error:", error);
    return "Error analyzing video asset. The model was unable to process the multi-modal buffer.";
  }
};
