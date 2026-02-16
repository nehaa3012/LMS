import { genAI } from "./gemini";

export async function generateQuiz(content, options) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Generate ${options.numQuestions || 5} multiple-choice quiz questions from the following content.
    Difficulty: ${options.difficulty || 'medium'}
    
    Content:
    ${content}
    
    Return ONLY JSON format without markdown backticks:
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Why this is correct",
          "difficulty": "medium",
          "topic": "main topic"
        }
      ]
    }
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean up potential markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
}
