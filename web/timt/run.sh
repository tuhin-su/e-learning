#!/bin/env bash

if [ ! -d "node_modules" ] && [ ! -f "./module" ]; then
    npm install
fi

ng serve --host 0.0.0.0 --port 4200 --disable-host-check