from pydantic import BaseModel

class RecommendationServiceSettings(BaseModel):
    """Cấu hình riêng cho Recommendation Service"""
    port: int = 5005
    url: str = "http://localhost:5005"

class ServicesSettings(BaseModel):
    """Gom nhóm cấu hình của các Microservices"""
    recommendation: RecommendationServiceSettings = RecommendationServiceSettings()
