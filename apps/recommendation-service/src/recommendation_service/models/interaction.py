from datetime import datetime
from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
import pymongo
from recommendation_service.core.database import get_database


class InteractionType(str, Enum):
    VIEW = "VIEW"
    LIKE = "LIKE"
    RATING = "RATING"
    SAVE_SHELF = "SAVE_SHELF"
    BORROW = "BORROW"


class Interaction(BaseModel):
    user_id: str = Field(..., description="ID của người dùng")
    book_id: str = Field(..., description="ID của sách (ObjectId)")
    interaction_type: InteractionType
    rating: Optional[float] = Field(None, ge=0, le=5)
    weight: float = 1.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[dict[str, Any]] = None

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "user_id": "60d5ecb8b394140015f3e2e1",
                "book_id": "60d5ecb8b394140015f3e2e2",
                "interaction_type": "VIEW",
                "rating": None,
                "weight": 1.0,
                "timestamp": "2024-01-01T00:00:00Z",
            }
        },
    )


async def create_interaction_indexes():
    """Tạo indexes cho collection interactions"""
    db = await get_database()
    if db is not None:
        # Index cho user_id (query lịch sử user)
        await db.interactions.create_index("user_id")
        # Index cho book_id (query thống kê sách)
        await db.interactions.create_index("book_id")
        # Compound index cho việc check existence (upsert)
        await db.interactions.create_index(
            [("user_id", 1), ("book_id", 1), ("interaction_type", 1)], unique=False
        )
        print("Interactions Indexes created.")
