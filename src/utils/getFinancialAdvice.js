import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured in environment variables");
  }

  try {
    // Use gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log("Generated advice:", response.text());
    return response.text();

  } catch (error) {
    console.error("Error generating financial advice:", error);
    
    if (error.message?.includes("PERMISSION_DENIED")) {
      throw new Error("Invalid API key or API not enabled. Please check your configuration.");
    }
    
    if (error.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("API quota exceeded. Please try again later.");
    }

    throw new Error("Failed to generate financial advice. Please try again later.");
  }
};

export default getFinancialAdvice;