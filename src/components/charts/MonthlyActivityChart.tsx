"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IMonthlyData } from "@/types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function MonthlyActivityChart({
  usersData,
  projectsData,
}: {
  usersData: IMonthlyData[];
  projectsData: IMonthlyData[];
}) {
  // Merge both datasets into a unified month-keyed structure
  const monthMap = new Map<string, { month: string; users: number; projects: number }>();

  usersData.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    const label = `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`;
    monthMap.set(key, { month: label, users: item.count, projects: 0 });
  });

  projectsData.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    const label = `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`;
    const existing = monthMap.get(key);
    if (existing) {
      existing.projects = item.count;
    } else {
      monthMap.set(key, { month: label, users: 0, projects: item.count });
    }
  });

  const chartData = Array.from(monthMap.values());

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No activity data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        />
        <Legend verticalAlign="bottom" height={36} />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#4F46E5"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="New Users"
        />
        <Line
          type="monotone"
          dataKey="projects"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="New Projects"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
