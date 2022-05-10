#!/bin/bash

docker build . --tag vr-ws-server
docker rm -f vr-ws-server
docker run -d -p 8765:8765 --name vr-ws-server vr-ws-server
