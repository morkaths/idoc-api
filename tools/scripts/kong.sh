#!/bin/bash

# Wait for Kong to be fully started
sleep 15

# Import service
curl -i -X POST http://localhost:8001/services \
  --data "name=auth-service" \
  --data "url=http://host.docker.internal:8080"

curl -i -X POST http://localhost:8001/services \
  --data "name=user-service" \
  --data "url=http://host.docker.internal:5001"

curl -i -X POST http://localhost:8001/services \
  --data "name=catalog-service" \
  --data "url=http://host.docker.internal:5002"

# Import route
curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data "name=auth-route" \
  --data "paths[]=/api/auth" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data "name=users-route" \
  --data "paths[]=/api/users" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data "name=roles-route" \
  --data "paths[]=/api/roles" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data "name=permissions-route" \
  --data "paths[]=/api/permissions" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data "name=profiles-route" \
  --data "paths[]=/api/profiles" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/catalog-service/routes \
  --data "name=books-route" \
  --data "paths[]=/api/books" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/catalog-service/routes \
  --data "name=authors-route" \
  --data "paths[]=/api/authors" \
  --data "strip_path=false"

curl -i -X POST http://localhost:8001/services/catalog-service/routes \
  --data "name=categories-route" \
  --data "paths[]=/api/categories" \
  --data "strip_path=false"