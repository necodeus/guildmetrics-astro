"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HandlersCombinedCalendarResponse } from "../myApi";

type ContributionChartType = {
  rawData: HandlersCombinedCalendarResponse;
};

export default function ContributionChart({ rawData }: ContributionChartType) {
  const data = useMemo(() => mapForStackedBar(rawData), [rawData]);
  const months = getAvailableMonths(data);
  const [selectedMonth, setSelectedMonth] = useState(months.at(-1) ?? "");

  const filteredData = filterByMonth(data, selectedMonth);
  const userKeys = useMemo(() => {
    return Object.keys(rawData.handles || {}).filter((handle) =>
      filteredData.some((row) => row[handle] > 0)
    );
  }, [rawData, filteredData]);

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

      <div style={{ width: "100%", height: 300 }} className="min-h-[300px]">
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
              content={<CustomTooltip isDark={isDark} rawData={rawData} />}
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
                isAnimationActive={false}
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

const CustomTooltip = ({ payload, label, isDark, rawData }: any) => {
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
            {rawData?.handles?.[entry.name] ?? entry.name}:{" "}
            {Math.round(entry.value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

function mapForStackedBar(
  raw: HandlersCombinedCalendarResponse
): Record<string, any>[] {
  const dataByDate = new Map<string, Record<string, any>>();
  const allHandles = Object.keys(raw.handles ?? {});
  
  const newCalendar: Record<string, Record<string, Record<string, number>>> = {};

  const sources = [raw.calendar, raw.github_calendar];
  for (const source of sources) {
    for (const month in source) {
      if (!newCalendar[month]) {
        newCalendar[month] = {};
      }
      const days = source[month];
      for (const date in days) {
        if (!newCalendar[month][date]) {
          newCalendar[month][date] = {};
        }
        const handles = days[date];
        for (const handle in handles) {
          newCalendar[month][date][handle] =
            (newCalendar[month][date][handle] ?? 0) + handles[handle];
        }
      }
    }
  }

  for (const month in newCalendar) {
    const days = newCalendar[month];
    for (const date in days) {
      const handles = days[date];
      if (!dataByDate.has(date)) {
        const row: Record<string, any> = { date };
        allHandles.forEach((h) => (row[h] = 0));
        dataByDate.set(date, row);
      }
      const row = dataByDate.get(date)!;
      for (const handle in handles) {
        row[handle] = handles[handle];
      }
    }
  }

  const sortedDates = Array.from(dataByDate.keys()).sort();
  return sortedDates.map((date) => dataByDate.get(date)!);
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
