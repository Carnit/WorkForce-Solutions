from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostCreate(BaseModel):
    content: str


class PostResponse(BaseModel):
    id: int
    author_id: int
    content: str
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
