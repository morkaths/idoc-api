from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, computed_field

from app.core.settings.app import AppSettings
from app.core.settings.services import ServicesSettings

from app.core.settings.redis import RedisSettings

class DatabaseSettings(BaseSettings):
    """Cấu hình cho MongoDB Database"""
    uri: str = "mongodb://localhost:27017/recommendation"

class Settings(BaseSettings):
    """
    Quản lý cấu hình toàn cục cho ứng dụng Recommendation Service.
    """
    
    # Nested configurations
    app: AppSettings = AppSettings()
    services: ServicesSettings = ServicesSettings()
    db: DatabaseSettings = DatabaseSettings()
    redis: RedisSettings = RedisSettings()

    # JWT Authentication
    jwt_public_key: str | None = None

    # Load từ file env, cú pháp biến lồng bằng dấu '__'. VD: APP__ALLOWED_ORIGINS="['*']"
    model_config = SettingsConfigDict(
        case_sensitive=False, 
        env_file=[".env", "../../.env"], 
        extra="ignore",
        env_nested_delimiter="__" 
    )


@lru_cache
def get_settings() -> Settings:
    """
    Tạo và cache (singleton) instance của Settings để tránh đọc file .env nhiều lần.
    """
    return Settings()
