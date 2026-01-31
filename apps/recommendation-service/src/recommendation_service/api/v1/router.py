from fastapi import APIRouter

from recommendation_service.api.v1.endpoints import recommendation

api_router = APIRouter()

# Đăng ký router cho resource 'recommendations'
api_router.include_router(
    recommendation.router, prefix="/recommendations", tags=["recommendations"]
)
