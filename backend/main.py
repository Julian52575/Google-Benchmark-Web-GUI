import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pathlib import Path

app = FastAPI()

BENCH_DIR = Path(os.getenv("BENCHMARK_DIR", "/data"))
GITHUB_REPO = os.getenv("GITHUB_REPO", "https://github.com/user/repo")

# allow frontend origin if not VITE_API_URL
origins = []

if not os.getenv("VITE_API_URL"):
    origins.append("http://localhost:" + (os.getenv("FRONTEND_PORT", "5501")))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_filename(filename: str):
    # benchmarkresults_<commit>_<branch>.json
    if not filename.startswith("benchmarkresults_"):
        return None

    try:
        _, commit, branch_json = filename.split("_", 2)
        branch = branch_json.replace(".json", "")
        return {
            "commit": commit,
            "branch": branch,
            "file": filename,
        }
    except ValueError:
        return None


def get_files():
    files = []
    for f in BENCH_DIR.iterdir():
        parsed = parse_filename(f.name)
        if parsed:
            files.append(parsed)
    return files


@app.get("/api/files")
def get_files_endpoint(branch: str = "dev", limit: int = 10):
    files = [
        f for f in get_files()
        if f["branch"] == branch
    ]

    files.sort(
        key=lambda f: (BENCH_DIR / f["file"]).stat().st_mtime,
        reverse=True
    )

    files = files[:limit]

    return [
        {
            **f,
            "github": f"{GITHUB_REPO}/commit/{f['commit']}"
        }
        for f in files
    ]


@app.get("/api/benchmark")
def get_benchmarks(file: str):
    full_path = BENCH_DIR / file

    if not full_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    with open(full_path) as f:
        data = json.load(f)

    benchmarks = [
        {
            "name": b["run_name"],
            "iterations": b["iterations"],
            "real_time": b["real_time"],
        }
        for b in data["benchmarks"]
    ]

    return {
        "context": data["context"],
        "benchmarks": benchmarks
    }