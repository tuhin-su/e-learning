#!/bin/env bash

# Check if the .venv directory exists, if not, create and activate the virtual environment
if [ ! -d ".venv" ]; then
    pip install virtualenv
    python3 -m virtualenv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
fi

# Activate the virtual environment
source .venv/bin/activate

# Run your Python script if needed
python3 app.py

# Sleep indefinitely
# sleep infinity
