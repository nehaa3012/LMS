"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  gradient,
  iconColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className={`glass-dark rounded-xl p-6 border border-white/5 hover-lift relative overflow-hidden`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-background/50 ${iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  trend.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {trend.value}%
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-500/10 to-transparent" />
      </div>
    </motion.div>
  );
}
