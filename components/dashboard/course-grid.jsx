"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import Image from "next/image";

export default function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses?limit=6");
      const data = await res.json();
      setCourses(data.courses?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 animate-pulse">
            <div className="h-40 bg-white/5 rounded-lg mb-4" />
            <div className="h-4 bg-white/5 rounded mb-2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="group"
        >
          <div className="glass-dark rounded-xl overflow-hidden border border-white/5 hover-lift hover:border-cyan-500/30 transition-all duration-300">
            {/* Course thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden">
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

              {/* Scan line effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
            </div>

            {/* Course info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {course.description}
              </p>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{course.estimatedHours || 5}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>245</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
