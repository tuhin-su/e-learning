#!/bin/env bash

if [ ! -d "node_modules" ] && [ ! -f "./module" ]; then
    npm install
fi

if [ -n "$API_URL" ]; then
    sed -i "s|%%API_URL%%|$API_URL|g" src/assets/config.js
else
    echo "API_URL environment variable is not set."
fi

# Check if MODE is set to "development"
if [ "$MODE" = "DEVELOPMENT" ]; then
    echo "Running Angular development server..."
    ng serve --host 0.0.0.0 --port 4200 --disable-host-check
else
    echo "MODE is not development. Skipping Angular server."
    ng build
fi

# Keep the container running
echo "Entering sleep mode..."
sleep infinity
