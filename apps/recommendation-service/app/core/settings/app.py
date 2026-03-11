from pydantic import BaseModel

class AppSettings(BaseModel):
    """Cấu hình chung của ứng dụng FastAPI"""
    name: str = "idoc-recommendation"
    allowed_origins: list[str] = ["*"]
    api_url: str = "http://localhost:8000/api"
    api_key: str = ""
