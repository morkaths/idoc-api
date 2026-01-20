import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from recommendation_service.api.deps import get_recommendation_strategy
from recommendation_service.api.v1.router import api_router
from recommendation_service.infrastructure.config.settings import get_settings

# Setup logging cơ bản
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Quản lý vòng đời ứng dụng (Lifespan Events).
    Code ở đây chạy khi app khởi động và tắt.
    """
    # Startup: Load ML Model thông qua Strategy
    logger.info("Application startup: Warming up recommendation strategy...")
    strategy = get_recommendation_strategy()
    strategy.load_model()
    
    yield
    
    # Shutdown: Cleanup resources (nếu cần)
    logger.info("Application shutdown.")


def create_application() -> FastAPI:
    """Factory function để tạo FastAPI app."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # Cấu hình CORS middleware
    if settings.CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Đăng ký routes
    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application


app = create_application()


if __name__ == "__main__":
    # Dùng cho debug local
    import uvicorn
    uvicorn.run("recommendation_service.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
