#!/bin/bash

# Check if the directory exists
if [ -d "$HOME/e-learning" ]; then
    # Navigate to the project directory
    cd "$HOME/e-learning" || exit
    
    # Fetch the latest changes without merging
    git fetch origin
    
    # Check the latest commit message on the remote repository for the "pull-server" keyword
    if git log origin/main -1 --pretty=%B | grep -q "pull-server"; then
        # Pull the changes if the keyword is found
        git pull origin main
    else
        echo "No 'pull-server' keyword found in the latest commit."
    fi
else
    echo "Directory ~/e-learning/ does not exist."
fi



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
    docker-compose "$@"
  elif command -v docker &> /dev/null; then
    docker compose "$@"
  else
    echo "Neither 'docker-compose' nor 'docker compose' found"
    exit 1
  fi
}


# Execute the appropriate action based on the MODE
if [ "$MODE" == "production" ]; then
  run_docker_compose up -d cloudflare-tunnel
  echo "Production mode is enabled"

elif [ "$MODE" == "development" ]; then
  run_docker_compose up -d angular
  echo "Development mode is enabled"
fi
