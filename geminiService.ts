import { GoogleGenAI, FunctionDeclaration, Part, GenerateContentResponse, Tool } from '@google/genai';
// FIX: The ChatMessage type is defined locally in `../types` and is not exported from the `@google/genai` package.
import { ChatMessage } from '../types';

// --- ملاحظة أمنية ---
// هذا الملف يتعامل مع جميع التفاعلات مع Google Gemini API.
// يتم الحصول على مفتاح API من متغيرات البيئة.
// في بيئة الإنتاج (مثل Vercel, Netlify, etc.)، يجب تحويل هذا الملف
// إلى دالة serverless (API route) لضمان
// عدم كشف مفتاح API للمتصفح من جانب العميل.
// سيقوم الواجهة الأمامية بعد ذلك باستدعاء هذه الدالة بدلاً من استخدام هذه الخدمة مباشرة.

// هذا هو مفتاح API الذي ستحتاج إلى إضافته في إعدادات Vercel
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const isAIAvailable = (): boolean => {
  return !!ai;
};

// دالة عامة لجميع محادثات الذكاء الاصطناعي
export const runAIChat = async (
  history: ChatMessage[],
  systemInstruction: string,
  tools: Tool[],
  toolImplementations: { [key:string]: (...args: any[]) => any }
): Promise<GenerateContentResponse> => {
  if (!ai) {
    throw new Error('AI service is not available. API_KEY is missing.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: history.map(msg => ({ role: msg.role, parts: msg.parts })),
    config: {
      systemInstruction,
      tools,
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const fc = response.functionCalls[0];
    const implementation = toolImplementations[fc.name];
    
    if (implementation) {
      const functionResult = implementation(fc.args);

      const toolResponseHistory: ChatMessage[] = [
        ...history,
        { role: 'model', parts: [{ functionCall: fc }] },
        { role: 'user', parts: [{ functionResponse: { name: fc.name, response: functionResult } }] }
      ];

      // استدعاء النموذج مرة أخرى مع استجابة الأداة
      const secondResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: toolResponseHistory.map(msg => ({ role: msg.role, parts: msg.parts })),
        config: { systemInstruction }, // ملاحظة: الاستدعاء الثاني لا يحتاج إلى أدوات
      });

      return secondResponse;
    }
  }

  return response;
};
