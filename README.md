# Google benchmark Web GUI  

Simplest gui viewer and comparer for google benchmarks.     


## Prerequisites

1. A directory to store the benchmarks logs. `/var/benchmarksResults/` by default.
2. A C++ project that runs google benchmarks and exports the results as json (`./benchmarkSuite --benchmark_out_format=json --benchmark_out=$BENCHMARK_DIR/$GIT_BRANCH/$GIT_COMMIT_HASH`).


## Configuration

`.env` exposes the following variables that you are free to update:

| name | usage | default |
| ---- | ----- | ------- |
| GITHUB_REPO | The repository that hosts the project, used to read commit comment |  |
| BACKEND_PORT | The port to exposes the backend to | 5502 |
| FRONTEND_PORT | The port to exposes the frontend to | 5501 |
| BENCHMARK_DIR=/var/benchmarksResults/myrepository/ | The directory that hosts the benchmarks logs | /var/benchmarksResults/myrepository/ | 
| VITE_API_URL="" | The backend url if you want/need to host it on another machine that the frontend |  |
------------------------- 

## Setup (Containers)

### Without docker (nix & podman)

If you don't want to install docker on your machine, you can use podman inside a nix shell instead.     
No prior knowledge of nix is required.  

1. Install nix from this 1 command: `curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install` [more details](https://determinate.systems/nix-installer/).
2. Run `nix-shell` to let nix download and load the dependencies into a temporary shell.
3. Ensure the output is similar:
```
Let's try podman:
podman version 5.0.3
podman version 5.0.3
podman-compose version 1.1.0
```

### With docker

`./run.sh` and `./stop.sh`.     
You can then access the dashboard at `localhost:$FRONTEND_PORT`.    

---
