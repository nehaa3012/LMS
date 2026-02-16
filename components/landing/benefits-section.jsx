"use client";

import { motion } from "framer-motion";
import { Brain, Rocket, Users, BookOpen, Clock, Globe } from "lucide-react";
import { useState } from "react";

export default function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      icon: Brain,
      title: "Adaptive Intelligence",
      description: "Our AI learns your learning style and adapts content difficulty in real-time, ensuring optimal knowledge retention.",
      stats: "3x faster learning",
      color: "cyan",
    },
    {
      icon: Rocket,
      title: "Accelerated Progress",
      description: "Structured pathways and bite-sized lessons help you achieve your goals faster than traditional methods.",
      stats: "Complete courses 60% faster",
      color: "purple",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join study groups, collaborate on projects, and learn from peers in an engaging social environment.",
      stats: "10K+ active learners",
      color: "pink",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Access curated courses across 50+ topics with video lectures, interactive quizzes, and hands-on projects.",
      stats: "500+ expert-led courses",
      color: "yellow",
    },
    {
      icon: Clock,
      title: "Learn Anytime",
      description: "Study at your own pace with lifetime access to all course materials and downloadable resources.",
      stats: "24/7 availability",
      color: "green",
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description: "Earn industry-recognized certificates that showcase your achievements to employers worldwide.",
      stats: "Trusted by 1000+ companies",
      color: "indigo",
    },
  ];

  const colorMap = {
    cyan: {
      gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    },
    purple: {
      gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
      border: "border-purple-500/30",
      text: "text-purple-400",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    },
    pink: {
      gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
      border: "border-pink-500/30",
      text: "text-pink-400",
      glow: "shadow-[0_0_30px_rgba(236,72,153,0.2)]",
    },
    yellow: {
      gradient: "from-yellow-500/10 via-amber-500/5 to-transparent",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      glow: "shadow-[0_0_30px_rgba(234,179,8,0.2)]",
    },
    green: {
      gradient: "from-green-500/10 via-emerald-500/5 to-transparent",
      border: "border-green-500/30",
      text: "text-green-400",
      glow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    },
    indigo: {
      gradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    },
  };

  return (
    <section className="py-32 relative">
      {/* Diagonal background split */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-cyan-950/10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-950/10 to-transparent" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-[10%] w-64 h-64 border border-cyan-500/10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-[15%] w-48 h-48 border border-purple-500/10"
          style={{ transform: "rotate(45deg)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="glass-dark rounded-full px-6 py-2 border border-purple-500/30">
              <span className="text-purple-400 font-semibold">Why Choose NexusLMS</span>
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform Knowledge
            </span>
            <br />
            <span className="text-foreground">Into Power</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience learning reimagined with cutting-edge technology and
            human-centered design
          </p>
        </motion.div>

        {/* Benefits grid with asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const colors = colorMap[benefit.color];
            const isHovered = hoveredCard === index;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative ${index === 1 || index === 4 ? 'lg:translate-y-8' : ''}`}
              >
                <div
                  className={`
                    relative h-full p-8 rounded-2xl 
                    glass-dark border transition-all duration-500
                    ${isHovered ? `${colors.border} ${colors.glow}` : 'border-white/5'}
                    overflow-hidden
                  `}
                >
                  {/* Background gradient */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}
                  />

                  {/* Scan line effect */}
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: isHovered ? "100%" : "-100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className={`absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`
                        w-16 h-16 rounded-xl mb-6
                        flex items-center justify-center
                        bg-background/50 ${colors.text}
                        group-hover:scale-110 transition-transform duration-300
                      `}
                    >
                      <benefit.icon className="w-8 h-8" strokeWidth={1.5} />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:translate-x-1 transition-transform">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {benefit.description}
                    </p>

                    {/* Stats badge */}
                    <div className="inline-flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors.text} animate-pulse`} />
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {benefit.stats}
                      </span>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div
                    className={`
                      absolute top-0 right-0 w-24 h-24 
                      bg-gradient-to-bl ${colors.gradient}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    `}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </div>
    </section>
  );
}
