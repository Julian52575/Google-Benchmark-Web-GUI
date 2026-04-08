import type { LogFile, BenchmarkResponse } from "../types";

const API = (import.meta.env.VITE_API_URL || "http://localhost:" + (import.meta.env.BACKEND_PORT || "5502"));

export async function fetchLogs(branch: string, limit: number): Promise<LogFile[]> {
  const res = await fetch(`${API}/api/files?branch=${branch}&limit=${limit}`);

  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function fetchBenchmarks(file: string): Promise<BenchmarkResponse> {
  const res = await fetch(`${API}/api/benchmark?file=${file}`);

  if (!res.ok) throw new Error("Failed to fetch benchmarks");
  return res.json();
}