#!/usr/bin/env bash

install_dependency() {
    sudo apt update -y && sudo apt-get install -y v4l2loopback-dkms python3 python3-pip
}

detect_dependency() {
    local all_installed=true
    for package_name in "$@"; do
        if dpkg -l | grep -q "^ii  $package_name"; then
            echo "$package_name is installed."
        else
            echo "$package_name is not installed."
            all_installed=false
        fi
    done
    echo "$all_installed"
}

unload_v4l2loopback() {
    if lsmod | grep -q "^v4l2loopback"; then
        echo "v4l2loopback module is currently loaded. Unloading..."
        sudo modprobe -r v4l2loopback
        if [ $? -eq 0 ]; then
            echo "v4l2loopback module unloaded successfully."
        else
            echo "Failed to unload v4l2loopback module."
        fi
    else
        echo "v4l2loopback module is not loaded."
    fi
}

load_v4l2loopback() {
    if [ -e /dev/video2 ]; then
        echo "The virtual camera device (/dev/video2) already exists."
    else
        echo "The virtual camera device does not exist. Loading v4l2loopback module..."
        sudo modprobe v4l2loopback devices=1 video_nr=2 card_label="VirtualCam" exclusive_caps=1
        sudo chmod 666 /dev/video2  
        if [ $? -eq 0 ]; then
            echo "v4l2loopback module loaded successfully."
        else
            echo "Failed to load v4l2loopback module."
        fi
    fi
}

# Check if required dependencies are installed
if [ "$(detect_dependency v4l2loopback-dkms python3 python3-pip)" == "false" ]; then
    echo "Some dependencies are missing. Installing..."
    install_dependency
else
    echo "All dependencies are installed."
fi


unload_v4l2loopback
load_v4l2loopback
# Define the path to the .venv directory and the Python script
VENV_DIR=".venv"
SCRIPT_PATH="vm_camera.py"

# Check if the .venv directory exists
if [ -d "$VENV_DIR" ]; then
    echo "Virtual environment found at $VENV_DIR. Activating..."
    
    # Activate the virtual environment
    source "$VENV_DIR/bin/activate"
    
    # Run the Python script
    python3 "$SCRIPT_PATH"
    
    # Optionally deactivate the virtual environment after running the script
    deactivate
else
    echo "No virtual environment found at $VENV_DIR."
fi