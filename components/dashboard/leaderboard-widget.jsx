"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Flame } from "lucide-react";
import Image from "next/image";

export default function LeaderboardWidget() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 2 minutes
    const interval = setInterval(fetchLeaderboard, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard?limit=10");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankGradient = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-orange-500/20";
      case 2:
        return "from-gray-300/20 to-gray-400/20";
      case 3:
        return "from-amber-600/20 to-amber-700/20";
      default:
        return "from-cyan-500/10 to-transparent";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full" />
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

  return (
    <div className="space-y-2">
      {leaderboard.map((entry, index) => (
        <motion.div
          key={entry.user.email || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="relative group"
        >
          <div className={`glass rounded-lg p-3 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden`}>
            {/* Background gradient for top 3 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(entry.rank)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex items-center gap-3">
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="relative">
                {entry.user.imageUrl ? (
                  <Image
                    src={entry.user.imageUrl}
                    alt={entry.user.firstName}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-cyan-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    {entry.user.firstName?.[0]}
                    {entry.user.lastName?.[0]}
                  </div>
                )}
                {entry.rank <= 3 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-background flex items-center justify-center">
                    <span className="text-[8px] font-bold text-black">{entry.rank}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {entry.user.firstName} {entry.user.lastName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {entry.streak}
                  </span>
                  <span>•</span>
                  <span>{entry.coursesCompleted} courses</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="text-sm font-bold text-cyan-400">{entry.points}</p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No leaderboard data yet</p>
        </div>
      )}
    </div>
  );
}
