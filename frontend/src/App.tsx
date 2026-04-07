import { useState } from "react";
import type { LogFile, Benchmark } from "./types";
import { fetchLogs, fetchBenchmarks } from "./services/api";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [branch, setBranch] = useState<string>("dev");
  const [limit, setLimit] = useState<number>(10);

  const [logs, setLogs] = useState<LogFile[]>([]);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>("");

  const [graphData, setGraphData] = useState<any>(null);
  const [context, setContext] = useState<Record<string, unknown> | null>(null);

  const loadLogs = async () => {
    const logs = await fetchLogs(branch, limit);
    setLogs(logs);

    if (logs.length > 0) {
      const latest = await fetchBenchmarks(logs[0].file);
      setBenchmarks(latest.benchmarks);
      setContext(latest.context);
    }
  };

  const loadGraph = async () => {
    const values: (number | null)[] = [];

    for (const log of logs) {
      const res = await fetchBenchmarks(log.file);
      const bench = res.benchmarks.find(
        (b) => b.name === selectedBenchmark
      );

      values.push(bench ? bench.real_time : null);
    }

    setGraphData({
      labels: logs.map((l) => l.commit.slice(0, 7)),
      datasets: [
        {
          label: selectedBenchmark,
          data: values,
        },
      ],
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Benchmark Viewer</h1>

      {/* Controls */}
      <div>
        <input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="branch"
        />
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
        <button onClick={loadLogs}>Load Logs</button>
      </div>

      {/* Benchmark selector */}
      <div>
        <select
          value={selectedBenchmark}
          onChange={(e) => setSelectedBenchmark(e.target.value)}
        >
          <option value="">Select benchmark</option>
          {benchmarks.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <button onClick={loadGraph} disabled={!selectedBenchmark}>
          Load Graph
        </button>
      </div>

      {/* Graph */}
      {graphData && <Line data={graphData} />}

      {/* Commits */}
      <div>
        <h3>Commits</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.file}>
              {log.github ? (
                <a href={log.github} target="_blank">
                  {log.commit}
                </a>
              ) : (
                log.commit
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Context */}
      <div>
        <h3>Context</h3>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </div>
    </div>
  );
}