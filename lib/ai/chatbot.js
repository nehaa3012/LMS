import { genAI } from "./gemini";

export async function getChatbotResponse(message, context) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `
    You are an AI tutor helping students learn ${context.courseTitle || 'various subjects'}.
    Be helpful, encouraging, and break down complex topics.
    Use the lesson content as reference when available.
    
    ${context.lessonContent ? `Current lesson context:\n${context.lessonContent}` : ''}
  `;

    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ... (context.chatHistory || []).map(msg => ({
                role: msg.role === 'USER' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        ]
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
}
