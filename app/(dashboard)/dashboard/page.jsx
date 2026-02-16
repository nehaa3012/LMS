"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Trophy,
  BookOpen,
  Clock,
  Zap,
  TrendingUp,
  Award,
  Target,
  Sparkles,
} from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import CourseGrid from "@/components/dashboard/course-grid";
import LeaderboardWidget from "@/components/dashboard/leaderboard-widget";
import AchievementsPreview from "@/components/dashboard/achievements-preview";
import ProgressChart from "@/components/dashboard/progress-chart";

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    hoursStudied: 0,
    streak: 0,
    points: 0,
    lessonsCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats from various endpoints
      const [coursesRes, achievementsRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/achievements"),
      ]);

      const courses = await coursesRes.json();
      const achievements = await achievementsRes.json();

      // Calculate stats
      setStats({
        coursesEnrolled: courses.courses?.length || 0,
        hoursStudied: 24, // Mock data - would come from study sessions
        streak: 7, // Mock data - would come from user profile
        points: achievements.progress?.points || 0,
        lessonsCompleted: achievements.progress?.lessons_completed || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="glass rounded-2xl p-8 neon-cyan">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-xl text-glow-cyan">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 animated-gradient opacity-20 blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-glow-cyan">
            Welcome back, {user?.firstName || "Learner"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Courses Enrolled"
          value={stats.coursesEnrolled}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
          gradient="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatsCard
          title="Hours Studied"
          value={stats.hoursStudied}
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          gradient="from-purple-500/20 to-pink-500/20"
          iconColor="text-purple-400"
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} days`}
          icon={Zap}
          trend={{ value: 2, isPositive: true }}
          gradient="from-yellow-500/20 to-orange-500/20"
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="Total Points"
          value={stats.points}
          icon={Trophy}
          trend={{ value: 150, isPositive: true }}
          gradient="from-green-500/20 to-emerald-500/20"
          iconColor="text-green-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="glass-dark rounded-2xl p-6 border border-cyan-500/20 scanlines h-full">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">Learning Progress</h2>
            </div>
            <ProgressChart />
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="glass-dark rounded-2xl p-6 border border-purple-500/20 scanlines">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Recent Achievements</h2>
          </div>
          <AchievementsPreview />
        </div>
      </div>

      {/* Courses and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Grid - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="glass-dark rounded-2xl p-6 border border-blue-500/20 scanlines">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Continue Learning</h2>
              </div>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View All →
              </button>
            </div>
            <CourseGrid />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-dark rounded-2xl p-6 border border-pink-500/20 scanlines">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-semibold">Leaderboard</h2>
          </div>
          <LeaderboardWidget />
        </div>
      </div>
    </div>
  );
}
