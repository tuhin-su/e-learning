#!/usr/bin/env python
import docker
from rich import print
from dotenv import load_dotenv
import os
import subprocess
from modules.bot import Bot
import threading
import yaml
import logging
from datetime import datetime
import git
import time

load_dotenv()

bot =  Bot(os.getenv('BOT_KEY'), os.getenv('CHANNEL_ID'), os.getenv("SERVER_NAME"), os.getenv('BOT_ENABLE'))
running_server = {}
current_date = datetime.now().strftime("%Y-%m-%d")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(f"logs/{current_date}_error.log"),  # Use the date in the filename
        logging.StreamHandler()
    ]
)

logging.basicConfig(
    level=logging.ERROR,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(f"logs/{current_date}_info.log"),  # Use the date in the filename
        logging.StreamHandler()
    ]
)
# Create a logger
logger = logging.getLogger(__name__)

class GitAutoUpdater:
    def __init__(self, server, repo_path, check_line, check_interval=5 * 3600):
        self.repo_path = repo_path
        self.check_line = check_line
        self.check_interval = check_interval
        self.server = server

        try:
            self.repo = git.Repo(repo_path)
        except git.exc.InvalidGitRepositoryError:
            raise ValueError(f"'{repo_path}' is not a valid Git repository.")

    def fetch_and_check(self):
        print(f"[{datetime.now()}] Fetching updates...")
        self.repo.git.fetch('--all')

        # Check for new commits in the remote branch
        remote_branch = f"origin/{self.repo.active_branch.name}"
        print(f"[{datetime.now()}] Checking commits on branch '{remote_branch}'...")

        for commit in self.repo.iter_commits(f'{self.repo.active_branch}..{remote_branch}'):
            print(f"Checking commit: {commit.hexsha[:7]} - {commit.message.strip()}")
            if self.check_line in commit.message:
                print(f"[{datetime.now()}] Found '{self.check_line}' in commit {commit.hexsha[:7]}. Pulling updates...")
                self.repo.git.pull('origin', self.repo.active_branch.name)
                bot.send_message(f"applyed {commit.hexsha[:7]} found: {commit.message.strip()}")
                logger.info(f"applyed {commit.hexsha[:7]} found: {commit.message.strip()}")
                if self.server != None:
                    self.server.restart()
                return
        print(f"[{datetime.now()}] No commits with '{self.check_line}' found.")

    def start(self):
        while True:
            try:
                self.fetch_and_check()
            except Exception as e:
                print(f"[{datetime.now()}] Error during update check: {e}")
            print(f"[{datetime.now()}] Sleeping for {self.check_interval / 3600} hours...\n")
            time.sleep(self.check_interval)

class DockerComposeManager:
    def __init__(self, compose_file="service.yml"):
        self.compose_file = compose_file
        self.client = docker.from_env()

    def load_services(self):
        """Ensure the Docker Compose file is loaded."""
        if not os.path.exists(self.compose_file):
            raise FileNotFoundError(f"{self.compose_file} not found.")
        logger.error(f"Docker Compose file {self.compose_file} loaded successfully.")

    def start_service(self, service_name):
        """Start a specific service/container."""
        try:
            subprocess.run(
                ["docker-compose", "-f", self.compose_file, "up", "-d", service_name],
                env=os.environ,
                check=True
            )
            logger.info(f"Service {service_name} started successfully.")
        except subprocess.CalledProcessError as e:
            logger.error(f"Error starting service {service_name}: {e}")

    def restart_all(self):
        """Restart all services."""
        try:
            subprocess.run(
                ["docker-compose", "-f", self.compose_file, "restart"],
                env=os.environ,
                check=True
            )
            logger.info("All services restarted successfully.")
        except subprocess.CalledProcessError as e:
            logger.error(f"Error restarting services: {e}")
    def stop_service(self, service_name):
        """Stop a specific service/container."""
        try:
            subprocess.run(
                ["docker-compose", "-f", self.compose_file, "stop", service_name],
                env=os.environ,
                check=True
            )
            logger.info(f"Service {service_name} stopped successfully.")
        except subprocess.CalledProcessError as e:
            logger.error(f"Error stopping service {service_name}: {e}")

    def restart_service(self, service_name):
        """Restart a specific service/container."""
        try:
            self.stop_service(service_name)
            self.start_service(service_name)
        except Exception as e:
            logger.error(f"Error restarting service {service_name}: {e}")

    def remove_service(self, service_name):
        """Remove a specific service/container."""
        try:
            subprocess.run(
                ["docker-compose", "-f", self.compose_file, "rm", "-f", service_name],
                env=os.environ,
                check=True
            )
            logger.info(f"Service {service_name} removed successfully.")
        except subprocess.CalledProcessError as e:
            logger.error(f"Error removing service {service_name}: {e}")

    def service_status(self, service_name):
        """Get the status of a specific service/container."""
        try:
            subprocess.run(
                ["docker-compose", "-f", self.compose_file, "ps", service_name],
                env=os.environ,
                check=True
            )
        except subprocess.CalledProcessError as e:
            logger.error(f"Error retrieving status for service {service_name}: {e}")

    def event_listener(self):
            global running_server
            try:
                for event in self.client.events(decode=True):
                    if event["Type"] == "container":
                        status = event.get("status")
                        container_id = event.get("id")[:12]
                        container_name = event["Actor"]["Attributes"].get("name", "unknown")
                      
                        running_server[container_name] = {
                            "id": container_id,
                            "status":status
                        }
                        msg = f"Container Event: {status} | ID: {container_id} | Name: {container_name}"
                        bot.send_message(msg)
                        if status == "die":
                            print(f"Container {container_name} ({container_id}) died.")
                            logger.error(self.client.containers.get(container_name).logs())
                        elif status == "start":
                            print(f"Container {container_name} ({container_id}) started.")
                        elif status == "stop":
                            print(f"Container {container_name} ({container_id}) stopped.")
                            self.restart_service(container_name)
                        elif status == "restart":
                            print(f"Container {container_name} ({container_id}) restarted.")

            except Exception as e:
                logger.error(f"Error listening to Docker events: {e}")
      
       

    def show_service_list(self) -> dict:
        try:
            with open(self.compose_file, 'r') as file:
                compose_data = yaml.safe_load(file)
                services = compose_data.get("services", {})
                if services:
                    return services.keys()
                else:
                    logger.error("No services found in the Docker Compose file.")
        except Exception as e:
            logger.error(f"Error loading services: {e}")

class Server:
    def __init__(self):
        self.server_conf_src_file_path = "servers/conf" 
        self.server_conf_dest_file_path = "nginx/conf.d"
        self.server_src_path = "servers"
        self.server_dest_path = "service.yml"
        self.manager = None
        self.name = os.getenv("SERVER_NAME")
        self.config = yaml.safe_load(open("config.yml", "r"))
        self.setEnvironment()
        self.line_to_check = "update_api"
        self.git = GitAutoUpdater(self, "./", self.line_to_check )

    def restart(self):
        self.manager.restart_all()

    def setEnvironment(self):
        os.environ["TUNNEL_TOKEN"] = self.config["TUNNEL"]["TOKEN"]
        os.environ["MODE"] = self.config["MODE"]

        os.environ["DB_HOST"] = self.config["DATABASE"]["HOST"]
        os.environ["DB_ROOT_PASSWORD"] = self.config["DATABASE"]["ROOT_PASSWORD"]
        os.environ["DB_NAME"] = self.config["DATABASE"]["NAME"]
        os.environ["DB_USER"] = self.config["DATABASE"]["USER"]
        os.environ["DB_PASSWORD"] = self.config["DATABASE"]["PASSWORD"]

        os.environ["ADDRESS"] = self.config["API"]["ADDRESS"]
        os.environ["PORT"] = str(self.config["API"]["PORT"])
        os.environ["LOG"] = str(self.config["API"]["LOG"])
        os.environ["API_URL"] = self.config["API"]["API_URL"]
        os.environ["SECRET_KEY"] = self.config["API"]["SECRET_KEY"]

        os.environ["SERVER_NAME"] = self.config["SERVER"]["NAME"]
        os.environ["SERVER_PORT"] = str(self.config["SERVER"]["PORT"])
        os.environ["BOT_ENABLE"] = str(self.config["BOT"]["ENABLE"])
        os.environ["BOT_KEY"] = self.config["BOT"]["KEY"]
        os.environ["CHANNEL_ID"] = self.config["BOT"]["CHANNEL_ID"]

        
    def createService(self):
        folder_path = self.server_src_path
        service_data = {}
        files = [
            file for file in os.listdir(folder_path)
            if file.endswith('.yml') and os.path.isfile(os.path.join(folder_path, file))
        ]

        for file in files:
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r') as yaml_file:
                # Load all YAML documents in the file
                yaml_data = list(yaml.load_all(yaml_file, Loader=yaml.FullLoader))

                # Process the data if it's not empty
                if yaml_data and isinstance(yaml_data[0], dict):
                    first_key = list(yaml_data[0].keys())[0]
                    
                    if first_key in self.config["REPLICAS"]:
                        # Add the data three times with modified keys and container names
                        for count in range(1, self.config["REPLICAS"][first_key] + 1):
                            for document in yaml_data:
                                if document:
                                    # Modify the document's first key with the count suffix
                                    modified_document = {}
                                    for key, value in document.items():
                                        if key == first_key:
                                            modified_document[f"{key}_{count}"] = value
                                        else:
                                            modified_document[key] = value
                                    service_data.update(modified_document)
                    else:
                        # Add the data once without modifying keys
                        for document in yaml_data:
                            if document:
                                service_data.update(document)

        # Wrap the data under the "service" label
        output_data = {"services": service_data}
       
        # Write the aggregated data to service.yml
        output_file = self.server_dest_path
        with open(output_file, 'w') as yaml_output:
            yaml.dump(output_data, yaml_output, default_flow_style=False)

        print(f"Aggregated data has been written to {output_file}")

    def modify_upstream_block(self, content, name, data):
            ips=''
            content = content.split("server 127.0.0.1")
            port = content[1].split(";")[0]
            
            for i in data:
                ips += f"server {i}{port};\n"
            
            content[1] = content[1].replace(str(port)+";\n", ips)
            content = "".join(content)
            return content



    def deploy(self):
        self.createService()
        self.manager = DockerComposeManager(compose_file="service.yml")
        self.manager.load_services()

        if not self.config["MODE"]:
            print("Please set the MODE in the config.yml file.")
            raise Exception("MODE not set in config.yml")
        
        service = self.config[self.config['MODE']]

        if not self.manager.show_service_list():
            raise Exception("No services defined in the Docker Compose file.")
        
        for i in self.manager.show_service_list():
            for j in service["contaners"]:
                if j in i:
                    self.manager.start_service(i)
                    print(f"Service {i} started successfully.")
        
        self.genrateLoadBlanser()
        monitroer = threading.Thread(target=self.manager.event_listener, daemon=True)
        updater = threading.Thread(target=self.git.start, daemon=True)
        print("[green]Docker event listener started.")
        monitroer.start()
        updater.start()
        monitroer.join()

    def genrateLoadBlanser(self):
        blance = False
        for i in self.config[self.config["MODE"]]["contaners"]:
                # if enable and container is in the list
                if self.config[self.config["MODE"]]["load_balanser"]:
                    if i in self.config["REPLICAS"]:
                        blance = True


                # check any config have or not
                if os.path.isfile(f"{self.server_conf_src_file_path}/{i}.conf"):
                    with(open(f"{self.server_conf_src_file_path}/{i}.conf", "r")) as f:
                        data = f.read()
                
                    if blance:
                        host_s = []
                        for j in self.manager.show_service_list():
                            if i in j:
                                host_s.append(j)

                        print(host_s,end="\n\n")

                        with(open(f"{self.server_conf_dest_file_path}/{i}.conf", "w")) as f:
                            f.write(self.modify_upstream_block(data, name=i, data=host_s))
                        
                        blance = False
                    else:
                        data = data.replace("127.0.0.1", i)
                
                        with(open(f"{self.server_conf_dest_file_path}/{i}.conf", "w")) as f:
                            f.write(data)
                        logger.info(f"File {i}.conf has been generated successfully.")
                else:
                    logger.info(f"File {i}.conf not found.")
        self.manager.restart_service(self.config[self.config["MODE"]]["blanser_name"])

if __name__ == "__main__":
    server = Server()
    server.deploy()