# Docker Compose iDoc API
---

## Cấu trúc thư mục

```
docker/
├── .env
├── docker-compose.kong.yml
├── docker-compose.minio.yml
├── docker-compose.redis.yml
├── docker-compose.yml
├── README.md
```

## Cấu hình biến môi trường

- File `.env` dùng chung cho toàn bộ stack:

```env
# =========================================
# Kong
# =========================================
KONG_PG_DATABASE=kong
KONG_PG_USER=idocadmin
KONG_PG_PASSWORD=idocadmin123
KONG_PASSWORD=idocadmin123
GW_IMAGE=kong/kong-gateway:3.12.0.0
GW_HOST=localhost

# =========================================
# MinIO
# =========================================
MINIO_ROOT_USER=idocadmin
MINIO_ROOT_PASSWORD=idocadmin123
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001

# =========================================
# Redis
# =========================================
REDIS_PORT=6379
REDIS_MANAGEMENT_PORT=8005
REDIS_PASSWORD=idocadmin123
REDIS_SAVE_POLICY="60 1"
REDIS_LOG_LEVEL=notice


```

## Khởi động toàn bộ stack

```sh
docker compose -p idoc-stack \
  -f docker/docker-compose.kong.yml \
  -f docker/docker-compose.minio.yml \
  -f docker/docker-compose.redis.yml \
  --env-file docker/.env up -d
```

- **Kong Admin API:** http://localhost:8001  
- **Kong Manager:** http://localhost:8002  
- **MinIO Console:** http://localhost:9001  
- **Redis:** http://localhost:6379

## Dừng và xóa stack cũ

```sh
docker compose -p idoc-stack \
  -f docker/docker-compose.kong.yml \
  -f docker/docker-compose.minio.yml \
  -f docker/docker-compose.redis.yml \
  --env-file docker/.env down -v
```

## Reset toàn bộ stack

```sh
# Stop the old containers
docker compose -p idoc-stack -f docker/docker-compose.yml down

# Start the new containers
bash tools/scripts/docker.sh
```

## ⚠️ Lưu ý

- Chỉnh sửa thông số trong các file compose và `.env` cho phù hợp dự án.
- Không commit file `.env` chứa thông tin nhạy cảm lên Git.
- Nếu cần reset dữ liệu, xóa volume:

  ```sh
  docker volume rm idoc-api_kong_db_data
  docker volume rm idoc-api_minio_data
  docker volume rm idoc-api_redis_data
  ```

## Tài liệu tham khảo

- [Kong Gateway Documentation](https://docs.konghq.com/gateway/latest/)
- [Kong DockerHub](https://hub.docker.com/_/kong)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [Redis DockerHub](https://hub.docker.com/_/redis)