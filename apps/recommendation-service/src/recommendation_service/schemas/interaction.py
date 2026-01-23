from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict

from recommendation_service.models.interaction import InteractionType


class InteractionRequest(BaseModel):
    user_id: str = Field(..., description="ID User")
    item_id: str = Field(..., description="ID Item (ObjectID)")
    interaction_type: InteractionType
    rating: Optional[float] = Field(None, ge=0, le=5)
    metadata: Optional[dict[str, Any]] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": "65ae...",
                "item_id": "65bf...",
                "interaction_type": "VIEW",
                "rating": None,
            }
        }
    )


class InteractionResponse(BaseModel):
    id: str = Field(..., description="ID Interaction (ObjectID)")
    user_id: str
    item_id: str
    interaction_type: InteractionType
    rating: Optional[float] = None
    weight: float
    timestamp: datetime
    metadata: Optional[dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
