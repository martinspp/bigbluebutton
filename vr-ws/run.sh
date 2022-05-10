#!/bin/bash

docker build . --tag vr-ws-server
docker run -d -e 8765:8765 --name vr-ws-server vr-ws-server
