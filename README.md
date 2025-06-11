# TIMT COLLAGE MANAGEMENT SOFTWARE

## FOR BUILDING DOCKER IMAGE CHECK OUT
[Docker Install](https://docs.docker.com/engine/install/)
[Docker Images](https://github.com/tuhin-su/docker)

## BUILD DOCKER IMAGES
```bash
git clone https://github.com/tuhin-su/docker
cd docker
docker build --build-arg VERSION=latest  --build-arg HOST_UID=1000 -f mariadb.Dockerfile -t mariadb:local .
docker build --build-arg VERSION=latest  --build-arg HOST_UID=1000 -f angular.Dockerfile -t angular:local .
docker build --build-arg VERSION=latest  --build-arg HOST_UID=1000 -f flask.Dockerfile -t flask:local .
docker build --build-arg VERSION=latest  --build-arg HOST_UID=1000 -f phpmyadmin.Dockerfile -t phpmyadmin:local .
docker build --build-arg VERSION=latest  --build-arg HOST_UID=1000 -f mailhog.Dockerfile -t mailhog:local .
cd ..
rm -rf docker
```
# START CONTAINERS
```bash
cp -p stack.env
docker compose up -d
```

### ADD DEVELOPMENT DOMAIN

#### INSTALL DOCKER NETWORK TOOL (KALI LINUX ONLY)
```bash
git clone https://github.com/tuhin-su/docker-network-tool.git
cd docker-network-tool
sudo bash setup.sh
cd ..
rm -rf docker-network-tool
```
##### DOMAINS AUTOMATIC ADDED  ON HOST
```yml
timt.test:4200
admin.timt.test:5173
api.test
db.test
```

#### MANUAL PROCESS
```bash
echo "127.0.0.1 db.timt.test dba.timt.test api.timt.test timt.test admin.timt.test mailhog.timt.test" | sudo tee -a /etc/hosts > /dev/null
```