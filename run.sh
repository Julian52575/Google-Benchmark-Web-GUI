#!/bin/bash

CONTAINER_RUNTIME=""
# Check if podman or docker is available
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
else
    echo "Neither podman nor docker is installed. Please install one of them to run the application."
    exit 1
fi

. backend/.env
if [ ! -d ${BENCHMARK_DIR} ]; then
    echo 'Benchmark directory does not exist. Creating...'
    mkdir -p ${BENCHMARK_DIR} --verbose

    if [ $? -ne 0 ]; then
        echo "Failed to create benchmark directory. Please check permissions and try again."
        exit 1
    fi
fi;

$CONTAINER_RUNTIME-compose up --build --remove-orphans --force-recreate