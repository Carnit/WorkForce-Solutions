from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    profile_image: Optional[str] = None


class UserModeToggle(BaseModel):
    mode: str = Field(..., pattern="^(hustler|builder)$")


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    bio: Optional[str]
    skills: Optional[str]
    interests: Optional[str]
    profile_image: Optional[str]
    mode: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
