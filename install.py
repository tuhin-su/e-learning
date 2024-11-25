import os
import subprocess

# Get current user and working directory
current_user = os.getenv("USER")
current_dir = os.getcwd()
script_path = os.path.join(current_dir, "run.sh")  # Assumes your script is named daemon.py

# Define the content of the service file
service_content = f"""[Unit]
Description=Git Auto Updater Service
After=network.target

[Service]
Type=simple
ExecStart=/bin/env bash {script_path}
Restart=always
User={current_user}
WorkingDirectory={current_dir}

[Install]
WantedBy=multi-user.target
"""

# Define the service file path
service_file_path = "/etc/systemd/system/e-learning.service"

# Function to execute shell commands
def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")

try:
    # Write the service file
    with open(service_file_path, "w") as service_file:
        service_file.write(service_content)
    print(f"Service file created at: {service_file_path}")

    # Reload systemd to recognize the new service
    print("Reloading systemd...")
    run_command("sudo systemctl daemon-reload")

    # Enable the service
    print("Enabling the service...")
    run_command(f"sudo systemctl enable e-learning.service")

    # Start the service
    print("Starting the service...")
    run_command(f"sudo systemctl start e-learning.service")

    # Check service status
    print("Checking service status...")
    run_command("sudo systemctl status e-learning.service")

except PermissionError:
    print("Permission denied. Please run the script with sudo to create and manage the service.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
