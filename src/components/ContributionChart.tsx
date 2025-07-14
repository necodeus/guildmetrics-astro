"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ContributionChartType = {
    rawData: {
        handle: string;
        calendar: { date: string; count: number }[];
    }[];
};

export default function ContributionChart({
  rawData,
}: ContributionChartType) {
  const data = mapForStackedBar(rawData);
  const months = getAvailableMonths(data);
  const [selectedMonth, setSelectedMonth] = useState(months.at(-1) ?? "");

  const filteredData = filterByMonth(data, selectedMonth);
  const userKeys = Object.keys(data[0] ?? {}).filter((k) => k !== "date");

  const isDark = useDarkMode();

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-5 py-2 rounded-[4px] text-m cursor-pointer ${
              selectedMonth === month
                ? "bg-blue-600 text-white"
                : "text-black dark:text-white bg-[#f2f2f2] hover:bg-[#eaeaea] dark:bg-[#0c0c0c] dark:hover:bg-[#121212] border border-black/10 dark:border-white/10"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: 300, }} className="min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            style={{
              background: isDark ? "#111827" : "#fff",
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{
                fill: isDark ? "#374151" : "#e5e7eb",
                opacity: 0.5,
              }}
            />
            {userKeys.map((user, index) => (
              <Bar
                key={user}
                dataKey={user}
                stackId="1"
                fill={`hsl(${index * 40}, 70%, 60%)`}
                activeBar={{
                  fillOpacity: 1,
                  stroke: isDark ? "#fff" : "#000",
                  strokeWidth: 1,
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getAvailableMonths(data: Record<string, any>[]): string[] {
  const months = new Set<string>();
  data.forEach((row) => {
    if (typeof row.date === "string") {
      months.add(row.date.slice(0, 7));
    }
  });
  return Array.from(months).sort();
}

const CustomTooltip = ({ payload, label, isDark }: any) => {
  if (!payload || !payload.length) return null;

  const filtered = payload.filter((entry: any) => entry.value > 0);
  const sorted = filtered.sort((a: any, b: any) => b.value - a.value);

  return (
    <div
      className="p-2 rounded shadow"
      style={{
        backgroundColor: isDark ? "#1f2937" : "#fff",
        color: isDark ? "#fff" : "#000",
      }}
    >
      <p className="font-medium text-sm">{label}</p>
      <hr
        style={{
          borderColor: isDark ? "#374151" : "#e5e7eb",
          margin: "8px 0 4px 0",
        }}
      />
      <ul>
        {sorted.map((entry: any, index: number) => (
          <li key={index} style={{ color: entry.color }}>
            {entry.name}: {Math.round(entry.value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

function mapForStackedBar(
  users: {
    handle: string;
    calendar: { date: string; count: number }[];
  }[]
): Record<string, any>[] {
  const allDates = new Set<string>();
  const handles = users.map((u) => u.handle);

  users.forEach((user) => {
    user.calendar.forEach((d) => allDates.add(d.date));
  });

  const sortedDates = Array.from(allDates).sort();

  const dataByDate = new Map<string, Record<string, any>>();
  sortedDates.forEach((date) => {
    const row: Record<string, any> = { date };
    handles.forEach((handle) => {
      row[handle] = 0;
    });
    dataByDate.set(date, row);
  });

  users.forEach((user) => {
    user.calendar.forEach(({ date, count }) => {
      const row = dataByDate.get(date);
      if (row) {
        row[user.handle] = count;
      }
    });
  });

  return Array.from(dataByDate.values());
}

function filterByMonth(
  data: Record<string, any>[],
  month: string
): Record<string, any>[] {
  return data.filter((row) => row.date.startsWith(month));
}

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const darkMode = htmlElement.classList.contains("dark");
    setIsDark(darkMode);
    const observer = new MutationObserver(() => {
      const darkMode = htmlElement.classList.contains("dark");
      setIsDark(darkMode);
    });
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }, []);

  return isDark;
}
