from motor.motor_asyncio import AsyncIOMotorClient
from recommendation_service.core.config import get_settings


class Database:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        settings = get_settings()
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client.get_default_database()
        print(f"Connected to MongoDB: {self.db.name}")

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")


db = Database()


async def get_database():
    return db.db
