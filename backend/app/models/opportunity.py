from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(Text)  # JSON string
    bounty_amount = Column(Integer)  # Optional monetary bounty
    status = Column(String, default="open")  # open, in_progress, completed, closed
    creator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    deadline = Column(DateTime)

    # Relationships
    creator = relationship(
        "User", back_populates="opportunities_created", foreign_keys=[creator_id]
    )
    applications = relationship("Application", back_populates="opportunity")
