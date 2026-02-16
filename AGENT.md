# AI-Powered LMS - Complete Architecture & Flow

## 🎯 Project Overview
A modern, AI-powered Learning Management System built with Next.js 16, featuring intelligent course creation, personalized learning paths, automated assessments, and real-time progress tracking.

---

## 📚 Table of Contents
1. [Tech Stack](#tech-stack)
2. [Quick Start](#quick-start)
3. [Database Schema](#database-schema)
4. [Project Structure](#project-structure)
5. [API Routes](#api-routes)
6. [AI Features Integration](#ai-features-integration)
7. [User Flows](#user-flows)
8. [Component Architecture](#component-architecture)
9. [Key Features Implementation](#key-features-implementation)

---

## 🚀 Quick Start

### **1. Create Next.js 16 Project**
```bash
npx create-next-app@latest ai-lms --no-typescript
cd ai-lms
```

### **2. Install Dependencies**
```bash
# Core dependencies
npm install @clerk/nextjs @prisma/client prisma zod
npm install @google/generative-ai
npm install jspdf qrcode
npm install recharts framer-motion
npm install date-fns clsx tailwind-merge

# Shadcn/ui setup
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea select dialog dropdown-menu
npx shadcn-ui@latest add tabs table badge avatar progress alert tooltip
```

### **3. Setup Prisma**
```bash
npx prisma init
# Copy the schema from below into prisma/schema.prisma
npx prisma generate
npx prisma db push
```

### **4. Configure Environment Variables**
Create `.env.local` with the variables listed in the Environment Variables section below.

### **5. Setup Clerk**
- Create account at https://clerk.com
- Add your Clerk keys to `.env.local`
- Wrap app with `ClerkProvider` in `app/layout.jsx`

### **6. Run Development Server**
```bash
npm run dev
```

### **Optional: Enable Type Checking with JSDoc**
Create `jsconfig.json` (see JavaScript + JSDoc Setup section below)

---

## 🛠 Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (with optional JSDoc for type checking)
- **Authentication**: Clerk
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini API

### UI/UX
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

### Additional Tools
- **File Upload**: uploadthing or AWS S3
- **Real-time**: WebSockets (optional for live leaderboard)
- **Caching**: Redis (optional for performance)

---

## 🗄 Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER MANAGEMENT ====================

model User {
  id            String   @id @default(cuid())
  clerkId       String   @unique
  email         String   @unique
  firstName     String?
  lastName      String?
  imageUrl      String?
  role          UserRole @default(STUDENT)
  
  // Profile
  bio           String?
  skills        String[]
  interests     String[]
  
  // Preferences
  learningGoals String?
  dailyGoal     Int      @default(30) // minutes per day
  
  // Stats
  totalPoints   Int      @default(0)
  streak        Int      @default(0)
  lastActive    DateTime @default(now())
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  createdCourses    Course[]          @relation("CourseInstructor")
  enrollments       Enrollment[]
  progress          Progress[]
  quizAttempts      QuizAttempt[]
  chatSessions      ChatSession[]
  certificates      Certificate[]
  notifications     Notification[]
  achievements      UserAchievement[]
  studySessions     StudySession[]
  
  @@index([clerkId])
  @@index([email])
}

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

// ==================== COURSE MANAGEMENT ====================

model Course {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String   @db.Text
  thumbnail       String?
  category        String
  level           CourseLevel
  language        String   @default("en")
  
  // Instructor
  instructorId    String
  instructor      User     @relation("CourseInstructor", fields: [instructorId], references: [id], onDelete: Cascade)
  
  // Status
  status          CourseStatus @default(DRAFT)
  isPublished     Boolean  @default(false)
  
  // Metadata
  estimatedHours  Float?
  price           Float    @default(0)
  tags            String[]
  
  // AI Generated
  aiSummary       String?  @db.Text
  learningObjectives String[] // AI generated from content
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime?

  // Relations
  modules         Module[]
  enrollments     Enrollment[]
  reviews         Review[]
  certificates    Certificate[]
  
  @@index([instructorId])
  @@index([slug])
  @@index([category])
  @@index([status])
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ==================== COURSE STRUCTURE ====================

model Module {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  title       String
  description String?  @db.Text
  order       Int
  
  // Metadata
  duration    Int?     // in minutes
  isLocked    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  lessons     Lesson[]
  
  @@index([courseId])
  @@index([order])
}

model Lesson {
  id          String      @id @default(cuid())
  moduleId    String
  module      Module      @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  title       String
  description String?     @db.Text
  content     String      @db.Text
  contentType ContentType
  order       Int
  
  // Media
  videoUrl    String?
  attachments String[]
  
  // Metadata
  duration    Int?        // in minutes
  isPreview   Boolean     @default(false)
  
  // AI Generated Content
  aiSummary   String?     @db.Text
  keyPoints   String[]
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  progress    Progress[]
  quizzes     Quiz[]
  
  @@index([moduleId])
  @@index([order])
}

enum ContentType {
  VIDEO
  TEXT
  DOCUMENT
  INTERACTIVE
  QUIZ
}

// ==================== ENROLLMENT & PROGRESS ====================

model Enrollment {
  id              String           @id @default(cuid())
  userId          String
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId        String
  course          Course           @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  status          EnrollmentStatus @default(ACTIVE)
  progress        Float            @default(0) // 0-100
  
  // Timestamps
  enrolledAt      DateTime         @default(now())
  completedAt     DateTime?
  lastAccessedAt  DateTime         @default(now())
  
  // Stats
  totalTimeSpent  Int              @default(0) // in minutes
  
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@index([status])
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
}

model Progress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId        String
  lesson          Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  isCompleted     Boolean  @default(false)
  completedAt     DateTime?
  timeSpent       Int      @default(0) // in seconds
  lastPosition    Int      @default(0) // for video/audio tracking
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, lessonId])
  @@index([userId])
  @@index([lessonId])
}

// ==================== STUDY TRACKING ====================

model StudySession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId    String?
  lessonId    String?
  
  startTime   DateTime @default(now())
  endTime     DateTime?
  duration    Int      @default(0) // in seconds
  
  // Activity tracking
  isActive    Boolean  @default(true)
  
  @@index([userId])
  @@index([courseId])
}

// ==================== AI-POWERED ASSESSMENTS ====================

model Quiz {
  id              String       @id @default(cuid())
  lessonId        String
  lesson          Lesson       @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  title           String
  description     String?      @db.Text
  
  // AI Generated
  isAiGenerated   Boolean      @default(false)
  generatedFrom   String?      @db.Text // source content
  
  // Config
  passingScore    Int          @default(70)
  timeLimit       Int?         // in minutes
  shuffleQuestions Boolean     @default(true)
  showAnswers     Boolean      @default(true)
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  questions       Question[]
  attempts        QuizAttempt[]
  
  @@index([lessonId])
}

model Question {
  id          String         @id @default(cuid())
  quizId      String
  quiz        Quiz           @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  question    String         @db.Text
  type        QuestionType
  order       Int
  points      Int            @default(1)
  
  // For multiple choice
  options     String[]
  correctAnswer String?      // JSON for multiple correct answers
  
  // For explanation
  explanation String?        @db.Text
  
  // AI metadata
  difficulty  String?
  topic       String?
  
  createdAt   DateTime       @default(now())
  
  @@index([quizId])
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  FILL_BLANK
}

model QuizAttempt {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  // Attempt data
  answers     Json     // { questionId: answer }
  score       Float
  isPassed    Boolean
  
  // Timing
  startedAt   DateTime @default(now())
  completedAt DateTime?
  timeTaken   Int?     // in seconds
  
  @@index([userId])
  @@index([quizId])
}

// ==================== AI CHATBOT TUTOR ====================

model ChatSession {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId    String?
  lessonId    String?
  
  title       String?
  context     Json?       // Course/lesson context for AI
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  messages    ChatMessage[]
  
  @@index([userId])
}

model ChatMessage {
  id          String      @id @default(cuid())
  sessionId   String
  session     ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  role        MessageRole
  content     String      @db.Text
  
  // AI metadata
  tokens      Int?
  model       String?
  
  createdAt   DateTime    @default(now())
  
  @@index([sessionId])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// ==================== GAMIFICATION ====================

model Achievement {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  icon        String
  points      Int      @default(0)
  
  // Unlock criteria
  criteria    Json     // { type: 'courses_completed', value: 5 }
  
  createdAt   DateTime @default(now())

  // Relations
  userAchievements UserAchievement[]
}

model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  unlockedAt    DateTime    @default(now())
  
  @@unique([userId, achievementId])
  @@index([userId])
}

// ==================== CERTIFICATES ====================

model Certificate {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  certificateNumber String @unique
  issueDate   DateTime @default(now())
  
  // Certificate data
  completionDate DateTime
  grade       String?
  
  // Verification
  verificationUrl String?
  
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}

// ==================== REVIEWS & RATINGS ====================

model Review {
  id          String   @id @default(cuid())
  userId      String
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  rating      Int      // 1-5
  comment     String?  @db.Text
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, courseId])
  @@index([courseId])
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type        NotificationType
  title       String
  message     String           @db.Text
  link        String?
  
  isRead      Boolean          @default(false)
  
  createdAt   DateTime         @default(now())
  
  @@index([userId])
  @@index([isRead])
}

enum NotificationType {
  COURSE_UPDATE
  ACHIEVEMENT_UNLOCKED
  CERTIFICATE_ISSUED
  QUIZ_AVAILABLE
  RECOMMENDATION
  REMINDER
  GENERAL
}
```

---

## 📁 Project Structure

```
ai-lms/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.jsx                    # Student dashboard
│   │   ├── courses/
│   │   │   ├── page.jsx                    # Browse courses
│   │   │   ├── [courseId]/
│   │   │   │   ├── page.jsx                # Course details
│   │   │   │   └── learn/
│   │   │   │       └── page.jsx            # Learning interface
│   │   │   └── create/
│   │   │       └── page.jsx                # Create course (instructor)
│   │   ├── my-courses/
│   │   │   └── page.jsx                    # Enrolled courses
│   │   ├── leaderboard/
│   │   │   └── page.jsx                    # Leaderboard
│   │   ├── achievements/
│   │   │   └── page.jsx                    # Achievements
│   │   ├── certificates/
│   │   │   └── page.jsx                    # Certificates
│   │   └── profile/
│   │       └── page.jsx                    # User profile
│   ├── api/
│   │   ├── courses/
│   │   │   ├── route.js                    # GET, POST courses
│   │   │   ├── [courseId]/
│   │   │   │   ├── route.js                # GET, PATCH, DELETE course
│   │   │   │   ├── enroll/route.js         # POST enroll
│   │   │   │   ├── modules/route.js        # GET, POST modules
│   │   │   │   ├── progress/route.js       # GET progress
│   │   │   │   └── recommendations/route.js # GET AI recommendations
│   │   ├── lessons/
│   │   │   ├── [lessonId]/
│   │   │   │   ├── route.js                # GET, PATCH lesson
│   │   │   │   ├── progress/route.js       # POST update progress
│   │   │   │   ├── summary/route.js        # GET AI summary
│   │   │   │   └── quiz/route.js           # GET AI generated quiz
│   │   ├── quiz/
│   │   │   ├── [quizId]/
│   │   │   │   ├── route.js                # GET quiz
│   │   │   │   ├── attempt/route.js        # POST submit attempt
│   │   │   │   └── generate/route.js       # POST AI generate quiz
│   │   ├── chat/
│   │   │   ├── route.js                    # POST create session
│   │   │   └── [sessionId]/
│   │   │       ├── route.js                # GET session
│   │   │       └── messages/route.js       # POST send message
│   │   ├── leaderboard/
│   │   │   └── route.js                    # GET leaderboard
│   │   ├── certificates/
│   │   │   ├── route.js                    # GET user certificates
│   │   │   ├── [certificateId]/route.js    # GET certificate
│   │   │   └── generate/route.js           # POST generate certificate
│   │   ├── study-session/
│   │   │   ├── start/route.js              # POST start session
│   │   │   └── end/route.js                # POST end session
│   │   ├── notifications/
│   │   │   └── route.js                    # GET, PATCH notifications
│   │   ├── achievements/
│   │   │   └── route.js                    # GET achievements
│   │   └── webhooks/
│   │       └── clerk/route.js              # POST clerk webhook
│   └── layout.jsx
├── components/
│   ├── ui/                                 # shadcn components
│   ├── courses/
│   │   ├── course-card.jsx
│   │   ├── course-grid.jsx
│   │   ├── module-list.jsx
│   │   ├── lesson-viewer.jsx
│   │   └── course-creator/
│   │       ├── course-form.jsx
│   │       ├── module-form.jsx
│   │       └── lesson-form.jsx
│   ├── learning/
│   │   ├── video-player.jsx
│   │   ├── progress-tracker.jsx
│   │   ├── quiz-interface.jsx
│   │   └── content-viewer.jsx
│   ├── dashboard/
│   │   ├── stats-card.jsx
│   │   ├── progress-chart.jsx
│   │   ├── activity-feed.jsx
│   │   └── study-streak.jsx
│   ├── leaderboard/
│   │   ├── leaderboard-table.jsx
│   │   └── rank-badge.jsx
│   ├── chat/
│   │   ├── chat-interface.jsx
│   │   ├── message-bubble.jsx
│   │   └── chat-sidebar.jsx
│   ├── certificates/
│   │   ├── certificate-preview.jsx
│   │   └── certificate-download.jsx
│   ├── achievements/
│   │   ├── achievement-card.jsx
│   │   └── achievement-modal.jsx
│   └── shared/
│       ├── navbar.jsx
│       ├── sidebar.jsx
│       ├── loading-spinner.jsx
│       └── empty-state.jsx
├── lib/
│   ├── db.js                              # Prisma client
│   ├── auth.js                            # Clerk helpers
│   ├── ai/
│   │   ├── gemini.js                      # Gemini API wrapper
│   │   ├── quiz-generator.js             # AI quiz generation
│   │   ├── summary-generator.js          # AI summaries
│   │   ├── chatbot.js                    # AI chatbot logic
│   │   └── recommendations.js            # AI recommendations
│   ├── utils/
│   │   ├── time.js                       # Time tracking utilities
│   │   ├── points.js                     # Points calculation
│   │   ├── certificate.js                # Certificate generation
│   │   └── validation.js                 # Input validation
│   └── constants.js                       # App constants
├── hooks/
│   ├── use-study-session.js
│   ├── use-progress.js
│   ├── use-chat.js
│   └── use-leaderboard.js
├── types/
│   └── index.js                          # JSDoc types
├── middleware.js                         # Clerk middleware
├── prisma/
│   ├── schema.prisma
│   └── seed.js
└── .env.local
```

---

## 🔌 API Routes

### **1. Course Management**

#### `GET /api/courses`
Get all published courses with filters
```javascript
// Query params: category, level, search, page, limit
Response: {
  courses: Course[],
  total: number,
  page: number,
  hasMore: boolean
}
```

#### `POST /api/courses`
Create a new course (instructors only)
```javascript
Body: {
  title: string,
  description: string,
  category: string,
  level: CourseLevel
}
Response: { course: Course }
```

#### `GET /api/courses/[courseId]`
Get course details with modules and lessons
```javascript
Response: {
  course: Course,
  modules: Module[],
  isEnrolled: boolean,
  progress?: number
}
```

#### `PATCH /api/courses/[courseId]`
Update course (instructor only)
```javascript
Body: Partial<Course>
Response: { course: Course }
```

#### `POST /api/courses/[courseId]/enroll`
Enroll in a course
```javascript
Response: { enrollment: Enrollment }
```

#### `GET /api/courses/[courseId]/progress`
Get user's progress in a course
```javascript
Response: {
  progress: number,
  completedLessons: number,
  totalLessons: number,
  timeSpent: number
}
```

#### `GET /api/courses/[courseId]/recommendations`
Get AI-powered next course recommendations
```javascript
Response: {
  recommendations: Course[],
  reason: string
}
```

---

### **2. Lesson & Content**

#### `GET /api/lessons/[lessonId]`
Get lesson content
```javascript
Response: {
  lesson: Lesson,
  progress?: Progress,
  nextLesson?: Lesson,
  prevLesson?: Lesson
}
```

#### `POST /api/lessons/[lessonId]/progress`
Update lesson progress
```javascript
Body: {
  isCompleted?: boolean,
  timeSpent: number,
  lastPosition?: number
}
Response: { progress: Progress }
```

#### `GET /api/lessons/[lessonId]/summary`
Get AI-generated lesson summary
```javascript
Response: {
  summary: string,
  keyPoints: string[],
  cached: boolean
}
```

#### `POST /api/lessons/[lessonId]/quiz`
Generate AI quiz from lesson content
```javascript
Body: {
  difficulty?: 'easy' | 'medium' | 'hard',
  numQuestions?: number
}
Response: { quiz: Quiz, questions: Question[] }
```

---

### **3. Quiz & Assessments**

#### `GET /api/quiz/[quizId]`
Get quiz with questions
```javascript
Response: {
  quiz: Quiz,
  questions: Question[],
  attempts: QuizAttempt[]
}
```

#### `POST /api/quiz/[quizId]/attempt`
Submit quiz attempt
```javascript
Body: {
  answers: Record<string, string>
}
Response: {
  attempt: QuizAttempt,
  score: number,
  isPassed: boolean,
  feedback: { questionId: string, correct: boolean, explanation: string }[]
}
```

#### `POST /api/quiz/generate`
Generate quiz using AI from any content
```javascript
Body: {
  content: string,
  title: string,
  numQuestions: number,
  difficulty: string
}
Response: { quiz: Quiz, questions: Question[] }
```

---

### **4. AI Chatbot**

#### `POST /api/chat`
Create new chat session
```javascript
Body: {
  courseId?: string,
  lessonId?: string,
  title?: string
}
Response: { session: ChatSession }
```

#### `GET /api/chat/[sessionId]`
Get chat session with messages
```javascript
Response: {
  session: ChatSession,
  messages: ChatMessage[]
}
```

#### `POST /api/chat/[sessionId]/messages`
Send message to AI tutor
```javascript
Body: {
  content: string
}
Response: {
  message: ChatMessage,
  response: ChatMessage
}
```

---

### **5. Study Tracking**

#### `POST /api/study-session/start`
Start a study session
```javascript
Body: {
  courseId?: string,
  lessonId?: string
}
Response: { session: StudySession }
```

#### `POST /api/study-session/end`
End study session
```javascript
Body: {
  sessionId: string
}
Response: {
  session: StudySession,
  pointsEarned: number
}
```

---

### **6. Leaderboard**

#### `GET /api/leaderboard`
Get global or course-specific leaderboard
```javascript
// Query params: courseId?, period (week|month|alltime), limit
Response: {
  leaderboard: {
    rank: number,
    user: User,
    points: number,
    coursesCompleted: number,
    streak: number
  }[],
  currentUserRank?: number
}
```

---

### **7. Certificates**

#### `GET /api/certificates`
Get user's certificates
```javascript
Response: { certificates: Certificate[] }
```

#### `GET /api/certificates/[certificateId]`
Get certificate details
```javascript
Response: { certificate: Certificate }
```

#### `POST /api/certificates/generate`
Generate certificate on course completion
```javascript
Body: {
  courseId: string
}
Response: { certificate: Certificate }
```

---

### **8. Achievements**

#### `GET /api/achievements`
Get user's achievements
```javascript
Response: {
  unlocked: Achievement[],
  locked: Achievement[],
  progress: Record<string, number>
}
```

---

### **9. Notifications**

#### `GET /api/notifications`
Get user notifications
```javascript
Response: {
  notifications: Notification[],
  unreadCount: number
}
```

#### `PATCH /api/notifications`
Mark notifications as read
```javascript
Body: {
  notificationIds: string[]
}
Response: { success: boolean }
```

---

## 🤖 AI Features Integration

### **1. Quiz Generation (Gemini)**

```javascript
// lib/ai/quiz-generator.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuiz(content, options) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate ${options.numQuestions} multiple-choice quiz questions from the following content.
    Difficulty: ${options.difficulty}
    
    Content:
    ${content}
    
    Return JSON format:
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
  const response = result.response.text();
  
  // Parse JSON and return
  return JSON.parse(response);
}
```

### **2. Content Summarization**

```javascript
// lib/ai/summary-generator.js

export async function generateSummary(content, maxLength = 500) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Summarize the following content in ${maxLength} characters or less.
    Include key points as bullet points.
    
    Content:
    ${content}
    
    Format:
    {
      "summary": "Brief summary",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

### **3. AI Chatbot Tutor**

```javascript
// lib/ai/chatbot.js

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
      ...context.chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}
```

### **4. Course Recommendations**

```javascript
// lib/ai/recommendations.js

export async function getRecommendations(userId, completedCourse) {
  // Get user's completed courses, interests, and performance
  const userProfile = await getUserProfile(userId);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    User just completed: "${completedCourse.title}" (${completedCourse.category}, ${completedCourse.level})
    
    User's completed courses: ${userProfile.completedCourses.map(c => c.title).join(', ')}
    User's interests: ${userProfile.interests.join(', ')}
    User's skill level: ${userProfile.averageLevel}
    
    Available courses: ${JSON.stringify(availableCourses)}
    
    Recommend 3 courses that would be good next steps.
    Return JSON:
    {
      "recommendations": [
        { "courseId": "...", "reason": "why this course", "relevanceScore": 0-100 }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

---

## 🎯 User Flows

### **Flow 1: Student Onboarding**

```
1. User lands on homepage
   ↓
2. Click "Sign Up" → Clerk sign-up modal
   ↓
3. Complete sign-up → Create user in database (webhook)
   ↓
4. Redirect to /dashboard/onboarding
   ↓
5. Set preferences:
   - Learning goals
   - Interests
   - Daily study target
   - Skill level
   ↓
6. Browse recommended courses
   ↓
7. Enroll in first course → Dashboard
```

### **Flow 2: Course Creation (Instructor)**

```
1. Navigate to /courses/create
   ↓
2. Fill course form:
   - Title, description
   - Category, level
   - Thumbnail upload
   ↓
3. Click "Create Course" → Save draft
   ↓
4. Add modules:
   - Module title
   - Module description
   - Order
   ↓
5. Add lessons to each module:
   - Lesson title
   - Content type (video/text/document)
   - Upload content
   - Add description
   ↓
6. For each lesson:
   - Click "Generate AI Summary" → Display summary
   - Click "Generate Quiz" → AI creates quiz
   - Edit quiz questions if needed
   ↓
7. Review course structure
   ↓
8. Click "Publish Course" → Status: PUBLISHED
```

### **Flow 3: Learning Experience**

```
1. Browse courses → /courses
   ↓
2. Click course card → /courses/[courseId]
   ↓
3. View course details:
   - Description
   - Modules preview
   - Instructor info
   - Reviews
   ↓
4. Click "Enroll" → Create enrollment
   ↓
5. Redirect to /courses/[courseId]/learn
   ↓
6. Learning interface:
   - Sidebar: Module/lesson list
   - Main area: Content viewer
   - Right panel: Notes, AI tutor
   ↓
7. Start study session (auto-tracks time)
   ↓
8. Watch video / read content
   - Progress auto-updates every 30s
   - Video position saved
   ↓
9. Click "AI Summary" → View key points
   ↓
10. Complete lesson → Mark as complete
    ↓
11. Take quiz (if available):
    - Answer questions
    - Submit
    - View results with explanations
    - Pass threshold: 70%
    ↓
12. Move to next lesson
    ↓
13. Complete all lessons → Course complete!
    ↓
14. Generate certificate
    ↓
15. View recommendations for next course
```

### **Flow 4: AI Chatbot Tutor**

```
1. During lesson, click "Ask AI Tutor"
   ↓
2. Chat panel opens
   ↓
3. Type question about lesson content
   ↓
4. AI processes:
   - Accesses lesson content as context
   - Uses chat history
   - Generates response
   ↓
5. AI responds with:
   - Clear explanation
   - Examples
   - Follow-up questions
   ↓
6. Continue conversation
   ↓
7. Chat history saved in session
```

### **Flow 5: Progress Tracking & Gamification**

```
1. User completes lesson
   ↓
2. Award points:
   - Lesson completion: 10 points
   - Quiz passed: 20 points
   - Perfect score: +10 bonus
   ↓
3. Update stats:
   - Total time spent
   - Lessons completed
   - Current streak
   ↓
4. Check achievement criteria:
   - "First Course" (enroll in 1 course)
   - "Quick Learner" (complete 5 lessons in a day)
   - "Quiz Master" (score 100% on 10 quizzes)
   - "Streak Hero" (7-day streak)
   ↓
5. If achievement unlocked:
   - Show celebration modal
   - Award bonus points
   - Update user profile
   ↓
6. Update leaderboard rank
   ↓
7. Send notification if rank improved
```

### **Flow 6: Certificate Generation**

```
1. User completes last lesson in course
   ↓
2. System checks completion:
   - All lessons completed
   - Required quizzes passed (if any)
   ↓
3. Auto-trigger certificate generation:
   - Generate unique certificate number
   - Create certificate record
   - Generate PDF with:
     * User name
     * Course title
     * Completion date
     * Certificate number
     * QR code for verification
   ↓
4. Send notification: "Certificate Ready!"
   ↓
5. User views in /certificates
   ↓
6. Options:
   - Download PDF
   - Share on LinkedIn
   - Verify authenticity (public link)
```

---

## 🏗 Component Architecture

### **Dashboard Components**

#### `StatsCard`
```javascript
/**
 * @param {Object} props
 * @param {string} props.title
 * @param {number|string} props.value
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {{ value: number, isPositive: boolean }} [props.trend]
 * @param {string} [props.description]
 */

// Displays key metrics like:
// - Courses enrolled
// - Hours studied
// - Current streak
// - Points earned
```

#### `ProgressChart`
```javascript
/**
 * @param {Object} props
 * @param {{ date: string, minutes: number }[]} props.data
 * @param {'week'|'month'|'year'} props.period
 */

// Shows study time over time using Recharts
// Line chart with smooth curves
// Responsive design
```

#### `ActivityFeed`
```javascript
/**
 * @typedef {Object} Activity
 * @property {'course_enrolled'|'lesson_completed'|'quiz_passed'|'achievement_unlocked'} type
 * @property {string} title
 * @property {Date} timestamp
 * @property {*} [metadata]
 */

// Shows recent activities
// Infinite scroll for older activities
// Click to view details
```

### **Learning Interface Components**

#### `LessonViewer`
```javascript
/**
 * @param {Object} props
 * @param {Object} props.lesson
 * @param {() => void} props.onComplete
 * @param {(timeSpent: number) => void} props.onProgressUpdate
 */

// Handles different content types:
// - VIDEO: Custom video player with tracking
// - TEXT: Rich text renderer
// - DOCUMENT: PDF/document viewer
// - INTERACTIVE: Embeds interactive content

// Features:
// - Auto-save position
// - Mark complete button
// - Next/previous navigation
// - Progress indicator
```

#### `QuizInterface`
```javascript
/**
 * @param {Object} props
 * @param {Object} props.quiz
 * @param {Object[]} props.questions
 * @param {(answers: Record<string, string>) => void} props.onSubmit
 */

// Features:
// - Question navigation
// - Timer (if time limit set)
// - Answer selection (multiple choice, true/false, etc.)
// - Submit confirmation
// - Results view with explanations
// - Retry option
```

#### `AITutorChat`
```javascript
/**
 * @param {Object} props
 * @param {string} props.sessionId
 * @param {Object} [props.courseContext]
 * @param {Object} [props.lessonContext]
 */

// Features:
// - Message list with scrolling
// - Input with send button
// - Typing indicator
// - Context-aware responses
// - Code syntax highlighting
// - LaTeX rendering for math
```

### **Course Creation Components**

#### `CourseForm`
```javascript
/**
 * @param {Object} props
 * @param {Partial<Object>} [props.initialData]
 * @param {(data: Object) => void} props.onSubmit
 */

// Form fields:
// - Title, description
// - Category dropdown
// - Level selector
// - Thumbnail upload (drag & drop)
// - Tags input
// - Price (if paid courses)

// Validation with zod
// Auto-save drafts
```

#### `ModuleList`
```javascript
/**
 * @param {Object} props
 * @param {Object[]} props.modules
 * @param {(modules: Object[]) => void} props.onReorder
 * @param {(module: Object) => void} props.onEdit
 * @param {(moduleId: string) => void} props.onDelete
 */

// Features:
// - Drag & drop reordering
// - Expand/collapse modules
// - Edit inline
// - Delete with confirmation
// - Add new module
```

---

## 🎨 Key Features Implementation

### **1. Real-time Study Session Tracking**

```javascript
// hooks/use-study-session.js

import { useState, useEffect } from 'react';

export function useStudySession(courseId, lessonId) {
  const [sessionId, setSessionId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Start session on mount
    startSession();

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      updateSession();
    }, 30000);

    // End session on unmount
    return () => {
      clearInterval(heartbeat);
      endSession();
    };
  }, [courseId, lessonId]);

  async function startSession() {
    const res = await fetch('/api/study-session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId })
    });
    const { session } = await res.json();
    setSessionId(session.id);
  }

  async function endSession() {
    if (!sessionId) return;
    await fetch('/api/study-session/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
  }

  return { elapsedTime, sessionId };
}
```

### **2. Dynamic Leaderboard Updates**

```javascript
// hooks/use-leaderboard.js

import { useState, useEffect } from 'react';

export function useLeaderboard(courseId, period = 'week') {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchLeaderboard, 120000);
    return () => clearInterval(interval);
  }, [courseId, period]);

  async function fetchLeaderboard() {
    const params = new URLSearchParams({ period });
    if (courseId) params.set('courseId', courseId);
    
    const res = await fetch(`/api/leaderboard?${params}`);
    const data = await res.json();
    
    setLeaderboard(data.leaderboard);
    setCurrentUserRank(data.currentUserRank);
  }

  return { leaderboard, currentUserRank, refresh: fetchLeaderboard };
}
```

### **3. Progress Calculation Logic**

```javascript
// lib/utils/progress.js

import { db } from '../db';

export async function calculateCourseProgress(userId, courseId) {
  // Get all lessons in course
  const lessons = await db.lesson.findMany({
    where: {
      module: { courseId }
    }
  });

  // Get user's completed lessons
  const completedProgress = await db.progress.findMany({
    where: {
      userId,
      lessonId: { in: lessons.map(l => l.id) },
      isCompleted: true
    }
  });

  const progress = (completedProgress.length / lessons.length) * 100;
  
  // Update enrollment
  await db.enrollment.update({
    where: {
      userId_courseId: { userId, courseId }
    },
    data: {
      progress: Math.round(progress),
      completedAt: progress === 100 ? new Date() : null,
      status: progress === 100 ? 'COMPLETED' : 'ACTIVE'
    }
  });

  return progress;
}
```

### **4. Achievement System**

```javascript
// lib/utils/achievements.js

import { db } from '../db';

export async function checkAndAwardAchievements(userId) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: true,
      progress: { where: { isCompleted: true } },
      quizAttempts: { where: { isPassed: true } }
    }
  });

  const achievements = await db.achievement.findMany();
  const userAchievements = await db.userAchievement.findMany({
    where: { userId }
  });

  const unlocked = userAchievements.map(ua => ua.achievementId);
  const toUnlock = [];

  for (const achievement of achievements) {
    if (unlocked.includes(achievement.id)) continue;

    const criteria = achievement.criteria;
    let shouldUnlock = false;

    switch (criteria.type) {
      case 'courses_completed':
        shouldUnlock = user.enrollments.filter(e => e.status === 'COMPLETED').length >= criteria.value;
        break;
      case 'lessons_completed':
        shouldUnlock = user.progress.length >= criteria.value;
        break;
      case 'quizzes_passed':
        shouldUnlock = user.quizAttempts.length >= criteria.value;
        break;
      case 'streak_days':
        shouldUnlock = user.streak >= criteria.value;
        break;
      case 'points_earned':
        shouldUnlock = user.totalPoints >= criteria.value;
        break;
    }

    if (shouldUnlock) {
      toUnlock.push(achievement.id);
    }
  }

  // Award new achievements
  if (toUnlock.length > 0) {
    await db.userAchievement.createMany({
      data: toUnlock.map(achievementId => ({
        userId,
        achievementId
      }))
    });

    // Send notifications
    await db.notification.createMany({
      data: toUnlock.map(achievementId => {
        const achievement = achievements.find(a => a.id === achievementId);
        return {
          userId,
          type: 'ACHIEVEMENT_UNLOCKED',
          title: 'Achievement Unlocked!',
          message: `You've earned: ${achievement?.name}`,
          link: '/achievements'
        };
      })
    });
  }

  return toUnlock;
}
```

### **5. Certificate Generation**

```javascript
// lib/utils/certificate.js

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { db } from '../db';

export async function generateCertificate(userId, courseId) {
  const user = await db.user.findUnique({ where: { id: userId } });
  const course = await db.course.findUnique({ where: { id: courseId } });
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }
  });

  // Generate unique certificate number
  const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 8).toUpperCase()}`;

  // Create certificate record
  const certificate = await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber,
      completionDate: enrollment.completedAt,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateNumber}`
    }
  });

  // Generate PDF
  const pdf = new jsPDF('landscape');
  
  // Add border
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 20);

  // Title
  pdf.setFontSize(40);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Completion', pdf.internal.pageSize.width / 2, 40, { align: 'center' });

  // Body
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This certifies that', pdf.internal.pageSize.width / 2, 70, { align: 'center' });

  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${user.firstName} ${user.lastName}`, pdf.internal.pageSize.width / 2, 90, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('has successfully completed', pdf.internal.pageSize.width / 2, 110, { align: 'center' });

  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(course.title, pdf.internal.pageSize.width / 2, 130, { align: 'center' });

  // Date and certificate number
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${enrollment.completedAt.toLocaleDateString()}`, 40, 170);
  pdf.text(`Certificate No: ${certificateNumber}`, 40, 180);

  // Generate QR code
  const qrCode = await QRCode.toDataURL(certificate.verificationUrl);
  pdf.addImage(qrCode, 'PNG', pdf.internal.pageSize.width - 60, 160, 30, 30);

  // Save PDF
  const pdfBuffer = pdf.output('arraybuffer');
  
  // Upload to storage (S3, etc.)
  // const url = await uploadToStorage(pdfBuffer, `certificates/${certificateNumber}.pdf`);

  return certificate;
}
```

---

## 🚀 Implementation Steps

### **Phase 1: Foundation (Week 1-2)**
1. ✅ Setup Next.js 16 project
2. ✅ Configure Clerk authentication
3. ✅ Setup PostgreSQL + Prisma
4. ✅ Install shadcn/ui components
5. ✅ Create base layout and navigation
6. ✅ Setup Gemini API integration

### **Phase 2: Core Features (Week 3-4)**
1. ✅ User authentication flows
2. ✅ Course CRUD operations
3. ✅ Module and lesson management
4. ✅ Enrollment system
5. ✅ Basic learning interface
6. ✅ Progress tracking

### **Phase 3: AI Features (Week 5-6)**
1. ✅ AI quiz generation
2. ✅ Content summarization
3. ✅ Chatbot tutor implementation
4. ✅ Course recommendations

### **Phase 4: Gamification (Week 7-8)**
1. ✅ Points system
2. ✅ Achievement system
3. ✅ Leaderboard
4. ✅ Study streak tracking
5. ✅ Dashboard with stats

### **Phase 5: Polish & Deploy (Week 9-10)**
1. ✅ Certificate generation
2. ✅ Notification system
3. ✅ Performance optimization
4. ✅ Testing
5. ✅ Deployment

---

## 🎨 UI/UX Design Guidelines

### **Color Scheme**
```css
/* Tailwind config */
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
}
```

### **Typography**
- Headings: `font-bold` with `text-2xl` to `text-4xl`
- Body: `font-normal` with `text-base`
- Use `font-inter` or `font-geist-sans` for modern look

### **Component Patterns**
- Cards: `rounded-xl shadow-sm border`
- Buttons: `rounded-lg` with hover effects
- Inputs: `rounded-md` with focus rings
- Use `hover:` and `focus:` states extensively

### **Animations**
- Page transitions: Fade in
- Cards: Hover scale (1.02)
- Modals: Slide up
- Use Framer Motion for smooth animations

---

## 📝 Environment Variables

```env
# .env.local

# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Gemini AI
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Upload (optional)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

# Redis (optional)
REDIS_URL=
```

---

## 📝 JavaScript + JSDoc Setup

Since we're using JavaScript instead of TypeScript, you can add type checking with JSDoc comments:

### **jsconfig.json**
```json
{
  "compilerOptions": {
    "checkJs": true,
    "strict": true,
    "module": "esnext",
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "jsx": "preserve",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
```

### **Example JSDoc Usage**
```javascript
/**
 * Calculate course progress for a user
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID
 * @returns {Promise<number>} Progress percentage (0-100)
 */
export async function calculateCourseProgress(userId, courseId) {
  // Implementation
}

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'BEGINNER'|'INTERMEDIATE'|'ADVANCED'} level
 * @property {boolean} isPublished
 */

/**
 * Get all published courses
 * @returns {Promise<Course[]>}
 */
export async function getPublishedCourses() {
  // Implementation
}
```

---

## 🔧 Additional Tips

### **Performance Optimization**
1. Use `loading.tsx` for route loading states
2. Implement pagination for lists
3. Cache AI responses (Redis or database)
4. Lazy load heavy components
5. Optimize images with Next.js Image

### **Security**
1. Validate all inputs with Zod or Joi
2. Use Clerk's middleware for protected routes
3. Implement rate limiting on AI endpoints
4. Sanitize user-generated content
5. Use CORS properly
6. Add JSDoc comments for better type safety

### **Testing**
1. Unit tests for utility functions (Jest/Vitest)
2. API tests for all routes (Supertest)
3. E2E tests for critical flows (Playwright/Cypress)
4. Test AI integrations with mocks
5. Use JSDoc for runtime type checking

### **Deployment**
- **Hosting**: Vercel (recommended for Next.js)
- **Database**: Neon, Supabase, or Railway
- **File Storage**: AWS S3 or Cloudflare R2
- **Monitoring**: Sentry for errors, Vercel Analytics

---

## 🎉 Feature Highlights

### **🤖 AI-Powered**
- Auto-generate quizzes from any content
- Intelligent content summaries
- 24/7 AI tutor available
- Personalized course recommendations

### **📊 Analytics & Tracking**
- Real-time progress tracking
- Detailed time-spent analytics
- Study session history
- Performance metrics

### **🏆 Gamification**
- Points for every action
- Achievements and badges
- Global and course leaderboards
- Study streaks

### **🎓 Modern Learning**
- Modular course structure
- Multiple content types
- Interactive quizzes
- Downloadable certificates

### **💎 Premium UX**
- Clean, modern interface
- Responsive design
- Smooth animations
- Intuitive navigation

---

## 📞 Support & Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Clerk Docs**: https://clerk.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Next.js 16**: https://nextjs.org/docs

---

**Happy Building! 🚀**

This architecture provides a solid foundation for a modern, AI-powered LMS built with **JavaScript**. The entire project uses pure JavaScript with optional JSDoc annotations for type safety. Start with Phase 1 and incrementally add features. The modular design allows for easy scaling and maintenance.

**Note:** While this guide uses JavaScript, you can optionally add JSDoc comments for better IntelliSense and type checking in your editor without the complexity of TypeScript compilation.
