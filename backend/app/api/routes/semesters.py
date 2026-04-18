from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.semester import Semester
from app.schemas.schemas import SemesterCreate, SemesterOut

router = APIRouter()

@router.get("/", response_model=list[SemesterOut])
def get_semesters(db: Session = Depends(get_db)):
    return db.query(Semester).all()

@router.post("/", response_model=SemesterOut)
def create_semester(semester: SemesterCreate, db: Session = Depends(get_db)):
    db_s = Semester(**semester.dict())
    db.add(db_s)
    db.commit()
    db.refresh(db_s)
    return db_s

@router.get("/active", response_model=SemesterOut)
def get_active_semester(db: Session = Depends(get_db)):
    s = db.query(Semester).filter(Semester.is_active == True).first()
    if not s:
        raise HTTPException(status_code=404, detail="No active semester found")
    return s

@router.patch("/{semester_id}/activate", response_model=SemesterOut)
def activate_semester(semester_id: int, db: Session = Depends(get_db)):
    # Deactivate all
    db.query(Semester).update({"is_active": False})
    s = db.query(Semester).filter(Semester.id == semester_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Semester not found")
    s.is_active = True
    db.commit()
    db.refresh(s)
    return s

@router.delete("/{semester_id}")
def delete_semester(semester_id: int, db: Session = Depends(get_db)):
    s = db.query(Semester).filter(Semester.id == semester_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Semester not found")
    db.delete(s)
    db.commit()
    return {"message": "Semester deleted"}
