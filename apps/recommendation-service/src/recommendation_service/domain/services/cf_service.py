import logging
from typing import Any

# Cấu hình logger
logger = logging.getLogger(__name__)


class CollaborativeFilteringService:
    """
    Domain Service xử lý logic Collaborative Filtering (Lọc cộng tác).
    
    Service này chịu trách nhiệm:
    1. Quản lý vòng đời của mô hình ML (Load model).
    2. Thực hiện tính toán gợi ý (Recommend).
    
    Pattern: Singleton (được quản lý bởi Dependency Injection ở tầng API).
    """

    def __init__(self) -> None:
        """
        Khởi tạo service.
        Lưu ý: Không load model ở đây để tránh blocking khi khởi tạo object.
        Model nên được load async hoặc trong phase startup của ứng dụng.
        """
        self.model: Any | None = None
        self.is_ready: bool = False
        logger.info("CollaborativeFilteringService initialized.")

    def load_model(self) -> None:
        """
        Giả lập việc load mô hình ML từ file hoặc database.
        Đây là tác vụ nặng (CPU/IO intensive).
        """
        logger.info("Loading Recommendation Model...")
        
        # TODO: Implement logic load model thật (e.g., pickle.load, tensorflow.load_model)
        # Giả lập delay
        # time.sleep(2) 
        
        self.model = "MOCK_MODEL_MATRIX"
        self.is_ready = True
        
        logger.info("Recommendation Model loaded successfully.")

    def recommend(self, user_id: str, top_k: int = 5) -> list[str]:
        """
        Tạo danh sách gợi ý cho user dựa trên model đã load.
        
        Args:
            user_id: ID người dùng.
            top_k: Số lượng sách muốn gợi ý.
            
        Returns:
            list[str]: Danh sách ID các sách được gợi ý.
            
        Raises:
            RuntimeError: Nếu model chưa được load.
        """
        if not self.is_ready or self.model is None:
            logger.error("Attempted to recommend but model is not ready.")
            raise RuntimeError("Model chưa sẵn sàng. Vui lòng thử lại sau.")

        # Logic giả lập (Mock implementation)
        # Trong thực tế, sẽ gọi self.model.predict(user_id)
        
        logger.info(f"Generating recommendations for user: {user_id}")
        
        # Trả về danh sách sách giả lập
        mock_books = [f"book_{i}" for i in range(1, top_k + 1)]
        
        return mock_books
