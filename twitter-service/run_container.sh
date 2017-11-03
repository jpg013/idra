#!/usr/bin/env bash

docker run -p 3040:3040 --env-file ./env twitter-service
