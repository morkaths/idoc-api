from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import get_settings

# Sử dụng HTTPBearer để lấy token từ header Authorization
security = HTTPBearer()


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> str:
    """
    Validate JWT Token và lấy user_id (sub).
    Sử dụng RSA Public Key được share từ Auth Service.
    """
    settings = get_settings()
    token = credentials.credentials

    if not settings.JWT_PUBLIC_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT Public Key not configured",
        )

    try:
        # Decode và Verify Signature dùng RSA256
        # Lưu ý: Client cần gửi Public Key đúng định dạng PEM
        payload = jwt.decode(
            token,
            settings.JWT_PUBLIC_KEY,
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
