#!/bin/bash
# CMD: bash tools/scripts/docker-start.sh

docker compose -f docker/docker-compose.kong.yml \
               -f docker/docker-compose.minio.yml \
               -f docker/docker-compose.redis.yml \
               --env-file docker/.env up -d