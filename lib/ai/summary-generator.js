import { genAI } from "./gemini";

export async function generateSummary(content, maxLength = 500) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Summarize the following content in ${maxLength} characters or less.
    Include key points as bullet points.
    
    Content:
    ${content}
    
    Return ONLY JSON format without markdown backticks:
    {
      "summary": "Brief summary",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
}
