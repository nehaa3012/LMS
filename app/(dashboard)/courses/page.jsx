"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Clock, Star, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = ["all", "Programming", "Design", "Business", "Marketing", "Data Science"];
  const levels = ["all", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="glass rounded-2xl p-8 neon-cyan">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-xl text-glow-cyan">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 animated-gradient opacity-20 blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-glow-cyan">
            Explore Courses
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover your next learning adventure
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-4 border border-cyan-500/20"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-lg"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "glass border-cyan-500/50 text-cyan-400 neon-cyan"
                      : "glass-dark border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Level filter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Level</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? "glass border-purple-500/50 text-purple-400 neon-purple"
                      : "glass-dark border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Found <span className="text-cyan-400 font-bold">{filteredCourses.length}</span> courses
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link href={`/courses/${course.id}`}>
              <div className="group glass-dark rounded-xl overflow-hidden border border-white/5 hover-lift hover:border-cyan-500/30 transition-all duration-300 h-full">
                {/* Course thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-cyan-400/30" />
                    </div>
                  )}

                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span className="glass px-3 py-1 text-xs font-medium text-cyan-400 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="glass px-3 py-1 text-xs font-medium text-purple-400 rounded-full">
                      {course.category}
                    </span>
                  </div>

                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
                </div>

                {/* Course info */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                    {course.instructor?.imageUrl ? (
                      <Image
                        src={course.instructor.imageUrl}
                        alt={course.instructor.firstName}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {course.instructor?.firstName?.[0]}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.estimatedHours || 5}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>1.2k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-glow-cyan">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                      <button className="glass px-4 py-2 rounded-lg text-sm font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="glass-dark rounded-2xl p-12 max-w-md mx-auto border border-white/10">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
