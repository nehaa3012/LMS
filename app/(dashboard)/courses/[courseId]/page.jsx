"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Lock,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.courseId) {
      fetchCourseDetails();
    }
  }, [params.courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${params.courseId}`);
      const data = await res.json();
      
      setCourse(data.course);
      setModules(data.modules || []);
      setIsEnrolled(data.isEnrolled || false);
      setProgress(data.progress || 0);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const res = await fetch(`/api/courses/${params.courseId}/enroll`, {
        method: "POST",
      });
      
      if (res.ok) {
        setIsEnrolled(true);
        router.push(`/courses/${params.courseId}/learn`);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="glass rounded-2xl p-8 neon-cyan">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-xl text-glow-cyan">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0 animated-gradient opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="glass-dark rounded-lg px-4 py-2 mb-6 flex items-center gap-2 hover:border-cyan-500/50 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              {/* Level badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="glass px-4 py-1.5 text-sm font-medium text-cyan-400 rounded-full neon-cyan">
                  {course.level}
                </span>
                <span className="glass px-4 py-1.5 text-sm font-medium text-purple-400 rounded-full">
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow-cyan">
                {course.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{course.estimatedHours || 10} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span>1.2k students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.9 rating</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="mt-8 glass-dark rounded-xl p-4 border border-white/10">
                <p className="text-sm text-muted-foreground mb-2">Instructor</p>
                <div className="flex items-center gap-3">
                  {course.instructor?.imageUrl ? (
                    <Image
                      src={course.instructor.imageUrl}
                      alt={course.instructor.firstName}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                      {course.instructor?.firstName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">Course Creator</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-dark rounded-2xl p-6 border border-cyan-500/20 scanlines sticky top-8">
                {/* Course thumbnail */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 group">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-cyan-400/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full glass-dark flex items-center justify-center neon-cyan">
                      <Play className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {isEnrolled ? (
                  <>
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-bold text-cyan-400">{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/courses/${params.courseId}/learn`)}
                      className="w-full glass-dark rounded-lg px-6 py-4 font-semibold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-cyan flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Continue Learning
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-glow-cyan mb-2">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Full lifetime access
                      </p>
                    </div>

                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full glass-dark rounded-lg px-6 py-4 font-semibold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                  </>
                )}

                {/* Features */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>AI tutor support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Progress tracking</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Course Content
          </h2>

          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="glass-dark rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                        {isEnrolled ? (
                          <Play className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.duration || 15} mins
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
