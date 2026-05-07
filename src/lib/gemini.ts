import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateLessonContent(topic: string, level: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explanatiom for ${topic} at ${level} level. 
    Format as JSON: { "title": string, "content": markdownString, "exercise": { "prompt": string, "type": "code" | "multiple_choice", "options"?: string[], "correctAnswer": string } }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          exercise: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING },
              type: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING }
            },
            required: ["prompt", "type", "correctAnswer"]
          }
        },
        required: ["title", "content", "exercise"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function evaluateCode(code: string, problem: string, language: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Problem: ${problem}\nLanguage: ${language}\nCode to evaluate:\n${code}\n\nAssess if the code is correct. Provide a score (0-100) and constructive feedback.
    Format as JSON: { "correct": boolean, "score": number, "feedback": string }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correct: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ["correct", "score", "feedback"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
