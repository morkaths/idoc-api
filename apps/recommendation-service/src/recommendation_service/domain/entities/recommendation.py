from dataclasses import dataclass
from typing import List

@dataclass
class RecommendationResult:
    """
    Entity đại diện cho kết quả gợi ý.
    """
    user_id: str
    book_ids: List[str]
    strategy_name: str
