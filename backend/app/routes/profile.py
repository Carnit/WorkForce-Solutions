from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import json
from database import get_db  # type: ignore
from models.user import User  # type: ignore
from schemas.user import UserResponse, UserProfile, UserModeToggle  # type: ignore
from utils.dependencies import get_current_user  # type: ignore

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    profile_data: UserProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile"""
    if profile_data.bio is not None:
        current_user.bio = profile_data.bio
    if profile_data.skills is not None:
        current_user.skills = json.dumps(profile_data.skills)
    if profile_data.interests is not None:
        current_user.interests = json.dumps(profile_data.interests)
    if profile_data.profile_image is not None:
        current_user.profile_image = profile_data.profile_image

    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/mode", response_model=UserResponse)
def toggle_mode(
    mode_data: UserModeToggle,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle user mode between hustler and builder"""
    current_user.mode = mode_data.mode
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return current_user
