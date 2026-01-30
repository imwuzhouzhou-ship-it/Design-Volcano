
import { GoogleGenAI, Type } from "@google/genai";

// Use API key directly from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMetricInterpretation(fieldName: string, tableContext: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一个资深数据仓库工程师。请根据字段名 "${fieldName}" 及其所属表 "${tableContext}" 的上下文，生成一段专业且易懂的指标解释。
      要求：
      1. 提供详细版解释（包含口径说明）。
      2. 提供精简版解释（一句话总结）。
      3. 风格专业，符合业务逻辑。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailed: { type: Type.STRING, description: '详细版解释' },
            brief: { type: Type.STRING, description: '精简版解释' }
          },
          required: ['detailed', 'brief']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback if API fails or no key
    return {
      detailed: `[自动生成] 关于 ${fieldName} 的详细业务口径解释...`,
      brief: `[自动生成] ${fieldName} 业务含义精简总结。`
    };
  }
}
