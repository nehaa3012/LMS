"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Sparkles } from "lucide-react";

export default function AchievementsPreview() {
  const [achievements, setAchievements] = useState({
    unlocked: [],
    locked: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements({
        unlocked: data.unlocked || [],
        locked: data.locked || [],
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-full" />
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-2 bg-white/5 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const recentUnlocked = achievements.unlocked.slice(0, 3);
  const nextLocked = achievements.locked.slice(0, 2);
  const displayAchievements = [...recentUnlocked, ...nextLocked];

  return (
    <div className="space-y-3">
      {displayAchievements.map((achievement, index) => {
        const isUnlocked = achievements.unlocked.some((a) => a.id === achievement.id);

        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative group"
          >
            <div
              className={`glass rounded-lg p-4 border transition-all duration-300 ${
                isUnlocked
                  ? "border-purple-500/30 hover:border-purple-500/50 neon-purple"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              {/* Glow effect for unlocked */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-lg opacity-50" />
              )}

              <div className="relative z-10 flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`p-3 rounded-full ${
                    isUnlocked
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                      : "bg-white/5"
                  }`}
                >
                  {isUnlocked ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold text-sm ${
                        isUnlocked ? "text-purple-400" : "text-muted-foreground"
                      }`}
                    >
                      {achievement.name}
                    </h4>
                    {isUnlocked && (
                      <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                  {isUnlocked && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                      <span className="font-bold">+{achievement.points}</span>
                      <span>points</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-2"
      >
        <button className="w-full glass-dark rounded-lg p-3 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
          <span className="text-sm text-purple-400 group-hover:text-purple-300 flex items-center justify-center gap-2">
            View All Achievements
            <Trophy className="w-4 h-4" />
          </span>
        </button>
      </motion.div>

      {displayAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Lock className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No achievements yet</p>
          <p className="text-xs mt-1">Start learning to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}
