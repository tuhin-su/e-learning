#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Validate NODE_ENV variable
if [ -z "$MODE" ]; then
  echo "MODE variable is not set in .env file"
  exit 1
fi

if [ "$MODE" != "production" ] && [ "$MODE" != "development" ]; then
  echo "MODE variable is not set to 'production' or 'development' in .env file"
  exit 1
fi

if [ "$MODE" == "production" ]; then
  docker compose up -d cloudflare-tunnel
  echo "Production mode is enabled"
elif [ "$MODE" == "development" ]; then
  docker compose up -d angular
  echo "Development mode is enabled"
fi