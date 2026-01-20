# Recommendation Service

Service chịu trách nhiệm tính toán và gợi ý nội dung (sách) cho người dùng dựa trên lịch sử tương tác.
Được thiết kế theo kiến trúc **3-Layer Architecture** đơn giản.

## Cấu Trúc Dự Án

Dự án được tổ chức gọn gàng thành các lớp:

```
src/recommendation_service/
├── api/             # [Presentation Layer] Controller, nhận Request
│   ├── v1/endpoints/
│   └── deps.py      # Dependency Injection
│
├── services/        # [Business Logic Layer] Xử lý nghiệp vụ chính
│   └── recommendation_service.py
│
├── schemas/         # [DTO Layer] Data Transfer Objects
│   └── recommendation.py
│
├── core/            # [Core] Cấu hình và tiện ích chung
│   └── config.py
│
└── main.py          # Entry point
```

## Các Thành Phần Chính

### 1. Presentation Layer (API)
- Nằm trong `api/`.
- Chịu trách nhiệm nhận HTTP Request, validate dữ liệu (pydantic), và gọi xuống Service Layer.
- Không chứa logic nghiệp vụ phức tạp.

### 2. Business Logic Layer (Services)
- Nằm trong `services/`.
- Chứa toàn bộ logic nghiệp vụ (Loading model, tính toán gợi ý).
- Là nơi tập trung xử lý chính của ứng dụng.

### 3. Data/DTO Layer (Schemas)
- Nằm trong `schemas/`.
- Định nghĩa định dạng dữ liệu input/output của API.

### 4. Core
- Nằm trong `core/`.
- Quản lý cấu hình (`Settings`), biến môi trường, logging.
