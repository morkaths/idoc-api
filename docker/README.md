# Docker Compose iDoc API
---

## Cấu trúc thư mục

```
docker/
├── docker-compose.kong.yml
├── docker-compose.minio.yml
├── docker-compose.redis.yml
├── .env
├── README.md
```

## Cấu hình biến môi trường

- File `.env` dùng chung cho toàn bộ stack:

```env
# Kong
KONG_PG_DATABASE=kong
KONG_PG_USER=kong
KONG_PG_PASSWORD=kong
KONG_PASSWORD=handyshake
GW_IMAGE=kong/kong-gateway:3.12.0.0
GW_HOST=localhost

# MinIO
MINIO_ROOT_USER=your-username
MINIO_ROOT_PASSWORD=your-secure-password
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