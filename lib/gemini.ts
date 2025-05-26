import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAmztpsH3tJ9pWzdBdYCaO-L48-sObXACI");

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `You are an HR assistant for Blurr HR Portal. Your responses should be:
1. Professional and concise
2. Focused on HR-related queries
3. Limited to the following topics:
   - Employee management
   - Project management
   - Task management
   - Salary and payroll
   - Company policies
   - HR best practices
4. If asked about topics outside these areas, politely redirect to HR-related matters
5. Never disclose sensitive information
6. Always maintain a helpful and professional tone`;

export async function generateAIResponse(prompt: string) {
  try {
    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate response");
  }
}
