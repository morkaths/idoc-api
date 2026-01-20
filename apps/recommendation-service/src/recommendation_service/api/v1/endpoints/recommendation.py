from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from recommendation_service.api.deps import get_recommendations_use_case
from recommendation_service.application.dtos.recommendation_dto import RecommendationResponse
from recommendation_service.application.use_cases.get_recommendations import GetRecommendationsUseCase

router = APIRouter()


@router.get("/{user_id}", response_model=RecommendationResponse)
def get_recommendations(
    user_id: str,
    use_case: GetRecommendationsUseCase = Depends(get_recommendations_use_case),
) -> Any:
    """
    Lấy danh sách gợi ý sách cho một người dùng cụ thể.
    
    - **user_id**: ID của người dùng.
    """
    try:
        # Gọi Use Case để thực thi logic nghiệp vụ
        return use_case.execute(user_id, top_k=5)
        
    except RuntimeError as e:
        # Xử lý lỗi từ tầng dưới (ví dụ: Model chưa load)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        # Xử lý các lỗi khác
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Đã xảy ra lỗi khi tạo gợi ý."
        )
