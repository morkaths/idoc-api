import logging
import time
from typing import Any, List
from ...domain.ports.recommendation_strategy import RecommendationStrategy

# Cấu hình logger
logger = logging.getLogger(__name__)

class CollaborativeFilteringStrategy(RecommendationStrategy):
    """
    Implementation của RecommendationStrategy sử dụng Collaborative Filtering.
    """

    def __init__(self) -> None:
        self._model: Any | None = None
        self._is_ready: bool = False
        logger.info("CollaborativeFilteringStrategy initialized.")

    def load_model(self) -> None:
        """
        Giả lập việc load mô hình ML từ file hoặc database.
        """
        logger.info("Loading Collaborative Filtering Model...")
        
        # TODO: Implement logic load model thật
        # Giả lập delay
        # time.sleep(2) 
        
        self._model = "MOCK_CF_MATRIX"
        self._is_ready = True
        
        logger.info("Collaborative Filtering Model loaded successfully.")

    @property
    def is_ready(self) -> bool:
        return self._is_ready

    def recommend(self, user_id: str, top_k: int = 5) -> List[str]:
        if not self._is_ready or self._model is None:
            logger.error("Attempted to recommend but model is not ready.")
            raise RuntimeError("Model Collaborative Filtering chưa sẵn sàng.")

        logger.info(f"CollaborativeFilteringStrategy: Calculating for user {user_id}")
        
        # Logic giả lập
        return [f"book_cf_{i}" for i in range(1, top_k + 1)]
