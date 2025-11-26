from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class OpportunityCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20)
    required_skills: Optional[List[str]] = None
    bounty_amount: Optional[int] = None
    deadline: Optional[datetime] = None

    @field_validator("bounty_amount", mode="before")
    @classmethod
    def convert_bounty_amount(cls, v):
        if v is None or v == "":
            return None
        try:
            return int(v)
        except (ValueError, TypeError):
            return None


class OpportunityResponse(BaseModel):
    id: int
    title: str
    description: str
    required_skills: Optional[str]
    bounty_amount: Optional[int]
    status: str
    creator_id: int
    created_at: datetime
    deadline: Optional[datetime]

    model_config = {"from_attributes": True}
