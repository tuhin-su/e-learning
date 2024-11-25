#!/bin/bash

# Define the virtual environment directory
VENV_DIR=".venv"

# Check if .venv exists
if [ -d "$VENV_DIR" ]; then
    echo "Activating existing virtual environment..."
else
    echo ".venv not found. Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create virtual environment."
        exit 1
    fi
    echo "Virtual environment created."
fi

# Activate the virtual environment
source "$VENV_DIR/bin/activate"
if [ $? -ne 0 ]; then
    echo "Error: Failed to activate virtual environment."
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        deactivate
        exit 1
    fi
else
    echo "requirements.txt not found. Skipping dependency installation."
fi

# Check for config.yml and copy from .config.yml if not found
if [ ! -f "config.yml" ]; then
    if [ -f ".config.yml" ]; then
        cp -p .config.yml config.yml
        echo "config.yml created from .config.yml."
    else
        echo "Error: .config.yml not found."
        deactivate
        exit 1
    fi
fi


python3 daemon.py
if [ $? -ne 0 ]; then
    echo "Error: Failed to run daemon.py."
    deactivate
    exit 1
fi

deactivate
