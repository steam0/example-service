#!/bin/bash

# This is a simple build script to perform auto pull, build, remove and run
SERVICE_NAME=example-service

git pull;
docker build -t $SERVICE_NAME -f x86/Dockerfile .
docker rm -f $SERVICE_NAME;
docker run -d -p 3003:3000 --name $SERVICE_NAME --restart always -e AUTH_SERVER_IP="10.0.1.7" -e AUTH_SERVER_PORT=8000 -e KAFKA_IP="10.0.1.7" -e KAFKA_PORT=2181 $SERVICE_NAME
