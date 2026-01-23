from fastapi import APIRouter

from recommendation_service.api.v1.endpoints import recommendation, interaction

api_router = APIRouter()

# Đăng ký router cho resource 'recommendations'
api_router.include_router(
    recommendation.router, 
    prefix="/recommendations", 
    tags=["recommendations"]
)

# Đăng ký router cho resource 'interactions'
api_router.include_router(
    interaction.router,
    prefix="/interactions",
    tags=["interactions"]
)
