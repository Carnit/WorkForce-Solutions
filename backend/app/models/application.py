from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    applicant_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.now)

    # Relationships
    opportunity = relationship("Opportunity", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
