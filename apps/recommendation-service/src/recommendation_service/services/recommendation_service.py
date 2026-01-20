import logging
import time
from typing import Any, List

logger = logging.getLogger(__name__)

class RecommendationService:
    """
    Service xử lý logic nghiệp vụ cho Recommendation.
    Mô hình 3-Layer: Controller -> Service -> Repository (nếu có DB).
    """

    def __init__(self) -> None:
        self._model: Any | None = None
        self._is_ready: bool = False
        logger.info("RecommendationService initialized.")

    def load_model(self) -> None:
        """
        Load mô hình hoặc dữ liệu cần thiết.
        """
        logger.info("Loading Recommendation Model...")
        
        # TODO: Implement logic load model thật
        # Giả lập delay
        # time.sleep(1) 
        
        self._model = "MOCK_MODEL_MATRIX"
        self._is_ready = True
        
        logger.info("Model loaded successfully.")

    def recommend(self, user_id: str, top_k: int = 5) -> List[str]:
        """
        Tạo danh sách gợi ý cho user.
        """
        if not self._is_ready or self._model is None:
            logger.error("Attempted to recommend but model is not ready.")
            raise RuntimeError("Model chưa sẵn sàng.")

        logger.info(f"Generating recommendations for user: {user_id}")
        
        # Logic tính toán trực tiếp tại đây (hoặc gọi util function)
        return [f"book_{i}" for i in range(1, top_k + 1)]
