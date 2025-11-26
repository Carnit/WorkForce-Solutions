from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base  # type: ignore [import-not-found]


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    bio = Column(Text)
    skills = Column(Text)  # JSON string of skills
    interests = Column(Text)  # JSON string of interests
    profile_image = Column(String)
    mode = Column(String, default="hustler")  # hustler or builder
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    opportunities_created = relationship(
        "Opportunity", back_populates="creator", foreign_keys="Opportunity.creator_id"
    )
    applications = relationship("Application", back_populates="applicant")
    posts = relationship("Post", back_populates="author")
