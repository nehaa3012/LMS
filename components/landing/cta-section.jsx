"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Gift } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

export default function CtaSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      {/* Epic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-purple-950/30 to-pink-950/30" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(45deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1), rgba(236,72,153,0.1))",
            backgroundSize: "400% 400%",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${i % 3 === 0 ? '6,182,212' : i % 3 === 1 ? '168,85,247' : '236,72,153'}, 0.4)`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative max-w-6xl mx-auto px-4"
      >
        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-dark rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Dramatic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
          
          {/* Animated border glow */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 opacity-50"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(6,182,212,0.5), transparent, rgba(168,85,247,0.5), transparent, rgba(236,72,153,0.5), transparent)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative z-10 p-12 md:p-16 text-center">
            {/* Icon badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-8 border border-cyan-500/30"
            >
              <Gift className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">Limited Time Offer</span>
              <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Start Learning
              </span>
              <br />
              <span className="text-foreground">Today</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Join 50,000+ learners transforming their careers with AI-powered education.
              <span className="text-cyan-400 font-semibold"> Get 30 days free</span> when you start today.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                "Unlimited course access",
                "AI-powered learning paths",
                "Industry certifications",
                "24/7 AI tutor support",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  className="flex items-center gap-2 glass rounded-full px-4 py-2 border border-purple-500/20"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-5 rounded-xl font-bold text-lg text-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                    style={{ mixBlendMode: "overlay" }}
                  />
                  <span className="relative flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-xl font-bold text-lg glass border-2 border-white/20 hover:border-purple-500/50 transition-all duration-300"
              >
                View Pricing
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>100% money-back guarantee</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent blur-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-transparent blur-2xl" />
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Trusted by learners at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"].map((company) => (
              <div key={company} className="text-2xl font-bold">{company}</div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
      />
    </section>
  );
}
