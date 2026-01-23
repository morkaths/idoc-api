from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError

from recommendation_service.core.config import get_settings

# OAuth2 scheme: Client gửi token via Header: Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{get_settings().API_V1_STR}/auth/login"
)  # URL này chỉ là dummy cho Swagger UI


def get_current_user_id(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """
    Validate JWT Token và lấy user_id (sub).
    Sử dụng RSA Public Key được share từ Auth Service.
    """
    settings = get_settings()

    if not settings.RSA_PUBLIC_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="RSA Public Key not configured",
        )

    try:
        # Decode và Verify Signature dùng RSA256
        payload = jwt.decode(
            token,
            settings.RSA_PUBLIC_KEY,
            algorithms=["RS256"],
            options={"verify_aud": False},  # Tùy chỉnh nếu cần verify audience
        )

        user_id: str = payload.get("sub") or payload.get("id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials: User ID missing",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
