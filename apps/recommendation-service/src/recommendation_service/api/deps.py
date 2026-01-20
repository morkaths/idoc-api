from ..services.recommendation_service import RecommendationService

# Khởi tạo singleton service.
_service = RecommendationService()

def get_recommendation_service() -> RecommendationService:
    """
    Dependency Injection cho Service Layer.
    """
    return _service
