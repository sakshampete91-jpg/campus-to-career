"""Opportunities endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_employer, get_current_user
from app.models.opportunity import Opportunity
from app.models.user import User
from app.schemas.opportunity import (
    MatchScoreResponse,
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpdate,
)

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _normalise(s: str) -> str:
    return s.lower().strip()


def _compute_match_score(student_skills: list, required_skills: list, preferred_skills: list):
    """Compute a 0-100 match score for a student against an opportunity."""
    if not required_skills:
        return 100, [], []

    student_norm = [_normalise(s["name"] if isinstance(s, dict) else s) for s in student_skills]
    required_norm = [_normalise(s) for s in required_skills]
    preferred_norm = [_normalise(s) for s in (preferred_skills or [])]

    matched_required = [
        s for s in required_norm
        if any(s in sn or sn in s for sn in student_norm)
    ]
    matched_preferred = [
        s for s in preferred_norm
        if any(s in sn or sn in s for sn in student_norm)
    ]
    missing = [s for s in required_norm if s not in matched_required]

    # Required skills count for 80%, preferred for 20%
    req_score = (len(matched_required) / len(required_norm)) * 80 if required_norm else 80
    pref_score = (len(matched_preferred) / len(preferred_norm)) * 20 if preferred_norm else 20

    total = int(req_score + pref_score)
    return total, matched_required + matched_preferred, missing


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/", response_model=List[OpportunityResponse])
def list_opportunities(
    skills: Optional[str] = Query(None, description="Comma-separated skills filter"),
    opportunity_type: Optional[str] = Query(None),
    work_arrangement: Optional[str] = Query(None),
    trust_status: Optional[str] = Query(None),
    q: Optional[str] = Query(None, description="Full-text search query"),
    is_paid: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List opportunities with optional filters."""
    query = db.query(Opportunity)

    if opportunity_type:
        query = query.filter(Opportunity.opportunity_type == opportunity_type)
    if work_arrangement:
        query = query.filter(Opportunity.work_arrangement == work_arrangement)
    if trust_status:
        query = query.filter(Opportunity.trust_status == trust_status)
    if is_paid is not None:
        query = query.filter(Opportunity.is_paid == is_paid)
    if q:
        search = f"%{q}%"
        query = query.filter(
            or_(
                Opportunity.title.ilike(search),
                Opportunity.company_name.ilike(search),
                Opportunity.description.ilike(search),
            )
        )

    opportunities = query.order_by(Opportunity.created_at.desc()).offset(offset).limit(limit).all()

    # Skills filter: in-memory (JSON column)
    if skills:
        requested = [_normalise(s) for s in skills.split(",")]
        filtered = []
        for opp in opportunities:
            opp_skills = [_normalise(s) for s in (opp.required_skills or [])]
            if any(any(rs in os or os in rs for os in opp_skills) for rs in requested):
                filtered.append(opp)
        return filtered

    return opportunities


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    """Get a single opportunity by ID."""
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")
    return opp


@router.post("/", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED)
def create_opportunity(
    payload: OpportunityCreate,
    current_user: User = Depends(get_current_active_employer),
    db: Session = Depends(get_db),
):
    """Create a new opportunity (employer only)."""
    opp = Opportunity(
        **payload.model_dump(exclude_none=False),
        posted_by_id=current_user.id,
        is_demo=False,
        trust_status="unverified",
    )
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp


@router.put("/{opportunity_id}", response_model=OpportunityResponse)
def update_opportunity(
    opportunity_id: str,
    payload: OpportunityUpdate,
    current_user: User = Depends(get_current_active_employer),
    db: Session = Depends(get_db),
):
    """Update an opportunity (employer owner only)."""
    opp = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id,
        Opportunity.posted_by_id == current_user.id,
    ).first()
    if not opp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found or you do not have permission to edit it.",
        )

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(opp, field, value)

    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp


@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(
    opportunity_id: str,
    current_user: User = Depends(get_current_active_employer),
    db: Session = Depends(get_db),
):
    """Delete an opportunity (employer owner only)."""
    opp = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id,
        Opportunity.posted_by_id == current_user.id,
    ).first()
    if not opp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found or you do not have permission to delete it.",
        )
    db.delete(opp)
    db.commit()
    return None


@router.get("/{opportunity_id}/match-score", response_model=MatchScoreResponse)
def get_match_score(
    opportunity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Calculate skill match score between the current student and an opportunity."""
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")

    student_skills = current_user.skills or []
    required_skills = opp.required_skills or []
    preferred_skills = opp.preferred_skills or []

    score, matched, missing = _compute_match_score(student_skills, required_skills, preferred_skills)

    if score >= 80:
        explanation = "Excellent match! Your skills align strongly with this role."
    elif score >= 50:
        explanation = "Good match. You meet most of the requirements."
    elif score >= 25:
        explanation = "Partial match. Consider building the missing skills before applying."
    else:
        explanation = "Low match. This role requires skills you haven't listed yet."

    return MatchScoreResponse(
        opportunity_id=opportunity_id,
        match_score=score,
        matched_skills=matched,
        missing_skills=missing,
        explanation=explanation,
    )
