import logging
from typing import Any, Dict, Optional
import requests

from app.core.config import get_settings

logger = logging.getLogger(__name__)

class InteractionClient:
    """
    Client gọi sang Interaction Service để lấy dữ liệu tương tác phục vụ thuật toán Recommendation.
    Được thiết kế tương tự mô hình gọi API của BookClient.ts.
    """
    def __init__(self):
        settings = get_settings()
        # Ánh xạ từ settings (hoặc dùng URL mặc định nếu chưa cấu hình)
        # Giả định port của interaction-service là 3001
        self.base_url = "http://localhost:3001/api/v1" 
        self.session = requests.Session()
        # Cấu hình timeout mặc định để tránh block luồng
        self.timeout = 10 
        
        # Thiết lập header mặc định (nếu cần truyền secret key / auth token giữa các Microservices thì set ở đây)
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json"
        })

    def get_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Lấy danh sách tương tác của một user cụ thể.
        @param user_id - ID người dùng
        @returns Dict chứa cấu trúc phản hồi từ API (JSON) hoặc None nếu lỗi
        """
        endpoint = f"{self.base_url}/interactions/user/{user_id}"
        
        try:
            response = self.session.get(endpoint, timeout=self.timeout)
            response.raise_for_status() # Bắn exception nếu HTTP status code >= 400
            
            # Trả về parsed JSON giống cách axios tự parse response.data
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Lỗi khi gọi API qua InteractionClient.get_by_user_id(user_id={user_id}): {str(e)}")
            # Trả về rỗng hoặc ném ngoại lệ tùy logic hệ thống của bạn muốn (ở đây return rỗng để ứng dụng ko văng)
            return None