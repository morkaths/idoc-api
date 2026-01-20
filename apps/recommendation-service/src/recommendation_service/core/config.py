from functools import lru_cache
from typing import ClassVar

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, computed_field

class Settings(BaseSettings):
    """
    Quản lý cấu hình toàn cục cho ứng dụng Recommendation Service.
    """
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "IDoc Recommendation Service"
    PORT: int = Field(default=8000, alias="RECOMMENDATION_PORT")

    # Redis (Dùng để cache kết quả gợi ý)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str | None = None 
    REDIS_DB: int = 0

    # JWT
    RSA_PUBLIC_KEY: str | None = None
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    # Redis URL
    @computed_field
    @property
    def redis_url(self) -> str:
        """Tạo Connection String cho Redis dựa trên user/pass"""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # Pydantic
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=[".env", "../../.env"],
        extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    """
    Tạo và cache instance của Settings.
    Giúp tránh việc đọc file .env nhiều lần, tối ưu hiệu năng.
    """
    return Settings()
