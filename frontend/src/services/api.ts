import type { LogFile, BenchmarkResponse } from "../types";

const API : string = (import.meta.env.VITE_API_URL as string) || ""

console.log("Using API URL: '", API, "' (set VITE_API_URL in .env to change this)");

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