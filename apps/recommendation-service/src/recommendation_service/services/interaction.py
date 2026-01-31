from recommendation_service.models.interaction import InteractionType


class InteractionService:
    @staticmethod
    def calculate_weight(
        interaction_type: InteractionType, rating: float | None = None
    ) -> float:
        """
        Tính toán trọng số dựa trên loại tương tác.
        VIEW: 1.0
        LIKE: 3.0
        SAVE_SHELF: 4.0
        BORROW: 5.0
        RATING: rating value
        """
        if interaction_type == InteractionType.VIEW:
            return 1.0
        elif interaction_type == InteractionType.LIKE:
            return 3.0
        elif interaction_type == InteractionType.SAVE_SHELF:
            return 4.0
        elif interaction_type == InteractionType.BORROW:
            return 5.0
        elif interaction_type == InteractionType.RATING:
            if rating is None:
                raise ValueError("Rating value is required for RATING type")
            return float(rating)
        return 1.0
