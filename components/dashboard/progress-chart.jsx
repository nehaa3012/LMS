"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProgressChart() {
  // Mock data - in production, this would come from study-session API
  const data = [
    { date: "Mon", minutes: 45 },
    { date: "Tue", minutes: 62 },
    { date: "Wed", minutes: 38 },
    { date: "Thu", minutes: 71 },
    { date: "Fri", minutes: 55 },
    { date: "Sat", minutes: 85 },
    { date: "Sun", minutes: 92 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-lg p-3 border border-cyan-500/30">
          <p className="text-sm font-medium">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-cyan-400">
            {payload[0].value} mins
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#colorMinutes)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
