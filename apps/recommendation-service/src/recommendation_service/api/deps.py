from ..infrastructure.strategies.collaborative_filtering import CollaborativeFilteringStrategy
from ..application.use_cases.get_recommendations import GetRecommendationsUseCase
from ..domain.ports.recommendation_strategy import RecommendationStrategy

# Khởi tạo singleton strategy.
# Trong môi trường production, có thể dùng Factory để quyết định strategy dựa trên config.
_strategy = CollaborativeFilteringStrategy()

def get_recommendation_strategy() -> RecommendationStrategy:
    """
    Trả về instance của RecommendationStrategy.
    """
    return _strategy

def get_recommendations_use_case() -> GetRecommendationsUseCase:
    """
    Dependency Injection cho Use Case.
    """
    return GetRecommendationsUseCase(strategy=_strategy)
