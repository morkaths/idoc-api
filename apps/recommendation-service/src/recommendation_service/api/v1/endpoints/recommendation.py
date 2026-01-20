from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from recommendation_service.api.deps import get_recommendation_service
from recommendation_service.schemas.recommendation import RecommendationResponse
from recommendation_service.services.recommendation_service import RecommendationService

router = APIRouter()


@router.get("/{user_id}", response_model=RecommendationResponse)
def get_recommendations(
    user_id: str,
    service: RecommendationService = Depends(get_recommendation_service),
) -> Any:
    """
    Lấy danh sách gợi ý sách cho một người dùng cụ thể.
    """
    try:
        # Gọi Service Layer trực tiếp
        book_ids = service.recommend(user_id, top_k=5)
        
        return RecommendationResponse(
            user_id=user_id,
            book_ids=book_ids,
            score=0.99
        )
        
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Đã xảy ra lỗi khi tạo gợi ý."
        )
