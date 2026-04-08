# Google benchmark Web GUI  

Simplest gui viewer and commit comparer for google benchmarks.     

<img width="1242" height="770" alt="image" src="https://github.com/user-attachments/assets/90072ea3-baca-419a-81fc-82fab6598d55" />    

#### All this from 2 docker containers and 1 folder !

## Prerequisites

1. A **directory** to store the benchmarks logs.
> [!IMPORTANT]
> The logs should follow this **naming convention**: benchmarkresults_${COMMIT}_${GIT_BRANCH}.json    
> where `COMMIT=$(git rev-parse HEAD) && GIT_BRANCH=$(git branch --show-current)`.

2. A C++ project that **runs google benchmarks and exports the results as json** (`./benchmarkSuite --benchmark_out_format=json --benchmark_out=$BENCHMARK_DIR/$GIT_BRANCH/$GIT_COMMIT_HASH/benchmarkresults_${COMMIT_FULL_HASH}_${GIT_BRANCH}.json`).

3. _Optional_: A runner ([maybe a Jenkins like this one](https://github.com/Julian52575/Hylozoa-Engine-Jenkins/tree/main) ?) that builds the benchmarks logs and exposes them automatically.

## Configuration

`.env` exposes the following variables that you are free to update:

| name | usage | default |
| ---- | ----- | ------- |
| GITHUB_REPO | The repository that hosts the project, used to link to commits |  |
| FRONTEND_PORT | The port to expose the frontend to | 5501 |
| BENCHMARK_DIR= | The directory that hosts the benchmarks logs | /var/benchmarksResults/myrepository/ |
| VITE_API_URL="" | The backend url if you want/need to host it on another machine that the frontend |  |

> [!IMPORTANT]
> If you plan on having a runner, make sure it has read/write access to the $BENCHMARK_DIR.

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
