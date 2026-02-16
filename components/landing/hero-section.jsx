"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-dark rounded-full px-6 py-3 mb-8 border border-cyan-500/30"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-sm font-medium">
            Next Generation Learning Platform
          </span>
          <Zap className="w-4 h-4 text-purple-400" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="text-glow-cyan block mb-2">Transform Your</span>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Learning Experience
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          Harness the power of AI to unlock your potential with personalized
          learning paths, real-time progress tracking, and gamified achievements.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="group glass-dark rounded-xl px-8 py-4 font-semibold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-cyan flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <button className="group glass-dark rounded-xl px-8 py-4 font-semibold border-2 border-white/10 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: "Active Learners", value: "50K+" },
            { label: "Courses", value: "500+" },
            { label: "Certificates Issued", value: "25K+" },
            { label: "Success Rate", value: "98%" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-dark rounded-xl p-6 border border-white/5 hover-lift"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-glow-cyan mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-20"
        >
          <div className="inline-flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full glass-dark border border-cyan-500/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    </section>
  );
}
