from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    """
    Schema cho yêu cầu gợi ý (Optional, dùng cho tương lai nếu cần filter).
    Hiện tại API GET /{user_id} chưa cần body, nhưng giữ lại để mở rộng.
    """
    # Ví dụ: category: str | None = None
    pass


class RecommendationResponse(BaseModel):
    """
    Schema cho phản hồi gợi ý sách.
    Trả về danh sách ID sách và điểm số tương ứng.
    """
    user_id: str = Field(..., description="ID của người dùng được gợi ý")
    book_ids: list[str] = Field(..., description="Danh sách ID các sách được gợi ý")
    score: float = Field(..., description="Điểm số độ tin cậy của gợi ý (0.0 - 1.0)")
