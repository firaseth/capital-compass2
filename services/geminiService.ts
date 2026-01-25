
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
      contents: `Context: 4-Quadrant Matrix State: ${financialState}
User Inquiry: ${userPrompt}

Specific Task:
1. Analyze the creator's current stability.
2. If risks are present, output a 'STABILIZATION PLAN' instead of a warning.
3. Reference the integrity of the SHA-256 hash in your reasoning.
4. Maintain a supportive yet risk-averse professional tone.`,
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
      text: "Verification interrupted. I'm having trouble accessing my core underwriting engine. Please re-verify your SHA-256 credentials.",
      sources: []
    };
  }
};

export const analyzeVideo = async (videoBase64: string, prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'video/mp4',
            data: videoBase64,
          },
        },
        { text: prompt },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Video Analysis Error:", error);
    return "Error analyzing video. Ensure the file is a valid MP4 and under limits.";
  }
};
