from pydantic import BaseModel, Field

class RecommendationRequest(BaseModel):
    """
    DTO cho yêu cầu gợi ý.
    """
    # Ví dụ: category: str | None = None
    pass


class RecommendationResponse(BaseModel):
    """
    DTO cho phản hồi gợi ý sách.
    """
    user_id: str = Field(..., description="ID của người dùng được gợi ý")
    book_ids: list[str] = Field(..., description="Danh sách ID các sách được gợi ý")
    strategy_used: str = Field(default="CollaborativeFiltering", description="Tên thuật toán được sử dụng")
