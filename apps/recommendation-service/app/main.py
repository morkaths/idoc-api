import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.core.config import get_settings
from app.core.database import db
from app.models.interaction import create_interaction_indexes

# Setup logging cơ bản
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup: Load ML Model và Connect DB
    logger.info("Application startup: Connection to MongoDB...")
    await db.connect()
    await create_interaction_indexes()
    logger.info("Application startup: Warming up recommendation service...")
    service = get_recommendation_service()
    service.load_model()
    yield

    # Shutdown: Cleanup resources
    logger.info("Application shutdown: Closing MongoDB connection...")
    db.close()
    logger.info("Application shutdown.")


def create_application() -> FastAPI:
    application = FastAPI(
        title="Recommendation Service",
        openapi_url="/api/v1/openapi.json",
        lifespan=lifespan,
    )

    # Cấu hình CORS middleware
    if settings.app.allowed_origins:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=settings.app.allowed_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Đăng ký routes
    application.include_router(api_router, prefix="/api/v1")

    return application


app = create_application()


if __name__ == "__main__":
    # Dùng cho debug local
    import uvicorn

    uvicorn.run(
        "recommendation_service.main:app",
        host="0.0.0.0",
        port=settings.services.recommendation.port,
        reload=True,
    )
