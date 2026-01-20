from pydantic import BaseModel, Field

class RecommendationRequest(BaseModel):
    """
    Schema cho yêu cầu gợi ý.
    """
    # Ví dụ: category: str | None = None
    pass


class RecommendationResponse(BaseModel):
    """
    Schema cho phản hồi gợi ý sách.
    """
    user_id: str = Field(..., description="ID của người dùng được gợi ý")
    book_ids: list[str] = Field(..., description="Danh sách ID các sách được gợi ý")
    score: float = Field(default=0.0, description="Điểm số độ tin cậy")
