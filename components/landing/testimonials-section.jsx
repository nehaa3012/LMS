"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      quote: "NexusLMS transformed how I learn. The AI-powered recommendations are spot-on, and I've completed 5 certifications in just 3 months. The gamification keeps me motivated every single day.",
      rating: 5,
      achievement: "5 Certifications",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Innovation Labs",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      quote: "The community features are incredible. I've connected with learners worldwide and the AI tutor helped me grasp complex concepts I struggled with for years. Truly revolutionary.",
      rating: 5,
      achievement: "Top 1% Learner",
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      company: "DataFlow Inc",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      quote: "Finally, a learning platform that adapts to me. The personalized paths and real-time progress tracking helped me land my dream job. Worth every second invested.",
      rating: 5,
      achievement: "Career Advancement",
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Creative Studio",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      quote: "The course quality is unmatched. Expert instructors, hands-on projects, and instant feedback. I've built a portfolio that impressed every interviewer. NexusLMS is a game-changer.",
      rating: 5,
      achievement: "Portfolio Projects",
    },
    {
      name: "Aisha Patel",
      role: "Marketing Director",
      company: "Growth Marketing",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
      quote: "The flexibility to learn at my pace while maintaining a full-time job is priceless. The streak system and achievements keep me accountable. Best investment in my career.",
      rating: 5,
      achievement: "180 Day Streak",
    },
    {
      name: "James Wilson",
      role: "Entrepreneur",
      company: "StartupHub",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      quote: "Used NexusLMS to upskill my entire team. The analytics dashboard helps me track progress, and the ROI has been phenomenal. Our productivity increased by 40% in 6 months.",
      rating: 5,
      achievement: "Team Success",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background with texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-dark border border-purple-500/30 mb-8"
          >
            <Quote className="w-10 h-10 text-purple-400" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Loved by Learners
            </span>
            <br />
            <span className="text-foreground">Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real people who transformed their careers with NexusLMS
          </p>
        </motion.div>

        {/* Testimonials grid - Masonry style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                type: "spring",
                stiffness: 80,
              }}
              className={`group ${index % 3 === 1 ? 'md:translate-y-8' : ''}`}
            >
              <div className="relative h-full glass-dark rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10"
                />

                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Quote className="w-12 h-12 text-purple-400" />
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground/90 leading-relaxed mb-8 text-lg">
                    "{testimonial.quote}"
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent mb-6" />

                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple-500/30"
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <div className="mt-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-purple-500/20">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm text-purple-400 font-semibold">
                      {testimonial.achievement}
                    </span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-dark rounded-2xl border border-purple-500/20 p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "4.9/5", label: "Average Rating" },
                { value: "50K+", label: "Happy Learners" },
                { value: "98%", label: "Recommend Us" },
                { value: "10K+", label: "5-Star Reviews" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
