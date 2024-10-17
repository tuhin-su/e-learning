#!/bin/env bash

if [ ! -d "node_modules" ] && [ ! -f "./module" ]; then
    npm install
fi

if [ -n "$API_URL" ]; then
    sed -i "s|%%API_URL%%|$API_URL|g" src/assets/config.js
else
    echo "API_URL environment variable is not set."
fi

ng serve --host 0.0.0.0 --port 4200 --disable-host-check
