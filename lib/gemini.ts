import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateInterviewQuestions(
  role: string,
  type: string,
  experience: string,
  technologies: string,
  questionCount: number
) {
  const prompt = `Generate ${questionCount} interview questions for a ${experience}-level ${role} position. 
  The interview should be of type: ${type}. 
  Focus on these technologies: ${technologies}.
  Format the response as a JSON array of objects, each with "question" and "type" fields.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error("Failed to parse questions", error);
    throw error;
  }
}

export async function generateFeedback(
  question: string,
  answer: string,
  role: string
) {
  const prompt = `
    You are an expert interviewer for ${role} positions.
    
    Question: ${question}
    
    Candidate's Answer: ${answer}
    
    Provide feedback on the answer, including:
    1. Strengths (what was good about the answer)
    2. Areas for improvement
    3. A score from 1-10
    4. Additional tips or advice
    
    Format your response as a JSON object with these keys: strengths, improvements, score, tips
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const feedback = JSON.parse(jsonMatch[0]);
    return feedback;
  } catch (error) {
    console.error("Failed to parse feedback", error);
    throw error;
  }
} 