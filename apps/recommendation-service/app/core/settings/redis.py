from pydantic import BaseModel, computed_field

class RedisSettings(BaseModel):
    """Cấu hình cho Redis Caching"""
    host: str = "localhost"
    port: int = 6379
    password: str | None = None
    db: int = 0

    @computed_field
    @property
    def url(self) -> str:
        """Tự động gen ra Connection String hoàn chỉnh"""
        if self.password:
            return f"redis://:{self.password}@{self.host}:{self.port}/{self.db}"
        return f"redis://{self.host}:{self.port}/{self.db}"
