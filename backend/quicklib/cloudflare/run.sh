#!/bin/bash
# Script to create Docker network and start Cloudflare Tunnel

set -e

NETWORK_NAME=cloudflare-net

# Create the network if it doesn't exist
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || \
  docker network create --driver bridge $NETWORK_NAME

echo "Starting Cloudflare Tunnel on network $NETWORK_NAME..."
docker compose up -d
echo "Cloudflare Tunnel started."
