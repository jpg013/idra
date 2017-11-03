#!/usr/bin/env bash

docker rm -f twitter-service

docker rmi twitter-service

docker image prune

docker volume prune

docker build -t twitter-service .
