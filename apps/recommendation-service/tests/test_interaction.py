import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from recommendation_service.models.interaction import InteractionType
from recommendation_service.schemas.interaction import InteractionCreate
from recommendation_service.services.interaction import InteractionService

@pytest.mark.asyncio
async def test_create_interaction():
    # Mock DB
    mock_db = MagicMock()
    mock_collection = AsyncMock()
    mock_db.interactions = mock_collection
    mock_collection.insert_one.return_value.inserted_id = "mock_id"

    with patch("recommendation_service.services.interaction.get_database", new=AsyncMock(return_value=mock_db)):
        data = InteractionCreate(
            book_id="book_id_123",
            interaction_type=InteractionType.VIEW
        )
        user_id = "user_id_123"
        
        result = await InteractionService.create_interaction(user_id, data)
        
        assert result["user_id"] == user_id
        assert result["book_id"] == "book_id_123"
        assert result["weight"] == 1.0  # VIEW implicit weight
        assert result["_id"] == "mock_id"
        
        mock_collection.insert_one.assert_called_once()
