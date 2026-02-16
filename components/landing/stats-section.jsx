"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp, Users, Award, BookCheck } from "lucide-react";

function Counter({ from = 0, to, duration = 2, suffix = "", prefix = "" }) {
  const count = useMotionValue(from);
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      },
    });
    return controls.stop;
  }, [from, to, duration, prefix, suffix, count]);

  return <span ref={ref}>{prefix}{from}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: "+",
      label: "Active Learners",
      description: "Join a thriving community",
      color: "cyan",
    },
    {
      icon: BookCheck,
      value: 500,
      suffix: "+",
      label: "Expert Courses",
      description: "Across 50+ domains",
      color: "purple",
    },
    {
      icon: Award,
      value: 25000,
      suffix: "+",
      label: "Certificates Issued",
      description: "Industry recognized",
      color: "pink",
    },
    {
      icon: TrendingUp,
      value: 98,
      suffix: "%",
      label: "Success Rate",
      description: "Student satisfaction",
      color: "yellow",
    },
  ];

  const colorStyles = {
    cyan: {
      gradient: "from-cyan-500 to-blue-500",
      glow: "shadow-[0_0_50px_rgba(6,182,212,0.4)]",
      text: "text-cyan-400",
    },
    purple: {
      gradient: "from-purple-500 to-violet-500",
      glow: "shadow-[0_0_50px_rgba(168,85,247,0.4)]",
      text: "text-purple-400",
    },
    pink: {
      gradient: "from-pink-500 to-rose-500",
      glow: "shadow-[0_0_50px_rgba(236,72,153,0.4)]",
      text: "text-pink-400",
    },
    yellow: {
      gradient: "from-yellow-500 to-amber-500",
      glow: "shadow-[0_0_50px_rgba(234,179,8,0.4)]",
      text: "text-yellow-400",
    },
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dramatic diagonal background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-background via-cyan-950/20 to-purple-950/20"
          style={{
            clipPath: "polygon(0 0, 100% 10%, 100% 100%, 0 90%)",
          }}
        />
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Dramatic header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-glow-cyan">Numbers That</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Tell Our Story
            </span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const styles = colorStyles[stat.color];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full glass-dark rounded-2xl border border-white/5 p-8 hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Hover gradient */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-5`}
                  />

                  <div className="relative z-10">
                    {/* Icon with glow effect */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`
                        w-16 h-16 rounded-xl mb-6
                        bg-gradient-to-br ${styles.gradient}
                        flex items-center justify-center
                        ${styles.glow}
                        group-hover:${styles.glow}
                      `}
                    >
                      <stat.icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>

                    {/* Value */}
                    <div className={`text-5xl md:text-6xl font-bold mb-2 ${styles.text}`}>
                      <Counter to={stat.value} suffix={stat.suffix} duration={2.5} />
                    </div>

                    {/* Label */}
                    <h3 className="text-xl font-semibold mb-2">
                      {stat.label}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Floating accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-3/4 bg-gradient-to-r ${styles.gradient} rounded-full blur-sm`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-2xl text-muted-foreground mb-8">
            Join thousands of learners transforming their careers
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="glass-dark rounded-xl px-10 py-5 font-bold border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-cyan text-lg">
              Start Your Journey
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
