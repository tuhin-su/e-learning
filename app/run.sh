#!/bin/env bash

# Check if the .venv directory exists, if not, create and activate the virtual environment
if [ ! -d ".venv" ]; then
    apt update -y && apt install build-essential cmake libgtk-3-dev libboost-python-dev -y

    pip install virtualenv
    python3 -m virtualenv .venv
fi

# Activate the virtual environment
source .venv/bin/activate
pip install -r requirements.txt

# Run your Python script if needed
python3 app.py
# sleep infinity
