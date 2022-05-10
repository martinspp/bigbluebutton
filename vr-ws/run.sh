#!/bin/bash

if [[ "$(docker images -q vr-ws-server:latest 2> /dev/null)" == "" ]]; then
  docker build . --tag vr-ws-server
fi
docker rm -f vr-ws-server
docker run -d -p 8765:8765 --name vr-ws-server vr-ws-server
