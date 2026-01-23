from datetime import datetime, timezone
from fastapi import HTTPException

from recommendation_service.core.database import get_database
from recommendation_service.models.interaction import Interaction, InteractionType
from recommendation_service.schemas.interaction import InteractionCreate


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

    @staticmethod
    async def create_interaction(user_id: str, data: InteractionCreate) -> Interaction:
        db = await get_database()

        # Validation logic
        if data.interaction_type == InteractionType.RATING and data.rating is None:
            raise HTTPException(
                status_code=400,
                detail="Rating giá trị bắt buộc khi loại tương tác là RATING",
            )

        weight = InteractionService.calculate_weight(data.interaction_type, data.rating)

        interaction_doc = Interaction(
            user_id=user_id,
            book_id=data.book_id,
            interaction_type=data.interaction_type,
            rating=data.rating,
            weight=weight,
            timestamp=datetime.now(timezone.utc),
            metadata=data.metadata,
        )

        interaction_data = interaction_doc.model_dump()

        # Tối ưu: Upsert cho các loại tương tác có tính trạng thái (Stateful)
        # RATING, LIKE, SAVE_SHELF: Chỉ lưu trạng thái mới nhất
        if data.interaction_type in [
            InteractionType.RATING,
            InteractionType.LIKE,
            InteractionType.SAVE_SHELF,
        ]:
            result = await db.interactions.update_one(
                {
                    "user_id": user_id,
                    "book_id": data.book_id,
                    "interaction_type": data.interaction_type,
                },
                {"$set": interaction_data},
                upsert=True,
            )
            # Nếu là update, result.upserted_id sẽ là None, ta không cần thiết phải lấy _id chính xác nếu không cần dùng ngay
            # Nếu cần _id cho response, ta có thể tìm lại hoặc chấp nhận trả về data đã gửi lên (client thường đã biết context)
            if result.upserted_id:
                interaction_data["_id"] = result.upserted_id
        else:
            # VIEW, BORROW: Lưu lịch sử (Append ONLY)
            result = await db.interactions.insert_one(interaction_data)
            interaction_data["_id"] = result.inserted_id

        return interaction_data
