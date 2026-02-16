# NexusLMS - Futuristic AI-Powered Learning Platform

A modern, sleek Learning Management System with a **Futuristic Dark** aesthetic featuring neon accents, glassmorphism effects, and cyber-inspired design elements.

## 🎨 Design System

### Aesthetic Direction
- **Theme**: Futuristic Dark with cyber-inspired elements
- **Color Palette**: Cyan (#06b6d4), Purple (#a855f7), Pink (#ec4899) neon accents on dark backgrounds
- **Typography**: Geist Sans font family with glowing text effects
- **Effects**: Glassmorphism, neon glows, scan lines, animated gradients

### Key Visual Features
- 🌐 Cyber grid background pattern
- 💎 Glassmorphism panels with backdrop blur
- ✨ Neon glow effects (cyan, purple, pink)
- 📊 Smooth animations with Framer Motion
- 🎯 Hover lift effects on cards
- 🔄 Animated gradients
- 📺 Retro scanline overlays

## 🚀 Pages & Components Built

### 1. **Dashboard** (`/dashboard`)
The main learning hub with real-time stats and progress tracking.

**Features:**
- 4 animated stat cards (Courses, Hours, Streak, Points)
- Real-time progress chart with Recharts
- Recent achievements preview
- Course grid with enrollment status
- Live leaderboard with auto-refresh

**API Integrations:**
- `GET /api/courses` - Fetch enrolled courses
- `GET /api/achievements` - User achievements and progress
- `GET /api/leaderboard` - Top learners

### 2. **Courses Browse** (`/courses`)
Explore all available courses with advanced filtering.

**Features:**
- Real-time search functionality
- Category filter (Programming, Design, Business, etc.)
- Level filter (Beginner to Expert)
- Responsive grid layout
- Course cards with hover effects
- Enrollment status indicators

**API Integrations:**
- `GET /api/courses?search=&category=&level=` - Course filtering

### 3. **Course Detail** (`/courses/[courseId]`)
Immersive course information and enrollment page.

**Features:**
- Hero section with animated background
- Course metadata (duration, lessons, ratings)
- Instructor profile card
- Sticky enrollment card
- Module and lesson breakdown
- Progress tracking for enrolled users

**API Integrations:**
- `GET /api/courses/[courseId]` - Course details, modules, lessons
- `POST /api/courses/[courseId]/enroll` - Enroll in course
- `GET /api/courses/[courseId]/progress` - User progress

## 📦 Components

### Dashboard Components

#### `StatsCard`
Animated metric card with trend indicators
- Props: title, value, icon, trend, gradient, iconColor
- Features: Hover gradient reveal, decorative corner

#### `CourseGrid`
Dynamic course grid with API integration
- Auto-fetches from `/api/courses`
- Progress bars for enrolled courses
- Skeleton loading states

#### `LeaderboardWidget`
Real-time leaderboard with rankings
- Crown/medal icons for top 3
- Auto-refresh every 2 minutes
- Streak and course completion stats

#### `AchievementsPreview`
Showcase of unlocked achievements
- Neon purple glow for unlocked items
- Lock icon for locked achievements
- Point rewards display

#### `ProgressChart`
Area chart showing learning activity
- Built with Recharts
- Custom gradient fill
- Glassmorphic tooltip

## 🎨 Custom CSS Classes

### Glassmorphism
- `.glass` - Light glass effect
- `.glass-dark` - Dark glass effect with blur

### Neon Glows
- `.neon-cyan` - Cyan box shadow
- `.neon-purple` - Purple box shadow
- `.neon-pink` - Pink box shadow

### Text Effects
- `.text-glow-cyan` - Cyan text shadow
- `.text-glow-purple` - Purple text shadow

### Backgrounds
- `.cyber-grid` - Grid pattern overlay
- `.animated-gradient` - Shifting gradient animation
- `.scanlines` - CRT scanline effect

### Interactions
- `.hover-lift` - Card lift on hover

## 🔌 API Endpoints Used

### Courses
- `GET /api/courses` - List all courses with filters
- `GET /api/courses/[id]` - Course details
- `POST /api/courses/[id]/enroll` - Enroll user
- `GET /api/courses/[id]/progress` - Course progress

### Leaderboard
- `GET /api/leaderboard?limit=10` - Top learners

### Achievements
- `GET /api/achievements` - User achievements

### Study Sessions (Ready for integration)
- `POST /api/study-session/start`
- `POST /api/study-session/end`

### Chat (Ready for integration)
- `POST /api/chat` - Create AI tutor session
- `POST /api/chat/[sessionId]/messages` - Send message

### Lessons (Ready for integration)
- `GET /api/lessons/[lessonId]` - Lesson content
- `POST /api/lessons/[lessonId]/progress` - Update progress
- `GET /api/lessons/[lessonId]/summary` - AI summary
- `POST /api/lessons/[lessonId]/quiz` - Generate AI quiz

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: Clerk
- **Database**: Prisma + PostgreSQL

## 🎯 Design Philosophy

### Bold & Distinctive
Every element is intentionally designed to create a memorable, futuristic learning experience. We avoid generic "AI slop" aesthetics by:
- Using distinctive cyan/purple/pink neon palette instead of common purple gradients
- Implementing authentic glassmorphism with proper backdrop filters
- Adding cyber-inspired elements (grid, scanlines) for atmosphere
- Creating smooth, purposeful animations that enhance UX

### Functional Beauty
- All glows and effects serve to guide user attention
- Hover states provide clear interactive feedback
- Loading states maintain visual consistency
- Progress indicators use vibrant gradients

### Performance-First
- Lazy loading for images
- Optimized animations with CSS transforms
- Debounced search and filters
- Skeleton loading states

## 📱 Responsive Design

All pages and components are fully responsive:
- Mobile: Single column layouts, touch-friendly targets
- Tablet: 2-column grids, collapsible filters
- Desktop: 3-column grids, sticky sidebars

## 🚀 Getting Started

1. Ensure all dependencies are installed:
```bash
npm install framer-motion recharts lucide-react
```

2. The app uses dark mode by default (set in `app/layout.js`)

3. All API endpoints should return data in the formats documented in `AGENT.md`

4. Start the development server:
```bash
npm run dev
```

## 🎨 Customization

### Color Scheme
Edit the CSS variables in `app/globals.css`:
- `--primary` - Main cyan color
- `--accent` - Purple accent
- Adjust `.dark` theme colors

### Animations
Framer Motion variants in components can be adjusted:
- `initial`, `animate`, `transition` props
- Delay values for stagger effects

### Neon Intensity
Adjust box-shadow values in `.neon-*` classes in `globals.css`

## 🔮 Future Enhancements

- AI Chatbot interface with streaming responses
- Live lesson viewer with video player
- Quiz interface with AI generation
- Certificate generation and display
- Real-time notification system
- Study session timer with pause/resume
- Achievement unlock animations
- Course progress heatmap

---

**Designed with precision. Built for the future.**
