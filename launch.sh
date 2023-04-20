#!/bin/bash
# build main app image
echo "=============================Pulling Main App Image==================================="
docker pull kxykxyou/vetyouhome:vyhapp
echo "=============================Finished Building Image==================================="
# pull mysql & redis images
echo "=============================Pulling Mysql Image==================================="
docker pull mysql
echo "=============================Mysql Image Pulled==================================="
echo "=============================Pulling Redis Image==================================="
docker pull redis
echo "=============================Redis Image Pulled==================================="


# docker dompose launch all services
echo "=============================Docker Compose Up Services==================================="
docker-compose up -d

# check container running status
docker ps -a