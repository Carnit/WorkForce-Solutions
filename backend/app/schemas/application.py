from pydantic import BaseModel, Field
from datetime import datetime


class ApplicationCreate(BaseModel):
    message: str = Field(..., min_length=10)


class ApplicationResponse(BaseModel):
    id: int
    opportunity_id: int
    applicant_id: int
    message: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
