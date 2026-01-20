from typing import List
import logging

from ...domain.ports.recommendation_strategy import RecommendationStrategy
from ...application.dtos.recommendation_dto import RecommendationResponse

logger = logging.getLogger(__name__)

class GetRecommendationsUseCase:
    """
    Use Case: Lấy danh sách gợi ý cho người dùng.
    """

    def __init__(self, strategy: RecommendationStrategy):
        self._strategy = strategy

    def execute(self, user_id: str, top_k: int = 5) -> RecommendationResponse:
        """
        Thực thi use case.
        """
        logger.info(f"Executing GetRecommendationsUseCase for user: {user_id}")
        
        # Gọi xuống Domain Layer (Strategy)
        book_ids = self._strategy.recommend(user_id, top_k)
        
        # Map sang DTO
        return RecommendationResponse(
            user_id=user_id,
            book_ids=book_ids,
            strategy_used="CollaborativeFiltering" # TODO: Lấy tên thật từ strategy
        )
