#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Validate MODE variable
if [ -z "$MODE" ]; then
  echo "MODE variable is not set in .env file"
  exit 1
fi

if [ "$MODE" != "production" ] && [ "$MODE" != "development" ]; then
  echo "MODE variable is not set to 'production' or 'development' in .env file"
  exit 1
fi

# Function to run docker compose using the appropriate command
run_docker_compose() {
  if command -v docker-compose &> /dev/null; then
    docker-compose "$1" "$2" "$3"
  elif command -v docker &> /dev/null; then
    docker compose "$1" "$2" "$3"
  else
    echo "Neither 'docker-compose' nor 'docker compose' found"
    exit 1
  fi
}


# Execute the appropriate action based on the MODE
if [ "$MODE" == "production" ]; then
  run_docker_compose
  run_docker_compose stop angular
  echo "Production mode is enabled"

elif [ "$MODE" == "development" ]; then
  run_docker_compose up -d angular
  echo "Development mode is enabled"
fi
