"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, TrendingUp, Award, Target } from "lucide-react";

export default function FeaturesShowcase() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Learning",
      description: "Intelligent course recommendations and personalized learning paths",
      gradient: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      icon: TrendingUp,
      title: "Real-time Progress",
      description: "Track your learning journey with detailed analytics and insights",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Earn achievements, compete on leaderboards, and build streaks",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: Sparkles,
      title: "AI Tutor",
      description: "24/7 AI assistant to help you understand complex topics",
      gradient: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning goals and stay motivated with daily targets",
      gradient: "from-indigo-500/20 to-violet-500/20",
      iconColor: "text-indigo-400",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0 animated-gradient opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-cyan">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your learning experience
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="glass-dark rounded-xl p-6 border border-white/5 hover-lift hover:border-cyan-500/30 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="glass-dark rounded-xl px-8 py-4 font-semibold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-cyan text-lg">
            Start Learning Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
