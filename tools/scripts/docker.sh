#!/bin/bash
# CMD: bash tools/scripts/docker.sh

docker compose -p idoc-stack -f docker/docker-compose.yml --env-file docker/.env up -d