from passlib.context import CryptContext  # type: ignore
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError  # type: ignore
from config import settings  # type: ignore

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    # Convert user ID to string if it's in 'sub' field
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        claims=to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict | None:
    """Decode a JWT access token"""
    try:
        payload = jwt.decode(
            token=token, key=settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Convert 'sub' back to int for consistency
        if "sub" in payload and isinstance(payload["sub"], str):
            payload["sub"] = int(payload["sub"])
        return payload
    except JWTError as e:
        print(f"JWT decode error: {e}")  # Debug output
        return None
