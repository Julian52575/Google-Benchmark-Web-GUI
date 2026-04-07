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

$CONTAINER_RUNTIME-compose down --remove-orphans