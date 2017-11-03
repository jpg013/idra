#!/usr/bin/env bash

docker rm -f users

docker rmi users

docker image prune

docker volume prune

docker build -t users .
