import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Array of models to try in order of preference
const GEMINI_MODELS = [
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
  "gemini-1.0-pro-latest"
];

// This function tries to find a working model
async function findWorkingModel() {
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test the model with a simple prompt
      const result = await model.generateContent("Hello");
      console.log(`Successfully connected to Gemini model: ${modelName}`);
      return model;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Model ${modelName} not available or failed: ${errorMessage}`);
      // Continue to the next model
    }
  }
  
  // If all models fail, throw an error
  throw new Error("No available Gemini models found. Please check your API key and try again.");
}

// Initialize with the default model, but findWorkingModel will be called when needed
let model = genAI.getGenerativeModel({ model: GEMINI_MODELS[0] });
let modelInitialized = false;

export async function generateInterviewQuestions(
  role: string,
  type: string,
  experience: string,
  technologies: string,
  questionCount: number
) {
  // Initialize the model if it hasn't been done yet
  if (!modelInitialized) {
    try {
      model = await findWorkingModel();
      modelInitialized = true;
    } catch (error: unknown) {
      console.error("Failed to initialize Gemini model:", error);
      throw error;
    }
  }

  const prompt = `Generate ${questionCount} interview questions for a ${experience}-level ${role} position. 
  The interview should be of type: ${type}. 
  Focus on these technologies: ${technologies}.
  Format the response as a JSON array of objects, each with "question" and "type" fields.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error: unknown) {
    console.error("Failed to generate interview questions:", error);
    throw error;
  }
}

export async function generateFeedback(
  question: string,
  answer: string,
  role: string
) {
  // Initialize the model if it hasn't been done yet
  if (!modelInitialized) {
    try {
      model = await findWorkingModel();
      modelInitialized = true;
    } catch (error: unknown) {
      console.error("Failed to initialize Gemini model:", error);
      throw error;
    }
  }
  
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const feedback = JSON.parse(jsonMatch[0]);
    return feedback;
  } catch (error: unknown) {
    console.error("Failed to generate feedback:", error);
    throw error;
  }
} 