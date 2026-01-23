import asyncio
import random
from datetime import datetime, timedelta
from faker import Faker
from motor.motor_asyncio import AsyncIOMotorClient
from recommendation_service.core.config import get_settings
from recommendation_service.models.interaction import Interaction, InteractionType

fake = Faker()
settings = get_settings()

NUM_USERS = 50
NUM_BOOKS = 100
INTERACTIONS_PER_USER_MIN = 5
INTERACTIONS_PER_USER_MAX = 20


async def seed_data():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client.get_database()
    collection = db.interactions

    # Optional: Clear existing data
    # await collection.delete_many({})
    # print("Cleared existing interactions.")

    user_ids = [str(fake.uuid4()) for _ in range(NUM_USERS)]
    book_ids = [str(fake.uuid4()) for _ in range(NUM_BOOKS)]

    interactions_to_insert = []

    print(f"Generating interactions for {NUM_USERS} users...")

    for user_id in user_ids:
        num_interactions = random.randint(
            INTERACTIONS_PER_USER_MIN, INTERACTIONS_PER_USER_MAX
        )
        for _ in range(num_interactions):
            book_id = random.choice(book_ids)
            interaction_type = random.choice(list(InteractionType))

            rating = None
            if interaction_type == InteractionType.RATING:
                rating = round(random.uniform(1.0, 5.0), 1)

            interaction = Interaction(
                user_id=user_id,
                book_id=book_id,
                interaction_type=interaction_type,
                rating=rating,
                timestamp=fake.date_time_between(start_date="-1y", end_date="now"),
                weight=1.0,  # Default weight, can be adjusted based on type
            )

            # Adjust weight based on type logic if needed (simple mock here)
            if interaction.interaction_type == InteractionType.VIEW:
                interaction.weight = 1.0
            elif interaction.interaction_type == InteractionType.BORROW:
                interaction.weight = 5.0
            elif interaction.interaction_type == InteractionType.RATING:
                interaction.weight = interaction.rating if interaction.rating else 1.0

            interactions_to_insert.append(interaction.model_dump(by_alias=True))

    if interactions_to_insert:
        result = await collection.insert_many(interactions_to_insert)
        print(f"Successfully inserted {len(result.inserted_ids)} interactions.")
    else:
        print("No interactions generated.")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())
