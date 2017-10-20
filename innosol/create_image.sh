#!/usr/bin/env bash

docker rm -f innosol

docker rmi innosol

docker image prune

docker volume prune

docker build -t innosol .