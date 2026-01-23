from typing import Annotated
from fastapi import APIRouter, Depends, Header, HTTPException

from recommendation_service.schemas.interaction import (
    InteractionCreate,
    InteractionResponse,
)
from recommendation_service.services.interaction import InteractionService

from recommendation_service.core.security import get_current_user_id

router = APIRouter()


@router.post("/", response_model=InteractionResponse)
async def create_interaction(
    interaction_in: InteractionCreate,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
):
    """
    Ghi nhận tương tác của người dùng.
    Yêu cầu: Bearer Token (JWT).
    """
    return await InteractionService.create_interaction(
        user_id=current_user_id, data=interaction_in
    )
