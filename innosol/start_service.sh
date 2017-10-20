#!/usr/bin/env bash

docker service create --name innosol -p 3030:3030 --env-file env innosol
