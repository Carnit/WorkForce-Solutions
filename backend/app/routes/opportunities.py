from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import json
from database import get_db  # type: ignore
from models.user import User  # type: ignore
from models.opportunity import Opportunity  # type: ignore
from models.application import Application  # type: ignore
from schemas.opportunity import OpportunityCreate, OpportunityResponse  # type: ignore
from schemas.application import ApplicationCreate, ApplicationResponse  # type: ignore
from utils.dependencies import get_current_user  # type: ignore

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


@router.post(
    "", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED
)
def create_opportunity(
    opportunity_data: OpportunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new opportunity"""
    try:
        new_opportunity = Opportunity(
            title=opportunity_data.title,
            description=opportunity_data.description,
            required_skills=json.dumps(opportunity_data.required_skills)
            if opportunity_data.required_skills
            else None,
            bounty_amount=opportunity_data.bounty_amount,
            deadline=opportunity_data.deadline,
            creator_id=current_user.id,
        )
        db.add(new_opportunity)
        db.commit()
        db.refresh(new_opportunity)
        return new_opportunity
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[OpportunityResponse])
def get_opportunities(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get list of opportunities"""
    query = db.query(Opportunity)

    if status:
        query = query.filter(Opportunity.status == status)

    opportunities = (
        query.order_by(Opportunity.created_at.desc()).offset(skip).limit(limit).all()
    )
    return opportunities


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get specific opportunity"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity


@router.put("/{opportunity_id}", response_model=OpportunityResponse)
def update_opportunity(
    opportunity_id: int,
    opportunity_data: OpportunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update opportunity (creator only)"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opportunity.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this opportunity"
        )

    opportunity.title = opportunity_data.title
    opportunity.description = opportunity_data.description
    opportunity.required_skills = (
        json.dumps(opportunity_data.required_skills)
        if opportunity_data.required_skills
        else None
    )
    opportunity.bounty_amount = opportunity_data.bounty_amount
    opportunity.deadline = opportunity_data.deadline
    opportunity.updated_at = datetime.now()

    db.commit()
    db.refresh(opportunity)
    return opportunity


@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete opportunity (creator only)"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opportunity.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this opportunity"
        )

    db.delete(opportunity)
    db.commit()
    return None


@router.post(
    "/{opportunity_id}/apply",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_to_opportunity(
    opportunity_id: int,
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Apply to an opportunity"""
    # Check if opportunity exists
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Check if already applied
    existing_application = (
        db.query(Application)
        .filter(
            Application.opportunity_id == opportunity_id,
            Application.applicant_id == current_user.id,
        )
        .first()
    )
    if existing_application:
        raise HTTPException(
            status_code=400, detail="Already applied to this opportunity"
        )

    # Create application
    new_application = Application(
        opportunity_id=opportunity_id,
        applicant_id=current_user.id,
        message=application_data.message,
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


@router.get("/{opportunity_id}/applications", response_model=List[ApplicationResponse])
def get_opportunity_applications(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get applications for an opportunity (creator only)"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opportunity.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to view applications"
        )

    applications = (
        db.query(Application).filter(Application.opportunity_id == opportunity_id).all()
    )
    return applications


@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all applications for current user's opportunities"""
    applications = (
        db.query(Application)
        .join(Opportunity)
        .filter(Opportunity.creator_id == current_user.id)
        .all()
    )
    return applications


@router.put(
    "/applications/{application_id}/status",
    response_model=ApplicationResponse,
)
def update_application_status(
    application_id: int,
    new_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update application status (accept/reject) - creator only"""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == application.opportunity_id)
        .first()
    )
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if opportunity.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this application"
        )

    if new_status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    application.status = new_status
    db.commit()
    db.refresh(application)
    return application
