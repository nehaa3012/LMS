import { genAI } from "./gemini";
import { prisma } from "../db";

export async function getRecommendations(userId, completedCourseId) {
    // 1. Get user profile
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            enrollments: {
                include: { course: true }
            }
        }
    });

    const completedCourse = await prisma.course.findUnique({
        where: { id: completedCourseId }
    });

    // 2. Get other available courses
    const allCourses = await prisma.course.findMany({
        where: {
            isPublished: true,
            id: { not: completedCourseId }
        },
        take: 10
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    User just completed: "${completedCourse.title}" (${completedCourse.category}, ${completedCourse.level})
    
    User's Interests: ${user.interests.join(', ')}
    Other Completed Courses: ${user.enrollments.filter(e => e.status === 'COMPLETED').map(e => e.course.title).join(', ')}
    
    Available courses for recommendation:
    ${JSON.stringify(allCourses.map(c => ({ id: c.id, title: c.title, category: c.category, level: c.level, description: c.description })))}
    
    Recommend 3 courses that would be good next steps based on what they just finished and their interests.
    
    Return ONLY JSON format without markdown backticks:
    {
      "recommendations": [
        { "courseId": "ID_HERE", "reason": "why this course", "relevanceScore": 85 }
      ]
    }
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
}
