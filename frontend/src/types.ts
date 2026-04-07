export interface LogFile {
  commit: string;
  branch: string;
  file: string;
  github: string | null;
}

export interface Benchmark {
  name: string;
  iterations: number;
  real_time: number;
}

export interface BenchmarkResponse {
  context: Record<string, unknown>;
  benchmarks: Benchmark[];
}