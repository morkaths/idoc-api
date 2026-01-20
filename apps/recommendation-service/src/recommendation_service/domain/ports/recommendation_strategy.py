from abc import ABC, abstractmethod
from typing import List

class RecommendationStrategy(ABC):
    """
    Interface (Port) cho các chiến lược gợi ý (Recommendation Strategies).
    Pattern: Strategy Pattern.
    """

    @abstractmethod
    def load_model(self) -> None:
        """
        Load mô hình hoặc dữ liệu cần thiết cho thuật toán.
        """
        pass

    @property
    @abstractmethod
    def is_ready(self) -> bool:
        """
        Kiểm tra xem strategy đã sẵn sàng để phục vụ chưa.
        """
        pass

    @abstractmethod
    def recommend(self, user_id: str, top_k: int = 5) -> List[str]:
        """
        Tạo danh sách gợi ý cho user.

        Args:
            user_id: ID của người dùng.
            top_k: Số lượng item muốn gợi ý.

        Returns:
            List[str]: Danh sách ID của các item được gợi ý.
        """
        pass
