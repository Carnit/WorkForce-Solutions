from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
from models.user import User
from models.application import Application
from schemas.user import UserResponse
from schemas.application import ApplicationResponse
from utils.dependencies import get_current_user

router = APIRouter(prefix="/network", tags=["Network"])


@router.get("", response_model=List[UserResponse])
def get_network(
    skip: int = 0,
    limit: int = 50,
    mode: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get network directory of users"""
    query = db.query(User).filter(User.id != current_user.id)

    if mode and mode in ["hustler", "builder"]:
        query = query.filter(User.mode == mode)

    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get specific user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/applications/my", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's applications"""
    applications = (
        db.query(Application).filter(Application.applicant_id == current_user.id).all()
    )
    return applications
