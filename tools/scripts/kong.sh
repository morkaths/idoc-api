#!/bin/bash
# CMD: bash tools/scripts/kong.sh

KONG_ADMIN="http://localhost:8001"

# Helper functions
function create_service() {
  local name=$1
  local url=$2
  echo "Creating service: $name"
  curl -i -s -X POST $KONG_ADMIN/services \
    --data "name=$name" \
    --data "url=$url" > /dev/null
}

function create_route() {
  local service=$1
  local name=$2
  local path=$3
  echo "Creating route: $name for $service"
  curl -i -s -X POST $KONG_ADMIN/services/$service/routes \
    --data "name=$name" \
    --data "paths[]=$path" \
    --data "strip_path=false" > /dev/null
}

function add_plugin() {
  local service=$1
  shift
  echo "Adding plugin to $service"
  curl -i -s -X POST $KONG_ADMIN/services/$service/plugins \
    "$@" > /dev/null
}

function add_global_plugin() {
  echo "Adding global plugin"
  curl -i -s -X POST $KONG_ADMIN/plugins \
    "$@" > /dev/null
}

echo "Waiting for Kong to start..."
sleep 5

# === Services ===
create_service "gateway"            "http://host.docker.internal:5000"
create_service "auth-service"       "http://host.docker.internal:8080"
create_service "statistics-service" "http://host.docker.internal:8085"
create_service "user-service"       "http://host.docker.internal:5001"
create_service "catalog-service"    "http://host.docker.internal:5002"
create_service "file-service"       "http://host.docker.internal:5003"
create_service "borrow-service"     "http://host.docker.internal:5004"

# === Routes ===
# Gateway
create_route "gateway" "docs-route" "/api/docs"

# Auth Service
create_route "auth-service" "auth-route"        "/api/auth"
create_route "auth-service" "users-route"       "/api/users"
create_route "auth-service" "roles-route"       "/api/roles"
create_route "auth-service" "permissions-route" "/api/permissions"

# Statistics Service
create_route "statistics-service" "statistics-route" "/api/statistics"

# User Service
create_route "user-service" "profiles-route" "/api/profiles"

# Catalog Service
create_route "catalog-service" "books-route"      "/api/books"
create_route "catalog-service" "authors-route"    "/api/authors"
create_route "catalog-service" "categories-route" "/api/categories"

# File Service
create_route "file-service" "files-route"  "/api/files"
create_route "file-service" "images-route" "/api/images"

# Borrow Service
create_route "borrow-service" "borrows-route" "/api/borrows"

# === Plugins ===

# Key Auth for Auth Service
add_plugin "auth-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Key Auth for Statistics
add_plugin "statistics-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Key Auth for User Service
add_plugin "user-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Key Auth for Catalog Service
add_plugin "catalog-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Key Auth for File Service
add_plugin "file-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Key Auth for Borrow Service
add_plugin "borrow-service" \
  --data "name=key-auth" \
  --data "config.key_names[]=x-api-key" \
  --data "config.key_in_header=true" \
  --data "config.key_in_query=true" \
  --data "config.run_on_preflight=true"

# Global CORS
add_global_plugin \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods[]=GET" \
  --data "config.methods[]=HEAD" \
  --data "config.methods[]=PUT" \
  --data "config.methods[]=PATCH" \
  --data "config.methods[]=POST" \
  --data "config.methods[]=DELETE" \
  --data "config.methods[]=OPTIONS" \
  --data "config.methods[]=TRACE" \
  --data "config.methods[]=CONNECT" \
  --data "config.headers[]=Content-Type" \
  --data "config.headers[]=Authorization" \
  --data "config.headers[]=x-api-key" \
  --data "config.credentials=true"

# Global Rate Limiting
add_global_plugin \
  --data "name=rate-limiting" \
  --data "config.second=10" \
  --data "config.minute=100" \
  --data "config.hour=5000" \
  --data "config.policy=local" \
  --data "config.limit_by=ip" \
  --data "config.sync_rate=-1" \
  --data "config.error_code=429" \
  --data "config.error_message=API rate limit exceeded"

echo "Kong configuration completed!"